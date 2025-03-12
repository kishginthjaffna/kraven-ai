import { create } from 'zustand';
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN
});

const WEBHOOK_URL = process.env.SITE_URL ??  'https://e747-2402-d000-8140-751-fd23-1b38-1209-d46d.ngrok-free.app';

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
            gender: formData.get("gender") as string,
        };

        if (!input.fileKey || !input.modelName || !input.gender) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const fileName = input.fileKey.replace("training_data/", "");
        const { data } = await supabaseAdmin.storage.from("training_data").createSignedUrl(fileName, 3600);

        if (!data || !data.signedUrl) {
            return NextResponse.json({ error: "Failed to get File URL" }, { status: 500 });
        }

        const fileUrl = data.signedUrl;
        const modelId = `${user.id}_${Date.now()}_${input.modelName.toLowerCase().replaceAll(" ", "_")}`;

        try {
            // Create model on Replicate
            await replicate.models.create(process.env.NEXT_PUBLIC_REPLICATE_USER_NAME || 'default_user', modelId, {
                visibility: "private",
                hardware: "gpu-a100-large"
            });

            // Start training
            const training = await replicate.trainings.create(
                "ostris",
                "flux-dev-lora-trainer",
                "b6af14222e6bd9be257cbc1ea4afda3cd0503e1133083b9d1de0364d8568e6ef",
                {
                    destination: `${process.env.NEXT_PUBLIC_REPLICATE_USER_NAME || 'default_user'}/${modelId}`,
                    input: {
                        steps: 1000,
                        resolution: "1024",
                        input_images: fileUrl,
                        trigger_word: "tvktv",
                    },
                    webhook: `${WEBHOOK_URL}/api/webhooks/training`,
                    webhook_events_filter: ["completed"], 
                }
            );

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
