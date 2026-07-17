import type { Request, Response } from "express";
import { getPrisma } from "../utils/db.js";

export async function getAllBooks(res: Response){
    try{
        const prisma = getPrisma();
        const books = await prisma.book.findMany();
        if(!books){
            res.status(404).json({message: 'Books not found'});
            return;
        }
        res.status(200).json({books});
    }catch(err){
        const message = err instanceof Error? err.message : 'Unknown error while fetching books';
        return res.status(500).json({message: message});
    }
}