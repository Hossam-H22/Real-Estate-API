import { Repository } from "typeorm";
import AppDataSource from "../../database/data-source";
import ApiFeatures from "../../utils/apiFeatures";
import { CustomError } from "../../utils/errorHandling";
import { Project } from "./project.entity";
import { Area } from "../Area/area.entity";
import { User, UserRole } from "../User/user.entity";
import { Property } from "../Property/property.entity";

class ProjectService {
    private userRepository: Repository<User>;
    private projectRepository: Repository<Project>;
    private areaRepository: Repository<Area>;
    private propertyRepository: Repository<Property>;

    constructor() {
        this.userRepository = AppDataSource.getRepository(User);
        this.projectRepository = AppDataSource.getRepository(Project);
        this.areaRepository = AppDataSource.getRepository(Area);
        this.propertyRepository = AppDataSource.getRepository(Property);
    }

    async getAll(query: any) {
        query["isDeleted"] = { "eq": false };
        let queryBuilder = this.projectRepository.createQueryBuilder('project');
        const rowsCount = await queryBuilder.getCount();
        const apiFeatures = new ApiFeatures(queryBuilder, 'project', query)
            .select()
            .relation()
            .filter()
            .search()
            .sort()
            .paginate();

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
        query["isDeleted"] = { "eq": false };
        let queryBuilder = this.projectRepository.createQueryBuilder('project');
        const apiFeatures = new ApiFeatures(queryBuilder, 'project', query)
            .select()
            .relation()
            .filter()
        const project = await apiFeatures['queryBuilder'].getOne();
        return { message: "Done", project };
    }

    async create(userId: string, data: Partial<Project>) {
        const checkProject = await this.projectRepository.findOneBy({ name: data.name, isDeleted: false });
        if (checkProject) {
            throw new CustomError("Duplicated project name", 409);
        }
        if(userId){
            const user = await this.userRepository.findOneBy({ _id: userId });
            data.createdBy = user as User;
        }
        const areaId: string = String(data.areaId);
        // const area = await this.areaRepository.findOneBy({ _id: areaId, isDeleted: false });
        const checkArea = await this.areaRepository.createQueryBuilder('area')
            .where("area._id = :value1 AND area.isDeleted = :value2", {value1: areaId, value2: false})
            .leftJoinAndSelect("area.cityId", "city")
            .getOne();
        
        if (!checkArea) {
            throw new CustomError("In-valid area id", 400);
        }

        const area = new Area().copy({
            _id: checkArea._id,
            name: checkArea.name,
            createdAt: checkArea.createdAt,
            updatedAt: checkArea.updatedAt,
            isDeleted: checkArea.isDeleted,
        });

        data.areaId = area;
        data.cityId = checkArea.cityId;

        data.name = data.name?.toLowerCase();        
        const project = this.projectRepository.create(data);
        const newProject = await this.projectRepository.save(project);
        return { message: "Done", project: newProject };
    }

    async update(userId: string, userRole: string, projectId: string, data: Partial<Project>) {
        const project = await this.projectRepository.findOne({ 
            where: { _id: projectId, isDeleted: false }, 
            relations: ["createdBy"] 
        });
        if (!project) {
            throw new CustomError("In-valid project id", 400);
        }
        if(userRole === UserRole.AGENT && project.createdBy._id !== userId){
            throw new CustomError("Not authorized account", 403)
        }

        if (data.name) {
            data.name = data.name?.toLowerCase();  
            if (project.name == data.name) {
                throw new CustomError("Sorry cannot update project with the same name", 400);
            }

            const checkProject = await this.projectRepository.findOneBy({ name: data.name, isDeleted: false });
            if (checkProject) {
                throw new CustomError("Duplicated project name", 409);
            }
        }

        if (data.description) {
            if (project.description == data.description) {
                throw new CustomError("Sorry cannot update project with the same description", 400);
            }
        }

        if (data.areaId) {
            const areaId: string = String(data.areaId);
            // if(area?.areaId?._id == areaId){
            //     throw new CustomError("Sorry cannot update area with the same area", 400);
            // }
            const checkArea = await this.areaRepository.createQueryBuilder('area')
                .where("area._id = :value1 AND area.isDeleted = :value2", {value1: areaId, value2: false})
                .leftJoinAndSelect("area.cityId", "city")
                .getOne();
            
            if (!checkArea) {
                throw new CustomError("In-valid area id", 400);
            }

            const area = new Area().copy({
                _id: checkArea._id,
                name: checkArea.name,
                createdAt: checkArea.createdAt,
                updatedAt: checkArea.updatedAt,
                isDeleted: checkArea.isDeleted,
            });

            data.areaId = area;
            data.cityId = checkArea.cityId;
        }

        const updateResult = await this.projectRepository.update(projectId, data);
        const updatedProject = await this.projectRepository.findOneBy({ _id: projectId })
        return { message: "Done", project: updatedProject };
    }
    
    async delete(userId: string, userRole: string, projectId: string) {
        const project = await this.projectRepository.findOne({ 
            where: { _id: projectId, isDeleted: false }, 
            relations: ["createdBy"] 
        });
        if (!project) {
            throw new CustomError("In-valid project id", 400);
        }
        if(userRole === UserRole.AGENT && project.createdBy._id !== userId){
            throw new CustomError("Not authorized account", 403)
        }

        const deleteResult = await this.projectRepository.update(projectId, {isDeleted:true});
        const deletePropertiesResult = await this.propertyRepository.update({projectId: new Project().setId(projectId) }, {isDeleted:true})
        return { message: "Done" };
    }

}

export default ProjectService;