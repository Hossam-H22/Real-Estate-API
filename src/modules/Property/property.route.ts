import { RequestHandler, Router } from "express";
import PropertyController from "./property.controller";
import * as validators from "./property.validation"
import { validation } from "../../middleware/validation.middleware";
import { auth } from "../../middleware/auth.middleware";
import { CloudinaryService } from "../../utils/cloudinary.service";

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
    auth(),
    CloudinaryService.fileUpload(CloudinaryService.fileType.image).array(
        "file",
        5
    ),
    validation(validators.create) as RequestHandler,
    PropertyController.createProperty
);

router.put(
    "/:propertyId", 
    auth(),
    CloudinaryService.fileUpload(CloudinaryService.fileType.image).array(
        "file",
        5
    ),
    validation(validators.update) as RequestHandler,
    PropertyController.updateProperty
);

// router.delete("/:propertyId", PropertyController.deleteProperty);

export default router;
