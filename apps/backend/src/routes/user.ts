import { userPrivateProfile, forgotPassword, resetPassword } from "../controllers/user.js";
import { Router } from "express";
import AuthMiddleware from "../middleware/authMiddleware.js";

const router = Router();

router.get('/profile', AuthMiddleware, userPrivateProfile);
router.get('/forgot-password', AuthMiddleware, forgotPassword);
router.get('/reset-password', AuthMiddleware, resetPassword);

export default router;