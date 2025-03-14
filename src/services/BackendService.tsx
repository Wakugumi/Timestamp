import LoggerService from "./LoggerService";
import { DeviceError, ElectronError } from "../helpers/AppError";
import IPCResponse from "../interfaces/IPCResponse";

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
      throw new ElectronError("Electon backend is not exposed");
    }
    await window.electron
      .invoke("camera/status", {})
      .then((response: IPCResponse<object>) => {
        response = new IPCResponse<object>(response);
        if (response.OK) return;
        else if (response.FAILED) throw new DeviceError(response.message);
        else {
          throw new DeviceError(response.message);
        }
      })
      .catch((error: Error) => {
        LoggerService.error(error.message);
        throw error;
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
      .then((response: IPCResponse<object>) => {
        response = new IPCResponse<object>(response);
        if (response.OK) return;
        else {
          throw new DeviceError(response.message);
        }
      })
      .catch((error: Error) => {
        throw new DeviceError("Unknown error @ BackendService | " + error);
      });
  }

  public static async paymentCallback() {
    return window.electron?.on("payment", (queryParams) => {
      return queryParams;
    });
  }

  /**
   * Trigger system call to capture photo
   * @returns {Promise<string>} Returns message as string if resolved, throw error otherwise
   */
  public static async capture(): Promise<string | void> {
    return await window.electron
      ?.invoke("camera/capture")
      .then((response: IPCResponse<object>) => {
        response = new IPCResponse<object>(response);
        if (response.OK) return response.message;
        else {
          throw new DeviceError(response.message);
        }
      })
      .catch((error: Error) => {
        LoggerService.error(error);
        throw new DeviceError(error.message);
      });
  }

  public static async getCaptures() {
    return await window.electron
      ?.invoke("session/get")
      .then((response: IPCResponse<object>) => {
        response = new IPCResponse<object>(response);
        if (response.OK) return response.data;
        else throw new DeviceError(response.message);
      })
      .catch((error: Error) => {
        LoggerService.error(error.message);
        throw new DeviceError("Unknown error @ BackendService" + error);
      });
  }

  /** Send signal to backend runtime to start uploading captures
   * @param {number} count number of captures to be uploaded
   * @returns {string} view page url
   */
  public static async process(count: number, urls: string[]) {
    console.log("Sending upload to backend", count, urls);
    return await window.electron
      ?.invoke("session/process", {
        count: count,
        urls: urls,
      })
      .then((response: IPCResponse<string>) => {
        response = new IPCResponse<string>(response);
        return response.data;
      })
      .catch((error: Error) => {
        throw error;
      });
  }

  /**
   * Reset session, clean up capture files and media, set all indexes to initial value
   * @returns {Promise<string | void>} Returns status message when resolved, otherwise throw error
   */
  public static async resetSession(): Promise<string | void> {
    return await window.electron
      ?.invoke("session/reset")
      .then((response: IPCResponse<object>) => {
        response = new IPCResponse<object>(response);
        if (response.OK) return response.message;
        else throw new DeviceError(response.message);
      })
      .catch((error: Error) => {
        LoggerService.error(error.message);
        throw error;
      });
  }

  public static async sendCanvas(url: string): Promise<void> {
    console.log("Sending canvas url", url);
    return await window.electron?.send("media/save", url);
  }

  public static async print(url: string): Promise<void> {
    return await window.electron.send("media/print", url);
  }
}

export default BackendService;
