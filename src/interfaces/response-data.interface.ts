export interface ResponseDataInterface<T> {
  success: boolean;
  messages: { msg: string; path?: string }[];
  data?: T;
}
