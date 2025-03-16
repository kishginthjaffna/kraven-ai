import { NextResponse } from "next/server";
import Replicate from "replicate";
import crypto from 'crypto';
import { supabaseAdmin } from "@/lib/supabase/admin";
import { Resend } from 'resend';
import { EmailTemplate } from "@/components/Mail templates/MailTemplate";

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN
});

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    console.log('Webhook is working:', req);
    try {
        const body = await req.json();
        const url = new URL(req.url);
        const userId = url.searchParams.get('userId');
        const modelName = url.searchParams.get('modelName');
        const fileName = url.searchParams.get('fileName');

        //To validate the webhook
        const id= req.headers.get("webhook-id") ?? '';
        const timeStamp = req.headers.get("webhook-timestamp") ?? '';
        const webhookSignature = req.headers.get("webhook-signature") ?? '';

        const signedContent = `${id}.${timeStamp}.${JSON.stringify(body)}`;
        const secret = await replicate.webhooks.default.secret.get();

        const secretBytes = Buffer.from(secret.key.split('_')[1], "base64");
        const signature = crypto
                            .createHmac('sha256', secretBytes)
                            .update(signedContent)
                            .digest('base64');
        console.log(signature);

        const expectedSignatures = webhookSignature.split(' ').map(sig => sig.split(',')[1]);
        const isValid = expectedSignatures.some(expectedSignature => expectedSignature === signature);
        console.log(isValid);

        if (!isValid) {
            return NextResponse.json('Invalid Signature', { status: 401 });
        }

        //Get user data
        const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId as string);
        if (userError || !userData) {
            return NextResponse.json('User not found', { status: 404 });
        }

        console.log('User data:', userData);
        console.log('User', userData.user);
        console.log('User metadata:', userData.user.user_metadata);

        const userEmail = userData.user.email ?? '';
        const userName = userData.user.user_metadata.fullname ?? '';

        if(body.status === 'succeeded'){
            //send a successfull email
            await resend.emails.send({
                from: 'Kraven AI',
                to: [userEmail],
                subject: 'Training Successfully Completed!',
                react: EmailTemplate({ userName, message: `Your model ${modelName} has been successfully trained!` }),
            });

            //update user metadata
            await supabaseAdmin.from('models').update({ 
                training_status: body.status,
                training_time: body.metrics?.total_time ?? null,
                version: body.output?.version.split(":")[1] ?? null,
             }).eq('user_id', userId as string).eq('model_name', modelName as string);
        } else {
            //send a failure email
            await resend.emails.send({
                from: 'Kraven AI',
                to: [userEmail],
                subject: `Training ${body.status}!`,
                react: EmailTemplate({ userName, message: `Your ${modelName} training has been ${body.status}` }),
            });

            //update user metadata
            await supabaseAdmin.from('models').update({ 
                training_status: body.status,
             }).eq('user_id', userId as string).eq('model_name', modelName as string);

             //Getting old credits
             const {data: oldCredits, error} = await supabaseAdmin.from('credits').select('model_training_count').eq('user_id', userId!).single();

             if(error) throw new Error('Error getting user credits in training webhook');
             //Updating credits
             await supabaseAdmin.from('credits').update({model_training_count: oldCredits?.model_training_count! + 1}).eq('user_id', userId!).single();
        }

        //Delete training data
        await supabaseAdmin.storage.from('training_data').remove([`${fileName}`]);

        console.log('Webhook is working!', body);
        return NextResponse.json('Okay', { status: 200 });
    } catch (error) {
        console.log('Webhook processing error:', error);
        return NextResponse.json('Internal Server Error' , { status: 500 });
    }

}