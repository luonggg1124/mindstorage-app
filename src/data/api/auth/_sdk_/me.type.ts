import type { IUser } from "@/data/models/user";

export type MeResponse = {
  200: IUser;
};

export type MeError = {
  [key: number]: {
    message: string;
    status: number;
    field?: string;
  };
};
