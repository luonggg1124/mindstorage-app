export interface IPageResponse<T> {
  data: T[];
  total: number;
  page: number;
  size: number;
}

