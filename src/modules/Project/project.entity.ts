import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToMany, JoinColumn } from "typeorm";
import { Area } from "../Area/area.entity";
import { User } from "../User/user.entity";
import { Property } from "../Property/property.entity";
import { City } from "../City/city.entity";


@Entity("projects")
export class Project {
    @PrimaryGeneratedColumn("uuid")
    _id: string;

    @Column()
    name: string;

    @Column({ type: "text" })
    description: string;

    @ManyToOne(() => Area, (area) => area.projects, { onDelete: "CASCADE", nullable: false })
    @JoinColumn({ name: "areaId" })
    areaId: Area;
    
    @ManyToOne(() => City, (city) => city.projects, { onDelete: "CASCADE", nullable: false })
    @JoinColumn({ name: "cityId" })
    cityId: City;

    @ManyToOne(() => User, (user) => user.projects, { onDelete: "CASCADE", nullable: false })
    @JoinColumn({ name: "createdBy" })
    createdBy: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({default: false})
    isDeleted: boolean;

    @OneToMany(() => Property, (property) => property.projectId)
    properties: Property[];

    setId(id:string){
        this._id = id;
        return this;
    }

    copy({_id, name, description, createdAt, createdBy, updatedAt, areaId, cityId, isDeleted, properties}:Partial<Project>){
        if(_id) this._id = _id
        if(name) this.name = name
        if(description) this.description = description
        if(createdAt) this.createdAt = createdAt
        if(createdBy) this.createdBy = createdBy
        if(cityId) this.cityId = cityId
        if(updatedAt) this.updatedAt = updatedAt
        if(isDeleted) this.isDeleted = isDeleted
        if(areaId) this.areaId = areaId
        if(properties) this.properties = properties
        return this;
    }
}
