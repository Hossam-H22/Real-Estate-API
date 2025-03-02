import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from 'dotenv';
import { Area } from "../modules/Area/area.entity";
import { City } from "../modules/City/city.entity";
import { Project } from "../modules/Project/project.entity";
import { Property } from "../modules/Property/property.entity";
import { User } from "../modules/User/user.entity";

dotenv.config();

const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: String(process.env.DB_PASSWORD),
    database: process.env.DB_NAME,
    // synchronize: process.env.MOOD == "DEV" ? true : false,  // Set to false in production
    synchronize: true,  // Set to false in production
    logging: process.env.MOOD == "DEV" ? true : false,
    // entities: ["src/modules/**/*.entity.ts"],
    entities: [Area, City, Project, Property, User],
    // migrations: ["src/migration/**/*.ts"],
});

export default AppDataSource;