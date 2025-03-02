import { UploadApiErrorResponse, UploadApiResponse, v2 } from "cloudinary";
import { Request } from "express";
import multer from "multer";



export class CloudinaryService {
    constructor() {
        v2.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.CLOUD_API_KEY,
            api_secret: process.env.CLOUD_API_SECRET,
            secure: true
        })
    }

    async uploadImage(
        filePath: string,
        folderName: string,
    ): Promise<UploadApiResponse | UploadApiErrorResponse> {
        return new Promise((resolve, reject) => {
            v2.uploader.upload(
                filePath,
                { folder: `${process.env.APP_NAME}/${folderName}` },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result!);
                }
            );
        });
    }

    async destroyImage(public_id: string){
        await v2.uploader.destroy(public_id);
    }

    static fileType: any = {
        image: ['image/gif', 'image/png', 'image/jpg', 'image/jpeg'],
        file: ['application/pdf', 'application/msword'],
    }

    static fileUpload(customType: string[] = []) {
        const storage = multer.diskStorage({});
        function fileFilter(req:Request, file: Express.Multer.File, cb: multer.FileFilterCallback) {
            if (customType.includes(file.mimetype)) {
                const filename = `${Date.now()}-${file.originalname}`;
                file.destination = `uploads/${filename}`;
                cb(null, true);
            } else {
                cb(Error('In-valid file format'));
            }
        }
        const upload = multer({ dest: 'uploads', fileFilter, storage });
        return upload;
    }
}