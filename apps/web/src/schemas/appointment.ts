import { z } from "zod";

const statusValues = ["scheduled", "completed", "cancelled"] as const;

export const appointmentFormSchema = z
  .object({
    patientId: z.string().min(1, "Patient is required"),
    title: z
      .string()
      .min(2, "Title must be at least 2 characters")
      .max(255, "Title must be at most 255 characters"),
    description: z.string().max(1000, "Description is too long"),
    date: z.string().min(1, "Date is required"),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
    status: z.enum(statusValues, {
      error: "Status is required",
    }),
  })
  .refine((val) => val.endTime > val.startTime, {
    message: "End time must be after start time",
    path: ["endTime"],
  });

export type AppointmentFormSchema = z.infer<typeof appointmentFormSchema>;
