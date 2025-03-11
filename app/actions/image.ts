'use server';

import { z } from 'zod';
import Replicate from "replicate";
import { ImageGenerationFormSchema } from './../../components/ImageConfig';
import { createClient } from '@/lib/supabase/server';
import { Database } from '@/database.types';
import { imageMeta } from "image-meta";
import { randomUUID } from 'crypto';
import { error } from 'console';
import { toast } from 'sonner';

interface ImageProps {
    error: string | null;
    success: boolean;
    data: any | null;
}

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
    useFileOutput: false
});

export async function generateImageAction(input : z.infer<typeof ImageGenerationFormSchema>): Promise<ImageProps> {

    const modelInput = {
        prompt: input.prompt,
        go_fast: true,
        guidance: input.guidance,
        megapixels: '1',
        num_outputs: input.num_outputs,
        aspect_ratio: input.aspect_ratio,
        output_format: input.output_format,
        output_quality: input.output_quality,
        prompt_strength: 0.8,
        num_inference_steps: input.num_inference_steps
    };

    try {
        const output = await replicate.run(input.model as `${string}/${string}`, { input: modelInput });

        return {
            error: null,
            success: true,
            data: output
        }
    } catch (error) {
        console.log(error);

        return {
            error: error as string | 'Error in generating image!',
            success: false,
            data: null
        }
    }
    
}

export async function imgUrlToBlob(imageUrl: string) {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    return blob;
}

type storeImageInput = {url: string} & Database["public"]["Tables"]["generated_images"]["Insert"]

export async function storeImages(data: storeImageInput[]) {
    const supabase = await createClient();
    const { data: userData } = await supabase.auth.getUser();
    
    if (!userData?.user) {
        return {
            error: 'User not found',
            success: false,
            data: null
        };
    }

    const userId = userData.user.id;
    const uploadResults: Array<{ fileName: string; error: string | null; success: boolean; data: any }> = [];

    for (const image of data) {
        try {
            const response = await fetch(image.url);
            if (!response.ok) {
                uploadResults.push({ fileName: '', error: 'Failed to fetch image', success: false, data: null });
                continue;
            }

            const blob = await response.blob();
            const arrayBuffer = await blob.arrayBuffer(); // Convert to ArrayBuffer
            const metadata = imageMeta(new Uint8Array(arrayBuffer)); // Extract image metadata

            if (!metadata) {
                uploadResults.push({ fileName: '', error: 'Invalid image metadata', success: false, data: null });
                continue;
            }

            const { width, height, type } = metadata;
            if (!type) {
                uploadResults.push({ fileName: '', error: 'Unknown file type', success: false, data: null });
                continue;
            }

            const fileName = `image_${randomUUID()}.${type}`;
            const filePath = `${userId}/${fileName}`;

            // Upload to Supabase Storage
            const { error: storageError } = await supabase.storage.from('generated_images').upload(filePath, arrayBuffer, {
                contentType: `image/${type}`,
                cacheControl: '3600',
                upsert: true
            });

            if (storageError) {
                uploadResults.push({ fileName, error: storageError.message, success: false, data: null });
                continue;
            }

            // Insert record into the database
            const { data: dbData, error: dbError } = await supabase.from('generated_images').insert([{
                user_id: userId,
                model: image.model,
                prompt: image.prompt,
                aspect_ratio: image.aspect_ratio,
                guidance: image.guidance,
                num_inference_steps: image.num_inference_steps,
                output_format: image.output_format,
                image_name: fileName,
                width,
                height,
            }]).select();

            uploadResults.push({
                fileName,
                error: dbError ? dbError.message : null,
                success: !dbError,
                data: dbData
            });

        } catch (error) {
            uploadResults.push({ fileName: '', error: `Unexpected error: ${error}`, success: false, data: null });
        }
    }

    console.log("Upload Results:", uploadResults);
    
    return {
        error: null,
        success: uploadResults.every(result => result.success),
        data: uploadResults
    };
}

export async function getImages(limit?: number) {
    const supabase = await createClient();
    const { data: userData } = await supabase.auth.getUser();
    
    if (!userData?.user) {
        return {
            error: 'User not found',
            success: false,
            data: null
        };
    }

    const userID = userData.user.id;
    let query = supabase.from('generated_images').select('*').eq('user_id', userID).order('created_at', { ascending: false });
    
    if (limit) {
        query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
        return {
            error: error.message || 'Error in getting images',
            success: false,
            data: null
        };
    }

    const imgWithUrls = await Promise.all(
        data.map(async (image: Database["public"]["Tables"]["generated_images"]["Row"]) => {
            const { data, error } = await supabase.storage.from('generated_images').createSignedUrl(`${userID}/${image.image_name}`, 60 * 60);

            return {
                ...image,
                url: data?.signedUrl,
            }
        })
    )

    return {
        error: null,
        success: true,
        data: imgWithUrls || null
    };
}

export async function deleteImage(id?: string, imageName?: string) {
    const supabase = await createClient();
    const { data: userData } = await supabase.auth.getUser();
    
    if (!userData?.user) {
        return {
            error: 'User not found',
            success: false,
            data: null
        };
    }

    const userId = userData.user.id;

    const { data, error } = await supabase.from('generated_images').delete().eq('id', id);
    await supabase.storage.from('generated_images').remove([`${userId}/${imageName}`]);

    if (error) {
        return {
            error: error.message || 'Error in deleting images',
            success: false,
            data: null
        };
    }

    return {
        error: null,
        success: true,
        data: data
    };
}