import { client } from "@/data/client.config";
import { VerifyEmailError, VerifyEmailRequest, VerifyEmailResponse } from "./verify-email.type";
import apiPaths from "@/paths/api";
import { LoginError, LoginRequest, LoginResponse } from "./login.type";
import { RegisterError, RegisterRequest, RegisterResponse } from "./register.type";
import { MeError, MeResponse } from "./me.type";
import { RefreshTokenError, RefreshTokenRequest, RefreshTokenResponse } from "./refresh-token.type";

export class AuthSDK {
    static async verifyEmail<ThrowOnError extends boolean = false>(request:VerifyEmailRequest){
        const response = await client.post<VerifyEmailResponse, VerifyEmailError, ThrowOnError>({
            url: apiPaths.auth.verifyEmail.getPath(),
            body: request.body
        })
        return response;
    }
    static async register<ThrowOnError extends boolean = false>(request: RegisterRequest){
        const response = await client.post<RegisterResponse, RegisterError, ThrowOnError>({
            url: apiPaths.auth.register.getPath(),
            body: request.body
        })
        return response;
    }
    static async login<ThrowOnError extends boolean = false>(request: LoginRequest) {
        const response = await client.post<LoginResponse, LoginError, ThrowOnError>({
            url: apiPaths.auth.login.getPath(),
            body: request.body,
        });
        return response;
    }

    static async me<ThrowOnError extends boolean = false>() {
        const response = await client.get<MeResponse, MeError, ThrowOnError>({
            url: apiPaths.auth.me.getPath(),
        });
        return response;
    }

    static async refreshToken<ThrowOnError extends boolean = false>(request: RefreshTokenRequest) {
        const response = await client.post<RefreshTokenResponse, RefreshTokenError, ThrowOnError>({
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