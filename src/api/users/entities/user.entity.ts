import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import * as sha256 from "sha256";
import {Contact} from "../../contacts/entities/contact.entity";

export interface UserPlain {
    id: number;
    login: string;
}

@Entity("users")
export class User {
    @PrimaryGeneratedColumn()
    public readonly id: number;

    @Column()
    public login: string;

    @Column()
    public password: string;

    @OneToMany(() => Contact, (contact) => contact.user)
    public contacts: Contact[];

    public getAuthToken(): string {
        return sha256(this.login + this.password);
    }

    public toJSON(): UserPlain {
        return {
            id: this.id,
            login: this.login
        };
    }
}
