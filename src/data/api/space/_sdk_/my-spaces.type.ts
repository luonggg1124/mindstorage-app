import { IMySpaceDto } from "../_dto_/my-space.dto";


export type MySpacesResponse = {
    200: IMySpaceDto[];
}
export type MySpacesError = {
    [key: number]: {
        message: string;
        status:number;
    }
}