"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const data_source_1 = __importDefault(require("../../database/data-source"));
const apiFeatures_1 = __importDefault(require("../../utils/apiFeatures"));
const errorHandling_1 = require("../../utils/errorHandling");
const project_entity_1 = require("../Project/project.entity");
const user_entity_1 = require("../User/user.entity");
const property_entity_1 = require("./property.entity");
const cloudinary_service_1 = require("./../../utils/cloudinary.service");
const short_uuid_1 = __importDefault(require("short-uuid"));
class PropertyService {
    propertyRepository;
    projectRepository;
    userRepository;
    cloudinaryService;
    constructor() {
        this.propertyRepository = data_source_1.default.getRepository(property_entity_1.Property);
        this.projectRepository = data_source_1.default.getRepository(project_entity_1.Project);
        this.userRepository = data_source_1.default.getRepository(user_entity_1.User);
        this.cloudinaryService = new cloudinary_service_1.CloudinaryService();
    }
    async getAll(query) {
        let queryBuilder = this.propertyRepository.createQueryBuilder('property');
        const rowsCount = await queryBuilder.getCount();
        const apiFeatures = new apiFeatures_1.default(queryBuilder, 'property', query)
            .select()
            .filter()
            .sort()
            .paginate()
            .search();
        const metadata = {
            totalNumberOfData: rowsCount,
            limit: apiFeatures.size,
            numberOfPages: Math.floor(rowsCount / apiFeatures.size) || 1,
            currentPage: apiFeatures.page,
        };
        const restPages = Math.floor(rowsCount / apiFeatures.size) - apiFeatures.page;
        if (restPages > 0)
            metadata.nextPage = apiFeatures.page + 1;
        const properties = await apiFeatures['queryBuilder'].getMany();
        return { message: "Done", metadata, properties };
    }
    async getById(propertyId, query) {
        query["_id"] = { "eq": propertyId };
        let queryBuilder = this.propertyRepository.createQueryBuilder('property');
        const apiFeatures = new apiFeatures_1.default(queryBuilder, 'property', query)
            .select()
            .filter();
        const property = await apiFeatures['queryBuilder'].getOne();
        return { message: "Done", property };
    }
    async create(userId, data, files) {
        // validate duplication of property name
        const checkProject = await this.propertyRepository.findOneBy({ name: data.name });
        if (checkProject && checkProject.name == data.name) {
            throw new errorHandling_1.CustomError("Duplicated property name", 409);
        }
        // get user data for property
        if (userId) {
            const user = await this.userRepository.findOneBy({ _id: userId });
            data.createdBy = user;
        }
        // get project data for property
        const projectId = String(data.projectId);
        const project = await this.projectRepository.findOneBy({ _id: projectId });
        if (!project) {
            throw new errorHandling_1.CustomError("In-valid project id", 400);
        }
        data.projectId = project;
        // uploading Images to the cloudinary
        data.imageFolderId = short_uuid_1.default.generate();
        data.images = [];
        for (const file of files) {
            const { secure_url, public_id } = await this.cloudinaryService.uploadImage(file.path, `property/${data.imageFolderId}`);
            data.images.push({ secure_url, public_id });
        }
        // create property
        const property = this.propertyRepository.create(data);
        if (!property) {
            for (const image of data.images) {
                await this.cloudinaryService.destroyImage(image.public_id);
            }
            throw new errorHandling_1.CustomError("Failed to create your property", 400);
        }
        // save property to database
        const newProperty = await this.propertyRepository.save(property);
        return { message: "Done", property: newProperty };
    }
    async update(userId, userRole, propertyId, data, files) {
        const property = await this.propertyRepository.findOneBy({ _id: propertyId });
        if (!property) {
            throw new errorHandling_1.CustomError("In-valid property id", 400);
        }
        if (data.name) {
            if (property.name == data.name) {
                throw new errorHandling_1.CustomError("Sorry cannot update property with the same name", 400);
            }
            const checkProperty = await this.propertyRepository.findOneBy({ name: data.name });
            if (checkProperty && checkProperty.name == data.name) {
                throw new errorHandling_1.CustomError("Duplicated property name", 409);
            }
        }
        if (data.description && property.description == data.description) {
            throw new errorHandling_1.CustomError("Sorry cannot update property with the same description", 400);
        }
        if (data.price && property.price == data.price) {
            throw new errorHandling_1.CustomError("Sorry cannot update property with the same price", 400);
        }
        if (data.type && property.type == data.type) {
            throw new errorHandling_1.CustomError("Sorry cannot update property with the same type", 400);
        }
        if (data.status && property.status == data.status) {
            throw new errorHandling_1.CustomError("Sorry cannot update property with the same status", 400);
        }
        if (data.bedrooms && property.bedrooms == data.bedrooms) {
            throw new errorHandling_1.CustomError("Sorry cannot update property with the same bedrooms", 400);
        }
        if (data.bathrooms && property.bathrooms == data.bathrooms) {
            throw new errorHandling_1.CustomError("Sorry cannot update property with the same bathrooms", 400);
        }
        if (data.squareFeet && property.squareFeet == data.squareFeet) {
            throw new errorHandling_1.CustomError("Sorry cannot update property with the same squareFeet", 400);
        }
        if (data.projectId) {
            const projectId = String(data.projectId);
            // if(project?.projectId?._id == projectId){
            //     throw new CustomError("Sorry cannot update project with the same project", 400);
            // }
            const project = await this.projectRepository.findOneBy({ _id: projectId });
            if (!project) {
                throw new errorHandling_1.CustomError("In-valid project id", 400);
            }
            data.projectId = project;
        }
        if (files && files.length) {
            // destroy old images
            for (const image of property.images) {
                await this.cloudinaryService.destroyImage(image.public_id);
            }
            data.images = [];
            for (const file of files) {
                const { secure_url, public_id } = await this.cloudinaryService.uploadImage(file.path, `property/${property.imageFolderId}`);
                data.images.push({ secure_url, public_id });
            }
        }
        const updateResult = await this.propertyRepository.update(propertyId, data);
        const updatedProperty = await this.propertyRepository.findOneBy({ _id: propertyId });
        return { message: "Done", property: updatedProperty };
    }
}
exports.default = PropertyService;
