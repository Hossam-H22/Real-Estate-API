"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const dotenv_1 = __importDefault(require("dotenv"));
const area_entity_1 = require("../modules/Area/area.entity");
const city_entity_1 = require("../modules/City/city.entity");
const project_entity_1 = require("../modules/Project/project.entity");
const property_entity_1 = require("../modules/Property/property.entity");
const user_entity_1 = require("../modules/User/user.entity");
dotenv_1.default.config();
const AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: String(process.env.DB_PASSWORD),
    database: process.env.DB_NAME,
    // synchronize: process.env.MOOD == "DEV" ? true : false,  // Set to false in production
    synchronize: true, // Set to false in production
    logging: process.env.MOOD == "DEV" ? true : false,
    // entities: ["src/modules/**/*.entity.ts"],
    entities: [area_entity_1.Area, city_entity_1.City, project_entity_1.Project, property_entity_1.Property, user_entity_1.User],
    // migrations: ["src/migration/**/*.ts"],
});
exports.default = AppDataSource;
