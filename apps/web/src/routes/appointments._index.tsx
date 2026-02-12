import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { useQuery } from "urql";
import { AppointmentsSkeleton } from "@/components/appointments/appointments-skeleton";
import { DayAppointments } from "@/components/appointments/day-appointments";
import type { AppointmentItem } from "@/components/appointments/types";
import { ButtonLink } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { appointmentsQuery } from "@/graphql/appointment";
import { cn, getMonthDateRange, groupByDateKey, toDateKey } from "@/lib/utils";
import type { Route } from "./+types/appointments._index";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Appointments | RaHealthcare" }];
}

export default function AppointmentsPage() {
  const today = new Date();
  const [month, setMonth] = useState(today);
  const [selectedDate, setSelectedDate] = useState<Date>(today);

  const { start, end } = getMonthDateRange(month);

  const [result] = useQuery({
    query: appointmentsQuery,
    variables: {
      startDate: start.toISOString(),
      endDate: end.toISOString(),
    },
  });

  const { data, fetching, error } = result;
  const appointments: AppointmentItem[] = data?.appointments ?? [];

  const appointmentsByDay = useMemo(
    () => groupByDateKey(appointments, (a) => a.startTime),
    [appointments],
  );

  const daysWithAppointments = useMemo(
    () =>
      new Set(
        [...appointmentsByDay.keys()].map((key) => {
          const [y, m, d] = key.split("-").map(Number);
          return new Date(y, m - 1, d).toDateString();
        }),
      ),
    [appointmentsByDay],
  );

  const selectedKey = toDateKey(selectedDate);
  const selectedAppointments = appointmentsByDay.get(selectedKey) ?? [];

  if (fetching && !data) {
    return <AppointmentsSkeleton />;
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h1 className="font-bold text-xl">Appointments</h1>
        <p className="text-destructive text-sm">
          {error.message || "Failed to load appointments"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="font-bold text-xl">Appointments</h1>
        <ButtonLink to="/appointments/new" size="sm">
          <Plus data-icon="inline-start" />
          New Appointment
        </ButtonLink>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(280px,auto)_1fr]">
        {/* Calendar panel */}
        <Card>
          <CardContent className="p-2">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              month={month}
              onMonthChange={setMonth}
              modifiers={{
                hasAppointments: (date) =>
                  daysWithAppointments.has(date.toDateString()),
              }}
              modifiersClassNames={{
                hasAppointments: "has-appointments",
              }}
              classNames={{
                day: cn(
                  "group/day relative aspect-square h-full w-full select-none rounded-none p-0 text-center",
                  "[&.has-appointments_.rdp-day_button]:after:absolute [&.has-appointments_.rdp-day_button]:after:bottom-1 [&.has-appointments_.rdp-day_button]:after:left-1/2 [&.has-appointments_.rdp-day_button]:after:size-1 [&.has-appointments_.rdp-day_button]:after:-translate-x-1/2 [&.has-appointments_.rdp-day_button]:after:rounded-full [&.has-appointments_.rdp-day_button]:after:bg-primary",
                ),
              }}
            />
          </CardContent>
        </Card>

        {/* Day detail panel */}
        <Card>
          <CardContent className="p-4">
            <DayAppointments
              date={selectedDate}
              appointments={selectedAppointments}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
