import { z } from "zod";
import { generalFields } from "../../middleware/validation.middleware";


export const signup = z.object({
    name: generalFields.userName,
    email: generalFields.email,
    password: generalFields.password,
    cPassword: generalFields.cPassword,
    phone: generalFields.phone,
    role: generalFields.role.optional(),
}).strict().refine(data => data.password === data.cPassword, {
    message: "cPassword isn't match with password",
    path: ["cPassword"] // This ensures the error appears under cPassword field
});


export const login = z.object({
    email: generalFields.email,
    password: generalFields.password,
}).strict();

// export const emailConfirmation = z.object({

// });

// export const forgetPassword = z.object({

// });

// export const resetPassword = z.object({

// });
