"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const data_source_1 = __importDefault(require("../../database/data-source"));
const project_entity_1 = require("./project.entity");
const area_entity_1 = require("../Area/area.entity");
const user_entity_1 = require("../User/user.entity");
const apiFeatures_1 = __importDefault(require("../../utils/apiFeatures"));
const errorHandling_1 = require("../../utils/errorHandling");
class ProjectService {
    projectRepository;
    areaRepository;
    userRepository;
    constructor() {
        this.projectRepository = data_source_1.default.getRepository(project_entity_1.Project);
        this.areaRepository = data_source_1.default.getRepository(area_entity_1.Area);
        this.userRepository = data_source_1.default.getRepository(user_entity_1.User);
    }
    async getAll(query) {
        let queryBuilder = this.projectRepository.createQueryBuilder('project');
        const rowsCount = await queryBuilder.getCount();
        const apiFeatures = new apiFeatures_1.default(queryBuilder, 'project', query)
            .select()
            .filter()
            .sort()
            .paginate()
            .search();
        const metadata = {
            totalNumberOfData: rowsCount,
            limit: apiFeatures.size,
            numberOfPages: Math.floor(rowsCount / apiFeatures.size) || 1,
            currentPage: apiFeatures.page,
        };
        const restPages = Math.floor(rowsCount / apiFeatures.size) - apiFeatures.page;
        if (restPages > 0)
            metadata.nextPage = apiFeatures.page + 1;
        const projects = await apiFeatures['queryBuilder'].getMany();
        return { message: "Done", metadata, projects };
    }
    async getById(projectId, query) {
        query["_id"] = { "eq": projectId };
        let queryBuilder = this.projectRepository.createQueryBuilder('project');
        const apiFeatures = new apiFeatures_1.default(queryBuilder, 'project', query)
            .select()
            .filter();
        const project = await apiFeatures['queryBuilder'].getOne();
        return { message: "Done", project };
    }
    async create(userId, data) {
        const checkProject = await this.projectRepository.findOneBy({ name: data.name });
        if (checkProject && checkProject.name == data.name) {
            throw new errorHandling_1.CustomError("Duplicated project name", 409);
        }
        if (userId) {
            const user = await this.userRepository.findOneBy({ _id: userId });
            data.createdBy = user;
        }
        const areaId = String(data.areaId);
        const area = await this.areaRepository.findOneBy({ _id: areaId });
        if (!area) {
            throw new errorHandling_1.CustomError("In-valid area id", 400);
        }
        data.areaId = area;
        const project = this.projectRepository.create(data);
        const newProject = await this.projectRepository.save(project);
        return { message: "Done", project: newProject };
    }
    async update(userId, userRole, projectId, data) {
        const project = await this.projectRepository.findOneBy({ _id: projectId });
        if (!project) {
            throw new errorHandling_1.CustomError("In-valid project id", 400);
        }
        if (data.name) {
            if (project.name == data.name) {
                throw new errorHandling_1.CustomError("Sorry cannot update project with the same name", 400);
            }
            const checkProject = await this.projectRepository.findOneBy({ name: data.name });
            if (checkProject && checkProject.name == data.name) {
                throw new errorHandling_1.CustomError("Duplicated project name", 409);
            }
        }
        if (data.description) {
            if (project.description == data.description) {
                throw new errorHandling_1.CustomError("Sorry cannot update project with the same description", 400);
            }
        }
        const areaId = String(data.areaId);
        if (areaId) {
            // if(area?.areaId?._id == areaId){
            //     throw new CustomError("Sorry cannot update area with the same area", 400);
            // }
            const area = await this.areaRepository.findOneBy({ _id: areaId });
            if (!area) {
                throw new errorHandling_1.CustomError("In-valid area id", 400);
            }
            data.areaId = area;
        }
        const updateResult = await this.projectRepository.update(projectId, data);
        const updatedProject = await this.projectRepository.findOneBy({ _id: projectId });
        return { message: "Done", project: updatedProject };
    }
}
exports.default = ProjectService;
