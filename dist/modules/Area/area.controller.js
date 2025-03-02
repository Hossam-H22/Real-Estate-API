"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const area_service_1 = __importDefault(require("./area.service"));
const errorHandling_1 = require("../../utils/errorHandling");
const areaService = new area_service_1.default();
class AreaController {
    static getAllAreas = (0, errorHandling_1.asyncHandler)(async (req, res, next) => {
        const areas = await areaService.getAll(req.query);
        res.status(200).json(areas);
    });
    static getAreaById = (0, errorHandling_1.asyncHandler)(async (req, res, next) => {
        const area = await areaService.getById(req.params.id, req.query);
        res.status(200).json(area);
    });
    static createArea = (0, errorHandling_1.asyncHandler)(async (req, res, next) => {
        const area = await areaService.create(req.headers?.userId, req.body);
        res.status(201).json(area);
    });
    static updateArea = (0, errorHandling_1.asyncHandler)(async (req, res, next) => {
        const updatedArea = await areaService.update(req.headers?.userId, req.headers?.userRole, req.params.areaId, req.body);
        res.status(200).json(updatedArea);
    });
}
exports.default = AreaController;
