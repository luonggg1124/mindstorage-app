import { client, safeRequest } from "@/data/client.config";
import type { ApiError } from "@/data/types";
import { VerifyEmailRequest, VerifyEmailResponse } from "./verify-email.type";
import apiPaths from "@/paths/api";
import { LoginRequest, LoginResponse } from "./login.type";
import { RegisterRequest, RegisterResponse } from "./register.type";
import { MeResponse } from "./me.type";
import { RefreshTokenRequest, RefreshTokenResponse } from "./refresh-token.type";

export class AuthSDK {
    static async verifyEmail<ThrowOnError extends boolean = false>(request:VerifyEmailRequest){
        const response = await client.post<VerifyEmailResponse, ApiError, ThrowOnError>({
            url: apiPaths.auth.verifyEmail.getPath(),
            body: request.body
        })
        return response;
    }
    static async register<ThrowOnError extends boolean = false>(request: RegisterRequest){
        const response = await client.post<RegisterResponse, ApiError, ThrowOnError>({
            url: apiPaths.auth.register.getPath(),
            body: request.body
        })
        return response;
    }
    static async login<ThrowOnError extends boolean = false>(request: LoginRequest) {
        const response = await client.post<LoginResponse, ApiError, ThrowOnError>({
            url: apiPaths.auth.login.getPath(),
            body: request.body,
        });
        return response;
    }

    static async me() {
        const response = safeRequest(() => client.get<MeResponse, ApiError, true>({
            url: apiPaths.auth.me.getPath(),
            throwOnError: true,
        }));
        return response;
    }

    static async refreshToken<ThrowOnError extends boolean = false>(request: RefreshTokenRequest) {
        const response = await client.post<RefreshTokenResponse, ApiError, ThrowOnError>({
            url: apiPaths.auth.refreshToken.getPath(),
            body: request.body,
        });
        return response;
    }
}

export type * from "./verify-email.type";
export type * from "./register.type";
export type * from "./login.type";
export type * from "./me.type";
export type * from "./refresh-token.type";