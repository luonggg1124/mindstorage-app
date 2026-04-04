import { IUser } from "@/data/models/user";

export type LoginRequest = {
  body: {
    username: string;
    password: string;
  };
};



/** Giống register; hỗ trợ 200 hoặc 201 tùy backend */
export type LoginResponse = {
 
  201: {
    accessToken: string;
    refreshToken: string;
    refreshTokenExpiresIn: number;
    user: IUser;
  };
};

export type LoginError = {
  [key: number]: {
    message: string;
    status: number;
    field?: string;
  };
};
