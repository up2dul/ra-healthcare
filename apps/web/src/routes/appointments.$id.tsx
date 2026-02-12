import {
  ArrowLeft,
  Calendar,
  Clock,
  FileText,
  Pencil,
  Trash2,
  User,
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useMutation, useQuery } from "urql";
import { AppointmentDetailSkeleton } from "@/components/appointments/appointments-skeleton";
import { Button, ButtonLink } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  appointmentQuery,
  deleteAppointmentMutation,
} from "@/graphql/appointment";
import { cn, formatDate, formatTime } from "@/lib/utils";
import type { Route } from "./+types/appointments.$id";

const STATUS_STYLES: Record<string, string> = {
  scheduled: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  completed:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export function meta({}: Route.MetaArgs) {
  return [{ title: "Appointment Detail | RaHealthcare" }];
}

export default function AppointmentDetailPage() {
  const { id } = useParams<"id">();
  const navigate = useNavigate();

  const [result] = useQuery({
    query: appointmentQuery,
    variables: { id: id ?? "" },
    pause: !id,
  });

  const [deleteResult, deleteAppointment] = useMutation(
    deleteAppointmentMutation,
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data, fetching, error } = result;
  const appointment = data?.appointment;

  const handleDelete = async () => {
    if (!id) return;

    const res = await deleteAppointment({ id });
    if (!res.error) {
      setDeleteDialogOpen(false);
      navigate("/appointments");
    }
  };

  if (fetching) {
    return <AppointmentDetailSkeleton />;
  }

  if (error) {
    return (
      <div className="space-y-4">
        <BackButton />
        <p className="text-destructive text-sm">
          Failed to load appointment. Please try again.
        </p>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="space-y-4">
        <BackButton />
        <p className="text-muted-foreground text-sm">Appointment not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <section className="flex items-center justify-between">
        <BackButton />
        <div className="flex gap-1">
          <ButtonLink to={`/appointments/edit/${id}`} variant="outline">
            <Pencil data-icon="inline-start" />
            Edit
          </ButtonLink>
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogTrigger
              render={
                <Button
                  variant="destructive"
                  disabled={deleteResult.fetching}
                />
              }
            >
              <Trash2 data-icon="inline-start" />
              Delete
            </DialogTrigger>
            <DialogContent showCloseButton={false}>
              <DialogHeader>
                <DialogTitle>Delete Appointment</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete{" "}
                  <strong>{appointment.title}</strong>? This action cannot be
                  undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setDeleteDialogOpen(false)}
                  disabled={deleteResult.fetching}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={deleteResult.fetching}
                >
                  {deleteResult.fetching ? "Deleting..." : "Delete"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </section>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base">{appointment.title}</CardTitle>
              <CardDescription>
                {formatDate(appointment.startTime)}
              </CardDescription>
            </div>
            <span
              className={cn(
                "shrink-0 rounded-sm px-2 py-0.5 font-medium text-xs capitalize",
                STATUS_STYLES[appointment.status] ??
                  "bg-muted text-muted-foreground",
              )}
            >
              {appointment.status}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-3 sm:grid-cols-2">
            <InfoItem
              icon={User}
              label="Patient"
              value={appointment.patient?.name}
            />
            <InfoItem
              icon={Calendar}
              label="Date"
              value={formatDate(appointment.startTime)}
            />
            <InfoItem
              icon={Clock}
              label="Time"
              value={`${formatTime(appointment.startTime)} - ${formatTime(appointment.endTime)}`}
            />
            {appointment.description && (
              <InfoItem
                icon={FileText}
                label="Description"
                value={appointment.description}
                className="sm:col-span-2"
              />
            )}
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}

function BackButton() {
  return (
    <ButtonLink to="/appointments" variant="ghost" size="sm">
      <ArrowLeft data-icon="inline-start" />
      Back
    </ButtonLink>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
  className,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | null | undefined;
  className?: string;
}) {
  return (
    <div className={cn("flex items-start gap-2", className)}>
      <Icon className="mt-0.5 size-3.5 text-muted-foreground" />
      <div>
        <dt className="text-[11px] text-muted-foreground">{label}</dt>
        <dd className="text-sm">{value || "—"}</dd>
      </div>
    </div>
  );
}
