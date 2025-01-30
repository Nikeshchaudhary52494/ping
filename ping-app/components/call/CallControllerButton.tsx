"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface CallControllerButtonProps {
  icon: LucideIcon;
  onClick: () => void;
  variant?: "default" | "destructive";
  active?: boolean;
}

export default function CallControllerButton({
  icon: Icon,
  onClick,
  variant = "default",
  active = true,
}: CallControllerButtonProps) {
  return (
    <Button
      variant={variant}
      size="icon"
      className={cn(
        "rounded-full w-12 h-12",
        !active && "bg-muted text-muted-foreground hover:bg-muted/80"
      )}
      onClick={onClick}
    >
      <Icon className="w-6 h-6" />
    </Button>
  );
}