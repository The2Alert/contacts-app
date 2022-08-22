import {Module} from "@nestjs/common";
import {ServeStaticModule} from "@nestjs/serve-static";
import {join} from "path";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ormconfig} from "./ormconfig";
import {appRootPath} from "@config";
import {AppController} from "./app.controller";
import {AppService} from "./app.service";
import {ApiModule} from "./api/api.module";
import {DataModule} from "./data/data.module";

@Module({
    imports: [
        ServeStaticModule.forRoot({
            rootPath: join(appRootPath, "./public")
        }),
        TypeOrmModule.forRoot({
            ...ormconfig,
            autoLoadEntities: true
        }),
        DataModule,
        ApiModule
    ],
    providers: [AppService],
    controllers: [AppController]
})
export class AppModule {}
