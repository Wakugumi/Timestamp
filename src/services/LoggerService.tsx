import { create } from "zustand";
import APIService from "./APIService";
import { toUnix } from "../utilities/dateFormatter";

enum Level {
  ERROR,
  WARN,
  INFO,
  DEBUG,
  TRACE,
}

interface LogEntry {
  timestamp: string;
  level: Level;
  technicalMessage: string;
  userMessage?: string;
  stack?: string;
}

type LogStore = {
  logs: LogEntry[];
  addLog: (log: LogEntry) => void;
};

const useLogStore = create<LogStore>((set) => ({
  logs: [],

  addLog: (log) =>
    set((state) => ({
      logs: [...state.logs, log],
    })),
}));

/**
 * Logger service to handle centralized logging.
 */
class LoggerService {
  static logStore = useLogStore;

  /**
   * Logs a message with the given level and stores it in global state.
   * This is the base function for logging, use the derivative function from this instead.
   *
   * @param level - The severity level of the log ('info', 'warn', 'error').
   * @param technicalMessage - A detailed message intended for developers.
   * @param userMessage - An optional user-friendly message for display.
   */
  static log(
    level: Level,
    technicalMessage: string,
    userMessage?: string,
    stack?: string,
  ) {
    const timestamp = toUnix(Date.now());
    const logEntry: LogEntry = {
      timestamp: timestamp,
      level: level,
      technicalMessage: technicalMessage,
      userMessage: userMessage,
      stack: stack,
    };

    const addLog = useLogStore.getState().addLog;
    addLog(logEntry);

    APIService.post("boothLogs", {
      message: logEntry.technicalMessage,
      level: logEntry.level,
      timestamp: logEntry.timestamp,
    })
      .then(() => {})
      .catch((error) => console.error(error));
    const consoleMessage = `[${timestamp}] (${level})\nLocation: ${stack}`;
    if (level === Level.ERROR) console.error(consoleMessage, technicalMessage);
    else if (level === Level.WARN)
      console.warn(consoleMessage, technicalMessage);
    else if (level === Level.INFO)
      console.log(consoleMessage, technicalMessage);
    else if (level === Level.TRACE)
      console.trace(consoleMessage, technicalMessage);
    else if (level === Level.DEBUG)
      console.debug(consoleMessage, technicalMessage);
  }

  /**
   * Logs an informational message.
   *
   * @param technicalMessage - A detailed message intended for developers.
   * @param userMessage - An optional user-friendly message for display.
   */
  static info(technicalMessage: string, userMessage?: string) {
    LoggerService.log(Level.INFO, technicalMessage, userMessage);
  }

  /**
   * Logs a warning message.
   *
   * @param technicalMessage - A detailed message intended for developers.
   * @param userMessage - An optional user-friendly message for display.
   */
  static warn(technicalMessage: string, userMessage?: string) {
    LoggerService.log(Level.WARN, technicalMessage, userMessage);
  }

  /**
   * Logs an error message.
   *
   * @param {Error} error - Error object or a string description of the error.
   * @param {string} userMessage? - An optional user-friendly message for display.
   */
  static error(error: Error | string, userMessage?: string) {
    if (error instanceof Error) {
      return LoggerService.log(
        Level.ERROR,
        (error as Error).message,
        userMessage,
        (error as Error).stack,
      );
    }
    return LoggerService.log(Level.ERROR, error, userMessage);
  }

  /** debug level log */
  static debug(message: string, ...args: string[]) {
    const stack = new Error().stack;
    LoggerService.log(
      Level.DEBUG,
      message + args.join(" "),
      "This is a developer log",
      stack,
    );
  }

  /** for tracing purpose log only */
  static trace(message: string, ...args: string[]) {
    const stack = new Error().stack;
    LoggerService.log(
      Level.TRACE,
      message + args.join(" "),
      "This is a developer log",
      stack,
    );
  }
}

export default LoggerService;
