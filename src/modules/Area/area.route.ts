import { RequestHandler, Router } from "express";
import AreaController from "./area.controller";
import * as validators from "./area.validation"
import { validation } from "../../middleware/validation.middleware";
import { auth } from "../../middleware/auth.middleware";

const router = Router();

router.get(
    "/", 
    AreaController.getAllAreas
);

router.get(
    "/:id", 
    validation(validators.get) as RequestHandler,
    AreaController.getAreaById
);

router.post(
    "/",
    auth(),
    validation(validators.create) as RequestHandler,
    AreaController.createArea
);

router.put(
    "/:areaId",
    auth(),
    validation(validators.update) as RequestHandler, 
    AreaController.updateArea
);

// router.delete("/:id", AreaController.deleteArea);

export default router;