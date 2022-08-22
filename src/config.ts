export const devMode: boolean = process.env.NODE_ENV === "development";

export const webpackDevMode: boolean = process.env.WEBPACK_DEV === "1";

export const port: number = Number(process.env.PORT ?? 80);

export const appRootPath: string = process.cwd();

export namespace db {
    export const host: string = process.env.DATABASE_HOST ?? "localhost";

    export const username: string = process.env.DATABASE_USER ?? "root";

    export const password: string = process.env.DATABASE_PASSWORD ?? "qwerty123";

    export const base: string = process.env.DATABASE_BASE ?? "contacts-app";
}
