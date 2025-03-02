"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const data_source_1 = __importDefault(require("../../database/data-source"));
const apiFeatures_1 = __importDefault(require("../../utils/apiFeatures"));
const user_entity_1 = require("./user.entity");
// const userRepository = AppDataSource.getRepository(User);
class UserService {
    userRepository;
    constructor() {
        this.userRepository = data_source_1.default.getRepository(user_entity_1.User);
    }
    async getAll(query) {
        let queryBuilder = this.userRepository.createQueryBuilder('user');
        const apiFeatures = new apiFeatures_1.default(queryBuilder, 'user', query)
            .select()
            .filter()
            .sort()
            .paginate()
            .search();
        const users = await apiFeatures['queryBuilder'].getMany();
        return users;
    }
    async getUserById(id, query) {
        query["_id"] = { "eq": id };
        let queryBuilder = this.userRepository.createQueryBuilder('user');
        const apiFeatures = new apiFeatures_1.default(queryBuilder, 'user', query)
            .filter()
            .select();
        const user = await apiFeatures['queryBuilder'].getOne();
        // const user = await this.userRepository.findOneBy({ _id: id });
        // if(!user){
        //     throw new CustomError("In-valid user id", 404);
        // }
        return { message: "Done", user };
    }
    async updateUser(id, data) {
        const updateResult = await this.userRepository.update(id, data);
        const user = await this.userRepository.findOneBy({ _id: id });
        return { message: "Done", user };
    }
}
exports.default = UserService;
