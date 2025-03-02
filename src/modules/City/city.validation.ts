import { generalFields } from "../../middleware/validation.middleware";
import { z } from "zod";

export const get = z.object({
    cityId: generalFields.id,
});

export const create = z.object({
    name: z.string().min(2).max(20),
}).strict();

export const update = z.object({
    cityId: generalFields.id,
    name: z.string().min(2).max(20).optional(),
}).strict();