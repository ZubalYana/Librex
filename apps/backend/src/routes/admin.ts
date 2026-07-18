import { Router } from "express";
import { getAllUsers, deleteAllUsersBooks, deleteUser, deleteUsersBook, editUserRole } from "../controllers/admin.js";
import AuthMiddleware from "../middleware/authMiddleware.js";
const router = Router();

router.get('/users', AuthMiddleware, getAllUsers);
router.delete('/users/:userId', AuthMiddleware, deleteUser);
router.delete('/books/:bookId', AuthMiddleware, deleteUsersBook);
router.delete('/users/:userId/books', AuthMiddleware, deleteAllUsersBooks);
router.put('/users/:userId/role', AuthMiddleware, editUserRole);

export default router;