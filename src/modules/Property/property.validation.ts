import { generalFields } from "../../middleware/validation.middleware";
import { z } from "zod";
import { PropertyStatus, PropertyType } from "./property.entity";

export const get = z.object({
    propertyId: generalFields.id,
});

export const create = z.object({
    name: z.string().min(2).max(100),
    description: z.string().min(5).max(500),
    price: z.coerce.number().positive().min(1000).max(30000000000),
    type: z.enum([PropertyType.APARTMENT, PropertyType.COMMERCIAL, PropertyType.HOUSE, PropertyType.LAND]),
    status: z.enum([PropertyStatus.AVAILABLE, PropertyStatus.RENTED, PropertyStatus.SOLD]).optional(),
    bedrooms: z.coerce.number().positive().min(1).max(20),
    bathrooms: z.coerce.number().positive().min(1).max(10),
    squareFeet: z.coerce.number().positive().min(50).max(10000),
    projectId: generalFields.id,
    file: z.array(generalFields.file).min(1).max(5),
}).strict();

export const update = z.object({
    propertyId: generalFields.id,
    name: z.string().min(2).max(100).optional(),
    description: z.string().min(5).max(500).optional(),
    price: z.coerce.number().positive().min(100000).max(30000000000).optional(),
    type: z.enum([PropertyType.APARTMENT, PropertyType.COMMERCIAL, PropertyType.HOUSE, PropertyType.LAND]).optional(),
    status: z.enum([PropertyStatus.AVAILABLE, PropertyStatus.RENTED, PropertyStatus.SOLD]).optional(),
    bedrooms: z.coerce.number().positive().min(1).max(20).optional(),
    bathrooms: z.coerce.number().positive().min(1).max(10).optional(),
    squareFeet: z.coerce.number().positive().min(50).max(10000).optional(),
    projectId: generalFields.id.optional(),
    file: z.array(generalFields.file.optional()).min(0).max(5).optional(),
}).strict();