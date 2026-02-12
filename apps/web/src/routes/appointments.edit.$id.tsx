import { useForm } from "@tanstack/react-form";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { useMutation, useQuery } from "urql";
import { EditAppointmentSkeleton } from "@/components/appointments/appointments-skeleton";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  appointmentQuery,
  updateAppointmentMutation,
} from "@/graphql/appointment";
import { patientsQuery } from "@/graphql/patient";
import {
  combineDateAndTime,
  fieldError,
  toDateKey,
  toTimeString,
} from "@/lib/utils";
import { appointmentFormSchema } from "@/schemas/appointment";
import type { Route } from "./+types/appointments.edit.$id";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Edit Appointment | RaHealthcare" }];
}

export default function EditAppointmentPage() {
  const { id } = useParams<"id">();
  const navigate = useNavigate();

  const [queryResult] = useQuery({
    query: appointmentQuery,
    variables: { id: id ?? "" },
    pause: !id,
  });

  const [patientsResult] = useQuery({
    query: patientsQuery,
    variables: { page: 1, limit: 200 },
  });

  const [updateResult, updateAppointment] = useMutation(
    updateAppointmentMutation,
  );

  const { data, fetching, error } = queryResult;
  const appointment = data?.appointment;
  const patients = patientsResult.data?.patients?.data ?? [];

  const form = useForm({
    defaultValues: {
      patientId: appointment?.patientId ?? "",
      title: appointment?.title ?? "",
      description: appointment?.description ?? "",
      date: appointment?.startTime ? toDateKey(appointment.startTime) : "",
      startTime: appointment?.startTime
        ? toTimeString(appointment.startTime)
        : "09:00",
      endTime: appointment?.endTime
        ? toTimeString(appointment.endTime)
        : "10:00",
      status: (appointment?.status ?? "scheduled") as
        | "scheduled"
        | "completed"
        | "cancelled",
    },
    validators: {
      onChange: appointmentFormSchema,
    },
    onSubmit: async ({ value }) => {
      if (!id) return;

      const res = await updateAppointment({
        id,
        input: {
          patientId: value.patientId,
          title: value.title,
          description: value.description || undefined,
          startTime: combineDateAndTime(value.date, value.startTime),
          endTime: combineDateAndTime(value.date, value.endTime),
          status: value.status,
        },
      });

      if (!res.error && res.data?.updateAppointment) {
        navigate(`/appointments/${id}`);
      }
    },
  });

  if (fetching) {
    return <EditAppointmentSkeleton />;
  }

  if (error) {
    return (
      <div className="space-y-4">
        <ButtonLink to="/appointments" variant="ghost" size="sm">
          <ArrowLeft data-icon="inline-start" />
          Back
        </ButtonLink>
        <p className="text-destructive text-sm">
          Failed to load appointment. Please try again.
        </p>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="space-y-4">
        <ButtonLink to="/appointments" variant="ghost" size="sm">
          <ArrowLeft data-icon="inline-start" />
          Back
        </ButtonLink>
        <p className="text-muted-foreground text-sm">Appointment not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <section className="flex items-center justify-between">
        <ButtonLink to={`/appointments/${id}`} variant="ghost" size="sm">
          <ArrowLeft data-icon="inline-start" />
          Back
        </ButtonLink>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Edit Appointment</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-4"
          >
            <fieldset className="grid gap-4 sm:grid-cols-2">
              {/* Patient selector */}
              <form.Field name="patientId">
                {(field) => (
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor={field.name}>
                      Patient <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={field.state.value}
                      onValueChange={(val) => {
                        field.handleChange(val as string);
                        field.handleBlur();
                      }}
                      disabled={
                        updateResult.fetching || patientsResult.fetching
                      }
                    >
                      <SelectTrigger
                        id={field.name}
                        className="w-full"
                        aria-invalid={
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid
                        }
                      >
                        <SelectValue placeholder="Select a patient" />
                      </SelectTrigger>
                      <SelectContent>
                        {patients.map((p: { id: string; name: string }) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {field.state.meta.isTouched &&
                      field.state.meta.errors.length > 0 && (
                        <p className="text-destructive text-xs">
                          {fieldError(field.state.meta.errors[0])}
                        </p>
                      )}
                  </div>
                )}
              </form.Field>

              {/* Title */}
              <form.Field name="title">
                {(field) => (
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor={field.name}>
                      Title <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="text"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      aria-invalid={
                        field.state.meta.isTouched && !field.state.meta.isValid
                      }
                      disabled={updateResult.fetching}
                    />
                    {field.state.meta.isTouched &&
                      field.state.meta.errors.length > 0 && (
                        <p className="text-destructive text-xs">
                          {fieldError(field.state.meta.errors[0])}
                        </p>
                      )}
                  </div>
                )}
              </form.Field>

              {/* Date */}
              <form.Field name="date">
                {(field) => (
                  <div className="space-y-1.5">
                    <Label htmlFor={field.name}>
                      Date <span className="text-destructive">*</span>
                    </Label>
                    <DatePicker
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onChange={(val) => field.handleChange(val)}
                      onBlur={field.handleBlur}
                      aria-invalid={
                        field.state.meta.isTouched && !field.state.meta.isValid
                      }
                      disabled={updateResult.fetching}
                    />
                    {field.state.meta.isTouched &&
                      field.state.meta.errors.length > 0 && (
                        <p className="text-destructive text-xs">
                          {fieldError(field.state.meta.errors[0])}
                        </p>
                      )}
                  </div>
                )}
              </form.Field>

              {/* Status */}
              <form.Field name="status">
                {(field) => (
                  <div className="space-y-1.5">
                    <Label htmlFor={field.name}>
                      Status <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={field.state.value}
                      onValueChange={(val) => {
                        field.handleChange(
                          val as "scheduled" | "completed" | "cancelled",
                        );
                        field.handleBlur();
                      }}
                      disabled={updateResult.fetching}
                    >
                      <SelectTrigger
                        id={field.name}
                        className="w-full"
                        aria-invalid={
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid
                        }
                      >
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    {field.state.meta.isTouched &&
                      field.state.meta.errors.length > 0 && (
                        <p className="text-destructive text-xs">
                          {fieldError(field.state.meta.errors[0])}
                        </p>
                      )}
                  </div>
                )}
              </form.Field>

              {/* Start time */}
              <form.Field name="startTime">
                {(field) => (
                  <div className="space-y-1.5">
                    <Label htmlFor={field.name}>
                      Start Time <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="time"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      aria-invalid={
                        field.state.meta.isTouched && !field.state.meta.isValid
                      }
                      disabled={updateResult.fetching}
                    />
                    {field.state.meta.isTouched &&
                      field.state.meta.errors.length > 0 && (
                        <p className="text-destructive text-xs">
                          {fieldError(field.state.meta.errors[0])}
                        </p>
                      )}
                  </div>
                )}
              </form.Field>

              {/* End time */}
              <form.Field name="endTime">
                {(field) => (
                  <div className="space-y-1.5">
                    <Label htmlFor={field.name}>
                      End Time <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="time"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      aria-invalid={
                        field.state.meta.isTouched && !field.state.meta.isValid
                      }
                      disabled={updateResult.fetching}
                    />
                    {field.state.meta.isTouched &&
                      field.state.meta.errors.length > 0 && (
                        <p className="text-destructive text-xs">
                          {fieldError(field.state.meta.errors[0])}
                        </p>
                      )}
                  </div>
                )}
              </form.Field>

              {/* Description */}
              <form.Field name="description">
                {(field) => (
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor={field.name}>Description</Label>
                    <Textarea
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      aria-invalid={
                        field.state.meta.isTouched && !field.state.meta.isValid
                      }
                      disabled={updateResult.fetching}
                      rows={3}
                    />
                    {field.state.meta.isTouched &&
                      field.state.meta.errors.length > 0 && (
                        <p className="text-destructive text-xs">
                          {fieldError(field.state.meta.errors[0])}
                        </p>
                      )}
                  </div>
                )}
              </form.Field>
            </fieldset>

            {updateResult.error && (
              <p className="text-destructive text-sm">
                {updateResult.error.message || "Failed to update appointment"}
              </p>
            )}

            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(`/appointments/${id}`)}
                    disabled={updateResult.fetching}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={!canSubmit || updateResult.fetching}
                  >
                    {updateResult.fetching || isSubmitting
                      ? "Saving..."
                      : "Save Changes"}
                  </Button>
                </div>
              )}
            </form.Subscribe>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
