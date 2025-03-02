import { Request, Response, NextFunction } from "express";
import ProjectService from "./project.service";
import { asyncHandler } from "../../utils/errorHandling";

const projectService = new ProjectService();
class ProjectController {

    static getAllProjects = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const projects = await projectService.getAll(req.query);
        res.status(200).json(projects);
    });

    static getProjectById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const project = await projectService.getById(req.params.projectId, req.query);
        res.status(200).json(project);
    });

    static createProject = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const project = await projectService.create(req.headers?.userId as string, req.body);
        res.status(201).json(project);
    });

    static updateProject = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const updatedProject = await projectService.update(
            req.headers?.userId as string, 
            req.headers?.userRole as string, 
            req.params.projectId, 
            req.body
        );
        res.status(200).json(updatedProject);
    });

    // static deleteProject = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    //     await projectService.delete(req.params.id);
    //     res.status(204).send();
    // });
}

export default ProjectController;