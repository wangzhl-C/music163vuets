import type { AxiosRequestConfig } from "axios";

export interface ResponseModel<T = any> {
  success: boolean;
  message: string | null;
  code: number | string;
  data: T;
}
export enum HttpCodeConfig {
  success = 200,
  notFound = 404,
  noPermission = 403
}
export interface UploadFileItemModel {
  name: string;
  value: string | Blob;
}
export type UploadRequestConfig = Omit<AxiosRequestConfig, 'url' | 'data'>