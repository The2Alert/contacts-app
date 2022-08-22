export interface User {
    id: number;
    login: string;
}

export interface AuthInfo {
    isAuth: boolean;
    user: User | null;
}

export interface GlobalStore {
    auth: AuthInfo;
}
