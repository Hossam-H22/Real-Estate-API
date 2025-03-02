"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const errorHandling_1 = require("../utils/errorHandling");
const token_service_1 = __importDefault(require("../utils/token.service"));
const user_entity_1 = require("../modules/User/user.entity");
const data_source_1 = __importDefault(require("../database/data-source"));
const userRepository = data_source_1.default.getRepository(user_entity_1.User);
const auth = (accessRoles = []) => {
    return (0, errorHandling_1.asyncHandler)(async (req, res, next) => {
        const { authorization } = req.headers;
        if (!authorization?.startsWith(process.env.BEARER_KEY)) {
            next(new errorHandling_1.CustomError("In-valid Bearer key", 400));
        }
        const token = authorization.split(process.env.BEARER_KEY)[1];
        if (!token) {
            next(new errorHandling_1.CustomError("Token is required", 400));
        }
        // Decode Token
        const decodedToken = token_service_1.default.verifyToken(token);
        if (!decodedToken.id || !decodedToken.isLoggedIn) {
            next(new errorHandling_1.CustomError("In-valid token", 400));
        }
        const authUser = await userRepository.findOne({
            select: {
                _id: true,
                name: true,
                email: true,
                role: true,
            },
            where: {
                _id: decodedToken.id
            },
        });
        if (!authUser) {
            next(new errorHandling_1.CustomError("Not register account", 401));
        }
        // if(authUser.changePasswordTime && parseInt(authUser.changePasswordTime.getTime()/1000) > decodedToken.iat){
        //     next(new CustomError("Expired token", 400));
        // }
        if (accessRoles.length > 0 && !accessRoles.includes(authUser.role)) {
            next(new errorHandling_1.CustomError("Not authorized account", 403));
        }
        req.headers.userId = authUser?._id;
        req.headers.userRole = authUser?.role;
        next();
    });
};
exports.auth = auth;
