'use client';

import React, { useEffect } from 'react'
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Slider } from '@/components/ui/slider';
import { Textarea } from './ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Info } from 'lucide-react';
import { useGeneratedStore } from '@/hooks/useGeneratedStore';
import { Tables } from '@/database.types';


export const ImageGenerationFormSchema = z.object({
    model: z.string({
      required_error: 'Please select a model.',
    }),
    prompt: z.string({
      required_error: 'Please enter a prompt.',
    }),
    guidance: z.number({
      required_error: 'Please enter a guidance.',
    }),
    num_outputs: z.number().min(1, {
      message: 'Please enter at least 1 output.',
    }).max(4, {
        message: 'Maximum 4 outputs allowed.',
    }),
    aspect_ratio: z.string({
      required_error: 'Please select an aspect ratio.',
    }),
    output_format: z.string({
      required_error: 'Please select an output format.',
    }),
    output_quality: z.number({
      required_error: 'Please select an output quality.',
    }),
    num_inference_steps: z.number().min(28, {
        message: 'Minimum 28 inference steps',
      }).max(50, {
          message: 'Maximum 50 inference steps allowed.',
      }),
});

interface ConfigurationProps{
  userModels: Tables<'models'>[],
  model_id?: string
}

const ImageConfig = ({userModels, model_id}: ConfigurationProps) => {
    const generateImage = useGeneratedStore((state) => state.generateImage)
    const form = useForm<z.infer<typeof ImageGenerationFormSchema>>({
        resolver: zodResolver(ImageGenerationFormSchema),
        defaultValues: {
          model: model_id ? `kishginthjaffna/${model_id}` : 'black-forest-labs/flux-dev',
          prompt: '',
          guidance: 3.5,
          num_outputs: 1,
          aspect_ratio: '1:1',
          output_format: 'webp',
          output_quality: 80,
          num_inference_steps: 28
        },
      })

    useEffect(() => {
      const subscription = form.watch((value, { name }) => {
        if(name === 'model'){
          let newSteps;

          (value.model === 'black-forest-labs/flux-schnell') ? newSteps=4  : newSteps=28;
          
          if(newSteps !== undefined) {
            form.setValue('num_inference_steps', newSteps);
          }
        }
      })

      return () => subscription.unsubscribe()
    }, [form])

    async function onSubmit(values: z.infer<typeof ImageGenerationFormSchema>) {
      const newValues = {
        ...values,
        prompt: values.model.startsWith("kishginthjaffna/") ? (() => {
          const modelId = values.model.replace('kishginthjaffna/', '').split(':')[0];
          const selectedModel = userModels.find((model) => model.model_id === modelId);

          return `photo of a ${selectedModel?.trigger_word || 'tvktv'} ${selectedModel?.gender}, ${values.prompt}`
        })() : values.prompt
      }
            await generateImage(newValues);
    }  

  return (
    <div className="w-full md:w-auto" >
      <TooltipProvider>
        <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <fieldset className='grid gap-4 p-4 md:p-6 bg-background rounded-lg border-black border-2 shadow-[6px_6px_0px_rgba(0,0,0,0.8)]'>
            <legend className='text-sm px-1 ml-1 '>
                Input
            </legend>

            <FormField
          control={form.control}
          name="model"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select a model
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>You can select any model from the list ( but remember outputs depend on the model you select)</p>
                  </TooltipContent>
                </Tooltip>
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="select a model" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="black-forest-labs/flux-dev">black-forest-labs/flux-dev</SelectItem>
                  <SelectItem value="black-forest-labs/flux-schnell">black-forest-labs/flux-schnell</SelectItem>
                  {userModels?.map((model) => model.training_status === 'succeeded' && <SelectItem key={model.id} value={`kishginthjaffna/${model.model_id}:${model.version}`}>{model.model_name}</SelectItem>)}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='grid grid-cols-2 gap-4'>
        <FormField
          control={form.control}
          name="aspect_ratio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select an aspect ratio</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="aspect ratio" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1:1">1:1</SelectItem>
                  <SelectItem value="16:9">16:9</SelectItem>
                  <SelectItem value="21:9">21:9</SelectItem>
                  <SelectItem value="3:2">3:2</SelectItem>
                  <SelectItem value="2:3">2:3</SelectItem>
                  <SelectItem value="4:5">4:5</SelectItem>
                  <SelectItem value="5:4">5:4</SelectItem>
                  <SelectItem value="3:4">3:4</SelectItem>
                  <SelectItem value="4:3">4:3</SelectItem>
                  <SelectItem value="9:16">9:16</SelectItem>
                  <SelectItem value="9:21">9:21</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="num_outputs"
          render={({ field }) => (
            <FormItem>
              <FormLabel>No of outputs</FormLabel>
              <FormControl>
                <Input type='number' min={1} max={4} placeholder="shadcn" {...field}
                onChange={(e) => form.setValue('num_outputs', parseInt(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> 
        </div>

        <FormField
          control={form.control}
          name="guidance"
          render={({ field }) => (
            <FormItem>
              <FormLabel className='flex items-center justify-between'>
                <div className='flex items-center gap-1'>
                    Guidance
                      <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>'Guidance' refers to a setting or parameter that controls how closely the generated image adheres to the text prompt provided to the AI model</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                
                <span className='text-sm text-muted-foreground'>
                {field.value}
                </span>
              </FormLabel>
              <FormControl>
                <Slider defaultValue={[field.value]} max={10} min={0} onValueChange={(e) => form.setValue('guidance', e[0])} step={0.5} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="num_inference_steps"
          render={({ field }) => (
            <FormItem>
              <FormLabel className='flex items-center justify-between'>
                <div className='flex items-center gap-1'>
                    Number of inference steps
                    <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>'Number of inference steps' refers to how many iterations the model performs when generating an image: Recommended range: 28-50</p>
                  </TooltipContent>
                </Tooltip>
                </div>
                
                <span className='text-sm text-muted-foreground'>
                    {field.value}
                </span>
              </FormLabel>
              <FormControl>
                <Slider defaultValue={[field.value]} max={form.getValues('model') === 'black-forest-labs/flux-schnell' ? 4 : 50} min={0} onValueChange={(e) => form.setValue('num_inference_steps', e[0])} step={1} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="output_quality"
          render={({ field }) => (
            <FormItem>
              <FormLabel className='flex items-center justify-between'>
                <div className='flex items-center gap-1'>
                    Output quality
                    <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>The visual fidelity and overall quality of the image produced by the AI model</p>
                  </TooltipContent>
                </Tooltip>
                </div>
                <span className='text-sm text-muted-foreground'>
                {field.value}
                </span>
              </FormLabel>
              <FormControl>
                <Slider defaultValue={[field.value]} max={100} min={50} onValueChange={(e) => form.setValue('output_quality', e[0])} step={1} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="output_format"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Output format</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="output formal" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="jpg">jpg</SelectItem>
                  <SelectItem value="png">png</SelectItem>
                  <SelectItem value="webp">webp</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="prompt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prompt</FormLabel>
              <FormControl>
                <Textarea className='h-36' placeholder="black forest gateau cake spelling out the words" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> 
        <Button type="submit" className='cursor-pointer w-full font-medium bg-orange-700'>Generate</Button>
        </fieldset>
      
      </form>
    </Form>
    </TooltipProvider>
    </div>
  )
}

export default ImageConfig
