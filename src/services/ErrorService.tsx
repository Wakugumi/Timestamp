import { AppError } from "../helpers/AppError";

export default class ErrorService {
  /**
   * Handles what considered fatal if the error cannot be resolved with just a reload
   * This logs to backend support as critical error
   * @returns {void}
   */
  public static handleFatalError() {}
}
