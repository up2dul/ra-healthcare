import { CalendarDays } from "lucide-react";
import { Link } from "react-router";
import { formatDate } from "@/lib/utils";
import { AppointmentCard } from "./appointment-card";
import type { AppointmentItem } from "./types";

interface DayAppointmentsProps {
  date: Date;
  appointments: AppointmentItem[];
}

export function DayAppointments({ date, appointments }: DayAppointmentsProps) {
  return (
    <section aria-label={`Appointments for ${formatDate(date.toISOString())}`}>
      <header className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold text-sm">
          <time dateTime={date.toISOString().split("T")[0]}>
            {formatDate(date.toISOString())}
          </time>
        </h3>
        <span className="text-muted-foreground text-xs">
          {appointments.length} appointment{appointments.length !== 1 && "s"}
        </span>
      </header>

      {appointments.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {appointments.map((apt) => (
            <li key={apt.id}>
              <Link to={`/appointments/${apt.id}`}>
                <AppointmentCard appointment={apt} />
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 py-8 text-muted-foreground">
          <CalendarDays className="size-8 opacity-40" aria-hidden="true" />
          <p className="text-sm">No appointments on this day</p>
        </div>
      )}
    </section>
  );
}
