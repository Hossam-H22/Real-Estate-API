
import { NextFunction, Request, Response } from "express";
import AuthService from "./auth.service";
import { asyncHandler } from "../../utils/errorHandling";

const authService = new AuthService();

class AuthController {

    static signup = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const user = await authService.createUser(req.body, req.file);
        res.status(201).json(user);
    });
    
    static login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const loggedUser = await authService.getUser(req.body);
        res.status(200).json(loggedUser);
    });

    // static confirmEmail = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    //     const newUser = await authService.createUser(req.body);
    //     res.status(201).json(newUser);
    // })

    // static newConfirmEmail = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    //     const updatedUser = await authService.updateUser(req.params.id, req.body);
    //     res.json(updatedUser);
    // })

    // static forgetPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    //     await authService.deleteUser(req.params.id);
    //     res.status(204).send();
    // })
    
    // static resetPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    //     await authService.deleteUser(req.params.id);
    //     res.status(204).send();
    // })
}

export default AuthController;