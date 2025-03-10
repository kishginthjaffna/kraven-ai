'use server';

import { z } from 'zod';
import Replicate from "replicate";
import { ImageGenerationFormSchema } from './../../components/ImageConfig';

interface ImageProps {
    error: string | null;
    success: boolean;
    data: any | null;
}

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

export async function generateImage(input : z.infer<typeof ImageGenerationFormSchema>): Promise<ImageProps> {

    const modelInput = {
        prompt: input.prompt,
        go_fast: true,
        guidance: input.guidance,
        megapixels: 1,
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