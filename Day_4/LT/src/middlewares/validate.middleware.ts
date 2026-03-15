import { Request, Response, NextFunction } from "express";
import z from "zod";

export const validate =
  (schema: z.ZodSchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const zodErrors = Object.fromEntries(
          error.issues.map((issue) => [issue.path.join("."), issue.message])
        );
        res.status(400).json({
          error: zodErrors,
        });
        return;
      }
      // Handle other errors
      res.status(500).json({
        error: "Internal server error",
      });
    }
  };
