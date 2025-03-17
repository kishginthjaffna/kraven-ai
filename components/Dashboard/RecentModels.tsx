import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Database } from '@/database.types'
import { Badge } from '../ui/badge'

interface RecentModelsProps {
    models: Database["public"]["Tables"]["models"]["Row"][]
}
const RecentModels = ({models}: RecentModelsProps) => {
    return (
      <Card className="w-full col-span-4 lg:col-span-1">
          <CardHeader className="">
            <CardTitle className="">
              Recent Models
            </CardTitle>
          </CardHeader>
          <CardContent className='grid gap-4'>
            <div className="space-y-4">
                    {
                    models.length === 0 ? <p>No models trained yet</p> : models.map(model => {
                        // Function to determine badge color based on status
                        const getBadgeColor = (status: string) => {
                        switch (status) {
                            case 'starting':
                            return 'bg-yellow-500 text-white'; // Yellow for starting
                            case 'processing':
                            return 'bg-blue-500 text-white'; // Blue for processing
                            case 'succeeded':
                            return 'bg-green-500 text-white'; // Green for succeeded
                            case 'failed':
                            return 'bg-red-500 text-white'; // Red for failed
                            case 'canceled':
                            return 'bg-gray-500 text-white'; // Gray for canceled
                            default:
                            return 'bg-gray-300 text-black'; // Default gray for unknown statuses
                        }
                        };

                    return <div key={model.model_id} className='bg-orange-700/7 rounded-lg p-4'>
                    <div className='flex justify-between'>
                        <p>{model.model_name}</p>
                        <Badge className={`mt-2 ${getBadgeColor(model.training_status as string)}`}>
                        {model.training_status}
                        </Badge>
                    </div>
                        <p className='text-xs text-muted-foreground'>{model.gender}</p>
            </div>
      })
    }
  </div>
            </CardContent>

        </Card>
    )
}

export default RecentModels
