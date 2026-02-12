import { useForm } from "@tanstack/react-form";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";
import { useMutation, useQuery } from "urql";
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
import { createAppointmentMutation } from "@/graphql/appointment";
import { patientsQuery } from "@/graphql/patient";
import { combineDateAndTime, fieldError, toDateKey } from "@/lib/utils";
import { appointmentFormSchema } from "@/schemas/appointment";
import type { Route } from "./+types/appointments.new";

export function meta({}: Route.MetaArgs) {
  return [{ title: "New Appointment | RaHealthcare" }];
}

export default function NewAppointmentPage() {
  const navigate = useNavigate();

  const [patientsResult] = useQuery({
    query: patientsQuery,
    variables: { page: 1, limit: 200 },
  });

  const [createResult, createAppointment] = useMutation(
    createAppointmentMutation,
  );

  const patients = patientsResult.data?.patients?.data ?? [];

  const form = useForm({
    defaultValues: {
      patientId: "",
      title: "",
      description: "",
      date: toDateKey(new Date()),
      startTime: "09:00",
      endTime: "10:00",
      status: "scheduled" as "scheduled" | "completed" | "cancelled",
    },
    validators: {
      onChange: appointmentFormSchema,
    },
    onSubmit: async ({ value }) => {
      const res = await createAppointment({
        input: {
          patientId: value.patientId,
          title: value.title,
          description: value.description || undefined,
          startTime: combineDateAndTime(value.date, value.startTime),
          endTime: combineDateAndTime(value.date, value.endTime),
          status: value.status,
        },
      });

      if (!res.error && res.data?.createAppointment) {
        navigate(`/appointments/${res.data.createAppointment.id}`);
      }
    },
  });

  return (
    <div className="space-y-4">
      <section className="flex items-center justify-between">
        <ButtonLink to="/appointments" variant="ghost" size="sm">
          <ArrowLeft data-icon="inline-start" />
          Back
        </ButtonLink>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>New Appointment</CardTitle>
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
                        createResult.fetching || patientsResult.fetching
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
                      disabled={createResult.fetching}
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
                      disabled={createResult.fetching}
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
                      disabled={createResult.fetching}
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
                      disabled={createResult.fetching}
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
                      disabled={createResult.fetching}
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
                      disabled={createResult.fetching}
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

            {createResult.error && (
              <p className="text-destructive text-sm">
                {createResult.error.message || "Failed to create appointment"}
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
                    onClick={() => navigate("/appointments")}
                    disabled={createResult.fetching}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={!canSubmit || createResult.fetching}
                  >
                    {createResult.fetching || isSubmitting
                      ? "Creating..."
                      : "Create Appointment"}
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
