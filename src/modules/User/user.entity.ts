import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, UpdateDateColumn } from "typeorm";
import { City } from "../City/city.entity";
import { Area } from "../Area/area.entity";
import { Project } from "../Project/project.entity";
import { Property } from "../Property/property.entity";


export enum UserRole {
    ADMIN = "admin",
    BUYER = "buyer",
    AGENT = "agent",
}

@Entity("users")
export class User {
    @PrimaryGeneratedColumn("uuid")
    _id: string;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column()
    phone: string;

    @Column({
        type: "enum",
        enum: UserRole,
        default: UserRole.BUYER,
    })
    role: UserRole;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => City, (city) => city.createdBy)
    cities: City[];

    @OneToMany(() => Area, (area) => area.createdBy)
    areas: Area[];

    @OneToMany(() => Project, (project) => project.createdBy)
    projects: Project[];

    @OneToMany(() => Property, (property) => property.createdBy)
    properties: Property[];
}
