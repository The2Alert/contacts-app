import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Query,
    Req,
    StreamableFile,
    UploadedFile,
    UseInterceptors
} from "@nestjs/common";
import {FileInterceptor} from "@nestjs/platform-express";
import {Request} from "express";
import {AuthOptions} from "../users/users.service";
import {ContactsService, SaveException, DeleteException, GetPhotoException} from "./contacts.service";
import {Contact} from "./entities/contact.entity";

export interface GetPhotoResponse {
    type: "error";
    content: string;
}

export interface CreateResponse {
    type: "error" | "success";
    content: string;
}

export interface CreateDto {
    name?: string;
    surname?: string;
    contact?: string;
}

export interface EditResponse {
    type: "error" | "success";
    content: string;
}

export interface DeleteResponse {
    type: "error" | "success";
    content: string;
}

@Controller("api/contacts")
export class ContactsController {
    constructor(public readonly contactsService: ContactsService) {}

    @Get()
    public getAll(@Req() req: Request, @Query("q") query: string | null = null): Promise<Contact[]> {
        const auth: AuthOptions = {
            id: Number(req.cookies["Auth-Id"] ?? 0),
            token: req.cookies["Auth-Token"] ?? ""
        };
        return this.contactsService.getAll(auth, query);
    }

    @Get(":id/photo")
    public async getPhoto(
        @Req() req: Request,
        @Param("id", new ParseIntPipe()) id: number
    ): Promise<StreamableFile | GetPhotoResponse> {
        const auth: AuthOptions = {
            id: Number(req.cookies["Auth-Id"] ?? 0),
            token: req.cookies["Auth-Token"] ?? ""
        };
        let photo: StreamableFile;
        try {
            photo = await this.contactsService.getPhoto(id, auth);
        } catch (error) {
            if (error instanceof GetPhotoException) {
                return {type: "error", content: error.message};
            } else throw error;
        }
        return photo;
    }

    @Post()
    @UseInterceptors(FileInterceptor("photo"))
    public async create(
        @Req() req: Request,
        @UploadedFile() photo: Express.Multer.File | null = null,
        @Body() body: CreateDto
    ): Promise<CreateResponse> {
        const auth: AuthOptions = {
            id: Number(req.cookies["Auth-Id"] ?? 0),
            token: req.cookies["Auth-Token"] ?? ""
        };
        const name: string = body.name ?? "";
        const surname: string = body.surname ?? "";
        const contact: string = body.contact ?? "";
        try {
            await this.contactsService.save({
                auth,
                photo,
                name,
                surname,
                contact
            });
            return {type: "success", content: ""};
        } catch (error) {
            if (error instanceof SaveException) return {type: "error", content: error.message};
            else throw error;
        }
    }

    @Put(":id")
    @UseInterceptors(FileInterceptor("photo"))
    public async edit(
        @Req() req: Request,
        @Param("id", new ParseIntPipe()) id: number,
        @UploadedFile() photo: Express.Multer.File | null = null,
        @Body() body: CreateDto
    ): Promise<EditResponse> {
        const auth: AuthOptions = {
            id: Number(req.cookies["Auth-Id"] ?? 0),
            token: req.cookies["Auth-Token"] ?? ""
        };
        const name: string = body.name ?? "";
        const surname: string = body.surname ?? "";
        const contact: string = body.contact ?? "";
        try {
            await this.contactsService.save({
                auth,
                id,
                photo,
                name,
                surname,
                contact
            });
            return {type: "success", content: ""};
        } catch (error) {
            if (error instanceof SaveException) return {type: "error", content: error.message};
            else throw error;
        }
    }

    @Delete(":id")
    public async delete(@Req() req: Request, @Param("id", new ParseIntPipe()) id: number): Promise<DeleteResponse> {
        const auth: AuthOptions = {
            id: Number(req.cookies["Auth-Id"] ?? 0),
            token: req.cookies["Auth-Token"] ?? ""
        };
        try {
            await this.contactsService.delete({auth, id});
            return {type: "success", content: ""};
        } catch (error) {
            if (error instanceof DeleteException) return {type: "error", content: error.message};
            else throw error;
        }
    }
}
