export type CreateSpaceRequest = {
  body: {
    name: string;
    description: string;
  };
};

export type CreateSpaceResponse = {
  201: {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
  };
};

