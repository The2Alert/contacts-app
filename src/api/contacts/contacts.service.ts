import {Inject, Injectable, StreamableFile} from "@nestjs/common";
import {FindOptionsWhere, Like, Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import * as sharp from "sharp";
import {unlink, writeFile} from "fs/promises";
import validator from "validator";
import {Contact, ContactTypes} from "./entities/contact.entity";
import {AuthInfo, AuthOptions, UsersService} from "../users/users.service";
import {DataService} from "@root/data/data.service";
import {User} from "../users/entities/user.entity";

export class GetPhotoException {
    constructor(public readonly message: string) {}
}

export interface SaveOptions {
    auth: AuthOptions;
    id?: number | null;
    photo: Express.Multer.File | null;
    name: string;
    surname: string;
    contact: string;
}

export class SaveException {
    constructor(public readonly message: string) {}
}

export interface DeleteOptions {
    auth: AuthOptions;
    id: number;
}

export class DeleteException {
    constructor(public readonly message: string) {}
}

@Injectable()
export class ContactsService {
    @Inject(DataService)
    public readonly dataService: DataService;

    @Inject(UsersService)
    public readonly usersService: UsersService;

    @InjectRepository(Contact)
    public readonly contactRepository: Repository<Contact>;

    public async getAll(auth: AuthOptions, query: string | null = null): Promise<Contact[]> {
        const authInfo: AuthInfo = await this.usersService.getAuthInfo(auth);
        if (!authInfo.isAuth || !authInfo.user) return [];
        const user: User = authInfo.user;
        const defaultWhere: FindOptionsWhere<Contact> = {
            user: {
                id: user.id
            }
        };
        let where: FindOptionsWhere<Contact>[];
        if (query !== null) {
            where = [
                {
                    name: Like("%" + query + "%"),
                    ...defaultWhere
                },
                {
                    surname: Like("%" + query + "%"),
                    ...defaultWhere
                },
                {
                    contact: Like("%" + query + "%"),
                    ...defaultWhere
                }
            ];
            const initial: string[] = query.split(" ");
            if (initial.length === 2) {
                where.push({
                    name: Like("%" + initial[0] + "%"),
                    surname: Like("%" + initial[1] + "%"),
                    ...defaultWhere
                });
                where.push({
                    name: Like("%" + initial[1] + "%"),
                    surname: Like("%" + initial[0] + "%"),
                    ...defaultWhere
                });
            }
        } else where = [defaultWhere];
        const contacts: Contact[] = await this.contactRepository.find({
            where,
            relations: {
                user: true
            }
        });
        return contacts;
    }

    public async getPhoto(id: number, auth: AuthOptions): Promise<StreamableFile> {
        const authInfo: AuthInfo = await this.usersService.getAuthInfo(auth);
        if (!authInfo.isAuth || !authInfo.user) throw new GetPhotoException("Access denied.");
        const user: User = authInfo.user;
        const contact: Contact | null = await this.contactRepository.findOne({
            where: {
                id,
                user: {
                    id: user.id
                }
            }
        });
        if (contact === null) throw new GetPhotoException("Not Found.");
        const photo: StreamableFile | null = contact.getPhoto(this.dataService);
        if (photo === null) throw new GetPhotoException("Not Found.");
        return photo;
    }

    public async save({auth, id = null, photo, name, surname, contact: contactPlain}: SaveOptions): Promise<void> {
        if (name === "") throw new SaveException("Enter name.");
        if (contactPlain === "") throw new SaveException("Enter phone number or email.");
        const isEmail: boolean = validator.isEmail(contactPlain);
        const isPhone: boolean = validator.isMobilePhone(contactPlain);
        if (!isEmail && !isPhone) throw new SaveException("Invalid contact.");
        const authInfo: AuthInfo = await this.usersService.getAuthInfo(auth);
        if (!authInfo.isAuth || !authInfo.user) throw new SaveException("Not authorized.");
        const user: User = authInfo.user;
        let type: ContactTypes = ContactTypes.NONE;
        if (isEmail) type = ContactTypes.EMAIL;
        else if (isPhone) type = ContactTypes.PHONE;
        const contact = new Contact();
        if (id !== null) contact.id = id;
        contact.type = type;
        contact.name = name;
        contact.surname = surname;
        contact.contact = contactPlain;
        contact.user = user;
        if (photo !== null) contact.photo = photo.mimetype;
        await this.contactRepository.save(contact);
        if (photo !== null) {
            const content: Buffer = photo.buffer;
            const content180х180: Buffer = await sharp(content).resize(180, 180).toBuffer();
            const path: string = contact.getPhotoPath(this.dataService) as string;
            await writeFile(path, content180х180);
        }
    }

    public async delete({auth, id}: DeleteOptions): Promise<void> {
        const authInfo: AuthInfo = await this.usersService.getAuthInfo(auth);
        if (!authInfo.isAuth || !authInfo.user) throw new DeleteException("Access denied.");
        const user: User = authInfo.user;
        const contact: Contact | null = await this.contactRepository.findOne({
            where: {
                id,
                user: {
                    id: user.id
                }
            }
        });
        if (contact === null) throw new DeleteException("Not Found.");
        const photoPath: string | null = contact.getPhotoPath(this.dataService);
        if (photoPath !== null) await unlink(photoPath);
        await this.contactRepository.remove(contact);
    }
}
