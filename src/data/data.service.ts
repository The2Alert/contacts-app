import {Injectable, OnModuleInit} from "@nestjs/common";
import {join} from "path";
import {pathExists, mkdir} from "fs-extra";

@Injectable()
export class DataService implements OnModuleInit {
    public getPath(): string {
        return join(process.cwd(), "./data");
    }

    public getContactsPathByPath(path: string): string {
        return join(path, "./contacts");
    }

    public getContactsPath(): string {
        return this.getContactsPathByPath(this.getPath());
    }

    public async onModuleInit(): Promise<void> {
        let path: string = this.getPath();
        if (!(await pathExists(path))) await mkdir(path);
        path = this.getContactsPathByPath(path);
        if (!(await pathExists(path))) await mkdir(path);
    }
}
