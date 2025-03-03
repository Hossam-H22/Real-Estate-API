import { RequestHandler, Router } from "express";
import ProjectController from "./project.controller";
import * as validators from "./project.validation"
import { validation } from "../../middleware/validation.middleware";
import { auth } from "../../middleware/auth.middleware";

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
    auth(),
    validation(validators.create) as RequestHandler,
    ProjectController.createProject
);

router.put(
    "/:projectId", 
    auth(),
    validation(validators.update) as RequestHandler,
    ProjectController.updateProject
);

// router.delete("/:id", ProjectController.deleteProject);

export default router;