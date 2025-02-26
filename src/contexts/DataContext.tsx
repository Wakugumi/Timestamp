import React, { createContext, ReactNode, useContext, useState } from "react";
import Frame from "../interfaces/Frame";
import PaymentCallback from "../interfaces/PaymentCallback";

/**
 * @typedef {Object} DataContextValue
 * @property {Frame} frame - returns Frame object that has been purchased in current cycle
 * @property {(frame: Frame) => void} setFrame - setter function to save Frame object
 * @property {PaymentCallback} payment - current state of payment in this cycle
 * @property {(payment: PaymentCallback) => void} setPayment - setter function to set payment state
 */
interface DataContextValue<T extends any> {
  data: T;
  setData: (value: T) => void;
  frame: Frame | null;
  setFrame: (frame: Frame) => void;
  payment: PaymentCallback | null;
  setPayment: (payment: PaymentCallback) => void;
  quantity: number;
  setQuantity: (qty: number) => void;
  reset: () => void;
}

/** @type {React.Context<DataContextValue<any> | undefined>} */
const DataContext = createContext<DataContextValue<any> | undefined>(undefined);

/**
 * Provides context to share data across childrens
 *
 * @component
 * @param {ReactNode} children - Child components to be shared with
 * @returns {JSX.Elements} The context provider wrapper
 */
export const DataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [data, setData] = useState<any>(null);
  const [frame, setFrame] = useState<Frame | null>(null);
  const [payment, setPayment] = useState<PaymentCallback | null>(null);
  const [quantity, setQuantity] = useState<number>(0);

  /** Reset data state of current cycle */
  const reset = () => {
    setData(null);
    setFrame(null);
    setPayment(null);
    setQuantity(0);
  };

  return (
    <DataContext.Provider
      value={{
        data,
        setData,
        frame,
        setFrame,
        payment,
        setPayment,
        quantity,
        setQuantity,
        reset,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

/**
 * A shared context to share data globally.
 *
 * @throws {Error} Throws error if used in a component that are not in a DataProvider
 * @returns {DataContextValue}
 */
export const globalData = () => {
  const context = useContext(DataContext);
  if (!context)
    throw new Error("globalData must be used within a DataProvider");

  return context;
};
