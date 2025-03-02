import { RequestHandler, Router } from "express";
import UserController from "./user.controller";
import * as validators from "./user.validation"
import { validation } from "../../middleware/validation.middleware";
import { auth } from "../../middleware/auth.middleware";
import { UserRole } from "./user.entity";

const router = Router();

router.get(
    "/all", 
    auth(), 
    UserController.getAllUsers
);

router.get(
    "/", 
    auth(), 
    UserController.getUserDetails
);

router.put(
    "/", 
    auth(), 
    validation(validators.update) as RequestHandler,
    UserController.updateUser
);

export default router;
