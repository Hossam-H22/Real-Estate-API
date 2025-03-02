import { generalFields } from "../../middleware/validation.middleware";
import { z } from "zod";

export const get = z.object({
    areaId: generalFields.id,
});

export const create = z.object({
    name: z.string().min(2).max(20),
    cityId: generalFields.id,
}).strict();

export const update = z.object({
    areaId: generalFields.id,
    cityId: generalFields.id.optional(),
    name: z.string().min(2).max(20).optional(),
}).strict();