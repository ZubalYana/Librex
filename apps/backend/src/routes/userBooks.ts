import { createBook, getUsersBooks, editUsersBook, deleteUsersBook } from "../controllers/userBooks.js";
import { Router } from "express";
import AuthMiddleware from "../middleware/authMiddleware.js";
const router = Router();

router.post('/', AuthMiddleware, createBook);
router.get('/mine', AuthMiddleware, getUsersBooks);
router.patch('/:bookId', AuthMiddleware, editUsersBook);
router.delete('/:bookId', AuthMiddleware, deleteUsersBook);

export default router;