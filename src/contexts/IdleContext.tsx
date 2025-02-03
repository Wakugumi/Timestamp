import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useNavigate } from "react-router";

type IdleTimerContextType = {
  isIdle: boolean;
  message: string | null;
};

type IdleTimerProviderProps = {
  children: ReactNode;
  timeout: number; // Time in seconds
};

const IdleTimerContext = createContext<IdleTimerContextType | undefined>(
  undefined,
);

export const IdleProvider: React.FC<IdleTimerProviderProps> = ({
  children,
  timeout,
}) => {
  const [isIdle, setIsIdle] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(timeout);
  const navigate = useNavigate();

  let timer: NodeJS.Timeout;

  const handleIdle = () => {
    console.log("IDLE, returning to default state");
    navigate("/");
  };

  const resetTimer = () => {
    clearTimeout(timer);
    setTimeLeft(timeout); // Reset the timer
    setIsIdle(false);
    startTimer();
  };

  const startTimer = () => {
    timer = setTimeout(() => {
      setIsIdle(true);
      handleIdle(); // Call the provided function when idle
    }, timeout * 1000);
  };

  const handleUserActivity = () => {
    if (isIdle) return; // If already idle, don't reset
    resetTimer();
  };

  useEffect(() => {
    // Add event listeners for user activity
    window.addEventListener("mousemove", handleUserActivity, { passive: true });
    window.addEventListener("click", handleUserActivity, { passive: true });
    window.addEventListener("touchstart", handleUserActivity, {
      passive: true,
    });

    startTimer();

    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", handleUserActivity);
      window.removeEventListener("click", handleUserActivity);
      window.removeEventListener("touchstart", handleUserActivity);
    };
  }, []);

  useEffect(() => {
    if (timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timeLeft]);

  const message =
    timeLeft <= 5 ? `You will be logged out in ${timeLeft} seconds.` : null;

  return (
    <IdleTimerContext.Provider value={{ isIdle, message }}>
      {children}
    </IdleTimerContext.Provider>
  );
};

// Custom hook to use the idle timer context
export const useIdle = (): IdleTimerContextType => {
  const context = useContext(IdleTimerContext);
  if (!context) {
    throw new Error("useIdleTimer must be used within an IdleTimerProvider");
  }
  return context;
};
