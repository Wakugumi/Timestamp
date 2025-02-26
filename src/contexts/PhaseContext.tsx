import React, { createContext, useContext, useState } from "react";

/**
 * @typedef {Object} PhaseContextValue
 * @property {number} currentPhase - the current phase of the main process
 * @property {(phase: number) => void} setCurrentPhase - a function to update current phase number
 */
interface PhaseContextValue {
  currentPhase: number;
  setCurrentPhase: (phase: number) => void;
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
  const [currentPhase, setCurrentPhase] = useState(1);
  return (
    <PhaseContext.Provider value={{ currentPhase, setCurrentPhase }}>
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

