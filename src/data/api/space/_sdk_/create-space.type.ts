export type CreateSpaceRequest = {
  body: {
    name: string;
    description: string;
  };
};

export type CreateSpaceResponse = {
  201: {
    id: number;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
  };
};

export type CreateSpaceError = {
  [key: number]: {
    message: string;
    status: number;
    field?: string;
  };
};

