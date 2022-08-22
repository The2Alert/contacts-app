import {Module} from "@nestjs/common";
import {UsersModule} from "./users/users.module";
import {ContactsModule} from "./contacts/contacts.module";

@Module({
    imports: [UsersModule, ContactsModule]
})
export class ApiModule {}
