import type { ISpaceDetailDto } from "../_dto_";

export type UpdateSpaceRequest = {
  id: string | number;
  body: {
    name: string;
    description?: string;
  };
};

export type UpdateSpaceResponse = {
  201: ISpaceDetailDto;
};

export type UpdateSpaceError = {
  [key: number]: {
    message: string;
    status: number;
    field?: string;
  };
};

