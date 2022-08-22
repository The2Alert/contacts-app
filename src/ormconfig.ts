import {DataSource, DataSourceOptions} from "typeorm";
import {User} from "./api/users/entities/user.entity";
import {Contact} from "./api/contacts/entities/contact.entity";
import {db, devMode} from "./config";

export const ormconfig: DataSourceOptions = {
    type: "mysql",
    host: db.host,
    username: db.username,
    password: db.password,
    database: db.base,
    entities: [User, Contact],
    synchronize: devMode,
    migrations: ["./dist/migrations/*.js"],
    migrationsRun: !devMode
};

export default new DataSource(ormconfig);
