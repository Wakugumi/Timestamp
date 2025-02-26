import LoggerService from "./LoggerService";
import { DeviceError, ElectronError } from "../helpers/AppError";
import IPCResponse, { IIpcResponse } from "../interfaces/IPCResponse";

/**
 * Set of functions to invoke processes in backend runtime
 *
 */
class BackendService {
  /**
   * Setup camera availability by checkin status to backend
   * @returns {Promise<void | string>}
   */
  public static async setup(): Promise<void | string> {
    if (window.electron === undefined) {
      console.error("Electron error");
      throw new ElectronError("Electon backend is not exposed");
    }
    await window.electron
      .invoke("camera/status", {})
      .then((response: IPCResponse<Object>) => {
        response = new IPCResponse<Object>(response);
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

  /**
   * Checks camera functions such as captures.
   * May last more than 10 seconds.
   * If everything went right, the function finish safely without any return, otherwise error is thrown
   * @returns {Promise<void>}
   */
  public static async checkup(): Promise<void> {
    if (window.electron === undefined)
      throw new ElectronError("Electon backend is not exposed");
    await window.electron
      .invoke("camera/checkup", {})
      .then((response: IPCResponse<Object>) => {
        response = new IPCResponse<Object>(response);
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
    return window.electron?.on("payment", (queryParams) => {
      console.log("Retrieve event from electron", queryParams);
      return queryParams;
    });
  }

  /**
   * Trigger system call to capture photo
   * @returns {Promise<void>} throw error otherwise
   */
  public static async capture() {
    await window.electron
      ?.invoke("camera/capture", {})
      .then((response: IPCResponse<Object>) => {
        response = new IPCResponse<Object>(response);
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

  public static async getCaptures() {
    return window.electron
      ?.invoke("session/get")
      .then((response: IPCResponse<Object>) => {
        response = new IPCResponse<Object>(response);
        if (response.OK) return response.data;
        else throw new DeviceError(response.message);
      })
      .catch((error: Error) => {
        LoggerService.error(error.message);
        throw new DeviceError("Unknown error @ BackendService" + error);
      });
  }
}

export default BackendService;
