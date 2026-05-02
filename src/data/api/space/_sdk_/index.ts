import { client, safeRequest } from "@/data/client.config";
import type { ApiError } from "@/data/types";
import apiPaths from "@/paths/api";
import type { MySpacesRequest, MySpacesResponse } from "./my-spaces.type";
import type { CreateSpaceRequest, CreateSpaceResponse } from "./create-space.type";
import type { SpaceDetailRequest, SpaceDetailResponse } from "./detail-space.type";
import type { UpdateSpaceRequest, UpdateSpaceResponse } from "./update-space.type";
import type { DeleteSpaceRequest, DeleteSpaceResponse } from "./delete-space.type";
import type { SpaceMembersRequest, SpaceMembersResponse } from "./members.type";


export class SpaceSDK {


    static async mySpaces(request: MySpacesRequest) {
        const response = await safeRequest(() =>
            client.get<MySpacesResponse, ApiError, true>({
                url: apiPaths.space.mySpaces.getPath(request.query),
                throwOnError: true,
            })
        );
        return response;
    }

    static async detail(request: SpaceDetailRequest) {
        const response = await safeRequest(() =>
            client.get<SpaceDetailResponse, ApiError, true>({
                url: apiPaths.space.detail.getPath(request.id),
                throwOnError: true,
            })
        );
        return response;
    }

    static async members(request: SpaceMembersRequest) {
        const response = await safeRequest(() =>
            client.get<SpaceMembersResponse, ApiError, true>({
                url: apiPaths.space.members.getPath(request.params.id, request.query),
                throwOnError: true,
            })
        );
        return response;
    }

    static async create(request: CreateSpaceRequest) {
        const response = await safeRequest(() =>
            client.post<CreateSpaceResponse, ApiError, true>({
                url: apiPaths.space.create.path,
                body: request.body,
                throwOnError: true
            })
        );
        return response;
    }

    static async update(request: UpdateSpaceRequest) {
        const response = await safeRequest(() =>
            client.put<UpdateSpaceResponse, ApiError, true>({
                url: apiPaths.space.update.getPath(request.id),
                body: request.body,
                throwOnError: true,
            })
        );
        return response;
    }

    static async delete(request: DeleteSpaceRequest) {
        const response = await safeRequest(() =>
            client.delete<DeleteSpaceResponse, ApiError, true>({
                url: apiPaths.space.delete.getPath(request.params.id),
                throwOnError: true,
            })
        );
        return response;
    }
 
}

export type * from "./create-space.type";
export type * from "./delete-space.type";
export type * from "./detail-space.type";
export type * from "./members.type";
export type * from "./my-spaces.type";
export type * from "./update-space.type";