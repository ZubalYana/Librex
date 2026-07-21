import { userPrivateProfile, forgotPassword, resetPassword, editUserEmail, editUserName, confirmEmailEditing, uploadAvatar } from "../controllers/user.js";
import { Router } from "express";
import AuthMiddleware from "../middleware/authMiddleware.js";
import { upload } from "../utils/multer.js";

const router = Router();

router.get('/profile', AuthMiddleware, userPrivateProfile);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password', resetPassword);
router.post('/edit-email', AuthMiddleware, editUserEmail);
router.put('/confirm-newEmail', AuthMiddleware, confirmEmailEditing);
router.put('/edit-name', AuthMiddleware, editUserName);
router.put('/upload-avatar', AuthMiddleware, upload.single('avatar'), uploadAvatar);

export default router;