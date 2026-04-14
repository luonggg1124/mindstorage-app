import { IDetailGroupDto } from "../_dto_/detail-group.dto";


export type GroupDetailRequest = {
  params: {
    id:number;
  }
};

export type GroupDetailResponse = {
  200: IDetailGroupDto;
};

export type GroupDetailError = {
  [key: number]: {
    message: string;
    status: number;
  };
};

