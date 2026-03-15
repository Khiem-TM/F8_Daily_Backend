declare module "express" {
  export interface Request {
    user?: {
      name: string;
      age?: number;
    };
  }
}
