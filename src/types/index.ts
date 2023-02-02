import { AxiosResponseHeaders } from 'axios';

export interface IResponseList<T> {
  data: T[];
  pagination: IPagination;
}

export interface IPagination {
  current: number;
  last: number;
  items: number;
}

export type IAxiosResponseHeaders =
  | AxiosResponseHeaders
  | Partial<Record<string, string> & { 'set-cookie'?: string[] | undefined }>;
