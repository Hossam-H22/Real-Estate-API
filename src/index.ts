import "reflect-metadata";
import express from "express";
import dotenv from "dotenv";
import initApp from "./app.controller";
import AppDataSource from "./database/data-source";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


AppDataSource.initialize()
    .then(() => {
        console.log("Database connected successfully!");
        initApp(app);
    })
    .catch((err) => {
        console.error("Database connection error:", err);
    });


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
