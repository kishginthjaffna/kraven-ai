import { Tables } from '@/database.types'
import React from 'react'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
  } from "@/components/ui/sheet"
import Image from 'next/image'
import { Button } from './ui/button'
import { Delete, DeleteIcon, Download, LucideDelete, Share, Trash2 } from 'lucide-react'
import { Badge } from './ui/badge'
import { ScrollArea, ScrollBar } from './ui/scroll-area'
import { toast } from 'sonner'
import DeleteImage from './DeleteImage'
 
  

interface ImageProps {
    image: {url: string | undefined} & Tables<'generated_images'>,
    onClose: () => void
}

const replicateUsername = process.env.NEXT_PUBLIC_REPLICATE_USER_NAME;

const ImageDialog = ({ image, onClose }: ImageProps) => {
    const downloadImage = () => {
        fetch(image.url || "").then((res) => res.blob()).then((blob) => {
            const url = window.URL.createObjectURL(new Blob([blob]));
            const a = document.createElement("a");
            a.href = url;
            a.setAttribute("download", `${image.prompt}.${image.output_format}`);
            document.body.appendChild(a);
            a.click();
            a.parentNode?.removeChild(a);
        }).catch((err) => {
            toast.error("Failed to download image.");
            console.log(err);
        });
    }

    const shareImage = () => {
        
    }
    return (
        <div>
            <Sheet open={true} onOpenChange={onClose}>
                <SheetContent className="max-w-full sm:max-w-xl w-full p-7 max-h-[100vh] flex flex-col">
                    <SheetHeader>
                        <SheetTitle className="text-xl w-full md:text-2xl">Image Details</SheetTitle>
                    </SheetHeader>

                    {/* Scrollable Area */}
                    <ScrollArea className="flex-1 overflow-y-auto">
                        <div className="relative w-fit h-fit">
                            <Image
                                src={image.url || ""}
                                alt={image.prompt || "Generated Image"}
                                width={image.width || 500}
                                height={image.height || 500}
                                className="w-full h-auto flex mb-3 rounded"
                            />
                            <div className="flex absolute top-1 right-1 gap-2">
                                <Button className="cursor-pointer rounded-full bg-orange-700 w-fit" onClick={downloadImage}>
                                    Download <Download /> 
                                </Button>
                                <DeleteImage imageId={image.id.toString()} onDelete={onClose} className='rounded-full' imageName={image.image_name ?? ''}/>
                            </div>
                            <hr className="inline-block w-full border-primary/30 mb-2" />
                        </div>

                        <p className="text-primary/90 w-full flex flex-col mb-4">
                            <span className="font-semibold text-primary text-xl">Prompt: </span>
                            {image.prompt}
                        </p>

                        <div className="flex flex-wrap gap-3">
                            <Badge variant={"secondary"} className="rounded-full border border-primary/30 px-4 py-2 text-sm font-normal">
                                <span className="font-semibold text-primary uppercase mr-2">Dimension </span> {image.width} x {image.height}
                            </Badge>
                            <Badge variant={"secondary"} className="rounded-full border border-primary/30 px-4 py-2 text-sm font-normal">
                                <span className="font-semibold text-primary uppercase mr-2">Format </span> {image.output_format}
                            </Badge>
                            <Badge variant={"secondary"} className="rounded-full border border-primary/30 px-4 py-2 text-sm font-normal">
                                <span className="font-semibold text-primary uppercase mr-2">Guidance </span> {image.guidance}
                            </Badge>
                            <Badge variant={"secondary"} className="rounded-full border border-primary/30 px-4 py-2 text-sm font-normal">
                                <span className="font-semibold text-primary uppercase mr-2">Aspect Ratio </span> {image.aspect_ratio}
                            </Badge>
                            <Badge variant={"secondary"} className="rounded-full border border-primary/30 px-4 py-2 text-sm font-normal">
                                <span className="font-semibold text-primary uppercase mr-2">Number of Inference Steps </span> {image.num_inference_steps}
                            </Badge>
                            <Badge variant={"secondary"} className="rounded-full border border-primary/30 px-4 py-2 text-sm font-normal">
                                <span className="font-semibold text-primary uppercase mr-2">Created at </span> {new Date(image.created_at).toLocaleString()}
                            </Badge>
                        </div>
                        <ScrollBar orientation="vertical" />
                    </ScrollArea>
                </SheetContent>
            </Sheet>
        </div>
    );
};

export default ImageDialog;

