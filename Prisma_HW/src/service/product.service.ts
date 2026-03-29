import prisma from "../utils/prisma.js";

// create
export async function createProduct(
  data: string,
  price: number,
  description: string
) {
  return await prisma.product.create({
    data: {
      name: data,
      price: price,
      description: description,
    },
  });
}

// get all
export async function getAllProducts() {
  return await prisma.product.findMany();
}

// get by id
export async function getProductById(id: number) {
  return await prisma.product.findUnique({
    where: { id },
  });
}

// update
export async function updateProduct(
  id: number,
  data: string,
  price: number,
  description: string
) {
  return await prisma.product.update({
    where: { id },
    data: {
      name: data,
      price: price,
      description: description,
    },
  });
}

// delete
export async function deleteProduct(id: number) {
  return await prisma.product.delete({
    where: { id },
  });
}
