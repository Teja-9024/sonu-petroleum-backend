import { z } from "zod";

export const dieselRateSchema = z.object({
  body: z.object({
    rate: z.number().positive("Rate must be a positive number")
  })
});
