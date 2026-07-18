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

export async function deleteUser(req: Request, res: Response){
    try{
        const prisma = getPrisma();

        if(req.user?.role !== 'ADMIN'){
            res.status(403).json({message: 'Forbidden access'});
            return;
        }

        const userId = req.params.userId;

        const user = await prisma.user.findUnique({where: { id: String(userId)}});

        if(!user){
            res.status(404).json({message: 'User to be deleted not found'});
            return;
        }

        await prisma.user.delete({where: { id: String(userId)}});
        res.status(200).json({message: 'User deleted successfully'});
    }catch(err){
        const message = err instanceof Error? err.message : 'Unknown error while trying to delete user';
        res.status(500).json({message: message});
    }
}

export async function deleteUsersBook(req: Request, res: Response){
    try{
        const prisma = getPrisma();
        if(req.user?.role !== 'ADMIN'){
            res.status(403).json({message: 'Forbidden access'});
            return;
        }

        const bookId = req.params.bookId;

        const book = await prisma.book.findUnique({where: {id: String(bookId)}});
        if(!book){
            res.status(404).json({message: 'Book to be deleted not found'});
            return;
        }

        await prisma.book.delete({where: {id: String(bookId)}});

        res.status(200).json({message: 'Book deleted successfully'});
    }catch(err){
        const message = err instanceof Error? err.message : 'Unknown error while deleting user\'s book';
        res.status(500).json({message: message});
    }
}

export async function deleteAllUsersBooks(req: Request, res: Response){
    try{
        const prisma = getPrisma();

        if(req.user?.role !== 'ADMIN'){
            res.status(403).json({message: 'Forbidden access'});
            return;
        }

        const userId = req.params.userId;

        const usersBooks = await prisma.book.findMany({where: {ownerId: String(userId)}});

        if(usersBooks.length === 0){
            res.status(404).json({message: 'User\'s books not found'});
            return;
        }

        await prisma.book.deleteMany({where: {ownerId: String(userId)}});

        res.status(200).json({message: 'User\'s books have been deleted successfully'});
    }catch(err){
        const message = err instanceof Error? err.message : 'Unknown error while trying to delete user\'s books';
        res.status(500).json({message: message});
    }
}