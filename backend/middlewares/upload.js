import multer from "multer";

// Memory storage so files go straight to Cloudinary
const storage = multer.memoryStorage();

const upload = multer({ storage });

export default upload;
