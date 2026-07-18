import type { Request, Response } from "express";
import { getPrisma } from "../utils/db.js";

export async function userPrivateProfile(req: Request, res: Response){
    try{
        const prisma = getPrisma();
        const userId = req.user?.userId;

        const user = await prisma.user.findUnique({where: {id: String(userId)}});

        if(!user){
            res.status(404).json({message: 'User not found'});
            return;
        }

        const {password: _, ...userWithoutPassword} = user;
        res.status(200).json({userWithoutPassword});
    }catch(err){
        const message = err instanceof Error? err.message : 'Unknown error while fetching user';
        res.status(500).json({message: message});
    }
}

