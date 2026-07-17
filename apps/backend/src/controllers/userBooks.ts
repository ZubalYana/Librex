import type { Request, Response } from "express";
import { getPrisma } from "../utils/db.js";

export async function createBook(req: Request, res: Response){
    try{
        const prisma = getPrisma();
        const  { name, description, author, photoUrl, ownerId } = req.body;

        if(!name || !author || !ownerId){
            res.status(400).json({message: 'Lacking required credentials'});
            return;
        }

        const book = await prisma.book.create({data: {name, description, author, photoUrl, ownerId}});

        res.status(201).json({book})
    }catch(err){
        const message = err instanceof Error? err.message : 'Unknown error while creating your book';
        res.status(500).json({message: message})
    } 
}