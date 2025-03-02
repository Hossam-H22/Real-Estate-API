"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
require("reflect-metadata");
const auth_route_1 = __importDefault(require("./modules/Auth/auth.route"));
const user_route_1 = __importDefault(require("./modules/User/user.route"));
const city_route_1 = __importDefault(require("./modules/City/city.route"));
const area_route_1 = __importDefault(require("./modules/Area/area.route"));
const project_route_1 = __importDefault(require("./modules/Project/project.route"));
const property_route_1 = __importDefault(require("./modules/Property/property.route"));
const errorHandling_1 = require("./utils/errorHandling");
function initApp(app) {
    // Middleware
    app.use((0, cors_1.default)());
    app.use(express_1.default.json());
    // Default Route
    app.get("/", (req, res) => {
        res.send("Welcome to the Node.js API with TypeScript!");
    });
    app.use("/api/v1/auth", auth_route_1.default);
    app.use("/api/v1/user", user_route_1.default);
    app.use("/api/v1/city", city_route_1.default);
    app.use("/api/v1/area", area_route_1.default);
    app.use("/api/v1/project", project_route_1.default);
    app.use("/api/v1/property", property_route_1.default);
    app.all("*", (req, res) => {
        res.status(404).json({ message: "In-valid routing please check url" });
    });
    // Error handling middleware
    app.use(errorHandling_1.globalErrorHandling);
}
exports.default = initApp;
