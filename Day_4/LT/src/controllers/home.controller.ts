import { Request, Response } from "express";

export const homeController = {
  index: (req: Request, res: Response) => {
    res.json({
      user: req.user,
    });

    console.log("User:", req.user);
  },
};
