import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import Link from 'next/link'
import { Button } from '../ui/button'
import { DollarSign, PlusIcon, Wand2Icon } from 'lucide-react'

const OuickActions = () => {
    return (
      <Card className="w-full col-span-4 lg:col-span-1  ">
          <CardHeader className="">
            <CardTitle className="">
              Quick Actions
            </CardTitle>
            <CardDescription>Get started with common sctions</CardDescription>
          </CardHeader>
          <CardContent className='grid gap-4'>
            <Button asChild className='w-full'>
              <Link href={'/image-generator'}>
                <Wand2Icon className='mr-2 h-4 w-4' />
                Generate Image
              </Link>
            </Button>
            <Button asChild className='w-full bg-primary'>
              <Link href={'/model-training'}>
                <PlusIcon className='mr-2 h-4 w-4' />
                Train a new model
              </Link>
            </Button>
            <Button asChild className='w-full' variant={'outline'}>
              <Link href={'/billing'}>
              <DollarSign className='mr-2 h-4 w-4' />
                Manage your plan
              </Link>
            </Button>
          </CardContent>
        </Card>
    )
}

export default OuickActions
