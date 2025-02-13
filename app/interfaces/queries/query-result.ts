export interface QueryResult<T = unknown> {
  isSuccess: boolean;
  errorMessage?: string;
  data?: T;
}
