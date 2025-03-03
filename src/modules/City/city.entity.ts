import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToMany } from "typeorm";
import { User } from "../User/user.entity";
import { Area } from "../Area/area.entity";
import { Project } from "../Project/project.entity";
import { Property } from "../Property/property.entity";

@Entity("cities")
export class City {
    @PrimaryGeneratedColumn("uuid")
    _id: string;

    @Column()
    name: string;

    @ManyToOne(() => User, (user) => user.cities, { onDelete: "CASCADE", nullable: false })
    @JoinColumn({ name: "createdBy" })
    createdBy: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({default: false})
    isDeleted: boolean;

    @OneToMany(() => Area, (area) => area.cityId)
    areas: Area[];

    @OneToMany(() => Project, (project) => project.cityId)
    projects: Project[];
    
    @OneToMany(() => Property, (property) => property.cityId)
    properties: Property[];

    
    setId(id:string){
        this._id = id;
        return this;
    }
}
