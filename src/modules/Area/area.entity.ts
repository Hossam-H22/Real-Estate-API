import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToMany } from "typeorm";
import { City } from "../City/city.entity";
import { User } from "../User/user.entity";
import { Project } from "../Project/project.entity";

@Entity("areas")
export class Area {
    @PrimaryGeneratedColumn("uuid")
    _id: string;

    @Column()
    name: string;

    @ManyToOne(() => City, (city) => city.areas, { onDelete: "CASCADE" })
    @JoinColumn({ name: "cityId" })
    cityId: City;

    @ManyToOne(() => User, (user) => user.areas, { onDelete: "CASCADE" })
    @JoinColumn({ name: "createdBy" })
    createdBy: User;

    @OneToMany(() => Project, (project) => project.areaId)
    projects: Project[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
