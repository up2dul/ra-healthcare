import { z } from "zod";

const genderValues = ["male", "female"] as const;
const appointmentStatusValues = [
  "scheduled",
  "completed",
  "cancelled",
] as const;

export const createPatientSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  email: z.email("Invalid email").nullish(),
  phone: z.string().min(1).max(20).nullish(),
  dateOfBirth: z.coerce.date().nullish(),
  gender: z.enum(genderValues).nullish(),
  address: z.string().max(500).nullish(),
});

export const updatePatientSchema = createPatientSchema.partial();

export const createAppointmentSchema = z
  .object({
    patientId: z.uuid("Invalid patient ID"),
    title: z.string().min(1, "Title is required").max(255),
    description: z.string().max(1000).nullish(),
    startTime: z.coerce.date(),
    endTime: z.coerce.date(),
    status: z.enum(appointmentStatusValues).default("scheduled"),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: "End time must be after start time",
    path: ["endTime"],
  });

export const updateAppointmentSchema = z
  .object({
    title: z.string().min(1).max(255).nullish(),
    description: z.string().max(1000).nullish(),
    startTime: z.coerce.date().nullish(),
    endTime: z.coerce.date().nullish(),
    status: z.enum(appointmentStatusValues).nullish(),
  })
  .refine(
    (data) => {
      if (data.startTime && data.endTime) {
        return data.endTime > data.startTime;
      }
      return true;
    },
    {
      message: "End time must be after start time",
      path: ["endTime"],
    },
  );

export const saveWorkflowSchema = z.object({
  steps: z
    .array(
      z.object({
        id: z.uuid().nullish(),
        label: z.string().min(1, "Label is required").max(255),
        order: z.number().int().min(0),
      }),
    )
    .min(1, "At least one step is required"),
});
