"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const city_entity_1 = require("./city.entity");
const data_source_1 = __importDefault(require("./../../database/data-source"));
const user_entity_1 = require("../User/user.entity");
const apiFeatures_1 = __importDefault(require("../../utils/apiFeatures"));
const errorHandling_1 = require("../../utils/errorHandling");
class CityService {
    cityRepository;
    userRepository;
    constructor() {
        this.cityRepository = data_source_1.default.getRepository(city_entity_1.City);
        this.userRepository = data_source_1.default.getRepository(user_entity_1.User);
    }
    async getAll(query) {
        let queryBuilder = this.cityRepository.createQueryBuilder('city');
        const rowsCount = await queryBuilder.getCount();
        const apiFeatures = new apiFeatures_1.default(queryBuilder, 'city', query)
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
        const cities = await apiFeatures['queryBuilder'].getMany();
        return { message: "Done", metadata, cities };
    }
    async getById(cityId, query) {
        query["_id"] = { "eq": cityId };
        let queryBuilder = this.cityRepository.createQueryBuilder('city');
        const apiFeatures = new apiFeatures_1.default(queryBuilder, 'city', query)
            .select()
            .filter();
        const city = await apiFeatures['queryBuilder'].getOne();
        return { message: "Done", city };
    }
    async create(userId, data) {
        data.name = data.name?.toLowerCase();
        if (userId) {
            const user = await this.userRepository.findOneBy({ _id: userId });
            data.createdBy = user;
        }
        const city = this.cityRepository.create(data);
        const newCity = await this.cityRepository.save(city);
        return { message: "Done", city: newCity };
    }
    async update(cityId, data) {
        let checkCity = await this.cityRepository.findOneBy({ _id: cityId });
        if (!checkCity) {
            throw new errorHandling_1.CustomError("In-valid city id", 400);
        }
        if (data.name) {
            data.name = data.name.toLowerCase();
            if (checkCity.name == data.name) {
                throw new errorHandling_1.CustomError("Sorry cannot update city with the same name", 400);
            }
            checkCity = await this.cityRepository.findOneBy({ name: data.name });
            if (checkCity && checkCity.name == data.name) {
                throw new errorHandling_1.CustomError("Duplicated city name", 409);
            }
        }
        const updateResult = await this.cityRepository.update(cityId, data);
        const city = await this.cityRepository.findOneBy({ _id: cityId });
        return { message: "Done", city };
    }
}
exports.default = CityService;
