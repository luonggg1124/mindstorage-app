import { IDetailGroupDto } from "../_dto_/detail-group.dto";


export type GroupDetailRequest = {
  params: {
    id: string;
  }
};

export type GroupDetailResponse = {
  200: IDetailGroupDto;
};

