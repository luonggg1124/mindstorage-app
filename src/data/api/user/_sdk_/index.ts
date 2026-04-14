import { client } from "@/data/client.config";
import {
  ValidUsernamePasswordError,
  ValidUsernamePasswordRequest,
  ValidUsernamePasswordResponse,
} from "./valid-username-password.type";
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
}


export type * from "./valid-username-password.type";