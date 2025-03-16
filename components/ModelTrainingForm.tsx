'use client'
import React, { useId } from 'react'
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from 'sonner'
import { getSignedStorageUrl } from '@/app/actions/model'
import { Card, CardContent } from './ui/card'
import Image from 'next/image'



const ACCEPTED_ZIP_FILES = ["application/x-zip-compressed", "application/zip"]

const formSchema = z.object({
    modelName: z.string({
        required_error: 'Model Name is required',
    }),

    gender: z.enum(['man', 'woman'], {
        required_error: 'Gender is required',
    }),

    zipFile: z.any().refine((file) => file?.[0] instanceof File, {
        message: 'Zip File is required',
    }).refine((file) => file?.[0]?.type && ACCEPTED_ZIP_FILES.includes(file?.[0]?.type), {
        message: 'Only Zip Files are accepted',
    }).refine((file) => file?.[0]?.size && file?.[0]?.size < (45*1024*1024), {
        message: 'File size should be less than 45MB',
    })

})

const ModelTrainingForm = () => {
    const toastId = useId();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          modelName: '',
          gender: 'man',
          zipFile: null,
        },
    })

    const fileRef = form.register('zipFile')

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            toast.loading('Uploading file...', { id: toastId, duration: 5000 });
            const data = await getSignedStorageUrl(values.zipFile[0].name);
            console.log(data);
            if(data.error) {
                toast.error(data.error || "Failed to get signed URL", { id: toastId, duration: 5000 });
                return;
            }

            //Uploading file
            const urlResponse = await fetch(data.signedUrl,{
                method: 'PUT',
                headers: {
                    'Content-Type': values.zipFile[0].type
                },
                body: values.zipFile[0]
            })

            if(!urlResponse.ok) {
                throw new Error('Failed to upload file');
            }

            const res = await urlResponse.json();
            toast.success("File uploaded successfully!", { id: toastId, duration: 5000 });
            console.log(res);

            const formData = new FormData();
            formData.append("fileKey", res.Key);
            formData.append("modelName", values.modelName);
            formData.append("gender", values.gender);
            toast.loading('Initiating model training...', { id: toastId, duration: 5000 });

            //Training handler
            const response = await fetch('/api/training', {
                method: 'POST',
                body: formData
            })

            const results = await response.json();

            if(!response.ok || results.error) {
                throw new Error(results.error || "Failed to start training!");
            }

            toast.success("Training started successfully! You'll receive a notification when it's done.", { id: toastId, duration: 5000 });


        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Failed to start training!";
            toast.error(errorMessage, { id: toastId, duration: 5000 });
        }
        
        console.log(values);
    }
    

    return (
        <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 m-0 md:grid-cols-2">
          <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-8">
                        <FormField
                            control={form.control}
                            name="modelName"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Model Name</FormLabel>
                                <FormControl>
                                    <Input placeholder='Enter your model name' {...field} />
                                </FormControl>
                                <FormDescription>
                                    This is will be the name of your model that you are going to train.
                                </FormDescription>
                                <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="gender"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                <FormLabel>Gender</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        className="flex space-y-1 gap-10"
                                        >
                                        <FormItem className="flex items-center space-x-1 space-y-0">
                                            <FormControl>
                                            <RadioGroupItem value="man" />
                                            </FormControl>
                                            <FormLabel className="font-normal">
                                            Male
                                            </FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-1 space-y-0">
                                            <FormControl>
                                            <RadioGroupItem value="woman" />
                                            </FormControl>
                                            <FormLabel className="font-normal">
                                            Female
                                            </FormLabel>
                                        </FormItem>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                        />

                        <FormField
                            control={form.control}
                            name="zipFile"
                            render={() => (
                                <FormItem>
                                <FormLabel>Training data <span className='text-orange-700 text-sm'> (read the requirements below) </span> </FormLabel>
                                <div className='text-sm mb-4 rounded-lg mt-1 pb-4'>
                                    <ul className="list-disc space-y-3 pl-5 text-gray-700">
                                        <li className="font-medium">Provide <span className="font-semibold">10, 12, or 15</span> images in total</li>
                                        <li>
                                        <span className="font-medium">Ideal breakdown for 12 images:</span>
                                        <ul className="list-circle pl-6 space-y-2 text-gray-600">
                                            <li><span className="font-semibold">6</span> face closeups</li>
                                            <li><span className="font-semibold">3-4</span> half-body closeups (till stomach)</li>
                                            <li><span className="font-semibold">2-3</span> full-body shots</li>
                                        </ul>
                                        </li>
                                        <li>No accessories on face/head <span className="italic">(ideally)</span></li>
                                        <li>No other people in images</li>
                                        <li>Different expressions, clothing, backgrounds with <span className="font-semibold">good lighting</span></li>
                                        <li>Images should be in <span className="font-semibold">1:1 resolution</span> (1048x1048 or higher)</li>
                                        <li>Use images of a <span className="font-semibold">similar age group</span> (ideally within past few months)</li>
                                        <li>Provide only a <span className="font-semibold">zip file</span> (under <span className="text-red-500 font-semibold">45MB</span> size)</li>
                                    </ul>
                                </div>
                                <FormControl>
                                    <Input type='file' accept='.zip' {...fileRef} />
                                </FormControl>
                                <FormDescription>
                                    Upload a zip file that is containing your training images.
                                </FormDescription>
                                <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button className='bg-orange-700 cursor-pointer w-full' type="submit">Submit</Button>
                    
                </form>
            </Form>
          <div className="relative hidden bg-orange-700/80 md:block">
            <Image src="/images/AI-1.png" alt="Image" className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale" width={400} height={500}/>
          </div>
        </CardContent>
      </Card>
    )
}

export default ModelTrainingForm
