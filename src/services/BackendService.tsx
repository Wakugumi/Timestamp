import axios from "axios";
import LoggerService from "./LoggerService";
import { DeviceError } from "../helpers/AppError";
import IPCResponse from "../interfaces/IPCResponse";

const BASE_URL = "http://localhost:3000/v1";
interface Payload {
  message: string;
  error?: string;
}
const api = axios.create({
  baseURL: BASE_URL,
});

class BackendService {
  /**
   * Setup camera availability by checkin status to backend
   * @returns {Promise<void | string>}
   */
  public static async setup() {
    try {
      const response: IPCResponse<object> = await window.electron.invoke(
        "camera/status",
        {},
      );
      console.log(response);
      if (response.OK) return;
      if (response.FAILED) throw new DeviceError(response.message);
    } catch (error) {
      LoggerService.error(
        error?.technicalMessage ? error?.technicalMessage : (error as string),
      );
      throw new DeviceError("Unknown error @ BackendService | " + error);
    }
  }

  public static async checkup() {
    await api
      .get<Payload>("checkup")
      .then((response) => {
        if (response.data.message === "ok") {
          return Promise.resolve();
        }
      })
      .catch((reason) => {
        LoggerService.error(reason);
        return new DeviceError(reason);
      });
  }

  public static async startStream() {
    await api
      .get<Payload>("stream/start")
      .then((response) => {
        if (response.data.message === "ready") {
          return;
        }
      })
      .catch((reason) => {
        LoggerService.error(reason);
        throw new DeviceError(reason);
      });
  }

  public static async stopStream() {
    api
      .get<Payload>("stream/stop")
      .then((response) => {
        if (response.data.message === "ok") {
          return Promise.resolve();
        }
      })
      .catch((reason) => {
        LoggerService.error(reason);
        return Promise.reject(reason);
      });
  }
}

export default BackendService;
