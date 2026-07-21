import type { Request, Response } from "express";
import { getPrisma } from "../utils/db.js";
import { getResend } from "../utils/resend.js";
import crypto from "crypto";
import bcrypt from 'bcrypt';
import fs from "fs";
import { getCloudinary } from "../utils/cloudinary.js";

export async function userPrivateProfile(req: Request, res: Response) {
  try {
    const prisma = getPrisma();
    const userId = req.user?.userId;

    const user = await prisma.user.findUnique({
      where: { id: String(userId) }, 
      include: { books: true, sentRequests: { include: {requestedBook: true}} }
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

      const resetLink = `http://localhost:5173/reset-password?token=${rawToken}&email=${email}`;

      await resend.emails.send({
        from: "Librex <noreply@librex.pictureboooks.homes>",
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

export async function editUserName(req: Request, res: Response){
    try{
        const prisma = getPrisma();
        const {newUserName} = req.body;

        if(newUserName.trim() === ""){
            res.status(400).json({message: 'Name cannot be an emtpy string'});
            return;
        }

        const user = await prisma.user.update({where: {id: String(req.user?.userId)}, data: { name: newUserName.trim() }});

        res.status(200).json({message: 'Name updated successfully', user: user});
    }catch(err){
        const message = err instanceof Error? err.message : 'Unknown error';
        res.status(500).json({message: message});
    }
}

export async function editUserEmail(req: Request, res: Response){
    try{
        const {newEmail, currentPassword} = req.body;
        const prisma = getPrisma();
        const resend = getResend();

        const user = await prisma.user.findUnique({where: {id: String(req.user?.userId)}});

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        const isPasswordValid = await bcrypt.compare(currentPassword, String(user?.password))
        if(!isPasswordValid){
            res.status(400).json({message: 'Incorrect password'});
            return;
        }

        const emailExists = await prisma.user.findUnique({where: {email: String(newEmail)}});
        if(!emailExists){
        const rawToken = crypto.randomBytes(32).toString("hex");
        const tokenHash = crypto
        .createHash('sha256')
        .update(rawToken)
        .digest("hex")

        const expiry = new Date (Date.now() + 30 * 60 * 1000);

        await prisma.user.update({where: {id: String(req.user?.userId)}, data: {pendingEmail: newEmail, emailChangeTokenHash: tokenHash, emailChangeExpiry: expiry}});

        const emailConfirmationLink = `http://localhost:5173/change-email?token=${rawToken}&newEmail=${newEmail}`;

        await resend.emails.send({
            from: 'Librex <noreply@librex.pictureboooks.homes>',
            to: newEmail,
            subject: 'Email change request',
            html: `In order to change your Librex account email follow the link: \n ${emailConfirmationLink}. \n \n If that wasn\'t you, ignore the email.`
        });
        }

        res.status(200).json({message: 'A confirmation link has been sent to your new email if it exists.'})
    }catch(err){
        const message = err instanceof Error? err.message : 'Unknown error while editing email'
        res.status(500).json({message: message});
    }
}

export async function confirmEmailEditing(req: Request, res: Response){
    try{
        const prisma = getPrisma();
        const { token } = req.body;

        if(!token){
            res.status(400).json({message: 'Invalid or expired confirmation link'});
            return;
        }
        
        const upcomingHash = crypto.createHash('sha256').update(token).digest("hex");


        const user = await prisma.user.findFirst({
            where: { emailChangeTokenHash: upcomingHash, emailChangeExpiry: { gt: new Date() } },
        });

        if(!user || !user.emailChangeTokenHash || !user.emailChangeExpiry){
            res.status(400).json({message: 'Invalid or expired confirmation link'});
            return;
        }

        if(user.emailChangeExpiry < new Date()){
            res.status(400).json({message: 'Invalid or expired confirmation link'});
            return;
        }


        if(upcomingHash !== user.emailChangeTokenHash){
            res.status(400).json({message: 'Invalid or expired confirmation link'});
            return;
        }

        await prisma.user.update({
            where: {id: user.id},
            data: { 
                email: String(user.pendingEmail),
                emailChangeExpiry: null,
                emailChangeTokenHash: null
            }
        })

        res.status(200).json({message: 'Email was updated successfully'});
        
    }catch(err){
        const message = err instanceof Error? err.message : 'Unknow error';
        res.status(500).json({message: message});
    }
}

export async function uploadAvatar(req: Request, res: Response) {
  try {
    const prisma = getPrisma();
    const cloudinary = getCloudinary();

    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    const uploadResponse = await cloudinary.uploader.upload(req.file.path, { folder: 'librex-avatars' });

    fs.unlinkSync(req.file.path);

    await prisma.user.update({
      where: { id: String(req.user?.userId) },
      data: { avatar: uploadResponse.secure_url },
    });

    res.status(200).json({ message: 'Avatar updated successfully', avatar: uploadResponse.secure_url });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error while uploading avatar';
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: message });
  }
}