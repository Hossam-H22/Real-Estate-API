"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const project_service_1 = __importDefault(require("./project.service"));
const errorHandling_1 = require("../../utils/errorHandling");
const projectService = new project_service_1.default();
class ProjectController {
    static getAllProjects = (0, errorHandling_1.asyncHandler)(async (req, res, next) => {
        const projects = await projectService.getAll(req.query);
        res.status(200).json(projects);
    });
    static getProjectById = (0, errorHandling_1.asyncHandler)(async (req, res, next) => {
        const project = await projectService.getById(req.params.projectId, req.query);
        res.status(200).json(project);
    });
    static createProject = (0, errorHandling_1.asyncHandler)(async (req, res, next) => {
        const project = await projectService.create(req.headers?.userId, req.body);
        res.status(201).json(project);
    });
    static updateProject = (0, errorHandling_1.asyncHandler)(async (req, res, next) => {
        const updatedProject = await projectService.update(req.headers?.userId, req.headers?.userRole, req.params.projectId, req.body);
        res.status(200).json(updatedProject);
    });
}
exports.default = ProjectController;
