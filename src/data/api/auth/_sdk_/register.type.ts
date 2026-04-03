

export type RegisterRequest = {
    body: {
        email: string;
        username: string;
        password: string;
        session: string;
        code: string;
        fullName: string;
        hobbies: string[];

    }
}

export type RegisterResponse = {
    201: {
        accessToken: string;
        refreshToken: string;
        refreshTokenExpiresIn: number;
    }
}
export type RegisterError = {
    [key: number]: {
        message: string;
        status: number;
        field?: string;
    }
}