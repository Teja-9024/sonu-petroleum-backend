import { z } from "zod";

export const deliverySchema = z.object({
  body: z.object({
    vanNo: z.string().min(1, "Van is required"),
    worker: z.string().min(1, "Worker name is required"),
    supplier: z.string().min(1, "Supplier is required"),
    customer: z.string().min(1, "Customer name is required"),
    litres: z.number().min(1, "Litres must be positive"),
    amount: z.number().min(1, "Amount must be positive"),
    dateTime: z.string().min(1, "Time is required"),
  })
});
