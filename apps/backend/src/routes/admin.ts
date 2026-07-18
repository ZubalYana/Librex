import { Router } from "express";
import { getAllUsers } from "../controllers/admin.js";
import AuthMiddleware from "../middleware/authMiddleware.js";
const router = Router();

router.get('/users', AuthMiddleware, getAllUsers);

export default router;