import { Request, Response, NextFunction } from "express";
import AreaService from "./area.service";
import { asyncHandler } from "../../utils/errorHandling";

const areaService = new AreaService();
class AreaController {

    static getAllAreas = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const areas = await areaService.getAll(req.query);
        res.status(200).json(areas);
    });

    static getAreaById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const area = await areaService.getById(req.params.id, req.query);
        res.status(200).json(area);
    });

    static createArea = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const area = await areaService.create(req.headers?.userId as string, req.body);
        res.status(201).json(area);
    });

    static updateArea = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const updatedArea = await areaService.update(
            req.headers?.userId as string, 
            req.headers?.userRole as string, 
            req.params.areaId, 
            req.body
        );
        res.status(200).json(updatedArea);
    });

    // static deleteArea = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    //     await areaService.delete(req.params.id);
    //     res.status(204).send();
    // });
}

export default AreaController;