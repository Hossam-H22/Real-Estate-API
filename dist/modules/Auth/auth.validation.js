"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signup = void 0;
const zod_1 = require("zod");
const validation_middleware_1 = require("../../middleware/validation.middleware");
exports.signup = zod_1.z.object({
    name: validation_middleware_1.generalFields.userName,
    email: validation_middleware_1.generalFields.email,
    password: validation_middleware_1.generalFields.password,
    cPassword: validation_middleware_1.generalFields.cPassword,
    phone: validation_middleware_1.generalFields.phone,
    role: validation_middleware_1.generalFields.role.optional(),
}).strict().refine(data => data.password === data.cPassword, {
    message: "cPassword isn't match with password",
    path: ["cPassword"] // This ensures the error appears under cPassword field
});
exports.login = zod_1.z.object({
    email: validation_middleware_1.generalFields.email,
    password: validation_middleware_1.generalFields.password,
}).strict();
// export const emailConfirmation = z.object({
// });
// export const forgetPassword = z.object({
// });
// export const resetPassword = z.object({
// });
