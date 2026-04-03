

export type ExistsUsernameRequest = {
    body: {
        username: string;
    }
}

export type ExistsUsernameResponse = {
    200: {
        exists: boolean;
    }
}

export type ExistsUsernameError = {
    [key: number]: {
        message: string;
        status: number;
        field?: string;
    }
}