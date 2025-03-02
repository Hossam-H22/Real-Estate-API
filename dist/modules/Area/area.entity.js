"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Area = void 0;
const typeorm_1 = require("typeorm");
const city_entity_1 = require("../City/city.entity");
const user_entity_1 = require("../User/user.entity");
const project_entity_1 = require("../Project/project.entity");
let Area = class Area {
    _id;
    name;
    cityId;
    createdBy;
    projects;
    createdAt;
    updatedAt;
};
exports.Area = Area;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Area.prototype, "_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Area.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => city_entity_1.City, (city) => city.areas, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "cityId" }),
    __metadata("design:type", city_entity_1.City)
], Area.prototype, "cityId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.areas, { onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "createdBy" }),
    __metadata("design:type", user_entity_1.User)
], Area.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => project_entity_1.Project, (project) => project.areaId),
    __metadata("design:type", Array)
], Area.prototype, "projects", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Area.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Area.prototype, "updatedAt", void 0);
exports.Area = Area = __decorate([
    (0, typeorm_1.Entity)("areas")
], Area);
