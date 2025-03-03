import { RequestHandler, Router } from "express";
import CityController from "./city.controller";
import * as validators from "./city.validation"
import { validation } from "../../middleware/validation.middleware";
import { auth } from "../../middleware/auth.middleware";
const router = Router();

router.get("/", CityController.getAllCities);

router.get(
    "/:cityId", 
    validation(validators.get) as RequestHandler,
    CityController.getCityById
);

router.post(
    "/", 
    auth(),
    validation(validators.create) as RequestHandler,
    CityController.createCity
);
router.put(
    "/:cityId", 
    auth(),
    validation(validators.update) as RequestHandler,
    CityController.updateCity
);
// router.delete("/:cityId", CityController.deleteCity);

export default router;
