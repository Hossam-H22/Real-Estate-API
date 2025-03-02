"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const app_controller_1 = __importDefault(require("./app.controller"));
const data_source_1 = __importDefault(require("./database/data-source"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
data_source_1.default.initialize()
    .then(() => {
    console.log("Database connected successfully!");
    (0, app_controller_1.default)(app);
})
    .catch((err) => {
    console.error("Database connection error:", err);
});
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
