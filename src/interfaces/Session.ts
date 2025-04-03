import Frame from "./Frame";
import PaymentCallback from "./PaymentCallback";

export interface Session {
  phase: number;
  payment: PaymentCallback | null;
  frame: Frame | null;
  canvas: JSON | null;
  quantity: number;
  reload: number;
}
