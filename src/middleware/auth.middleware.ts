import { Request, Response, NextFunction } from "express";
import { asyncHandler, CustomError } from "../utils/errorHandling";
import TokenService from "../utils/token.service";
import { User, UserRole } from "../modules/User/user.entity";
import AppDataSource from "../database/data-source";

const userRepository = AppDataSource.getRepository(User);

export const auth = (accessRoles: UserRole[] = []) => {
    return asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { authorization } = req.headers;
        
        if (!authorization?.startsWith((process.env.BEARER_KEY as string))) {
            next(new CustomError("In-valid Bearer key", 400));
        }
    
        const token = (authorization as string).split((process.env.BEARER_KEY as string))[1]
        if (!token) {
            next(new CustomError("Token is required", 400));
        }
    
        // Decode Token
        const decodedToken = TokenService.verifyToken(token);
        if (!decodedToken.id || !decodedToken.isLoggedIn) {
            next(new CustomError("In-valid token", 400));
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
            next(new CustomError("Not register account", 401));
        }

        // if(authUser.changePasswordTime && parseInt(authUser.changePasswordTime.getTime()/1000) > decodedToken.iat){
        //     next(new CustomError("Expired token", 400));
        // }

        if(accessRoles.length>0 && !accessRoles.includes(authUser!.role)) {
            next(new CustomError("Not authorized account", 403));
        }
        
        req.headers.userId = authUser?._id;
        req.headers.userRole = authUser?.role;

        next();
    })
}