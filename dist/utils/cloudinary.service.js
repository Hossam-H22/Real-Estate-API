"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudinaryService = void 0;
const cloudinary_1 = require("cloudinary");
const multer_1 = __importDefault(require("multer"));
class CloudinaryService {
    constructor() {
        cloudinary_1.v2.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.CLOUD_API_KEY,
            api_secret: process.env.CLOUD_API_SECRET,
            secure: true
        });
    }
    async uploadImage(filePath, folderName) {
        return new Promise((resolve, reject) => {
            cloudinary_1.v2.uploader.upload(filePath, { folder: `${process.env.APP_NAME}/${folderName}` }, (error, result) => {
                if (error)
                    return reject(error);
                resolve(result);
            });
        });
    }
    async destroyImage(public_id) {
        await cloudinary_1.v2.uploader.destroy(public_id);
    }
    static fileType = {
        image: ['image/gif', 'image/png', 'image/jpg', 'image/jpeg'],
        file: ['application/pdf', 'application/msword'],
    };
    static fileUpload(customType = []) {
        const storage = multer_1.default.diskStorage({});
        function fileFilter(req, file, cb) {
            if (customType.includes(file.mimetype)) {
                const filename = `${Date.now()}-${file.originalname}`;
                file.destination = `uploads/${filename}`;
                cb(null, true);
            }
            else {
                cb(Error('In-valid file format'));
            }
        }
        const upload = (0, multer_1.default)({ dest: 'uploads', fileFilter, storage });
        return upload;
    }
}
exports.CloudinaryService = CloudinaryService;
