import { RequestHandler, Router } from "express";
import * as validators from "./auth.validation"
import { validation } from "../../middleware/validation.middleware";
import AuthController from "./auth.controller";

const router = Router();


router.post(
    "/signup",
    //fileUpload(fileValidation.image).single('image'),
    validation(validators.signup) as RequestHandler,
    AuthController.signup
);

router.post(
    "/login",
    validation(validators.login) as RequestHandler,
    AuthController.login
);

// router.get(
//     "/confirmEmail/:token",
//     validation(validators.emailConfirmation) as RequestHandler,
//     AuthController.confirmEmail
// );

// router.get(
//     "/newConfirmEmail/:token",
//     validation(validators.emailConfirmation) as RequestHandler,
//     AuthController.newConfirmEmail
// );

// router.patch(
//     "/forgetPassword",
//     validation(validators.forgetPassword) as RequestHandler,
//     AuthController.forgetPassword
// );

// router.patch(
//     "/resetPassword",
//     validation(validators.resetPassword) as RequestHandler,
//     AuthController.resetPassword
// );


export default router;
