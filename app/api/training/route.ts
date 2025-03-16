import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const WEBHOOK_URL = process.env.SITE_URL ??  'https://71c2-2402-d000-8140-26b3-ec19-120f-b57e-2a44.ngrok-free.app';

async function validateUserCredits(userId: string) {
    const {data: userCredits, error} = await supabaseAdmin.from('credits').select('*').eq('user_id', userId).single();
    if(error){
        throw new Error('Error getting user credits in validateUserCredits');
    }

    const credits = userCredits?.model_training_count ?? 0;
    if (credits <= 0) {
        throw new Error("Not enough credits for model training");
    }

    return credits;
}
export async function POST(request: NextRequest) {
    try {
        if (!process.env.REPLICATE_API_TOKEN) {
            throw new Error("REPLICATE_API_TOKEN is not set");
        }

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 401 });
        }

        const formData = await request.formData();
        const input = {
        fileKey: formData.get("fileKey") as string,
        modelName: formData.get("modelName") as string,
        gender: formData.get("gender") as "man" | "woman",
        };

        if (!input.fileKey || !input.modelName || !input.gender) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const oldCredits = await validateUserCredits(user?.id);

        const fileName = input.fileKey.replace("training_data/", "");
        const { data } = await supabaseAdmin.storage.from("training_data").createSignedUrl(fileName, 3600);

        if (!data || !data.signedUrl) {
            return NextResponse.json({ error: "Failed to get File URL" }, { status: 500 });
        }

        const fileUrl = data.signedUrl;
        const modelId = `${user.id}_${Date.now()}_${input.modelName.toLowerCase().replaceAll(" ", "_")}`;

        try {
            // Create model on Replicate
            await replicate.models.create('kishginthjaffna', modelId, {
                visibility: "private",
                hardware: "gpu-a100-large"
            });

            const webhookUrl = `${WEBHOOK_URL}/api/webhooks/training?userId=${user.id}&modelName=${encodeURIComponent(input.modelName)}&fileName=${encodeURIComponent(fileName)}`;
            console.log("Webhook URL:", webhookUrl);

            // Start training
            const training = await replicate.trainings.create(
                "ostris",
                "flux-dev-lora-trainer",
                "b6af14222e6bd9be257cbc1ea4afda3cd0503e1133083b9d1de0364d8568e6ef",
                {
                    destination: `kishginthjaffna/${modelId}`,
                    input: {
                        steps: 1000,
                        resolution: "1024",
                        input_images: fileUrl,
                        trigger_word: "tvktv",
                    },
                    webhook: webhookUrl,
                    webhook_events_filter: ["completed"], 
                }
            );
            

            //add model to supabase
            await supabaseAdmin.from("models").insert({ 
                model_id: modelId, 
                user_id: user.id,
                model_name: input.modelName,
                gender: input.gender,
                training_status: training.status,
                trigger_word: "tvktv",
                training_steps: 1200,
                training_id: training.id,
            });

            //Updating credits
            await supabaseAdmin.from('credits').update({ model_training_count: oldCredits - 1 }).eq('user_id', user.id);



            return NextResponse.json({ success: true }, { status: 200 });

        } catch (replicateError) {
            console.error("Replicate Error:", replicateError);
            return NextResponse.json({ error: "Failed to create or train model on Replicate" }, { status: 500 });
        }

    } catch (error) {
        console.error("General Error:", error);
        return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to start model training" }, { status: 500 });
    }
}
