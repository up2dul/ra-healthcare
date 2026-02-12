import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery } from "urql";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createAppointmentMutation } from "@/graphql/appointment";
import { patientsQuery } from "@/graphql/patient";
import { cn, combineDateAndTime, fieldError, toDateKey } from "@/lib/utils";
import { appointmentFormSchema } from "@/schemas/appointment";

interface AddAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Pre-selected date for the appointment (YYYY-MM-DD). */
  defaultDate?: string;
}

export function AddAppointmentDialog({
  open,
  onOpenChange,
  defaultDate,
}: AddAppointmentDialogProps) {
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
      date: defaultDate ?? toDateKey(new Date()),
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
        onOpenChange(false);
        form.reset();
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Appointment</DialogTitle>
          <DialogDescription>
            Schedule a new appointment for a patient.
          </DialogDescription>
        </DialogHeader>

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
                  <select
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    aria-invalid={
                      field.state.meta.isTouched && !field.state.meta.isValid
                    }
                    disabled={createResult.fetching || patientsResult.fetching}
                    className={cn(
                      "h-8 w-full rounded-none border border-input bg-transparent px-2.5 py-1 text-xs outline-none transition-colors",
                      "focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50",
                      "disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50",
                      "dark:bg-input/30",
                      field.state.meta.isTouched &&
                        !field.state.meta.isValid &&
                        "border-destructive ring-1 ring-destructive/20 dark:border-destructive/50 dark:ring-destructive/40",
                    )}
                  >
                    <option value="">Select a patient</option>
                    {patients.map((p: { id: string; name: string }) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
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
                  <Input
                    id={field.name}
                    name={field.name}
                    type="date"
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

            {/* Status */}
            <form.Field name="status">
              {(field) => (
                <div className="space-y-1.5">
                  <Label htmlFor={field.name}>
                    Status <span className="text-destructive">*</span>
                  </Label>
                  <select
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) =>
                      field.handleChange(
                        e.target.value as
                          | "scheduled"
                          | "completed"
                          | "cancelled",
                      )
                    }
                    onBlur={field.handleBlur}
                    aria-invalid={
                      field.state.meta.isTouched && !field.state.meta.isValid
                    }
                    disabled={createResult.fetching}
                    className={cn(
                      "h-8 w-full rounded-none border border-input bg-transparent px-2.5 py-1 text-xs outline-none transition-colors",
                      "focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50",
                      "disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50",
                      "dark:bg-input/30",
                      field.state.meta.isTouched &&
                        !field.state.meta.isValid &&
                        "border-destructive ring-1 ring-destructive/20 dark:border-destructive/50 dark:ring-destructive/40",
                    )}
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
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

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createResult.fetching}
            >
              Cancel
            </Button>
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <Button
                  type="submit"
                  disabled={!canSubmit || createResult.fetching}
                >
                  {createResult.fetching || isSubmitting
                    ? "Creating..."
                    : "Create Appointment"}
                </Button>
              )}
            </form.Subscribe>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
