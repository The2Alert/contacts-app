import {Body, Controller, Get, Post, Req, Res} from "@nestjs/common";
import {Request, Response} from "express";
import {UsersService, LoginException, AuthInfo} from "./users.service";

export interface LoginResponse {
    type: "error" | "success";
    content: string;
}

export interface LoginDto {
    login?: string;
    password?: string;
}

export interface LogoutResponse {
    type: "success";
}

@Controller("api/users")
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post("login")
    public async login(@Res({passthrough: true}) res: Response, @Body() body: LoginDto): Promise<LoginResponse> {
        const login: string = body.login ?? "";
        const password: string = body.password ?? "";
        try {
            await this.usersService.login({
                login,
                password,
                onAuth: (id, token) => {
                    res.cookie("Auth-Id", id);
                    res.cookie("Auth-Token", token);
                }
            });
            return {type: "success", content: ""};
        } catch (error) {
            if (error instanceof LoginException) return {type: "error", content: error.message};
            else throw error;
        }
    }

    @Post("logout")
    public logout(@Res({passthrough: true}) res: Response): LogoutResponse {
        res.clearCookie("Auth-Id");
        res.clearCookie("Auth-Token");
        return {type: "success"};
    }

    @Get("auth")
    public getAuthInfo(@Req() req: Request): Promise<AuthInfo> {
        const id: number = Number(req.cookies["Auth-Id"] ?? 0);
        const token: string = req.cookies["Auth-Token"] ?? "";
        return this.usersService.getAuthInfo({id, token});
    }
}
