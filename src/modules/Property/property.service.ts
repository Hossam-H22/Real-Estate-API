import AppDataSource from "../../database/data-source";
import ApiFeatures from "../../utils/apiFeatures";
import { CustomError } from "../../middleware/errorHandling.middleware";
import { Project } from "../Project/project.entity";
import { User, UserRole } from "../User/user.entity";
import { Property } from "./property.entity";
import { Repository } from "typeorm";
import { CloudinaryService } from './../../utils/cloudinary.service';
import short from 'short-uuid';

class PropertyService {
    private userRepository: Repository<User>;
    private propertyRepository: Repository<Property>;
    private projectRepository: Repository<Project>;
    private cloudinaryService: CloudinaryService;

    constructor() {
        this.userRepository = AppDataSource.getRepository(User);
        this.propertyRepository = AppDataSource.getRepository(Property);
        this.projectRepository = AppDataSource.getRepository(Project);
        this.cloudinaryService = new CloudinaryService();
    }

    async getAll(query: any) {
        query["isDeleted"] = { "eq": false };
        let queryBuilder = this.propertyRepository.createQueryBuilder('property');
        const rowsCount = await queryBuilder.getCount();
        const apiFeatures = new ApiFeatures(queryBuilder, 'property', query)
            .select()
            .relation()
            .filter()
            .search()
            .sort()
            .paginate();

        const metadata: any = {
            totalNumberOfData: rowsCount,
            limit: apiFeatures.size,
            numberOfPages: Math.floor(rowsCount / apiFeatures.size) || 1,
            currentPage: apiFeatures.page,
        }
        const restPages = Math.floor(rowsCount / apiFeatures.size) - apiFeatures.page;
        if (restPages > 0) metadata.nextPage = apiFeatures.page + 1;
        
        const properties = await apiFeatures['queryBuilder'].getMany();
        return { message: "Done", metadata, properties };
    }

    async getById(propertyId: string, query: any) {
        query["_id"] = { "eq": propertyId };
        query["isDeleted"] = { "eq": false };
        let queryBuilder = this.propertyRepository.createQueryBuilder('property');
        const apiFeatures = new ApiFeatures(queryBuilder, 'property', query)
            .select()
            .relation()
            .filter()
        const property = await apiFeatures['queryBuilder'].getOne();
        return { message: "Done", property };
    }

    async create(userId: string, data: Partial<Property>, files: Express.Multer.File[]) {

        // validate duplication of property name
        data.name = data.name?.toLowerCase();
        const checkProperty = await this.propertyRepository.findOneBy({ name: data.name, isDeleted: false });
        if (checkProperty) {
            throw new CustomError("Duplicated property name", 409);
        }

        // get user data for property
        if(userId){
            const user = await this.userRepository.findOneBy({ _id: userId });
            data.createdBy = user as User;
        }

        // get project data for property
        const projectId: string = String(data.projectId);
        const checkProject = await this.projectRepository.createQueryBuilder('project')
            .where("project._id = :value1 AND area.isDeleted = :value2", {value1: projectId, value2: false})
            .leftJoinAndSelect("project.cityId", "city")
            .leftJoinAndSelect("project.areaId", "area")
            .getOne();
        if (!checkProject) {
            throw new CustomError("In-valid project id", 400);
        }
        data.cityId = checkProject.cityId;
        data.areaId = checkProject.areaId;
        data.projectId = new Project().copy({
            _id: checkProject._id,
            name: checkProject.name,
            description: checkProject.description,
            createdAt: checkProject.createdAt,
            updatedAt: checkProject.updatedAt,
            isDeleted: checkProject.isDeleted,
        });


        // uploading Images to the cloudinary
        data.imageFolderId = short.generate();
        data.images = [];
        for (const file of files) {
            const { secure_url, public_id } = await this.cloudinaryService.uploadImage(
                file.path,
                `property/${data.imageFolderId}`
            );
            data.images.push({ secure_url, public_id });
        }

        // create property
        const property = this.propertyRepository.create(data);
        if (!property) {
            for (const image of data.images) {
                await this.cloudinaryService.destroyImage(image.public_id);
            }
            throw new CustomError("Failed to create your property", 400);
        }

        // save property to database
        const newProperty = await this.propertyRepository.save(property);
        return { message: "Done", property: newProperty };
    }

