import AppDataSource from "../../database/data-source";
import ApiFeatures from "../../utils/apiFeatures";
import { CustomError } from "../../utils/errorHandling";
import { City } from "../City/city.entity";
import { User } from "../User/user.entity";
import { Area } from "./area.entity";
import { Repository } from "typeorm";

class AreaService {
    private areaRepository: Repository<Area>;
    private cityRepository: Repository<City>;
    private userRepository: Repository<User>;

    constructor() {
        this.areaRepository = AppDataSource.getRepository(Area);
        this.cityRepository = AppDataSource.getRepository(City);
        this.userRepository = AppDataSource.getRepository(User);
    }

    async getAll(query: any) {
        let queryBuilder = this.areaRepository.createQueryBuilder('area');
        const rowsCount = await queryBuilder.getCount();
        const apiFeatures = new ApiFeatures(queryBuilder, 'area', query)
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
        
        const areas = await apiFeatures['queryBuilder'].getMany();
        return { message: "Done", metadata, areas };
    }

    async getById(areaId: string, query: any) {
        query["_id"] = { "eq": areaId };
        let queryBuilder = this.areaRepository.createQueryBuilder('area');
        const apiFeatures = new ApiFeatures(queryBuilder, 'area', query)
            .select()
            .filter()
        const area = await apiFeatures['queryBuilder'].getOne();
        return { message: "Done", area };
    }

    async create(userId: string, data: Partial<Area>) {
        data.name = data.name?.toLowerCase();
        const checkArea = await this.areaRepository.findOneBy({ name: data.name });
        if (checkArea && checkArea.name == data.name) {
            throw new CustomError("Duplicated area name", 409);
        }
        if(userId){
            const user = await this.userRepository.findOneBy({ _id: userId });
            data.createdBy = user as User;
        }
        
        const cityId: string = String(data.cityId);
        const city = await this.cityRepository.findOneBy({ _id: cityId });
        if (!city) {
            throw new CustomError("In-valid city id", 400);
        }
        data.cityId = city;

        const area = this.areaRepository.create(data);
        const newArea = await this.areaRepository.save(area);
        return { message: "Done", area: newArea };
    }

    async update(userId: string, userRole: string, areaId: string, data: Partial<Area>) {
        const area = await this.areaRepository.findOneBy({ _id: areaId });
        if (!area) {
            throw new CustomError("In-valid area id", 400);
        }

        if (data.name) {
            data.name = data.name.toLowerCase();
            if (area.name == data.name) {
                throw new CustomError("Sorry cannot update area with the same name", 400);
            }

            const checkArea = await this.areaRepository.findOneBy({ name: data.name });
            if (checkArea && checkArea.name == data.name) {
                throw new CustomError("Duplicated area name", 409);
            }
        }

        const cityId: string = String(data.cityId);
        if (cityId) {
            // if(area?.cityId?._id == cityId){
            //     throw new CustomError("Sorry cannot update area with the same city", 400);
            // }
            const city = await this.cityRepository.findOneBy({ _id: cityId });
            if (!city) {
                throw new CustomError("In-valid city id", 400);
            }
            data.cityId = city;
        }

        const updateResult = await this.areaRepository.update(areaId, data);
        const updatedArea = await this.areaRepository.findOneBy({ _id: areaId })
        return { message: "Done", area: updatedArea };
    }



    // async delete(id: string) {
    //     return this.areaRepository.delete(id);
    // }
}

export default AreaService;