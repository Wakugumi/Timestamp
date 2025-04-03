import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePhase } from "../contexts/PhaseContext";

/**
 * @params {timeout} timeout duration in milliseconds;
 * @returns {string | null} idle message if given
 */
const useIdleTimer = (timeout: number, isActive: boolean): string | null => {
  const phase = usePhase();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);
  useEffect(() => {
    if (!isActive) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setRemaining(null);
      return;
    }

    // When IDLE timer runs out, everything called here
    const handleIdle = () => {
      phase?.restart();
    };

    const resetTimer = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setRemaining(timeout); // Reset remaining time

      timeoutRef.current = setTimeout(() => {
        handleIdle();
      }, timeout);
    };

    resetTimer(); // Start timer when component mounts

    const events: (keyof DocumentEventMap)[] = [
      "mousemove",
      "keydown",
      "scroll",
      "click",
      "touchstart",
    ];
    events.forEach((event) =>
      window.addEventListener(event, resetTimer, { passive: true }),
    );

    const interval = setInterval(() => {
      setRemaining((prev) => (prev !== null ? Math.max(prev - 1000, 0) : null)); // Decrease remaining time every second
    }, 1000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      clearInterval(interval);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [isActive, timeout]);

  return remaining !== null && remaining <= 5000
    ? `Exitting this session in ${remaining / 1000}...`
    : null;
};

export default useIdleTimer;
