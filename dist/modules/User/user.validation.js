"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.update = void 0;
const validation_middleware_1 = require("../../middleware/validation.middleware");
const zod_1 = require("zod");
exports.update = zod_1.z.object({
    name: validation_middleware_1.generalFields.userName.optional(),
    phone: validation_middleware_1.generalFields.phone.optional(),
}).strict();
