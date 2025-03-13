'use client'

import { Database } from '@/database.types'
import React, { useId } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import Link from 'next/link';
import { ArrowRightCircle, BrainCircuit,  CircleCheckBig, CircleDashed, CircleMinus, CircleX, Clock, Loader2, Trash, Trash2, User2 } from 'lucide-react';
import {formatDistance} from 'date-fns';
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
import { toast } from 'sonner';
import { deleteModel } from '@/app/actions/model';
import { cn } from '@/lib/utils';
  

type ModelType = {
    error: string | null,
    success: boolean,
    data: Database["public"]["Tables"]["models"]["Row"][] | null,
}
interface ModelsProps {
    models: ModelType,
}
const ModelsList = ({models}: ModelsProps) => {
    const { data } = models;
    const toastId = useId();

    const handleDeleteModel = async (id:number, model_id: string, model_version: string) => {
        toast.loading("Deleting model...", {id: toastId});

        const { success, error  } = await deleteModel(id, model_id, model_version);

        if(success){
            toast.success("Model deleted successfully", {id: toastId});
        } else {
            toast.error(error, {id: toastId});
        }
    }

    if (data?.length === 0) {
        return (
            <Card className="w-full flex items-center justify-center shadow-none border-none">
                <CardContent className="flex flex-col items-center justify-center gap-4 p-2">
                    <span className="text-xl text-muted-foreground">You haven't trained any models. Start by creating a new model now!</span>
                    <Link href="/model-training">
                    <Button className='bg-orange-700 cursor-pointer'>
                        Create a model <BrainCircuit className=''/>
                    </Button> 
                    </Link>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
  {data?.map((model, index) => (
    <Card key={index} className="relative flex flex-col overflow-hidden rounded-2xl shadow-md border border-gray-200 bg-white">
      <CardHeader className="p-4 border-b bg-gray-50">
        <CardTitle className="text-2xl font-bold text-gray-900 ">
            <div className='flex justify-between'>
                {model.model_name}
                <div className='flex items-center justify-center gap-4'>
                    <div className='flex items-center gap-2'>
                    {
                        (() => {
                            switch (model.training_status) {
                            case "starting":
                                return <span className="text-yellow-600 text-sm font-semibold flex items-center gap-2"><Loader2 className='w-4 h-4 animate-spin'/>Starting</span>;
                            case "succeeded":
                                return <span className="text-green-600 text-sm font-semibold flex items-center gap-2"><CircleCheckBig className='w-4 h-4'/>Completed</span>;
                            case "failed":
                                return <span className="text-red-600 text-sm font-semibold flex items-center gap-2"><CircleX className='w-4 h-4'/>Failed</span>;
                            case "processing":
                                return <span className="text-blue-600 text-sm font-semibold flex items-center gap-2"><CircleDashed className='w-4 h-4' />In Progress</span>;
                            default:
                                return <span className="text-gray-600 text-sm font-semibold flex items-center gap-2"><CircleMinus className='w-4 h-4' />Canceled</span>;
                            }
                        })()
                    }
                    </div>
                    <div>
                        <AlertDialog>
                        <AlertDialogTrigger><Trash2 className='ml-2 w-4 h-4 text-destructive cursor-pointer'/></AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your model
                                and remove your data from our servers.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel className='cursor-pointer'>Cancel</AlertDialogCancel>
                            <AlertDialogAction className='bg-orange-700 cursor-pointer' 
                            onClick={() => handleDeleteModel(model.id, model.model_id || '', model.version || '')}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                        </AlertDialog>
                    </div> 
                </div>
            </div>
        </CardTitle>
        <CardDescription className="text-gray-600 text-sm mt-1">
          Created: <br />
          {formatDistance(new Date(model.created_at), new Date(), { addSuffix: true })}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-5">
          {/* Training Duration */}
          <div className="flex flex-col bg-orange-600/10 p-5 rounded-xl shadow-sm border border-orange-400/50">
            <div className="flex items-center gap-2 text-sm text-orange-800 font-medium">
              <Clock className="w-5 h-5 text-orange-700" />
              <span>Training Duration</span>
            </div>
            <p className="text-lg font-semibold text-orange-700 mt-2">
              {Math.round(Number(model.training_time) / 60) || "--"} min
            </p>
          </div>

          {/* Gender */}
          <div className="flex flex-col bg-blue-600/10 p-5 rounded-xl shadow-sm border border-blue-400/50">
            <div className="flex items-center gap-2 text-sm text-blue-800 font-medium">
              <User2 className="w-5 h-5 text-blue-700" />
              <span>Gender</span>
            </div>
            <p className="text-lg font-semibold text-blue-700 mt-2"> {model.gender ? model.gender.charAt(0).toUpperCase() + model.gender.slice(1) : "N/A"}</p>
          </div>
        </div>
        <div>
                                <Link href={model.training_status === 'succeeded' ? `/image-generator?model_id=${model.model_id}:${model.version}` : '#'}
                                    className={cn('inline-flex w-full', model.training_status !== 'succeeded' && 'pointer-events-none opacity-50')}>
                                    <Button className="w-full bg-orange-700 cursor-pointer flex items-center text-md">
                                        Generate Images <ArrowRightCircle className='' />
                                    </Button>
                                </Link>
                            </div>
      </CardContent>
      
    </Card>
  ))}
</div>

    )
}

export default ModelsList
