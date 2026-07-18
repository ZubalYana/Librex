import { userPrivateProfile } from "../controllers/user.js";
import { Router } from "express";
import AuthMiddleware from "../middleware/authMiddleware.js";

const router = Router();

router.get('/profile', AuthMiddleware, userPrivateProfile);

export default router;