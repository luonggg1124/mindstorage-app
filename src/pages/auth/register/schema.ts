import { z } from "zod";

export const USERNAME_RE = /^[a-zA-Z0-9_]{4,20}$/;

export const registerSchema = z.object({
  // step 1
  fullName: z.string().trim().min(1, "Vui lòng nhập họ tên."),
  gender: z.enum(["MALE", "FEMALE", "OTHER"], { message: "Vui lòng chọn giới tính." }),
  hobbies: z.array(z.string()),

  // step 2
  intendedUse: z
    .array(z.string())
    .min(1, "Vui lòng chọn ít nhất một mục đích sử dụng."),
  username: z
    .string()
    .trim()
    .regex(USERNAME_RE, "Tài khoản chỉ gồm chữ/số/_ và dài 4–20 ký tự."),
  password: z.string().min(8, "Mật khẩu tối thiểu 8 ký tự."),

  // step 3
  email: z.string().trim().email("Email không hợp lệ."),
  session: z.string().trim().min(1, "Vui lòng bấm “Gửi mã” để nhận mã xác nhận."),
  code: z.string().trim().min(1, "Vui lòng nhập mã xác nhận."),
  agree: z.boolean().refine((v) => v === true, "Vui lòng đồng ý chính sách."),
});

export type RegisterSchema = z.infer<typeof registerSchema>;

export const step1Schema = registerSchema.pick({ fullName: true, gender: true, hobbies: true });
export const step2Schema = registerSchema.pick({
  intendedUse: true,
  username: true,
  password: true,
});
export const step3Schema = registerSchema.pick({
  email: true,
  session: true,
  code: true,
  agree: true,
});

