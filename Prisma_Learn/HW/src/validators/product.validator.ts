import { z } from "zod";

export const createProductSchema = z.object({
  name: z
    .string()
    .min(2, "Name is required and should be at least 2 characters long"),
  desc: z.string().optional(),
  price: z.number().positive("Price must be a positive number"),
  stock: z.number().int().min(0).default(0),
  userId: z.number().int().positive("User ID must be a positive integer"),
});

export const updateProductSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name should be at least 2 characters long")
      .optional(),
    desc: z.string().optional(),
    price: z.number().positive("Price must be a positive number").optional(),
    stock: z.number().int().min(0).optional(),
  })
  .refine(
    (data) =>
      Object.keys(data).some(
        (key) => data[key as keyof typeof data] !== undefined
      ),
    {
      message: "At least one field must be provided for update",
    }
  );

export const getProductsQuerySchema = z.object({
  userId: z.coerce.number().int().positive().optional(),
  q: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});
