
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface ComponentLoaderProps {
  className?: string;
  height?: number | string;
  width?: number | string;
  rounded?: boolean;
}

export function ComponentLoader({ 
  className, 
  height = "12rem", 
  width = "100%",
  rounded = true
}: ComponentLoaderProps) {
  return (
    <div className={cn("w-full flex items-center justify-center p-4", className)}>
      <Skeleton 
        className={cn(
          "w-full", 
          rounded && "rounded-lg"
        )} 
        style={{ 
          height: typeof height === 'number' ? `${height}px` : height,
          width: typeof width === 'number' ? `${width}px` : width
        }}
      />
    </div>
  );
}
