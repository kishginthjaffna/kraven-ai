'use client';

import { z } from 'zod';
import { create } from 'zustand';
import { ImageGenerationFormSchema } from '@/components/ImageConfig';
import { generateImageAction, storeImages } from '@/app/actions/image';
import { toast } from 'sonner';

interface GeneratedStore {
    loading: boolean;
    images: Array<{ url: string }>;
    error: string | null;
    generateImage: (values: z.infer<typeof ImageGenerationFormSchema>) => Promise<void>;
}

export const useGeneratedStore = create<GeneratedStore>((set) => ({
    loading: false,
    images: [],
    error: null,

    generateImage: async (values: z.infer<typeof ImageGenerationFormSchema>) => {
        set({ loading: true, error: null });

        try {
            const response = await generateImageAction(values);
            const { error, success, data } = response;

            if (!success || !Array.isArray(data)) {
                console.error("Image generation failed:", error || "Invalid response format");
                set({ loading: false, error: error || "Failed to generate images." });
                return;
            }

            console.log("Generated Images Data:", data); // Debugging

            // Format images with URL and metadata
            const formattedImages = data
                .filter((url: string) => url) // Remove any null/empty URLs
                .map((url: string) => ({ url, ...values }));

            set({ loading: false, images: formattedImages });
            toast.success("Images generated successfully!");

            if (formattedImages.length > 0) {
                const storeResponse = await storeImages(formattedImages);
                toast.success("Images stored successfully!");
                if (!storeResponse.success) {
                    console.error("Error storing images:", storeResponse.error);
                    toast.error("Failed to store images!");
                }
            }

        } catch (err) {
            console.error("Unexpected error:", err);
            set({ loading: false, error: 'Failed to generate image. Please try again!' });
        }
    }
}));
