import type { Request, Response } from "express";
import { getPrisma } from "../utils/db.js";
import { getResend } from "../utils/resend.js";
import crypto from "crypto";
import bcrypt from 'bcrypt';

export async function userPrivateProfile(req: Request, res: Response) {
  try {
    const prisma = getPrisma();
    const userId = req.user?.userId;

    const user = await prisma.user.findUnique({
      where: { id: String(userId) },
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const { password: _, ...userWithoutPassword } = user;
    res.status(200).json({ userWithoutPassword });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unknown error while fetching user";
    res.status(500).json({ message: message });
  }
}

export async function forgotPassword(req: Request, res: Response) {
  try {
    const prisma = getPrisma();
    const resend = getResend();
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ message: "Email is required" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { email: String(email) },
    });

    if (user) {
      const rawToken = crypto.randomBytes(32).toString("hex");
      const tokenHash = crypto
        .createHash("sha256")
        .update(rawToken)
        .digest("hex");
      const expiry = new Date(Date.now() + 30 * 60 * 1000);

      await prisma.user.update({
        where: { id: String(user.id) },
        data: { resetTokenHash: tokenHash, resetTokenExpiry: expiry },
      });

      const resetLink = `https://localhost:5173/reset-password?token=${rawToken}&email=${email}`;

      await resend.emails.send({
        from: "Librex <noreply@yourdomain.com>",
        to: user.email,
        subject: "Reset your Librex password",
        html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link expires in 30 minutes.</p>`,
      });
    }

    res.status(200).json({ message: "If that email exists, a reset link has been sent." });

  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ message: message });
  }
}

export async function resetPassword(req: Request, res: Response){
    try{
        const prisma = getPrisma();
        const {email, token, newPassword} = req.body;

        if(!email || !token || !newPassword){
            res.status(400).json({message: 'Invalid or expired reset link'});
            return;
        }

        const user = await prisma.user.findUnique({where: {email: email}});

        if(!user || !user.resetTokenHash || !user.resetTokenExpiry){
            res.status(400).json({message: 'Invalid or expired reset link'});
            return;
        }

        if(user.resetTokenExpiry < new Date()){
            res.status(400).json({message: 'Invalid or expired reset link'});
            return;
        }

        const incomingHash = crypto.createHash("sha256").update(token).digest("hex");

        if(incomingHash !== user.resetTokenHash){
            res.status(400).json({message: 'Invalid or expired reset link'});
            return;
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: {id: user.id},
            data: {
                password: hashedPassword,
                resetTokenExpiry: null,
                resetTokenHash: null,
            },
        });

        res.status(200).json({message: 'Password reset successfully'});
    }catch(err){
        const message = err instanceof Error? err.message : 'Unknown error while reseting password';
        res.status(500).json({message: message});
    }
}