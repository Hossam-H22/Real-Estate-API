import { RequestHandler, Router } from "express";
import PropertyController from "./property.controller";
import * as validators from "./property.validation"
import { validation } from "../../middleware/validation.middleware";
import { auth } from "../../middleware/auth.middleware";
import { CloudinaryService } from "../../utils/cloudinary.service";
import { endPointRoles } from "./property.roles";

const router = Router();

router.get(
    "/", 
    PropertyController.getAllProperties
);

router.get(
    "/:propertyId",
    validation(validators.get) as RequestHandler,
    PropertyController.getPropertyById
);

router.post(
    "/", 
    auth(endPointRoles.create),
    CloudinaryService.fileUpload(CloudinaryService.fileType.image).array(
        "file",
        5
    ),
    validation(validators.create) as RequestHandler,
    PropertyController.createProperty
);

router.put(
    "/:propertyId", 
    auth(endPointRoles.update),
    CloudinaryService.fileUpload(CloudinaryService.fileType.image).array(
        "file",
        5
    ),
    validation(validators.update) as RequestHandler,
    PropertyController.updateProperty
);

router.delete(
    "/:propertyId", 
    auth(endPointRoles.delete),
    validation(validators.deleting) as RequestHandler,
    PropertyController.deleteProperty
);

router.patch(
    "/:propertyId/favorite", 
    auth(endPointRoles.favorite),
    validation(validators.deleting) as RequestHandler,
    PropertyController.toggleFavoriteProperty
);

export default router;
