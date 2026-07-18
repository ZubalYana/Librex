import { Router } from "express";
import { getAllUsers, deleteAllUsersBooks, deleteUser, deleteUsersBook } from "../controllers/admin.js";
import AuthMiddleware from "../middleware/authMiddleware.js";
const router = Router();

router.get('/users', AuthMiddleware, getAllUsers);
router.delete('/:userId', AuthMiddleware, deleteUser);
router.delete('/:bookId', AuthMiddleware, deleteUsersBook);
router.delete('/:userId', AuthMiddleware, deleteAllUsersBooks);

export default router;