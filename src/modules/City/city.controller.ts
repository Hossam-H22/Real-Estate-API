import { NextFunction, Request, Response } from "express";
import CityService from "./city.service";
import { asyncHandler } from "../../middleware/errorHandling.middleware";

const cityService = new CityService();

class CityController {

    static getAllCities = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const cities = await cityService.getAll(req.query);
        res.status(200).json(cities);
    });

    static getCityById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const city = await cityService.getById(req.params.cityId, req.query);
        res.status(200).json(city);
    });

    static createCity = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const city = await cityService.create(
            req.headers?.userId as string, 
            req.body
        );
        res.status(201).json(city);
    });

    static updateCity = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const updatedCity = await cityService.update(
            req.headers?.userId as string, 
            req.headers?.userRole as string, 
            req.params.cityId, 
            req.body
        );
        res.status(200).json(updatedCity);
    });

    static deleteCity = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const deleteRes = await cityService.delete(
            req.headers?.userId as string, 
            req.headers?.userRole as string, 
            req.params.cityId, 
        );
        res.status(200).json(deleteRes);
    });
}

export default CityController;