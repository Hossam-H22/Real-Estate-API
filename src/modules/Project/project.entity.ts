import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToMany, JoinColumn } from "typeorm";
import { Area } from "../Area/area.entity";
import { User } from "../User/user.entity";
import { Property } from "../Property/property.entity";


@Entity("projects")
export class Project {
    @PrimaryGeneratedColumn("uuid")
    _id: string;

    @Column()
    name: string;

    @Column({ type: "text" })
    description: string;

    @ManyToOne(() => Area, (area) => area.projects, { onDelete: "CASCADE" })
    @JoinColumn({ name: "areaId" })
    areaId: Area;

    @ManyToOne(() => User, (user) => user.projects, { onDelete: "CASCADE" })
    @JoinColumn({ name: "createdBy" })
    createdBy: User;

    @OneToMany(() => Property, (property) => property.projectId)
    properties: Property[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
