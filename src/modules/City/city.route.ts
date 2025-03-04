import { RequestHandler, Router } from "express";
import CityController from "./city.controller";
import * as validators from "./city.validation"
import { validation } from "../../middleware/validation.middleware";
import { auth } from "../../middleware/auth.middleware";
import { endPointRoles } from "./city.roles";
const router = Router();

router.get("/", CityController.getAllCities);

router.get(
    "/:cityId", 
    validation(validators.get) as RequestHandler,
    CityController.getCityById
);

router.post(
    "/", 
    auth(endPointRoles.create),
    validation(validators.create) as RequestHandler,
    CityController.createCity
);

router.put(
    "/:cityId", 
    auth(endPointRoles.update),
    validation(validators.update) as RequestHandler,
    CityController.updateCity
);

router.delete(
    "/:cityId", 
    auth(endPointRoles.delete),
    validation(validators.deleting) as RequestHandler,
    CityController.deleteCity
);


export default router;
