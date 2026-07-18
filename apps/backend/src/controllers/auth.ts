import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import type { Request, Response } from "express";
import { getPrisma } from "../utils/db.js";

export async function Register(req: Request, res: Response) {
  try {
    const prisma = getPrisma();
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ message: "Missing required credentials" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name: name, email: email, password: hashedPassword },
    });

    if (!user) {
      res.status(500).json({ message: "Server failed to create user" });
      return;
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json({ user: userWithoutPassword, token });
  } catch (err: any) {
    if (err.code === "P2002") {
      res.status(409).json({ message: "User with this email already exists" });
      return;
    }
    const message =
      err instanceof Error
        ? err.message
        : "Unknown error occured during registration";
    return res.status(500).json({ message: message });
  }
}

export async function Login(req: Request, res: Response) {
  try {
    const prisma = getPrisma();
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: "Missing required credentials" });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email: email } });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      res.status(401).json({ message: "Incorrect password" });
      return;
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    const { password: _, ...userWithoutPassword } = user;
    res.status(200).json({ token: token, user: userWithoutPassword });
  } catch (err: any) {
    const mesage =
      err instanceof Error
        ? err.message
        : "Unknown error occured while loggin you in";
    res.status(500).json({ message: mesage });
  }
}
