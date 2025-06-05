import { NextFunction, Request, Response } from "express";

export interface AppError extends Error {
  status?: number;
}

export const errorHandler = (
  error: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  console.error(error);
  res.status(error.status || 500).json({
    message: error.message || "Internal Server Error",
  });
};
