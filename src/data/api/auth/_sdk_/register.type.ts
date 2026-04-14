import type { IUser } from "@/data/models/user";

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
  };
};

export type RegisterResponse = {
  201: {
    refreshTokenExpiresIn: number;
    accessToken: string;
    refreshToken: string;
    user: IUser;
  };
};

export type RegisterError = {
  [key: number]: {
    message: string;
    status: number;
    field?: string;
  };
};
