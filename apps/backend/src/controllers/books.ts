import type { Request, Response } from "express";
import { getPrisma } from "../utils/db.js";

export async function getAllBooks(req: Request, res: Response){
    try{
        const prisma = getPrisma();
        const search = req.query.search as string | undefined;
        const order = req.query.order === 'desc' ? 'desc' : 'asc';
         const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { author: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};
        const page = Number(req.query.page) || 1;
        const booksLimit = Number(req.query.booksLimit) || 10;

        const skip = ( page - 1 ) * booksLimit;
    
        const [books, totalCount] = await Promise.all([ 
            prisma.book.findMany({where, orderBy: {name: order}, skip, take: booksLimit}),
            prisma.book.count({where})
            ])

        res.status(200).json({
            books,
            pagination: {
                page,
                booksLimit, 
                totalCount,
                totalPages: Math.ceil(totalCount/booksLimit),
            },
        });
    }catch(err){
        const message = err instanceof Error? err.message : 'Unknown error while fetching books';
        res.status(500).json({message: message});
    }
}

export async function getBookDetails(req: Request, res: Response){
    try{
        const prisma = getPrisma();
        const bookId = req.params.bookId;
        
        const book = await prisma.book.findUnique({where: {id: String(bookId)}, include: {owner: true}});

        if(!book){
            res.status(404).json({message: 'Book not found'});
            return;
        }

        res.status(200).json(book);
    }catch(err){
        const message = err instanceof Error? err.message : 'Unknown error while getting book details';
        res.status(500).json({message: message});
    }
}