"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const city_service_1 = __importDefault(require("./city.service"));
const errorHandling_1 = require("../../utils/errorHandling");
const cityService = new city_service_1.default();
class CityController {
    static getAllCities = (0, errorHandling_1.asyncHandler)(async (req, res, next) => {
        const cities = await cityService.getAll(req.query);
        res.status(200).json(cities);
    });
    static getCityById = (0, errorHandling_1.asyncHandler)(async (req, res, next) => {
        const city = await cityService.getById(req.params.cityId, req.query);
        res.status(200).json(city);
    });
    static createCity = (0, errorHandling_1.asyncHandler)(async (req, res, next) => {
        const city = await cityService.create(req.headers?.userId, req.body);
        res.status(201).json(city);
    });
    static updateCity = (0, errorHandling_1.asyncHandler)(async (req, res, next) => {
        const updatedCity = await cityService.update(req.params.cityId, req.body);
        res.status(200).json(updatedCity);
    });
}
exports.default = CityController;
