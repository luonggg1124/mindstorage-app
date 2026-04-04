import { IUser } from "@/data/models/user";


export type RegisterRequest = {
    body: {
        email: string;
        username: string;
        password: string;
        session: string;
        code: string;
        fullName: string;
        hobbies: string;
        intendedUse: string;
    }
}

export type RegisterResponse = {
    201: {
        accessToken: string;
        refreshToken: string;
        refreshTokenExpiresIn: number;
        user: IUser;
    }
}
export type RegisterError = {
    [key: number]: {
        message: string;
        status: number;
        field?: string;
    }
}