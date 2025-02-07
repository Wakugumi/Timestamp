import LoggerService from "./LoggerService";
import { DeviceError } from "../helpers/AppError";
import IPCResponse from "../interfaces/IPCResponse";

class BackendService {
  /**
   * Setup camera availability by checkin status to backend
   * @returns {Promise<void | string>}
   */
  public static async setup() {
    await window.electron
      .invoke("camera/status", {})
      .then((response: IPCResponse<object>) => {
        if (response.OK) return;
        else if (response.FAILED) throw new DeviceError(response.message);
        else {
          throw new DeviceError(response.message);
        }
      })
      .catch((error: Error) => {
        LoggerService.error(error.message);
        throw new DeviceError("Unknown error @ BackendService" + error);
      });
  }

  public static async checkup() {
    await window.electron
      .invoke("camera/checkup", {})
      .then((response: IPCResponse<object>) => {
        if (response.OK) return;
        else {
          throw new DeviceError(response.message);
        }
      })
      .catch((error: Error) => {
        LoggerService.error(error.message);
        throw new DeviceError("Unknown error @ BackendService" + error);
      });
  }
}

export default BackendService;
