export type ApiErrorItem = {
  message: string;
  status: number;
  field?: string;
};

/**
 * API error payload returned by backend (map by http status).
 * Used for SDK layer generics.
 */
export type ApiError = {
  [key: number]: ApiErrorItem;
};



