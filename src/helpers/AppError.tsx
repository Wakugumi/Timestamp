export class AppError extends Error {
  public name: string;
  public code: string;
  public userMessage: string;
  public technicalMessage: string;
  /**
   * Creates an instance of AppError.
   *
   * @param code - A unique error code to categorize the error.
   * @param technicalMessage - A detailed message intended for developers.
   * @param userMessage - A user-friendly message for end users.
   */
  constructor(
    name: string,
    code: string,
    technicalMessage: string,
    userMessage: string,
  ) {
    super(technicalMessage);
    this.name = name;
    this.code = code;
    this.userMessage = userMessage;
    this.technicalMessage = technicalMessage;
  }

  valueOf() {
    return this.userMessage;
  }
  toString() {
    return this.userMessage;
  }
}

export class NetworkError extends AppError {
  constructor(
    technicalMessage: string,
    userMessage: string = "We're very sorry, the network seems to be out of order",
  ) {
    super("NetworkError", "NETWORK_ERROR", technicalMessage, userMessage);
  }
}

export class DeviceError extends AppError {
  constructor(
    technicalMessage: string,
    userMessage: string = "We're very sorry, our device seems to be out of order",
  ) {
    super("DeviceError", "DEVICE_ERROR", technicalMessage, userMessage);
  }
}

export class FileSystemError extends AppError {
  constructor(
    technicalMessage: string,
    userMessage: string = "We're very sorry, our program seems to be trouble running",
  ) {
    super("FileSystemError", "FILESYSTEM_ERROR", technicalMessage, userMessage);
  }
}

export class ElectronError extends AppError {
  constructor(
    technicalMessage: string,
    userMessage: string = "We're very sorry, the app seems not working",
  ) {
    super("ElectronError", "ELECTRON_ERROR", technicalMessage, userMessage);
  }
}

import LoggerService from "../services/LoggerService";

/**
 * Handles errors by logging them with appropriate messages for developers and users.
 *
 * @param err - The error to handle. Can be an instance of AppError, Error, or unknown.
 */
export function handleError(err: unknown): void {
  if (err instanceof AppError) {
    LoggerService.error(err.message, err.userMessage);
  } else if (err instanceof Error) {
    LoggerService.error(
      err.message,
      "An unexpected error occurred. Please try again later.",
    );
  } else {
    LoggerService.error("Unknown error", "An unknown error occurred.");
  }
}
