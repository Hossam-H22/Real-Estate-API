import { RequestHandler, Router } from "express";
import UserController from "./user.controller";
import * as validators from "./user.validation"
import { validation } from "../../middleware/validation.middleware";
import { auth } from "../../middleware/auth.middleware";
import { UserRole } from "./user.entity";
import { endPointRoles } from "./user.roles";

const router = Router();

router.get(
    "/all", 
    auth(endPointRoles.getAll), 
    UserController.getAllUsers
);

router.get(
    "/", 
    auth(endPointRoles.get), 
    UserController.getUserDetails
);

router.put(
    "/", 
    auth(endPointRoles.update), 
    validation(validators.update) as RequestHandler,
    UserController.updateUser
);

export default router;
