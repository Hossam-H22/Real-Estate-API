import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn, OneToMany } from "typeorm";
import { User } from "../User/user.entity";
import { Area } from "../Area/area.entity";

@Entity("cities")
export class City {
    @PrimaryGeneratedColumn("uuid")
    _id: string;

    @Column()
    name: string;

    // @Column()
    // country: string;

    @OneToMany(() => Area, (area) => area.cityId)
    areas: Area[];

    @ManyToOne(() => User, (user) => user.cities, { onDelete: "CASCADE" })
    @JoinColumn({ name: "createdBy" })
    createdBy: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
