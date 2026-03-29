import type { Request, Response, NextFunction } from "express";
import * as ProductService from "../service/product.service.js";

export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const products = await ProductService.getAllProducts();
    res.json(products);
  } catch (error) {
    next(error);
  }
};

export const getProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = await ProductService.getProductById(Number(req.params.id));
    res.json(product);
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, price, description } = req.body;
    const newProduct = await ProductService.createProduct(
      name,
      price,
      description
    );
    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, price, description } = req.body;
    const updated = await ProductService.updateProduct(
      Number(req.params.id),
      name,
      price,
      description
    );
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await ProductService.deleteProduct(Number(req.params.id));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
