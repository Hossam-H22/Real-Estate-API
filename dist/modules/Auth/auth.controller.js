"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_service_1 = __importDefault(require("./auth.service"));
const errorHandling_1 = require("../../utils/errorHandling");
const authService = new auth_service_1.default();
class AuthController {
    static signup = (0, errorHandling_1.asyncHandler)(async (req, res, next) => {
        const user = await authService.createUser(req.body, req.file);
        res.status(201).json(user);
    });
    static login = (0, errorHandling_1.asyncHandler)(async (req, res, next) => {
        const loggedUser = await authService.getUser(req.body);
        res.status(200).json(loggedUser);
    });
}
exports.default = AuthController;
