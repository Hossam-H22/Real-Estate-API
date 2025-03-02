import { Request, Response, NextFunction } from "express";
import PropertyService from "./property.service";
import { asyncHandler } from "../../utils/errorHandling";

const propertyService = new PropertyService();
class PropertyController {

    static getAllProperties = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const properties = await propertyService.getAll(req.query);
        res.status(200).json(properties);
    })

    static getPropertyById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const property = await propertyService.getById(req.params.propertyId, req.query);
        res.status(200).json(property);
    })

    static createProperty = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const property = await propertyService.create(
            req.headers?.userId as string, 
            req.body, 
            req.files as Express.Multer.File[]
        );
        res.status(201).json(property);
    })

    static updateProperty = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const updatedProperty = await propertyService.update(
            req.headers?.userId as string,
            req.headers?.userRole as string,
            req.params.propertyId, 
            req.body,
            req.files as Express.Multer.File[]
        );
        res.status(200).json(updatedProperty);
    })

    // static deleteProperty = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    //     await propertyService.delete(req.params.id);
    //     res.status(204).send();
    // })
}

export default PropertyController;