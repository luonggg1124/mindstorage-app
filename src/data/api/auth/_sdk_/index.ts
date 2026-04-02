import { client } from "@/data/client.config";
import { VerifyEmailError, VerifyEmailRequest, VerifyEmailResponse } from "./verify-email.type";
import apiPaths from "@/paths/api";


export class AuthSDK {
    static async verifyEmail<ThrowOnError extends boolean = false>(request:VerifyEmailRequest){
        const response = await client.post<VerifyEmailResponse, VerifyEmailError, ThrowOnError>({
            url: apiPaths.auth.verifyEmail.getPath(),
            body: request.body
        })
        return response;
    }
}