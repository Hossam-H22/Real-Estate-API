import AppDataSource from "../../database/data-source";
import ApiFeatures from "../../utils/apiFeatures";
import { CustomError } from "../../utils/errorHandling";
import { User } from "./user.entity";
import { Repository } from "typeorm";


// const userRepository = AppDataSource.getRepository(User);

class UserService {
    userRepository: Repository<User>;

    constructor(){
        this.userRepository = AppDataSource.getRepository(User);
    }

    async getAll(query: any) {
        let queryBuilder = this.userRepository.createQueryBuilder('user');
        const apiFeatures = new ApiFeatures(queryBuilder, 'user', query)
            .select()
            .filter()
            .sort()
            .paginate()
            .search();
        const users = await apiFeatures['queryBuilder'].getMany();
        return users;
    }

    async getUserById(id: string, query: any) {
        query["_id"] = { "eq" : id };
        let queryBuilder = this.userRepository.createQueryBuilder('user');
        const apiFeatures = new ApiFeatures(queryBuilder, 'user', query)
            .filter()
            .select()
        const user = await apiFeatures['queryBuilder'].getOne();
        // const user = await this.userRepository.findOneBy({ _id: id });
        // if(!user){
        //     throw new CustomError("In-valid user id", 404);
        // }
        
        return { message: "Done", user };
    }

    async updateUser(id: string, data: Partial<User>) {
        const updateResult = await this.userRepository.update(id, data);
        const user = await this.userRepository.findOneBy({ _id: id });
        return { message: "Done", user };
    }

}

export default UserService;