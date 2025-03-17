import { Database } from "@/database.types";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { BrainCircuit, CircuitBoard, Image, Images } from "lucide-react";

interface StateCardsProps {
  imageCount: number;
  modelCount: number;
  credits: Database["public"]["Tables"]["credits"]["Row"] | null;
}

const StatesCards = ({ imageCount, modelCount, credits }: StateCardsProps) => {
  const stats = [
    {
      title: "Total Images",
      count: imageCount,
      description: "Images generated so far",
      icon: <Image className="w-6 h-6 text-orange-700" />,
    },
    {
      title: "Total Models",
      count: modelCount,
      description: "Models trained",
      icon: <CircuitBoard className="w-6 h-6 text-orange-700" />,
    },
    {
      title: "Image Credits",
      count: `${credits?.image_generation_count || 0} / ${credits?.max_image_generation_count || 0}`,
      description: "Credits left for image generation",
      icon: <Images className="w-6 h-6 text-orange-700" />,
    },
    {
      title: "Model Credits",
      count: `${credits?.model_training_count || 0} / ${credits?.max_model_training_count || 0}`,
      description: "Credits left for model training",
      icon: <BrainCircuit className="w-6 h-6 text-orange-700" />,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className="group border border-orange-700/40"
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              {stat.title}
            </CardTitle>
            {stat.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-4xl font-bold text-gray-900">
              {stat.count}
            </div>
            <p className="text-xs lg:text-sm text-gray-500">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatesCards;
