// middleware/auth.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export interface AuthedRequest extends Request {
  user?: { userId: string; email: string; role: "owner" | "worker"; vanId?: string | null };
}

export const requireAuth = (req: AuthedRequest, res: Response, next: NextFunction) => {
  const hdr = req.headers.authorization;
  if (!hdr?.startsWith("Bearer ")) return res.status(401).json({ message: "Missing token" });

  const token = hdr.slice(7);
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as any;
    req.user = { userId: decoded.userId, email: decoded.email, role: decoded.role, vanId: decoded.vanId ?? null };
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};
