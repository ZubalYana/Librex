import multer from "multer";
import os from "os";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, os.tmpdir())
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    },
});

export const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 
    }
})