"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const property_controller_1 = __importDefault(require("./property.controller"));
const validators = __importStar(require("./property.validation"));
const validation_middleware_1 = require("../../middleware/validation.middleware");
const cloudinary_service_1 = require("../../utils/cloudinary.service");
const router = (0, express_1.Router)();
router.get("/", property_controller_1.default.getAllProperties);
router.get("/:propertyId", (0, validation_middleware_1.validation)(validators.get), property_controller_1.default.getPropertyById);
router.post("/", 
// auth(),
cloudinary_service_1.CloudinaryService.fileUpload(cloudinary_service_1.CloudinaryService.fileType.image).array("file", 5), (0, validation_middleware_1.validation)(validators.create), property_controller_1.default.createProperty);
router.put("/:propertyId", 
// auth(),
cloudinary_service_1.CloudinaryService.fileUpload(cloudinary_service_1.CloudinaryService.fileType.image).array("file", 5), (0, validation_middleware_1.validation)(validators.update), property_controller_1.default.updateProperty);
// router.delete("/:propertyId", PropertyController.deleteProperty);
exports.default = router;
