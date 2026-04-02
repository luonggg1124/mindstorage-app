export type PathDisplay = {
    sidebar: boolean;
    search: boolean;
  };
  
  export type Queries = Record<string, string | number | boolean>;
  
  export type Route<
    P extends object | undefined = undefined,
    Children extends Record<string, Route<any, any>> | undefined = undefined
  > = {
    title: string;
    path: string;
    getPath: (params: P, queries?: Queries) => string;
    tags?: string[];
    display: {
      sidebar: boolean;
      search: boolean;
    };
    permission?: string | string[];
    children?: Children;
  };
  
  export function defineRoute<T extends Route<any, any>>(route: T): T {
    return route;
  }
  
  export type BasePathItem = Route;
  
  export type PathItem = BasePathItem;
  
  export type PathGroup = {
    base: BasePathItem;
    [key: string]: PathItem;
  };
  export function buildQueryString(
    params?: Record<string, string | number | boolean>
  ): string {
    if (!params || Object.keys(params).length === 0) {
      return "";
    }
  
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
  
    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : "";
  }