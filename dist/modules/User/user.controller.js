"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_service_1 = __importDefault(require("./user.service"));
const errorHandling_1 = require("../../utils/errorHandling");
const userService = new user_service_1.default();
class UserController {
    static getAllUsers = (0, errorHandling_1.asyncHandler)(async (req, res, next) => {
        const users = await userService.getAll(req.query);
        res.status(200).json(users);
    });
    static getUserDetails = (0, errorHandling_1.asyncHandler)(async (req, res, next) => {
        const user = await userService.getUserById(req.headers.userId, req.query);
        res.status(200).json(user);
    });
    static updateUser = (0, errorHandling_1.asyncHandler)(async (req, res, next) => {
        const updatedUser = await userService.updateUser(req.headers.userId, req.body);
        res.status(200).json(updatedUser);
    });
}
exports.default = UserController;
