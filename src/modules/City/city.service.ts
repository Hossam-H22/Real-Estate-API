import { City } from "./city.entity";
import AppDataSource from './../../database/data-source';
import { Repository } from "typeorm";
import { User, UserRole } from "../User/user.entity";
import ApiFeatures from "../../utils/apiFeatures";
import { CustomError } from "../../middleware/errorHandling.middleware";
import { Area } from "../Area/area.entity";
import { Project } from "../Project/project.entity";
import { Property } from "../Property/property.entity";

class CityService {
    private userRepository: Repository<User>;
    private cityRepository: Repository<City>;
    private areaRepository: Repository<Area>;
    private projectRepository: Repository<Project>;
    private propertyRepository: Repository<Property>;

    constructor() {
        this.userRepository = AppDataSource.getRepository(User);
        this.cityRepository = AppDataSource.getRepository(City);
        this.areaRepository = AppDataSource.getRepository(Area);
        this.projectRepository = AppDataSource.getRepository(Project);
        this.propertyRepository = AppDataSource.getRepository(Property);
    }

    async getAll(query: any) {
        query["isDeleted"] = { "eq": false };
        let queryBuilder = this.cityRepository.createQueryBuilder('city');
        const rowsCount = await queryBuilder.getCount();
        const apiFeatures = new ApiFeatures(queryBuilder, 'city', query)
            .select()
            .relation()
            .filter()
            .search()
            .sort()
            .paginate();

        const metadata: any = {
            totalNumberOfData: rowsCount,
            limit: apiFeatures.size,
            numberOfPages: Math.ceil(rowsCount / apiFeatures.size) || 1,
            currentPage: apiFeatures.page,
        }
        const restPages = Math.ceil(rowsCount / apiFeatures.size) - apiFeatures.page;
        if (restPages > 0) metadata.nextPage = apiFeatures.page + 1;
        
        const cities = await apiFeatures['queryBuilder'].getMany();
        return { message: "Done", metadata, cities };
    }

    async getById(cityId: string, query: any) {
        query["_id"] = { "eq": cityId };
        query["isDeleted"] = { "eq": false };
        let queryBuilder = this.cityRepository.createQueryBuilder('city');
        const apiFeatures = new ApiFeatures(queryBuilder, 'city', query)
            .select()
            .relation()
            .filter()
        const city = await apiFeatures['queryBuilder'].getOne();
        return { message: "Done", city };
    }

    async create(userId: string, data: Partial<City>) {
        data.name = data.name?.toLowerCase();
        if(userId){
            const user = await this.userRepository.findOneBy({ _id: userId })
            data.createdBy = user as User;
        }
        const checkCity = await this.cityRepository.findOneBy({ name: data.name, isDeleted: false });
        if(checkCity){
            throw new CustomError("Duplicated city name", 409);
        }
        const city = this.cityRepository.create(data);
        const newCity = await this.cityRepository.save(city);
        return { message: "Done", city: newCity };
    }

    async update(userId: string, userRole: string, cityId: string, data: Partial<City>) {
        let checkCity = await this.cityRepository.findOne({ 
            where: { _id: cityId, isDeleted: false }, 
            relations: ["createdBy"] 
        });
        if (!checkCity) {
            throw new CustomError("In-valid city id", 400);
        }
        if(userRole === UserRole.AGENT && checkCity.createdBy._id !== userId){
            throw new CustomError("Not authorized account", 403)
        }

        if (data.name) {
            data.name = data.name.toLowerCase();
            if (checkCity.name == data.name) {
                throw new CustomError("Sorry cannot update city with the same name", 400);
            }

            checkCity = await this.cityRepository.findOneBy({ name: data.name, isDeleted: false  });
            if (checkCity) {
                throw new CustomError("Duplicated city name", 409);
            }
        }
        const updateResult = await this.cityRepository.update(cityId, data);
        const city = await this.cityRepository.findOneBy({ _id: cityId })
        return { message: "Done", city };
    }

    async delete(userId: string, userRole: string, cityId: string) {
        let checkCity = await this.cityRepository.findOneBy({ _id: cityId, isDeleted: false });
        if (!checkCity) {
            throw new CustomError("In-valid city id", 400);
        }
        const deleteResult = await this.cityRepository.update(cityId, {isDeleted:true});
        const deleteAreasResult = await this.areaRepository.update({cityId: new City().setId(cityId) }, {isDeleted:true})
        const deleteProjectsResult = await this.projectRepository.update({cityId: new City().setId(cityId) }, {isDeleted:true})
        const deletePropertiesResult = await this.propertyRepository.update({cityId: new City().setId(cityId) }, {isDeleted:true})
        return { message: "Done" };
    }


}

export default CityService;