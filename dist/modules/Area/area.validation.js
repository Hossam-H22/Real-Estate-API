"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.update = exports.create = exports.get = void 0;
const validation_middleware_1 = require("../../middleware/validation.middleware");
const zod_1 = require("zod");
exports.get = zod_1.z.object({
    areaId: validation_middleware_1.generalFields.id,
});
exports.create = zod_1.z.object({
    name: zod_1.z.string().min(2).max(20),
    cityId: validation_middleware_1.generalFields.id,
}).strict();
exports.update = zod_1.z.object({
    areaId: validation_middleware_1.generalFields.id,
    cityId: validation_middleware_1.generalFields.id.optional(),
    name: zod_1.z.string().min(2).max(20).optional(),
}).strict();
