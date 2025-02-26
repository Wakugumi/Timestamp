import { create } from "zustand";
import Page from "../components/Page";
import APIService from "./APIService";
import { toUnix } from "../utilities/dateFormatter";

enum Level {
  INFO,
  WARN,
  ERROR,
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
   * @param technicalMessage - A detailed message intended for developers.
   * @param userMessage - An optional user-friendly message for display.
   */
  static error(technicalMessage: string, userMessage?: string) {
    const errorStack = new Error();
    LoggerService.log(Level.ERROR, technicalMessage, userMessage);
  }

  private static _location(): string {
    try {
      const error = new Error();
      const stackLines = error.stack?.split("\n") || [];
      return stackLines[4]?.trim() || "Untraceable error";
    } catch {
      return "Untraceable error";
    }
  }
}

export default LoggerService;
