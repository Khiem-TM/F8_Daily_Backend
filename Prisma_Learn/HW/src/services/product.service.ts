import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

type CreateProductInput = {
  name: string;
  desc?: string;
  price: number;
  stock: number;
  userId: number;
};

export async function createProduct(data: CreateProductInput) {
  const user = await prisma.user.findUnique({
    where: { id: data.userId },
  });
  if (!user) throw new Error("User not found");

  const product = await prisma.product.create({ data });
  return product;
}

type GetProductsInput = {
  userId?: number;
  q?: string;
  page: number;
  limit: number;
};

export async function getProducts({
  userId,
  q,
  page,
  limit,
}: GetProductsInput) {
  const where = {
    ...(userId && { userId }),
    ...(q && { name: { contains: q, mode: "insensitive" as const } }),
  };

  const [products, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { created_at: "desc" },
    }),
    prisma.product.count({ where }),
  ]);

  return {
    data: products,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getProductById(id: number) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  if (!product) throw new Error("Product not found");
  const { user: createdBy, ...rest } = product;
  return { ...rest, createdBy };
}

type UpdateProductInput = {
  name?: string;
  desc?: string;
  price?: number;
  stock?: number;
};

export async function updateProduct(id: number, data: UpdateProductInput) {
  try {
    const updated = await prisma.product.update({
      where: { id },
      data: { ...data, updated_at: new Date() },
    });
    return updated;
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError && e.code === "P2025") {
      throw new Error("Product not found");
    }
    throw e;
  }
}

export async function deleteProduct(id: number) {
  try {
    await prisma.product.delete({ where: { id } });
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError && e.code === "P2025") {
      throw new Error("Product not found");
    }
    throw e;
  }
}
