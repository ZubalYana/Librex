import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth.js';
import userBooksRouter from './routes/userBooks.js';
import adminRouter from './routes/admin.js';

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;
app.use(cors());
app.use(express.json())
app.use('/auth', authRouter);
app.use('/userBooks', userBooksRouter);
app.use('/admin', adminRouter)

app.listen(PORT, ()=>{
    console.log(`Librex backend running on PORT: ${PORT}`)
})