import { DeviceError } from "../helpers/AppError";

enum StatusCode {
  OK = 0,
  FAILED = 1,
  TIMEOUT = 2,
  ERROR = 3,
}

export default class IPCResponse<T> {
  status: StatusCode;
  message: string;
  data?: T | null;
  headers?: object;

  constructor(
    status: StatusCode,
    message: string,
    data: T | null = null,
    headers: object = {},
  ) {
    this.status = status;
    this.message = message;
    this.data = data;
    this.headers = headers;
  }

  get STATUS() {
    return this.status;
  }
  get OK() {
    return this.status === StatusCode.OK;
  }

  get FAILED() {
    return this.status === StatusCode.FAILED;
  }

  get TIMEOUT() {
    return this.status === StatusCode.TIMEOUT;
  }

  get ERROR() {
    return this.status === StatusCode.ERROR;
  }
}
