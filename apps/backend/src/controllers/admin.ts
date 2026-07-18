import type { Request, Response } from "express";
import { getPrisma } from "../utils/db.js";

export async function getAllUsers(req: Request, res: Response) {
  try {
    const prisma = getPrisma();

    if (req.user?.role !== "ADMIN") {
      res.status(403).json({ message: "Forbidden access" });
      return;
    }

    const page = Number(req.query.page) || 1;
    const userLimit = Math.min(Number(req.query.userLimit) || 15, 100);

    const skip = ( page - 1 ) * userLimit;

    const [users, totalCount] = await Promise.all([
        prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
      skip,
      take: userLimit,
    }),
    prisma.user.count(),
    ]) 

    res.status(200).json({ 
        users,
        pagination: {page, userLimit, totalCount, totalPages: Math.ceil(totalCount/userLimit)}
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unknown error while getting users";
    res.status(500).json({ message: message });
  }
}
