import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import type { Request, Response } from 'express';
import { getPrisma } from '../utils/db.js';


export async function Register (req: Request, res: Response){
    const prisma = getPrisma()
    const { name, email, password, role } = req.body;
    if(!name || !email || !password){
        res.status(400).json({message: 'Missing required credentials'});
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: {name: name, email: email, password: hashedPassword, role: role? role: 'USER'}
    });

    if(!user){
        res.status(500).json({message: 'Server failed to create user'});
        return;
    }

    const token = jwt.sign( 'token', user.id );

    return res.status(201).json({user: user, token: token})
}

export async function Login(req: Request, res: Response){
    const prisma = getPrisma()
    const {email, password} = req.body;
    if(!email || !password){
        res.status(400).json({message: 'Missing required credentials'});
        return;
    }

    const user = await prisma.user.findUnique({where: {email: email}});

    if(!user){
        res.status(404).json({message: 'User not found'});
        return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if(!passwordMatch){
        res.status(401).json({message: 'Incorrect password'});
        return;
    }

    const token = jwt.sign('token', user.id);

    res.status(200).json({token: token, user: user})
}