import AppDataSource from "../../database/data-source";
import ApiFeatures from "../../utils/apiFeatures";
import { CustomError } from "../../utils/errorHandling";
import { City } from "../City/city.entity";
import { Project } from "../Project/project.entity";
import { Property } from "../Property/property.entity";
import { User, UserRole } from "../User/user.entity";
import { Area } from "./area.entity";
import { Repository } from "typeorm";

class AreaService {
    private areaRepository: Repository<Area>;
    private cityRepository: Repository<City>;
    private userRepository: Repository<User>;
    private projectRepository: Repository<Project>;
    private propertyRepository: Repository<Property>;

    constructor() {
        this.areaRepository = AppDataSource.getRepository(Area);
        this.cityRepository = AppDataSource.getRepository(City);
        this.userRepository = AppDataSource.getRepository(User);
        this.projectRepository = AppDataSource.getRepository(Project);
        this.propertyRepository = AppDataSource.getRepository(Property);
    }

    async getAll(query: any) {
        query["isDeleted"] = { "eq": false };
        let queryBuilder = this.areaRepository.createQueryBuilder('area');
        const rowsCount = await queryBuilder.getCount();
        const apiFeatures = new ApiFeatures(queryBuilder, 'area', query)
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
        
        const areas = await apiFeatures['queryBuilder'].getMany();
        return { message: "Done", metadata, areas };
    }

    async getById(areaId: string, query: any) {
        query["_id"] = { "eq": areaId };
        query["isDeleted"] = { "eq": false };
        let queryBuilder = this.areaRepository.createQueryBuilder('area');
        const apiFeatures = new ApiFeatures(queryBuilder, 'area', query)
            .select()
            .relation()
            .filter();
        const area = await apiFeatures['queryBuilder'].getOne();
        return { message: "Done", area };
    }

    async create(userId: string, data: Partial<Area>) {
        data.name = data.name?.toLowerCase();
        const checkArea = await this.areaRepository.findOneBy({ name: data.name, isDeleted: false });
        if (checkArea && checkArea.name == data.name) {
            throw new CustomError("Duplicated area name", 409);
        }
        if(userId){
            const user = await this.userRepository.findOneBy({ _id: userId });
            data.createdBy = user as User;
        }
        
        const cityId: string = String(data.cityId);
        const city = await this.cityRepository.findOneBy({ _id: cityId, isDeleted: false });
        if (!city) {
            throw new CustomError("In-valid city id", 400);
        }
        data.cityId = city;

        const area = this.areaRepository.create(data);
        const newArea = await this.areaRepository.save(area);
        return { message: "Done", area: newArea };
    }

    async update(userId: string, userRole: string, areaId: string, data: Partial<Area>) {
        const area = await this.areaRepository.findOne({ 
            where: { _id: areaId, isDeleted: false }, 
            relations: ["createdBy"] 
        });
        if (!area) {
            throw new CustomError("In-valid area id", 400);
        }
        if(userRole === UserRole.AGENT && area.createdBy._id !== userId){
            throw new CustomError("Not authorized account", 403)
        }

        if (data.name) {
            data.name = data.name.toLowerCase();
            if (area.name == data.name) {
                throw new CustomError("Sorry cannot update area with the same name", 400);
            }

            const checkArea = await this.areaRepository.findOneBy({ name: data.name, isDeleted: false });
            if (checkArea) {
                throw new CustomError("Duplicated area name", 409);
            }
        }

        if (data.cityId) {
            const cityId: string = String(data.cityId);
            // if(area?.cityId?._id == cityId){
            //     throw new CustomError("Sorry cannot update area with the same city", 400);
            // }
            const city = await this.cityRepository.findOneBy({ _id: cityId, isDeleted: false });
            if (!city) {
                throw new CustomError("In-valid city id", 400);
            }
            data.cityId = city;
        }

        const updateResult = await this.areaRepository.update(areaId, data);
        const updatedArea = await this.areaRepository.findOneBy({ _id: areaId })
        return { message: "Done", area: updatedArea };
    }
    
    async delete(userId: string, userRole: string, areaId: string) {
        const area = await this.areaRepository.findOneBy({ _id: areaId, isDeleted: false });
        if (!area) {
            throw new CustomError("In-valid area id", 400);
        }
        const deleteResult = await this.areaRepository.update(areaId, {isDeleted:true});
        const deleteProjectsResult = await this.projectRepository.update({areaId: new Area().setId(areaId) }, {isDeleted:true})
        const deletePropertiesResult = await this.propertyRepository.update({areaId: new Area().setId(areaId) }, {isDeleted:true})
        return { message: "Done" };
    }


}

export default AreaService;