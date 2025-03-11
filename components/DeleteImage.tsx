import React from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog" 
import { Button } from './ui/button'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { deleteImage } from '@/app/actions/image'
import { cn } from '@/lib/utils'

interface deleteImageProps {
    imageId: string,
    onDelete: () => void,
    className?: string,
    imageName?: string  
}
const DeleteImage = ({imageId, onDelete, className, imageName}: deleteImageProps) => {
    const handleDelete = async () => {
        toast.loading("Deleting image...");

        const { error, success } = await deleteImage(imageId, imageName);

        if (error) {
            toast.error(error);
        } else if (success) {
            toast.success("Image deleted successfully!");
            onDelete?.();
        }
    }
  return (
    <div>
      <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button className={cn("cursor-pointer w-fit bg-orange-700", className)}>
                                    <Trash2 />
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    `This action cannot be undone. This will permanently delete your ${imageName} from our database and you won't be able to find this image anywhere again.``
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel className='cursor-pointer'>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className='bg-orange-700 cursor-pointer'>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>

        </AlertDialog>

    </div>
  )
}

export default DeleteImage
