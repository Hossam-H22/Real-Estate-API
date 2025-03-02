"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validation = exports.generalFields = void 0;
const zod_1 = require("zod");
const user_entity_1 = require("../modules/User/user.entity");
exports.generalFields = {
    id: zod_1.z.string().uuid(),
    userName: zod_1.z.string().min(2).max(20).regex(/^\w+$/, "Only alphanumeric characters allowed").describe("UserName is required"),
    email: zod_1.z.string().email().refine((email) => {
        const domainParts = email.split("@")[1]?.split(".") || [];
        return domainParts.length >= 2 && domainParts.length <= 4;
    }, {
        message: "Invalid email domain format",
    }),
    password: zod_1.z.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, {
        message: "Password must contain at least one uppercase, one lowercase, one number, and be at least 8 characters long.",
    }),
    cPassword: zod_1.z.string(),
    phone: zod_1.z.string().regex(/^(002|\+2)?01[0125][0-9]{8}$/, {
        message: "Invalid Egyptian phone number format",
    }),
    gender: zod_1.z.enum(["male", "female"]).describe("Please choose male or female"),
    role: zod_1.z.enum([user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.AGENT, user_entity_1.UserRole.BUYER]),
    token: zod_1.z.string(),
    file: zod_1.z.object({
        size: zod_1.z.number().positive(),
        path: zod_1.z.string(),
        filename: zod_1.z.string(),
        destination: zod_1.z.string(),
        mimetype: zod_1.z.string(),
        encoding: zod_1.z.string(),
        originalname: zod_1.z.string(),
        fieldname: zod_1.z.string(),
        dest: zod_1.z.string().optional(),
    }),
};
const validation = (schema, considerHeaders = false) => {
    return (req, res, next) => {
        let inputs = { ...req.body, ...req.query, ...req.params };
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
exports.validation = validation;
