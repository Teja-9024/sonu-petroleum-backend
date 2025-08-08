import { z } from "zod";

export const vanSchema = z.object({
  body: z.object({
    vanNo:z.string().min(1, "Van number is required"),
    name: z.string().min(1, "Van name is required"),
    capacity: z.number().min(0),
    currentDiesel: z.number().min(0),
    worker: z.string().min(1, "Worker name is required"),
    morningStock: z.number().min(0),
    totalFilled: z.number().min(0),
    totalDelivered: z.number().min(0),
  })
});
