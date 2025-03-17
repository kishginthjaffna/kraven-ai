import { Tables } from "@/database.types";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

interface RecentImagesProps {
  images: Array<Tables<"generated_images"> & { url: string | undefined }>;
}

const RecentImages = ({ images }: RecentImagesProps) => {
  return (
    <Card className="col-span-4 xl:col-span-3 border border-gray-200 shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="bg-gray-100 py-2 px-6 border-b">
        <CardTitle className="text-lg font-semibold text-orange-700">
          Recent Generations
        </CardTitle>
      </CardHeader>
      <CardContent className="">
        <Carousel opts={{ align: "start" }} className="w-full">
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={index} className="w-full md:basis-1/2 lg:basis-1/3">
                <div className="">
                  <Card className="w-full h-full">
                    <CardContent className="flex items-center justify-center p-2">
                      {image.url ? (
                        <img
                          src={image.url}
                          alt={`Generated image ${index + 1}`}
                          className="object-cover w-full h-full rounded-lg"
                        />
                      ) : (
                        <span className="text-3xl font-semibold">{index + 1}</span>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-3 top-1/2 transform -translate-y-1/2 p-2" />
          <CarouselNext className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2" />
        </Carousel>
        
        <div className="flex justify-end">
              <Link href={"/my-images"}>
                <Button variant={"ghost"} className="cursor-pointer">
                  View Gallery <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
        
      </CardContent>
    </Card>
  );
};

export default RecentImages;
