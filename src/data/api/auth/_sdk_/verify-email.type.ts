

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
export type VerifyEmailError = {
    [key: number]: {
        field?: string;
        status: number;
        message: string;
    }
}