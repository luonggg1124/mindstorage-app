import type { IUser } from "@/data/models/user";

export type LoginRequest = {
  body: {
    username: string;
    password: string;
  };
};

export type LoginResponse = {
  201: {
    refreshTokenExpiresIn: number;
    accessToken: string;
    refreshToken: string;
    user: IUser;
  };
};

