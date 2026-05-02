import type { IUser } from "@/data/models/user";


export type RefreshTokenRequest = {
  body: {
    refreshToken: string;
  };
};

export type RefreshTokenResponse = {
  201: {
    refreshTokenExpiresIn: number;
    accessToken: string;
    refreshToken: string;
    user: IUser;
  };
};


