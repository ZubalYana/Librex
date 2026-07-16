import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export default function AuthMiddleware(req: Request, res: Response, next: NextFunction){
    const token = req.headers.authorization?.split(" ")[1];

    if(!token){
        res.status(401).json({message: 'No token provided'});
        return;
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
            userId: string,
            role: string
        }

        req.user = decoded;
        next();
    }catch(err){
        const message = err instanceof Error? err.message : 'Unknown error'
        return res.status(401).json({message: 'Invalid or expired token', err: message});
    }
}