"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.update = exports.create = exports.get = void 0;
const validation_middleware_1 = require("../../middleware/validation.middleware");
const zod_1 = require("zod");
exports.get = zod_1.z.object({
    cityId: validation_middleware_1.generalFields.id,
});
exports.create = zod_1.z.object({
    name: zod_1.z.string().min(2).max(20),
}).strict();
exports.update = zod_1.z.object({
    cityId: validation_middleware_1.generalFields.id,
    name: zod_1.z.string().min(2).max(20).optional(),
}).strict();
