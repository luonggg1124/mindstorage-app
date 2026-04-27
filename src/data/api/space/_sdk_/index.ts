import { client } from "@/data/client.config";
import apiPaths from "@/paths/api";
import type { MySpacesError, MySpacesRequest, MySpacesResponse } from "./my-spaces.type";
import type { CreateSpaceError, CreateSpaceRequest, CreateSpaceResponse } from "./create-space.type";
import type { SpaceDetailError, SpaceDetailRequest, SpaceDetailResponse } from "./detail-space.type";
import type { UpdateSpaceError, UpdateSpaceRequest, UpdateSpaceResponse } from "./update-space.type";
import type { DeleteSpaceError, DeleteSpaceRequest, DeleteSpaceResponse } from "./delete-space.type";
import type { SpaceMembersError, SpaceMembersRequest, SpaceMembersResponse } from "./members.type";


export class SpaceSDK {


    static async mySpaces<ThrowOnError extends boolean = false>(request: MySpacesRequest) {
        const response = await client.get<MySpacesResponse, MySpacesError, ThrowOnError>({
            url: apiPaths.space.mySpaces.getPath(request.query),
        });
        return response;
    }

    static async detail<ThrowOnError extends boolean = false>(request: SpaceDetailRequest) {
        const response = await client.get<SpaceDetailResponse, SpaceDetailError, ThrowOnError>({
            url: apiPaths.space.detail.getPath(request.id),
        });
        return response;
    }

    static async members<ThrowOnError extends boolean = false>(request: SpaceMembersRequest) {
        const response = await client.get<SpaceMembersResponse, SpaceMembersError, ThrowOnError>({
            url: apiPaths.space.members.getPath(request.params.id, request.query),
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

    static async update<ThrowOnError extends boolean = false>(request: UpdateSpaceRequest) {
        const response = await client.put<UpdateSpaceResponse, UpdateSpaceError, ThrowOnError>({
            url: apiPaths.space.update.getPath(request.id),
            body: request.body,
        });
        return response;
    }

    static async delete<ThrowOnError extends boolean = false>(request: DeleteSpaceRequest) {
        const response = await client.delete<DeleteSpaceResponse, DeleteSpaceError, ThrowOnError>({
            url: apiPaths.space.delete.getPath(request.params.id),
        });
        return response;
    }
 
}

export type * from "./create-space.type";
export type * from "./delete-space.type";
export type * from "./detail-space.type";
export type * from "./members.type";
export type * from "./my-spaces.type";
export type * from "./update-space.type";