
import React from "react";
import { LoadingSpinner } from "./loading-spinner";
import { cn } from "@/lib/utils";

interface LoadingScreenProps {
  className?: string;
  text?: string;
}

export function LoadingScreen({ className, text = "Carregando..." }: LoadingScreenProps) {
  return (
    <div className={cn(
      "fixed inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center z-50",
      className
    )}>
      <div className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg">
        <LoadingSpinner size={40} />
        <p className="text-base font-medium text-foreground/70">{text}</p>
      </div>
    </div>
  );
}
