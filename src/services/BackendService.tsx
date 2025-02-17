import LoggerService from "./LoggerService";
import { DeviceError, ElectronError } from "../helpers/AppError";
import IPCResponse from "../interfaces/IPCResponse";

class BackendService {
  /**
   * Setup camera availability by checkin status to backend
   * @returns {Promise<void | string>}
   */
  public static async setup() {
    if (window.electron === undefined) {
      console.error("Electron error");
      throw new ElectronError("Electon backend is not exposed");
    }
    await window.electron
      .invoke("camera/status", {})
      .then((response: IPCResponse<object>) => {
        console.log(response.status);
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
    if (window.electron === undefined)
      throw new ElectronError("Electon backend is not exposed");
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

  public static async paymentCallback() {
    if (window.electron === undefined) {
      throw new DeviceError("Electron API is not exposed");
    }

    return await window.electron?.on("payment", (queryParams) => {
      return queryParams;
    });
  }
}

export default BackendService;
