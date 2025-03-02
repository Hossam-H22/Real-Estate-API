"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const data_source_1 = __importDefault(require("../../database/data-source"));
const apiFeatures_1 = __importDefault(require("../../utils/apiFeatures"));
const errorHandling_1 = require("../../utils/errorHandling");
const city_entity_1 = require("../City/city.entity");
const user_entity_1 = require("../User/user.entity");
const area_entity_1 = require("./area.entity");
class AreaService {
    areaRepository;
    cityRepository;
    userRepository;
    constructor() {
        this.areaRepository = data_source_1.default.getRepository(area_entity_1.Area);
        this.cityRepository = data_source_1.default.getRepository(city_entity_1.City);
        this.userRepository = data_source_1.default.getRepository(user_entity_1.User);
    }
    async getAll(query) {
        let queryBuilder = this.areaRepository.createQueryBuilder('area');
        const rowsCount = await queryBuilder.getCount();
        const apiFeatures = new apiFeatures_1.default(queryBuilder, 'area', query)
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
        const areas = await apiFeatures['queryBuilder'].getMany();
        return { message: "Done", metadata, areas };
    }
    async getById(areaId, query) {
        query["_id"] = { "eq": areaId };
        let queryBuilder = this.areaRepository.createQueryBuilder('area');
        const apiFeatures = new apiFeatures_1.default(queryBuilder, 'area', query)
            .select()
            .filter();
        const area = await apiFeatures['queryBuilder'].getOne();
        return { message: "Done", area };
    }
    async create(userId, data) {
        data.name = data.name?.toLowerCase();
        const checkArea = await this.areaRepository.findOneBy({ name: data.name });
        if (checkArea && checkArea.name == data.name) {
            throw new errorHandling_1.CustomError("Duplicated area name", 409);
        }
        if (userId) {
            const user = await this.userRepository.findOneBy({ _id: userId });
            data.createdBy = user;
        }
        const cityId = String(data.cityId);
        const city = await this.cityRepository.findOneBy({ _id: cityId });
        if (!city) {
            throw new errorHandling_1.CustomError("In-valid city id", 400);
        }
        data.cityId = city;
        const area = this.areaRepository.create(data);
        const newArea = await this.areaRepository.save(area);
        return { message: "Done", area: newArea };
    }
    async update(userId, userRole, areaId, data) {
        const area = await this.areaRepository.findOneBy({ _id: areaId });
        if (!area) {
            throw new errorHandling_1.CustomError("In-valid area id", 400);
        }
        if (data.name) {
            data.name = data.name.toLowerCase();
            if (area.name == data.name) {
                throw new errorHandling_1.CustomError("Sorry cannot update area with the same name", 400);
            }
            const checkArea = await this.areaRepository.findOneBy({ name: data.name });
            if (checkArea && checkArea.name == data.name) {
                throw new errorHandling_1.CustomError("Duplicated area name", 409);
            }
        }
        const cityId = String(data.cityId);
        if (cityId) {
            // if(area?.cityId?._id == cityId){
            //     throw new CustomError("Sorry cannot update area with the same city", 400);
            // }
            const city = await this.cityRepository.findOneBy({ _id: cityId });
            if (!city) {
                throw new errorHandling_1.CustomError("In-valid city id", 400);
            }
            data.cityId = city;
        }
        const updateResult = await this.areaRepository.update(areaId, data);
        const updatedArea = await this.areaRepository.findOneBy({ _id: areaId });
        return { message: "Done", area: updatedArea };
    }
}
exports.default = AreaService;
