import { createBook, getUsersBooks, editUsersBook, deleteUsersBook } from "../controllers/userBooks.js";
import { Router } from "express";
import AuthMiddleware from "../middleware/authMiddleware.js";
import { upload } from "../utils/multer.js";
const router = Router();

router.post('/', AuthMiddleware, upload.single("photo"), createBook);
router.get('/mine', AuthMiddleware, getUsersBooks);
router.patch('/:bookId', AuthMiddleware, upload.single('photo'), editUsersBook);
router.delete('/:bookId', AuthMiddleware, deleteUsersBook);

export default router;