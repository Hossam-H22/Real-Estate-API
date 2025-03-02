import cors from 'cors';
import express, { Request, Response, Express } from 'express';
import "reflect-metadata";
import authRoutes from './modules/Auth/auth.route';
import userRoutes from './modules/User/user.route';
import cityRoutes from './modules/City/city.route';
import areaRoutes from './modules/Area/area.route';
import projectRoutes from './modules/Project/project.route';
import propertyRoutes from './modules/Property/property.route';
import { globalErrorHandling } from './utils/errorHandling';


function initApp(app:Express) {

    // Middleware
    app.use(cors());
    app.use(express.json());

    // Default Route
    app.get("/", (req:Request, res:Response) => {
        res.send("Welcome to the Node.js API with TypeScript!");
    });
    
    app.use("/api/v1/auth", authRoutes);
    app.use("/api/v1/user", userRoutes);
    app.use("/api/v1/city", cityRoutes);
    app.use("/api/v1/area", areaRoutes);
    app.use("/api/v1/project", projectRoutes);
    app.use("/api/v1/property", propertyRoutes);


    app.all("*", (req:Request, res:Response) => {
        res.status(404).json({ message: "In-valid routing please check url" });
    });

    
    // Error handling middleware
    app.use(globalErrorHandling);

}

export default initApp;