import { getAllBooks, getBookDetails } from "../controllers/books.js";
import { Router } from "express";
// import AuthMiddleware from "../middleware/authMiddleware.js";
const router = Router();

//auth middleware not added intentionally: the idea of previewing books before authorization
router.get('/books', getAllBooks);
router.get('/:bookId', getBookDetails);

export default router;