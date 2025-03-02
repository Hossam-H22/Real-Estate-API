import { City } from "./city.entity";
import AppDataSource from './../../database/data-source';
import { Repository } from "typeorm";
import { User } from "../User/user.entity";
import ApiFeatures from "../../utils/apiFeatures";
import { CustomError } from "../../utils/errorHandling";

class CityService {
    private cityRepository: Repository<City>;
    private userRepository: Repository<User>;
    constructor() {
        this.cityRepository = AppDataSource.getRepository(City);
        this.userRepository = AppDataSource.getRepository(User);
    }

    async getAll(query: any) {
        let queryBuilder = this.cityRepository.createQueryBuilder('city');
        const rowsCount = await queryBuilder.getCount();
        const apiFeatures = new ApiFeatures(queryBuilder, 'city', query)
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
        
        const cities = await apiFeatures['queryBuilder'].getMany();
        return { message: "Done", metadata, cities };
    }

    async getById(cityId: string, query: any) {
        query["_id"] = { "eq": cityId };
        let queryBuilder = this.cityRepository.createQueryBuilder('city');
        const apiFeatures = new ApiFeatures(queryBuilder, 'city', query)
            .select()
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
        const city = this.cityRepository.create(data);
        const newCity = await this.cityRepository.save(city);
        return { message: "Done", city: newCity };
    }

    async update(cityId: string, data: Partial<City>) {
        let checkCity = await this.cityRepository.findOneBy({ _id: cityId });
        if (!checkCity) {
            throw new CustomError("In-valid city id", 400);
        }

        if (data.name) {
            data.name = data.name.toLowerCase();
            if (checkCity.name == data.name) {
                throw new CustomError("Sorry cannot update city with the same name", 400);
            }

            checkCity = await this.cityRepository.findOneBy({ name: data.name });
            if (checkCity && checkCity.name == data.name) {
                throw new CustomError("Duplicated city name", 409);
            }
        }
        const updateResult = await this.cityRepository.update(cityId, data);
        const city = await this.cityRepository.findOneBy({ _id: cityId })
        return { message: "Done", city };
    }

    // async delete(id: string) {
    //     return await this.cityRepository.delete(id);
    // }
}

export default CityService;