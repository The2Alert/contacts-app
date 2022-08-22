import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {getExtension} from "mime";
import {join} from "path";
import {StreamableFile} from "@nestjs/common";
import {createReadStream, ReadStream} from "fs";
import {DataService} from "@root/data/data.service";
import {User} from "../../users/entities/user.entity";

export enum ContactTypes {
    NONE,
    EMAIL,
    PHONE
}

export interface ContactPlain {
    id: number;
    type: ContactTypes;
    photo: string | null;
    name: string;
    surname: string;
    contact: string;
    userId: number;
}

@Entity("contacts")
export class Contact {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public type: ContactTypes;

    @Column({default: ""})
    public photo: string;

    @Column()
    public name: string;

    @Column()
    public surname: string;

    @Column()
    public contact: string;

    @ManyToOne(() => User, (user) => user.contacts)
    public user: User;

    public getPhotoURL(): string | null {
        if (this.photo === "") return null;
        return "/api/contacts/" + this.id + "/photo";
    }

    public getPhotoPath(dataService: DataService): string | null {
        if (this.photo === "") return null;
        const ext: string = getExtension(this.photo) ?? "image/png";
        const path: string = join(dataService.getContactsPath(), "./contact-" + this.id + "-photo-180х180." + ext);
        return path;
    }

    public getPhoto(dataService: DataService): StreamableFile | null {
        const path: string | null = this.getPhotoPath(dataService);
        if (path === null) return null;
        const stream: ReadStream = createReadStream(path);
        const type: string = this.photo;
        return new StreamableFile(stream, {type});
    }

    public toJSON(): ContactPlain {
        const {id, type, name, surname, contact} = this;
        const photo: string | null = this.getPhotoURL();
        const userId: number = this.user.id;
        return {id, type, photo, name, surname, contact, userId};
    }
}
