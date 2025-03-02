"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const data_source_1 = __importDefault(require("../../database/data-source"));
const errorHandling_1 = require("../../utils/errorHandling");
const user_entity_1 = require("../User/user.entity");
const hash_service_1 = __importDefault(require("../../utils/hash.service"));
const token_service_1 = __importDefault(require("../../utils/token.service"));
const userRepository = data_source_1.default.getRepository(user_entity_1.User);
class AuthService {
    userRepository;
    constructor() {
        this.userRepository = data_source_1.default.getRepository(user_entity_1.User);
    }
    async createUser(data, file) {
        let { email, password } = data;
        email = email?.toLowerCase();
        const checkUser = await this.userRepository.findOneBy({ email });
        if (checkUser) {
            throw new errorHandling_1.CustomError("Email exist", 409);
        }
        // hash password
        const hashPassword = hash_service_1.default.hash(password);
        data.password = hashPassword;
        const newUser = this.userRepository.create(data);
        await this.userRepository.save(newUser);
        return { message: "Done", user: newUser._id };
    }
    async getUser(data) {
        const { email, password } = data;
        const user = await this.userRepository.findOneBy({ email: email.toLowerCase() });
        if (!user) {
            throw new errorHandling_1.CustomError("Email not exist", 404);
        }
        // compare hashed Password
        const match = hash_service_1.default.compare({ plainText: password, hashValue: user.password });
        if (!match) {
            throw new errorHandling_1.CustomError("In-valid password", 404);
        }
        // geţ tokens
        const access_token = token_service_1.default.generateToken({
            payload: {
                id: user._id,
                isLoggedIn: true,
                role: user.role,
            },
            expiresIn: 60 * 30,
        });
        const refresh_token = token_service_1.default.generateToken({
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
exports.default = AuthService;
