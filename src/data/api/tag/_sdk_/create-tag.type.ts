

export type CreateTagRequest = {
  body: {
    name: string;
    groupId: number;
  };
};

export type CreateTagResponse = {
  201: {
    id: number;
    name: string;
    groupId: number;
    createdAt: string;
    updatedAt: string;
  };
};

export type CreateTagError = {
  [key: number]: {
    message: string;
    status: number;
    field?: string;
  };
};

