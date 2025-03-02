"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.update = exports.create = exports.get = void 0;
const validation_middleware_1 = require("../../middleware/validation.middleware");
const zod_1 = require("zod");
exports.get = zod_1.z.object({
    projectId: validation_middleware_1.generalFields.id,
});
exports.create = zod_1.z.object({
    name: zod_1.z.string().min(2).max(100),
    description: zod_1.z.string().min(5).max(500),
    areaId: validation_middleware_1.generalFields.id,
}).strict();
exports.update = zod_1.z.object({
    projectId: validation_middleware_1.generalFields.id,
    areaId: validation_middleware_1.generalFields.id.optional(),
    name: zod_1.z.string().min(2).max(100).optional(),
    description: zod_1.z.string().min(5).max(500).optional(),
}).strict();
