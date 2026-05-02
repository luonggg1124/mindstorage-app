

export type VerifyEmailRequest = {
    body: {
        email: string;
    }
}
export type VerifyEmailResponse = {
    200: {
        session: string;
    }
}
