import AppDataSource from "../../database/data-source";
import { Repository } from "typeorm";
import { Project } from "./project.entity";
import { Area } from "../Area/area.entity";
import { User } from "../User/user.entity";
import ApiFeatures from "../../utils/apiFeatures";
import { CustomError } from "../../utils/errorHandling";

class ProjectService {
    private projectRepository: Repository<Project>;
    private areaRepository: Repository<Area>;
    private userRepository: Repository<User>;

    constructor() {
        this.projectRepository = AppDataSource.getRepository(Project);
        this.areaRepository = AppDataSource.getRepository(Area);
        this.userRepository = AppDataSource.getRepository(User);
    }

    async getAll(query: any) {
        let queryBuilder = this.projectRepository.createQueryBuilder('project');
        const rowsCount = await queryBuilder.getCount();
        const apiFeatures = new ApiFeatures(queryBuilder, 'project', query)
            .select()
            .filter()
            .sort()
            .paginate()
            .search();

        const metadata: any = {
            totalNumberOfData: rowsCount,
            limit: apiFeatures.size,
            numberOfPages: Math.floor(rowsCount / apiFeatures.size) || 1,
            currentPage: apiFeatures.page,
        }
        const restPages = Math.floor(rowsCount / apiFeatures.size) - apiFeatures.page;
        if (restPages > 0) metadata.nextPage = apiFeatures.page + 1;
        
        const projects = await apiFeatures['queryBuilder'].getMany();
        return { message: "Done", metadata, projects };
    }

    async getById(projectId: string, query: any) {
        query["_id"] = { "eq": projectId };
        let queryBuilder = this.projectRepository.createQueryBuilder('project');
        const apiFeatures = new ApiFeatures(queryBuilder, 'project', query)
            .select()
            .filter()
        const project = await apiFeatures['queryBuilder'].getOne();
        return { message: "Done", project };
    }

    async create(userId: string, data: Partial<Project>) {
        const checkProject = await this.projectRepository.findOneBy({ name: data.name });
        if (checkProject && checkProject.name == data.name) {
            throw new CustomError("Duplicated project name", 409);
        }
        if(userId){
            const user = await this.userRepository.findOneBy({ _id: userId });
            data.createdBy = user as User;
        }
        const areaId: string = String(data.areaId);
        const area = await this.areaRepository.findOneBy({ _id: areaId });
        if (!area) {
            throw new CustomError("In-valid area id", 400);
        }
        data.areaId = area;

        const project = this.projectRepository.create(data);
        const newProject = await this.projectRepository.save(project);
        return { message: "Done", project: newProject };
    }

    async update(userId: string, userRole: string, projectId: string, data: Partial<Project>) {
        const project = await this.projectRepository.findOneBy({ _id: projectId });
        if (!project) {
            throw new CustomError("In-valid project id", 400);
        }

        if (data.name) {
            if (project.name == data.name) {
                throw new CustomError("Sorry cannot update project with the same name", 400);
            }

            const checkProject = await this.projectRepository.findOneBy({ name: data.name });
            if (checkProject && checkProject.name == data.name) {
                throw new CustomError("Duplicated project name", 409);
            }
        }

        if (data.description) {
            if (project.description == data.description) {
                throw new CustomError("Sorry cannot update project with the same description", 400);
            }
        }

        const areaId: string = String(data.areaId);
        if (areaId) {
            // if(area?.areaId?._id == areaId){
            //     throw new CustomError("Sorry cannot update area with the same area", 400);
            // }
            const area = await this.areaRepository.findOneBy({ _id: areaId });
            if (!area) {
                throw new CustomError("In-valid area id", 400);
            }
            data.areaId = area;
        }

        const updateResult = await this.projectRepository.update(projectId, data);
        const updatedProject = await this.projectRepository.findOneBy({ _id: projectId })
        return { message: "Done", project: updatedProject };
    }





    // async delete(id: string) {
    //     return this.projectRepository.delete(id);
    // }
}

export default ProjectService;