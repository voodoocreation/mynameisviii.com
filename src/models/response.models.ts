import { ServerError } from "../services/configureHttpClient";

export interface ISuccess<Data> {
  readonly ok: true;
  readonly data: Data;
}

export interface IFailure {
  readonly ok: false;
  readonly message: string;
  readonly data?: any;
}

export type TResponse<Data> = ISuccess<Data> & IFailure;

export const success = <T>(data: T): ISuccess<T> => ({ data, ok: true });

export const failure = (error: ServerError | Error | string): IFailure => {
  const response: any = { ok: false };
  if (typeof error === "string") {
    response.message = error;
  } else {
    response.message = error.message;

    if ((error as ServerError).data !== undefined) {
      response.data = (error as ServerError).data;
    }
  }

  return response;
};
