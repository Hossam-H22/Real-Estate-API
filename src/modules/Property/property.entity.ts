import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from "typeorm";
import { User } from "../User/user.entity";
import { Project } from "../Project/project.entity";
import { City } from "../City/city.entity";
import { Area } from "../Area/area.entity";

export enum PropertyType {
    HOUSE = "house",
    APARTMENT = "apartment",
    LAND = "land",
    COMMERCIAL = "commercial",
}

export enum PropertyStatus {
    AVAILABLE = "available",
    SOLD = "sold",
    RENTED = "rented",
}

// Define an Image object type
class PropertyImage {
    @Column()
    secure_url: string;

    @Column()
    public_id: string;
}

@Entity("properties")
export class Property {
    @PrimaryGeneratedColumn("uuid")
    _id: string;

    @Column()
    name: string;

    @Column({ type: "text" })
    description: string;

    @Column({ type: "float" })
    price: number;

    @Column({
        type: "enum",
        enum: PropertyType,
        default: PropertyType.HOUSE
    })
    type: PropertyType;

    @Column({
        type: "enum",
        enum: PropertyStatus,
        default: PropertyStatus.AVAILABLE
    })
    status: PropertyStatus;

    @Column()
    bedrooms: number;

    @Column()
    bathrooms: number;

    @Column()
    squareFeet: number;

    @Column()
    imageFolderId: string;

    @Column("jsonb", { default: [] })
    images: PropertyImage[];

    @ManyToOne(() => User, (user) => user.properties, { onDelete: "CASCADE", nullable: false })
    @JoinColumn({ name: "createdBy" })
    createdBy: User;

    @ManyToOne(() => Project, (project) => project.properties, { onDelete: "CASCADE", nullable: false })
    @JoinColumn({ name: "projectId" })
    projectId: Project;
    
    @ManyToOne(() => City, (city) => city.properties, { onDelete: "CASCADE", nullable: false })
    @JoinColumn({ name: "cityId" })
    cityId: City;

    @ManyToOne(() => Area, (area) => area.properties, { onDelete: "CASCADE", nullable: false })
    @JoinColumn({ name: "areaId" })
    areaId: Area;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({default: false})
    isDeleted: boolean;


    setId(id:string){
        this._id = id;
        return this;
    }
}
