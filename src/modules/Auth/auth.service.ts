import AppDataSource from "../../database/data-source";
import { CustomError } from "../../utils/errorHandling";
import { Repository } from "typeorm";
import { User } from "../User/user.entity";
import HashingService from "../../utils/hash.service";
import TokenService from "../../utils/token.service";


const userRepository = AppDataSource.getRepository(User);

class AuthService {
    userRepository: Repository<User>;

    constructor() {
        this.userRepository = AppDataSource.getRepository(User);
    }


    async createUser(data: Partial<User>, file: Express.Multer.File | undefined) {
        let { email, password } = data;
        email = email?.toLowerCase();
        const checkUser = await this.userRepository.findOneBy({ email });
        if (checkUser) {
            throw new CustomError("Email exist", 409);
        }

        // hash password
        const hashPassword = HashingService.hash(password as string);
        data.password = hashPassword;

        const newUser = this.userRepository.create(data);
        await this.userRepository.save(newUser);
        return { message: "Done", user: newUser._id };
    }


    async getUser(data: Partial<User>) {
        const { email, password } = data;

        const user = await this.userRepository.findOneBy({ email: (email as string).toLowerCase() });
        if (!user) {
            throw new CustomError("Email not exist", 404);
        }

        // compare hashed Password
        const match = HashingService.compare({ plainText: (password as string), hashValue: user.password });
        if (!match) {
            throw new CustomError("In-valid password", 404);
        }

        // geţ tokens
        const access_token = TokenService.generateToken({
            payload: {
                id: user._id,
                isLoggedIn: true,
                role: user.role,
            },
            expiresIn: 60 * 30,
        });

        const refresh_token = TokenService.generateToken({
            payload: {
                id: user._id,
                isLoggedIn: true,
                role: user.role,
            },
            expiresIn: 60 * 60 * 24 * 365,
        });
        
        return { message: "Done", access_token, refresh_token };
    }

}

export default AuthService;