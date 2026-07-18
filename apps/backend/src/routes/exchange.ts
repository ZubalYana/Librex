import { Router } from "express";
const router = Router();
import { requestExchange } from "../controllers/exchange.js";
import AuthMiddleware from "../middleware/authMiddleware.js";

router.post("/:bookId/request-exchange", AuthMiddleware, requestExchange);

export default router;