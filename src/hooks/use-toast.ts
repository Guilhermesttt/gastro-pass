
import * as React from "react";
import { toast as sonnerToast } from "sonner";

export type ToastProps = {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
  duration?: number;
};

export function toast({
  title,
  description,
  action,
  variant = "default",
  duration = 4000,
}: ToastProps) {
  // Map our variant to sonner's styles
  const style = variant === "destructive" 
    ? { style: { backgroundColor: "hsl(var(--destructive))", color: "hsl(var(--destructive-foreground))" } }
    : {};

  sonnerToast(title, {
    description,
    action,
    duration,
    ...style,
  });
}

export function useToast() {
  return {
    toast,
  };
}
