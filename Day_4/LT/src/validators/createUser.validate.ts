import z from "zod";
export const userSchema = z.object({
  name: z.string().min(1, "Tên k được để trống"),
  email: z
    .string()
    .min(1, "Email k được để trống")
    .pipe(z.string().email("Email không hợp lệ")),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});
