import { RequestHandler, Router } from "express";
import AreaController from "./area.controller";
import * as validators from "./area.validation"
import { validation } from "../../middleware/validation.middleware";
import { auth } from "../../middleware/auth.middleware";
import { endPointRoles } from "./area.roles";

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
    auth(endPointRoles.create),
    validation(validators.create) as RequestHandler,
    AreaController.createArea
);

router.put(
    "/:areaId",
    auth(endPointRoles.update),
    validation(validators.update) as RequestHandler, 
    AreaController.updateArea
);

router.delete(
    "/:areaId",
    auth(endPointRoles.delete),
    validation(validators.deleting) as RequestHandler, 
    AreaController.deleteArea
);


export default router;