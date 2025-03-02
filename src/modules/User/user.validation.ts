import { generalFields } from "../../middleware/validation.middleware";
import { z } from "zod";

export const update = z.object({
    name: generalFields.userName.optional(),
    phone: generalFields.phone.optional(),
}).strict();