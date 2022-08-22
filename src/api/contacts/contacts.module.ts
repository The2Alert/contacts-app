import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {DataModule} from "@root/data/data.module";
import {UsersModule} from "../users/users.module";
import {ContactsController} from "./contacts.controller";
import {ContactsService} from "./contacts.service";
import {Contact} from "./entities/contact.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Contact]), UsersModule, DataModule],
    controllers: [ContactsController],
    providers: [ContactsService]
})
export class ContactsModule {}
