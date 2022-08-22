import "reflect-metadata";
import "module-alias/register";
import "dotenv/config";
import {NestFactory} from "@nestjs/core";
import {NestExpressApplication} from "@nestjs/platform-express";
import {Compiler, webpack} from "webpack";
import * as webpackDevMiddleware from "webpack-dev-middleware";
import * as webpackHotMiddleware from "webpack-hot-middleware";
import * as cookieParser from "cookie-parser";
import {devMode, webpackDevMode, port} from "@config";
import {AppModule} from "./app.module";
import webpackConfig from "./webpack.config";

(async () => {
    const app: NestExpressApplication = await NestFactory.create<NestExpressApplication>(AppModule);
    app.use(cookieParser());
    app.enableShutdownHooks();
    if (devMode && webpackDevMode) {
        const compiler: Compiler = webpack(webpackConfig());
        app.use(webpackDevMiddleware(compiler));
        app.use(webpackHotMiddleware(compiler));
    }
    await app.listen(port);
})();
