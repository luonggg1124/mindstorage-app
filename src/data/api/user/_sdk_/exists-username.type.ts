

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

