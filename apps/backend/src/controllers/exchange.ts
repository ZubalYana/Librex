import type { Request, Response } from "express";
import { getPrisma } from "../utils/db.js";

export async function quireExchange(req: Request, res: Response){
    try{
        const prisma = getPrisma();
        const userId = req.user?.userId;
        const bookId = req.params.bookId;

        const bookForExchange = await prisma.book.findUnique({where: {id: String(bookId)}});

        if(!bookForExchange){
            res.status(404).json({message: 'Book for exchange not found'});
            return;
        }

        
    }catch(err){
        const message = err instanceof Error? err.message : 'Unknown error while quiring exchange';
        res.status(500).json({message: message});
    }
}