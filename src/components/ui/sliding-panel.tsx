"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { Button } from "./button";

interface SlidingPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
  width?: "sm" | "md" | "lg" | "xl" | "2xl";
}

const widthClasses = {
  sm: "w-80",
  md: "w-96",
  lg: "w-[32rem]",
  xl: "w-[40rem]",
  "2xl": "w-[48rem]",
};

export function SlidingPanel({
  open,
  onOpenChange,
  children,
  title,
  description,
  className,
  width = "lg",
}: SlidingPanelProps) {
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onOpenChange(false);
      }
    };

    if (open) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={() => onOpenChange(false)}
      />
      
      {/* Panel */}
      <div className="ml-auto flex">
        <div
          className={cn(
            "relative flex h-full flex-col bg-background shadow-2xl transition-transform duration-300 ease-in-out",
            widthClasses[width],
            className
          )}
        >
          {/* Header */}
          {(title || description) && (
            <div className="flex items-start justify-between border-b border-border p-6">
              <div className="space-y-1">
                {title && (
                  <h2 className="text-lg font-semibold leading-none tracking-tight">
                    {title}
                  </h2>
                )}
                {description && (
                  <p className="text-sm text-muted-foreground">
                    {description}
                  </p>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
          )}
          
          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export function SlidingPanelContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-6", className)} {...props}>
      {children}
    </div>
  );
}

export function SlidingPanelFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center justify-end space-x-2 border-t border-border p-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}