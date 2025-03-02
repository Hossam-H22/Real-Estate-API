"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const property_service_1 = __importDefault(require("./property.service"));
const errorHandling_1 = require("../../utils/errorHandling");
const propertyService = new property_service_1.default();
class PropertyController {
    static getAllProperties = (0, errorHandling_1.asyncHandler)(async (req, res, next) => {
        const properties = await propertyService.getAll(req.query);
        res.status(200).json(properties);
    });
    static getPropertyById = (0, errorHandling_1.asyncHandler)(async (req, res, next) => {
        const property = await propertyService.getById(req.params.propertyId, req.query);
        res.status(200).json(property);
    });
    static createProperty = (0, errorHandling_1.asyncHandler)(async (req, res, next) => {
        const property = await propertyService.create(req.headers?.userId, req.body, req.files);
        res.status(201).json(property);
    });
    static updateProperty = (0, errorHandling_1.asyncHandler)(async (req, res, next) => {
        const updatedProperty = await propertyService.update(req.headers?.userId, req.headers?.userRole, req.params.propertyId, req.body, req.files);
        res.status(200).json(updatedProperty);
    });
}
exports.default = PropertyController;
