
import { Request, Response, NextFunction } from "express";
import { z, ZodSchema } from "zod";
import { UserRole } from "../modules/User/user.entity";

export const generalFields = {
    id: z.string().uuid(),
    userName: z.string().min(2).max(20).regex(/^\w+$/, "Only alphanumeric characters allowed").describe("UserName is required"),
    email: z.string().email().refine((email) => {
        const domainParts = email.split("@")[1]?.split(".") || [];
        return domainParts.length >= 2 && domainParts.length <= 4;
    }, {
        message: "Invalid email domain format",
    }),
    password: z.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, {
        message: "Password must contain at least one uppercase, one lowercase, one number, and be at least 8 characters long.",
    }),
    cPassword: z.string(),
    phone: z.string().regex(/^(002|\+2)?01[0125][0-9]{8}$/, {
        message: "Invalid Egyptian phone number format",
    }),
    gender: z.enum(["male", "female"]).describe("Please choose male or female"),
    role: z.enum([UserRole.ADMIN, UserRole.AGENT, UserRole.BUYER]),
    token: z.string(),
    file: z.object({
        size: z.number().positive(),
        path: z.string(),
        filename: z.string(),
        destination: z.string(),
        mimetype: z.string(),
        encoding: z.string(),
        originalname: z.string(),
        fieldname: z.string(),
        dest: z.string().optional(),
    }),
};


interface CustomRequest extends Request {
    file?: Express.Multer.File;
    files?: Express.Multer.File[];
}


export const validation = (schema: ZodSchema, considerHeaders: boolean = false) => {
    return (req: CustomRequest, res: Response, next: NextFunction) => {
        let inputs: Record<string, any> = { ...req.body, ...req.query, ...req.params };

        if (req.file || req.files) {
            inputs.file = req.file || req.files;
        }

        if (considerHeaders && req.headers?.authorization) {
            inputs = { authorization: req.headers.authorization };
        }

        const result = schema.safeParse(inputs);
        if (!result.success) {
            res.status(400).json({ message: "Validation Error", errors: result.error.format() });
        }
        else {
            next();
        }
    };
};


