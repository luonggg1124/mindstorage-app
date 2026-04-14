export type ValidUsernamePasswordRequest = {
  body: {
    username: string;
    password:string;
  };
};

export type ValidUsernamePasswordResponse = {
  200: {
    valid: boolean;
  };
};

export type ValidUsernamePasswordError = {
  [key: number]: {
    message: string;
    status: number;
    field?: string;
  };
};

