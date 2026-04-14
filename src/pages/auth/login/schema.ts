import { z } from "zod";

import { USERNAME_RE } from "../register/schema";

export const loginSchema = z.object({
  username: z
    .string()
    .trim()
    .regex(USERNAME_RE, "Tài khoản chỉ gồm chữ/số/_ và dài 4–20 ký tự."),
  password: z.string().min(8, "Mật khẩu tối thiểu 8 ký tự."),
});

export type LoginSchema = z.infer<typeof loginSchema>;
