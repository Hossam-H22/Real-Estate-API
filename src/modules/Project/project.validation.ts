import { generalFields } from "../../middleware/validation.middleware";
import { z } from "zod";

export const get = z.object({
    projectId: generalFields.id,
});

export const create = z.object({
    name: z.string().min(2).max(100),
    description: z.string().min(5).max(500),
    areaId: generalFields.id,
}).strict();

export const update = z.object({
    projectId: generalFields.id,
    areaId: generalFields.id.optional(),
    name: z.string().min(2).max(100).optional(),
    description: z.string().min(5).max(500).optional(),
}).strict();