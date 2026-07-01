import multer from "multer"
import path from "path"

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(process.cwd(), "/public/temp"))
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const FILE_SIZE_LIMIT = 2 * 1024 * 1024 // 2 MB

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true)
    else cb(new Error("Only image files are allowed"), false)
}

export const upload = multer({
    storage,
    limits: { fileSize: FILE_SIZE_LIMIT },
    fileFilter,
})