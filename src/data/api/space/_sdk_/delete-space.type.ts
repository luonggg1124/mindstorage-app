export type DeleteSpaceRequest = {
  params: {
    id: string | number;
  };
};

export type DeleteSpaceResponse = {
  204: void;
};

export type DeleteSpaceError = {
  [key: number]: {
    message: string;
    status: number;
    field?: string;
  };
};