    async update(userId: string, userRole: string, propertyId: string, data: Partial<Property>, files: Express.Multer.File[]) {
        const property = await this.propertyRepository.findOne({ 
            where: { _id: propertyId, isDeleted: false }, 
            relations: ["createdBy"] 
        });
        if (!property) {
            throw new CustomError("In-valid property id", 400);
        }
        if(userRole === UserRole.AGENT && property.createdBy._id !== userId){
            throw new CustomError("Not authorized account", 403)
        }

        if (data.name) {
            data.name = data.name.toLowerCase();
            if (property.name == data.name) {
                throw new CustomError("Sorry cannot update property with the same name", 400);
            }

            const checkProperty = await this.propertyRepository.findOneBy({ name: data.name, isDeleted: false });
            if (checkProperty) {
                throw new CustomError("Duplicated property name", 409);
            }
        }

        if (data.description && property.description == data.description) {
            throw new CustomError("Sorry cannot update property with the same description", 400);
        }
        if (data.price && property.price == data.price) {
            throw new CustomError("Sorry cannot update property with the same price", 400);
        }
        if (data.type && property.type == data.type) {
            throw new CustomError("Sorry cannot update property with the same type", 400);
        }
        if (data.status && property.status == data.status) {
            throw new CustomError("Sorry cannot update property with the same status", 400);
        }
        if (data.bedrooms && property.bedrooms == data.bedrooms) {
            throw new CustomError("Sorry cannot update property with the same bedrooms", 400);
        }
        if (data.bathrooms && property.bathrooms == data.bathrooms) {
            throw new CustomError("Sorry cannot update property with the same bathrooms", 400);
        }
        if (data.squareFeet && property.squareFeet == data.squareFeet) {
            throw new CustomError("Sorry cannot update property with the same squareFeet", 400);
        }
        
        if (data.projectId) {
            const projectId: string = String(data.projectId);
            const checkProject = await this.projectRepository.createQueryBuilder('project')
                .where("project._id = :value1 AND area.isDeleted = :value2", {value1: projectId, value2: false})
                .leftJoinAndSelect("project.cityId", "city")
                .leftJoinAndSelect("project.areaId", "area")
                .getOne();
            if (!checkProject) {
                throw new CustomError("In-valid project id", 400);
            }
            data.cityId = checkProject.cityId;
            data.areaId = checkProject.areaId;
            data.projectId = new Project().copy({
                _id: checkProject._id,
                name: checkProject.name,
                description: checkProject.description,
                createdAt: checkProject.createdAt,
                updatedAt: checkProject.updatedAt,
                isDeleted: checkProject.isDeleted,
            })
        }

        if (files && files.length) {
            // destroy old images
            for (const image of property.images) {
                await this.cloudinaryService.destroyImage(image.public_id);
            }

            data.images = [];
            for (const file of files) {
                const { secure_url, public_id } = await this.cloudinaryService.uploadImage(
                    file.path,
                    `property/${property.imageFolderId}`
                );
                data.images.push({ secure_url, public_id });
            }
        }

        const updateResult = await this.propertyRepository.update(propertyId, data);
        const updatedProperty = await this.propertyRepository.findOneBy({ _id: propertyId })
        return { message: "Done", property: updatedProperty };
    }

    async delete(userId: string, userRole: string, propertyId: string) {
        const property = await this.propertyRepository.findOne({ 
            where: { _id: propertyId, isDeleted: false }, 
            relations: ["createdBy"] 
        });
        if (!property) {
            throw new CustomError("In-valid property id", 400);
        }
        if(userRole === UserRole.AGENT && property.createdBy._id !== userId){
            throw new CustomError("Not authorized account", 403)
        }
        
        const deleteResult = await this.propertyRepository.update(propertyId, {isDeleted:true});
        return { message: "Done" };
    }

    async toggleFavorite(userId: string, userRole: string, propertyId: string) {
        const user = await this.userRepository.findOne({ where: { _id: userId }, relations: ["favorites"] });
        if(!user) {
            throw new CustomError("In-valid user id", 400);
        }
        const checkExistProperty =  user?.favorites.find((property)=> property._id===propertyId);
        if(checkExistProperty){
            user.favorites = user.favorites.filter(property => property._id !== propertyId);
        }
        else {
            const property = await this.propertyRepository.findOneBy({ _id: propertyId, isDeleted: false });
            if (!property) {
                throw new CustomError("In-valid property id", 400);
            }
            user.favorites.push(property);
        }
        await this.userRepository.save(user);
        
        const { password, createdAt, updatedAt, ...returnUser } = user
        return { 
            message: "Done", 
            result: checkExistProperty? "Property removed from favorites":"Property added to favorites",
            user: returnUser
        };
    }

}

export default PropertyService;
