export type UpdateSpaceRequest = {
  id: string | number;
  body: {
    name: string;
    description?: string;
  };
};

export type UpdateSpaceResponse = {
  201: {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
  };
};

