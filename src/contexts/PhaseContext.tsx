import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router";
import BackendService from "../services/BackendService";

/**
 * @typedef {Object} PhaseContextValue
 * @property {number} currentPhase - the current phase of the main process
 * @property {(phase: number) => void} setCurrentPhase - a function to update current phase number
 */
interface PhaseContextValue {
  currentPhase: number;
  jumpTo: (phase: number) => void;
  next: () => void;
  restart: () => void;
}

/** @type {React.Context<PhaseContextValue | undefined>} */
const PhaseContext = createContext<PhaseContextValue | undefined>(undefined);

/**
 * Provider component for the PhaseContext.
 *
 * @component
 * @param {React.ReactNode} children - The child components that will have access to the PhaseContext.
 * @returns {JSX.Element} The context provider wrapping the child components.
 */
export const PhaseProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentPhase, setCurrentPhase] = useState(0);
  const navigate = useNavigate();

  const next = () => {
    console.log("PHASE NEXT");
    BackendService.sessionNext();
    navigate(`/phase${currentPhase + 1}`);
    setCurrentPhase(currentPhase + 1);
  };

  const jumpTo = (phase: number) => {
    setCurrentPhase(phase);
    navigate(`/phase${phase}`);
  };

  const restart = () => {
    setCurrentPhase(0);
    BackendService.reset();
    navigate("/");
  };

  return (
    <PhaseContext.Provider value={{ currentPhase, jumpTo, next, restart }}>
      {children}
    </PhaseContext.Provider>
  );
};

/**
 * Custom hook to access the PhaseContext.
 *
 * @throws {Error} Throws an error if used outside of a PhaseProvider.
 * @returns {PhaseContextValue} The context value containing the current phase and the function to update it.
 */
export const usePhase = () => {
  const context = useContext(PhaseContext);
  if (!context) {
    throw new Error("usePhase must be used within a PhaseProvider");
  }
  return context;
};
