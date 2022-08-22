import {Injectable, OnModuleInit} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import * as sha256 from "sha256";
import {Repository} from "typeorm";
import {User} from "./entities/user.entity";

export interface LoginOptions {
    login: string;
    password: string;
    onAuth?: (id: number, token: string) => any;
}

export class LoginException {
    constructor(public readonly message: string) {}
}

export interface AuthInfo {
    isAuth: boolean;
    user: User | null;
}

export interface AuthOptions {
    id: number;
    token: string;
}

@Injectable()
export class UsersService implements OnModuleInit {
    @InjectRepository(User)
    private readonly userRepository: Repository<User>;

    public async onModuleInit(): Promise<void> {
        const count: number = await this.userRepository.count();
        if (count === 0) {
            let user = new User();
            user.login = "login";
            user.password = sha256("qwerty123");
            await this.userRepository.insert(user);
            user = new User();
            user.login = "dev2alert";
            user.password = sha256("0000");
            await this.userRepository.insert(user);
            user = new User();
            user.login = "artem";
            user.password = sha256("123456");
            await this.userRepository.insert(user);
        }
    }

    public async login({login, password, onAuth}: LoginOptions): Promise<void> {
        if (login === "") throw new LoginException("Enter login.");
        if (password === "") throw new LoginException("Enter password.");
        const user: User | null = await this.userRepository.findOne({
            where: {
                login,
                password: sha256(password)
            }
        });
        if (user === null) throw new LoginException("Invalid username or password.");
        const id: number = user.id;
        const token: string = user.getAuthToken();
        onAuth?.(id, token);
    }

    public async getAuthInfo({id, token}: AuthOptions): Promise<AuthInfo> {
        if (id === 0 || token === "") return {isAuth: false, user: null};
        const user: User | null = await this.userRepository.findOne({
            where: {id}
        });
        if (user === null) return {isAuth: false, user: null};
        const userToken: string = user.getAuthToken();
        if (token !== userToken) return {isAuth: false, user: null};
        return {isAuth: true, user};
    }
}
