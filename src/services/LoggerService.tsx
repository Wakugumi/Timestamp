import { create } from 'zustand';

interface LogEntry {
    timestamp: string;
    level: 'info' | 'warn' | 'error';
    technicalMessage: string;
    userMessage?: string;
  }
const useLogStore = create<LogEntry[]>(() => []);  

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
    static log(level: 'info' | 'warn' | 'error', technicalMessage: string, userMessage?: string) {
        const timestamp = new Date().toISOString();
        const logEntry: LogEntry = { timestamp, level, technicalMessage, userMessage };

        LoggerService.logStore.setState((state) => [...state, logEntry]);

        console[level](`[${timestamp}] ${technicalMessage}`);

        
    }

     /**
   * Logs an informational message.
   *
   * @param technicalMessage - A detailed message intended for developers.
   * @param userMessage - An optional user-friendly message for display.
   */
    static info(technicalMessage: string, userMessage?: string) {
        LoggerService.log('info', technicalMessage, userMessage);
      }
    

       /**
   * Logs a warning message.
   *
   * @param technicalMessage - A detailed message intended for developers.
   * @param userMessage - An optional user-friendly message for display.
   */
    static warn(technicalMessage: string, userMessage?: string) {
        LoggerService.log('warn', technicalMessage, userMessage);
    }


    /**
   * Logs an error message.
   *
   * @param technicalMessage - A detailed message intended for developers.
   * @param userMessage - An optional user-friendly message for display.
   */
    static error(technicalMessage: string, userMessage?: string) {
        LoggerService.log('error', technicalMessage, userMessage);
    }
}

export default LoggerService;