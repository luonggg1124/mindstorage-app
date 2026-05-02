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



