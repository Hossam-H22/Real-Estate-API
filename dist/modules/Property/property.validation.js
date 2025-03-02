"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.update = exports.create = exports.get = void 0;
const validation_middleware_1 = require("../../middleware/validation.middleware");
const zod_1 = require("zod");
const property_entity_1 = require("./property.entity");
exports.get = zod_1.z.object({
    propertyId: validation_middleware_1.generalFields.id,
});
exports.create = zod_1.z.object({
    name: zod_1.z.string().min(2).max(100),
    description: zod_1.z.string().min(5).max(500),
    price: zod_1.z.coerce.number().positive().min(1000).max(30000000000),
    type: zod_1.z.enum([property_entity_1.PropertyType.APARTMENT, property_entity_1.PropertyType.COMMERCIAL, property_entity_1.PropertyType.HOUSE, property_entity_1.PropertyType.LAND]),
    status: zod_1.z.enum([property_entity_1.PropertyStatus.AVAILABLE, property_entity_1.PropertyStatus.RENTED, property_entity_1.PropertyStatus.SOLD]).optional(),
    bedrooms: zod_1.z.coerce.number().positive().min(1).max(20),
    bathrooms: zod_1.z.coerce.number().positive().min(1).max(10),
    squareFeet: zod_1.z.coerce.number().positive().min(50).max(10000),
    projectId: validation_middleware_1.generalFields.id,
    file: zod_1.z.array(validation_middleware_1.generalFields.file).min(1).max(5),
}).strict();
exports.update = zod_1.z.object({
    propertyId: validation_middleware_1.generalFields.id,
    name: zod_1.z.string().min(2).max(100).optional(),
    description: zod_1.z.string().min(5).max(500).optional(),
    price: zod_1.z.coerce.number().positive().min(100000).max(30000000000).optional(),
    type: zod_1.z.enum([property_entity_1.PropertyType.APARTMENT, property_entity_1.PropertyType.COMMERCIAL, property_entity_1.PropertyType.HOUSE, property_entity_1.PropertyType.LAND]).optional(),
    status: zod_1.z.enum([property_entity_1.PropertyStatus.AVAILABLE, property_entity_1.PropertyStatus.RENTED, property_entity_1.PropertyStatus.SOLD]).optional(),
    bedrooms: zod_1.z.coerce.number().positive().min(1).max(20).optional(),
    bathrooms: zod_1.z.coerce.number().positive().min(1).max(10).optional(),
    squareFeet: zod_1.z.coerce.number().positive().min(50).max(10000).optional(),
    projectId: validation_middleware_1.generalFields.id.optional(),
    file: zod_1.z.array(validation_middleware_1.generalFields.file.optional()).min(0).max(5).optional(),
}).strict();
