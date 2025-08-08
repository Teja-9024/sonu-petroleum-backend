import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string(),
    role: z.enum(["owner", "worker"]),
    vanNo: z.string().nullable().optional()
  }).superRefine((data, ctx) => {
    if (data.role === "worker" && (!data.vanNo || data.vanNo === "")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Van is required when role is worker",
        path: ["van"]
      });
    }
    if (data.role === "owner" && data.vanNo) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Van should not be provided when role is owner",
        path: ["van"]
      });
    }
  })
});


export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(["owner", "worker"])
  })
});
