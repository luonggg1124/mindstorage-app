import { client, safeRequest } from "@/data/client.config";
import type { ApiError } from "@/data/types";
import {
  ValidUsernamePasswordRequest,
  ValidUsernamePasswordResponse,
} from "./valid-username-password.type";
import type { MyProfileResponse } from "./my-profile.type";
import type { SearchUsersRequest, SearchUsersResponse } from "./search.type";
import type {
  SearchInviteUsersRequest,
  SearchInviteUsersResponse,
} from "./search-invite.type";
import apiPaths from "@/paths/api";

export class UserSDK {
  static async validUsernamePassword(request: ValidUsernamePasswordRequest) {
    const response = await safeRequest(() =>
      client.post<
        ValidUsernamePasswordResponse,
        ApiError,
        true
      >({
        url: apiPaths.user.existsUsername.path,
        body: request.body,
        throwOnError: true,
      })
    );
    return response;
  }

  static async myProfile() {
    const response = await safeRequest(() =>
      client.get<MyProfileResponse, ApiError, true>({
        url: apiPaths.user.myProfile.path,
        throwOnError: true,
      })
    );
    return response;
  }

  static async search(request: SearchUsersRequest) {
    const response = await safeRequest(() =>
      client.get<SearchUsersResponse, ApiError, true>({
        url: apiPaths.user.search.getPath(request.query),
        throwOnError: true,
      })
    );
    return response;
  }

  static async searchInvite(request: SearchInviteUsersRequest) {
    const response = await safeRequest(() =>
      client.get<SearchInviteUsersResponse, ApiError, true>({
        url: apiPaths.user.searchInvite.getPath(request.query),
        throwOnError: true,
      })
    );
    return response;
  }
}


export type * from "./valid-username-password.type";
export type * from "./my-profile.type";
export type * from "./search.type";
export type * from "./search-invite.type";