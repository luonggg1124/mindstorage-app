export type DeleteGroupRequest = {
  params: {
    id: string | number;
  };
};

export type DeleteGroupResponse = {
  204: void;
};

export type DeleteGroupError = {
  [key: number]: {
    message: string;
    status: number;
    field?: string;
  };
};

