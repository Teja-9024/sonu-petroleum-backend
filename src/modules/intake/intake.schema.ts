import { z } from "zod";

export const intakeSchema = z.object({
  body: z.object({
    // vanNo: z.string().min(1, "Van is required"),
    // worker: z.string().min(1, "Worker name is required"),
    pumpName: z.string().min(1, "Pump name is required"),
    litres: z.number().min(1, "Litres must be positive"),
    amount: z.number().min(1, "Amount must be positive"),
    dateTime: z.string().min(1, "Date is required"),
  })
});

