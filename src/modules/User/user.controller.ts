
import { NextFunction, Request, Response } from "express";
import UserService from "./user.service";
import { asyncHandler } from "../../utils/errorHandling";

const userService = new UserService();

class UserController {

    static getAllUsers = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const users = await userService.getAll(req.query);
        res.status(200).json(users);
    });
    
    static getUserDetails = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const user = await userService.getUserById(req.headers.userId as string, req.query);
        res.status(200).json(user);
    });

    static updateUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const updatedUser = await userService.updateUser(req.headers.userId as string, req.body);
        res.status(200).json(updatedUser);
    })


}

export default UserController;