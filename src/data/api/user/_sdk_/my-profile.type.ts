import type { IMyProfileDto } from "../_dto_";

export type MyProfileRequest = Record<string, never>;

export type MyProfileResponse = {
  200: IMyProfileDto;
};

export type MyProfileError = {
  [key: number]: {
    message: string;
    status: number;
  };
};

