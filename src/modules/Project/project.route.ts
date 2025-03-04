import { RequestHandler, Router } from "express";
import ProjectController from "./project.controller";
import * as validators from "./project.validation"
import { validation } from "../../middleware/validation.middleware";
import { auth } from "../../middleware/auth.middleware";
import { endPointRoles } from "./project.roles";

const router = Router();

router.get(
    "/", 
    ProjectController.getAllProjects
);

router.get(
    "/:projectId", 
    validation(validators.get) as RequestHandler,
    ProjectController.getProjectById
);

router.post(
    "/", 
    auth(endPointRoles.create),
    validation(validators.create) as RequestHandler,
    ProjectController.createProject
);

router.put(
    "/:projectId", 
    auth(endPointRoles.update),
    validation(validators.update) as RequestHandler,
    ProjectController.updateProject
);

router.delete(
    "/:projectId", 
    auth(endPointRoles.delete),
    validation(validators.deleting) as RequestHandler,
    ProjectController.deleteProject
);


export default router;