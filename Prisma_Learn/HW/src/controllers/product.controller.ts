import { Request, Response } from "express";
import * as ProductService from "../services/product.service";
import {
  createProductSchema,
  updateProductSchema,
  getProductsQuerySchema,
} from "../validators/product.validator";

export async function createProduct(req: Request, res: Response) {
  const parsed = createProductSchema.safeParse(req.body);
  if (!parsed.success)
    return res
      .status(400)
      .json({ error: "Validation failed", details: parsed.error.issues });

  try {
    const product = await ProductService.createProduct(parsed.data);
    return res.status(201).json({ data: product });
  } catch (e: any) {
    if (e.message === "User not found")
      return res.status(404).json({ error: e.message });
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function getProducts(req: Request, res: Response) {
  const parsed = getProductsQuerySchema.safeParse(req.query);
  if (!parsed.success)
    return res
      .status(400)
      .json({ error: "Validation failed", details: parsed.error.issues });

  try {
    const result = await ProductService.getProducts(parsed.data);
    return res.json(result);
  } catch (e: any) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function getProductById(req: Request, res: Response) {
  try {
    const product = await ProductService.getProductById(Number(req.params.id));
    return res.json({ data: product });
  } catch (e: any) {
    if (e.message === "Product not found")
      return res.status(404).json({ error: e.message });
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function updateProduct(req: Request, res: Response) {
  const parsed = updateProductSchema.safeParse(req.body);
  if (!parsed.success)
    return res
      .status(400)
      .json({ error: "Validation failed", details: parsed.error.issues });

  try {
    const product = await ProductService.updateProduct(
      Number(req.params.id),
      parsed.data
    );
    return res.json({ data: product });
  } catch (e: any) {
    if (e.message === "Product not found")
      return res.status(404).json({ error: e.message });
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function deleteProduct(req: Request, res: Response) {
  try {
    await ProductService.deleteProduct(Number(req.params.id));
    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (e: any) {
    if (e.message === "Product not found")
      return res.status(404).json({ error: e.message });
    return res.status(500).json({ error: "Internal server error" });
  }
}
