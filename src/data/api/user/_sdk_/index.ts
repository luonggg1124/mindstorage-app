import { client } from "@/data/client.config";
import {
  ValidUsernamePasswordError,
  ValidUsernamePasswordRequest,
  ValidUsernamePasswordResponse,
} from "./valid-username-password.type";
import type { MyProfileError, MyProfileResponse } from "./my-profile.type";
import type { SearchUsersError, SearchUsersRequest, SearchUsersResponse } from "./search.type";
import type {
  SearchInviteUsersError,
  SearchInviteUsersRequest,
  SearchInviteUsersResponse,
} from "./search-invite.type";
import apiPaths from "@/paths/api";

export class UserSDK {
  static async validUsernamePassword<ThrowOnError extends boolean = false>(
    request: ValidUsernamePasswordRequest
  ) {
    const response = await client.post<
      ValidUsernamePasswordResponse,
      ValidUsernamePasswordError,
      ThrowOnError
    >({
      url: apiPaths.user.existsUsername.path,
      body: request.body,
    });
    return response;
  }

  static async myProfile<ThrowOnError extends boolean = false>() {
    const response = await client.get<MyProfileResponse, MyProfileError, ThrowOnError>({
      url: apiPaths.user.myProfile.path,
    });
    return response;
  }

  static async search<ThrowOnError extends boolean = false>(request: SearchUsersRequest) {
    const response = await client.get<SearchUsersResponse, SearchUsersError, ThrowOnError>({
      url: apiPaths.user.search.getPath(request.query),
    });
    return response;
  }

  static async searchInvite<ThrowOnError extends boolean = false>(request: SearchInviteUsersRequest) {
    const response = await client.get<SearchInviteUsersResponse, SearchInviteUsersError, ThrowOnError>({
      url: apiPaths.user.searchInvite.getPath(request.query),
    });
    return response;
  }
}


export type * from "./valid-username-password.type";
export type * from "./my-profile.type";
export type * from "./search.type";
export type * from "./search-invite.type";