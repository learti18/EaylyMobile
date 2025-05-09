import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits long"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  confirmPassword: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .refine((val) => val.length >= 6, {
      message: "Password must be at least 6 characters long",
    })
    .refine((val, ctx) => val === ctx.parent.password, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
