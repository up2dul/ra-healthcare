import { Clock, User } from "lucide-react";
import { cn, formatTime } from "@/lib/utils";
import type { AppointmentItem } from "./types";

const STATUS_STYLES: Record<string, string> = {
  scheduled: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  completed:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

interface AppointmentCardProps {
  appointment: AppointmentItem;
}

export function AppointmentCard({ appointment }: AppointmentCardProps) {
  return (
    <article className="flex flex-col gap-1.5 rounded-none border p-3">
      <header className="flex items-start justify-between gap-2">
        <h4 className="font-medium text-sm leading-tight">
          {appointment.title}
        </h4>
        <span
          className={cn(
            "shrink-0 rounded-full px-2 py-0.5 font-medium text-[10px] capitalize",
            STATUS_STYLES[appointment.status] ?? "bg-muted text-foreground",
          )}
        >
          {appointment.status}
        </span>
      </header>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-muted-foreground text-xs">
        <span className="inline-flex items-center gap-1">
          <User className="size-3" aria-hidden="true" />
          {appointment.patient.name}
        </span>
        <time className="inline-flex items-center gap-1">
          <Clock className="size-3" aria-hidden="true" />
          {formatTime(appointment.startTime)} –{" "}
          {formatTime(appointment.endTime)}
        </time>
      </div>

      {appointment.description && (
        <p className="line-clamp-2 text-muted-foreground text-xs">
          {appointment.description}
        </p>
      )}
    </article>
  );
}
