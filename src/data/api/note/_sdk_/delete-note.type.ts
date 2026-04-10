export type DeleteNoteRequest = {
  params: {
    id: string | number;
  };
};

export type DeleteNoteResponse = {
  204: void;
};

export type DeleteNoteError = {
  [key: number]: {
    message: string;
    status: number;
    field?: string;
  };
};

