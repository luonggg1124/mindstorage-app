export type UpdateSpaceRequest = {
  id: string | number;
  body: {
    name: string;
    description?: string;
  };
};

export type UpdateSpaceResponse = {
  201: {
    id: number;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
  };
};

export type UpdateSpaceError = {
  [key: number]: {
    message: string;
    status: number;
    field?: string;
  };
};

