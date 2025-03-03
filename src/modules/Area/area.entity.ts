import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToMany } from "typeorm";
import { City } from "../City/city.entity";
import { User } from "../User/user.entity";
import { Project } from "../Project/project.entity";
import { Property } from "../Property/property.entity";

@Entity("areas")
export class Area {
    
    @PrimaryGeneratedColumn("uuid")
    _id: string;

    @Column()
    name: string;

    @ManyToOne(() => City, (city) => city.areas, { onDelete: "CASCADE", nullable: false })
    @JoinColumn({ name: "cityId" })
    cityId: City;

    @ManyToOne(() => User, (user) => user.areas, { onDelete: "CASCADE", nullable: false })
    @JoinColumn({ name: "createdBy" })
    createdBy: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({default: false})
    isDeleted: boolean;

    @OneToMany(() => Project, (project) => project.areaId)
    projects: Project[];

    @OneToMany(() => Property, (property) => property.areaId)
    properties: Property[];


    setId(id:string){
        this._id = id;
        return this;
    }

    copy({_id, name, createdAt, createdBy, updatedAt, cityId, isDeleted=false, properties, projects}:Partial<Area>){
        if(_id) this._id = _id
        if(name) this.name = name
        if(createdAt) this.createdAt = createdAt
        if(createdBy) this.createdBy = createdBy
        if(cityId) this.cityId = cityId
        if(updatedAt) this.updatedAt = updatedAt
        if(projects) this.projects = projects
        if(properties) this.properties = properties
        this.isDeleted = isDeleted
        return this;
    }
}
