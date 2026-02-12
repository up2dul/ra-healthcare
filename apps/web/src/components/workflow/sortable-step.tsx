import { useSortable } from "@dnd-kit/react/sortable";
import { GripVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { LocalWorkflowStep } from "./types";

interface SortableStepProps {
  step: LocalWorkflowStep;
  index: number;
  onRemove: (id: string) => void;
  disabled?: boolean;
}

export function SortableStep({
  step,
  index,
  onRemove,
  disabled,
}: SortableStepProps) {
  const { ref, isDragging } = useSortable({
    id: step.id,
    index,
  });

  return (
    <li
      ref={ref}
      className={cn(
        "flex items-center gap-2 rounded-none border bg-background px-3 py-2 transition-shadow",
        isDragging && "z-10 shadow-lg ring-2 ring-primary/30",
        disabled && "opacity-60",
      )}
    >
      <span
        className="cursor-grab touch-none text-muted-foreground"
        aria-hidden="true"
      >
        <GripVertical className="size-4" />
      </span>

      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary text-xs">
        {index + 1}
      </span>

      <span className="flex-1 text-sm">{step.label}</span>

      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={() => onRemove(step.id)}
        disabled={disabled}
        aria-label={`Remove ${step.label}`}
      >
        <Trash2 className="size-3.5" />
      </Button>
    </li>
  );
}
