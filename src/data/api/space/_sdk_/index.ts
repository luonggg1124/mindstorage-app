import { client } from "@/data/client.config";
import apiPaths from "@/paths/api";
import type { MySpacesError, MySpacesResponse } from "./my-spaces.type";
import type { CreateSpaceError, CreateSpaceRequest, CreateSpaceResponse } from "./create-space.type";
import type { SpaceDetailError, SpaceDetailRequest, SpaceDetailResponse } from "./detail-space.type";


export class SpaceSDK {


    static async mySpaces<ThrowOnError extends boolean = false>() {
        const response = await client.get<MySpacesResponse, MySpacesError, ThrowOnError>({
            url: apiPaths.space.mySpaces.path
        });
        return response;
    }

    static async detail<ThrowOnError extends boolean = false>(request: SpaceDetailRequest) {
        const response = await client.get<SpaceDetailResponse, SpaceDetailError, ThrowOnError>({
            url: apiPaths.space.detail.getPath(request.id),
        });
        return response;
    }

    static async create<ThrowOnError extends boolean = false>(request: CreateSpaceRequest) {
        const response = await client.post<CreateSpaceResponse, CreateSpaceError, ThrowOnError>({
            url: apiPaths.space.create.path,
            body: request.body,
        });
        return response;
    }
 
}