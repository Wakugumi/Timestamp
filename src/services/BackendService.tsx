import LoggerService from "./LoggerService";
import { DeviceError, ElectronError } from "../helpers/AppError";
import IPCResponse from "../interfaces/IPCResponse";
import PaymentCallback from "../interfaces/PaymentCallback";
import Frame from "../interfaces/Frame";
import { Session } from "../interfaces/Session";

interface SessionStartResponse {
  phase: number;
}

/**
 * Set of functions to invoke processes in backend runtime
 *
 */
class BackendService {
  /** To be calld on beginning of a session
   *  @return {Promise<void | number>} if a interrupted phase happens before the component subtree mounts, returns the number of that phase
   */
  public static async start(): Promise<Session | void> {
    return await window.electron
      .invoke("session/begin")
      .then((response: IPCResponse<Session>) => {
        console.log(response.data);
        response = new IPCResponse<Session>(response);
        return response.data;
      })
      .catch((error: Error) => {
        throw error;
      });
  }

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

  /** send signal to Electron process to increment phase number in current session */
  public static async sessionNext() {
    if (window.electron == undefined) {
      throw new ElectronError("Electron backend is not exposed");
    }

    await window.electron.invoke("session/proceed");
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
  public static async reset(): Promise<string | void> {
    return await window.electron
      ?.invoke("session/end")
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

  public static async saveCanvas(url: string): Promise<void> {
    return await window.electron?.send("media/save", url);
  }

  public static async print(
    url: string,
    quantity: number,
    split: boolean,
  ): Promise<void> {
    return await window.electron?.send("media/print", {
      data: url,
      quantity: quantity,
      split: split,
    });
  }

  public static sendMotion(dataUrl: string) {
    window.electron?.invoke("media/motion", dataUrl);
  }

  public static async sendPayment(payment: PaymentCallback) {
    await window.electron?.invoke("session/state/payment", payment);
  }

  public static async sendFrame(frame: Frame) {
    await window.electron?.invoke("session/state/frame", frame);
  }

  public static async sendCanvas(canvas: string) {
    await window.electron?.invoke("media/canvas", canvas);
  }

  public static fallback() {
    window.electron?.invoke("session/throw");
  }
}

export default BackendService;
