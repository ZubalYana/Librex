import type { Request, Response } from "express";
import { getPrisma } from "../utils/db.js";
import { getCloudinary } from "../utils/cloudinary.js";
import fs from "fs"

export async function createBook(req: Request, res: Response) {
  try {
    const prisma = getPrisma();
    const cloudinary = getCloudinary();
    const { name, description, author, photoUrl: providedPhotoUrl } = req.body;
    const ownerId = req.user?.userId;

    if (!name || !author || !ownerId) {
      res.status(400).json({ message: 'Lacking required credentials' });
      return;
    }

    let photoUrl: string | null = providedPhotoUrl ?? null;

    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, { folder: 'librex-bookPhotos' });
      fs.unlinkSync(req.file.path);
      photoUrl = uploadResult.secure_url;
    }

    const book = await prisma.book.create({
      data: { name, description, author, photoUrl, ownerId },
    });

    res.status(201).json({ book });
  } catch (err) {
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    console.log(err)
    const message = err instanceof Error ? err.message : 'Unknown error while creating your book';
    res.status(500).json({ message: message });
  }
}

export async function getUsersBooks(req: Request, res: Response){
    try{
        const prisma = getPrisma();
        const userId = req.user?.userId;
        if(!userId){
            res.status(400).json({message: 'Lacking user id to perform'});
            return
        }

        const user = await prisma.user.findUnique({ where: {id: String(userId)}, include: {books: true}});

        if(!user){
            res.status(404).json({message: 'User not found'});
            return;
        }

        const usersBooks = user.books;
        res.status(200).json({usersBooks});
    }catch(err){
        const message = err instanceof Error? err.message : 'Unknown error occured while fetching your books';
        res.status(500).json({message: message})
    }
}

export async function editUsersBook(req: Request, res: Response){
    try{
        const prisma = getPrisma();
        const { name, description, photoUrl, author } = req.body;
        const ownerId = req.user?.userId;
        const bookId = req.params.bookId;

        const book = await prisma.book.findUnique({where: {id: String(bookId)}});

        if(!book){
            res.status(404).json({message: 'Book not found'});
            return;
        }

        if(book.ownerId != ownerId){
            res.status(403).json({message: 'Not your book'});
            return;
        }

        const updatedBook = await prisma.book.update({where: {id: String(bookId)}, data: {name, description, photoUrl, author}});

        res.status(200).json({updatedBook});
    }catch(err){
        const message = err instanceof Error? err.message : 'Unknown error while editing your book';
        res.status(500).json({message: message});
    }
}

export async function deleteUsersBook(req: Request, res: Response){
    try{
        const prisma = getPrisma();
        const bookId = req.params.bookId;
        const ownerId = req.user?.userId;
        const book = await prisma.book.findUnique({where: {id: String(bookId)}});
        if(!book){
            res.status(404).json({message: 'Book not found'});
            return;
        }

        if(book.ownerId != ownerId){
            res.status(403).json({message: 'Not your book'});
            return;
        }

        await prisma.book.delete({where: {id: String(bookId)}})

        res.status(200).json({message: 'Deleted successfully'});
    }catch(err){
        const message = err instanceof Error? err.message : 'Unknown error while deleting your book';
        res.status(500).json({message: message});
        console.log(err)
    }
}