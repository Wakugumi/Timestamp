import axios from "axios";
import { NetworkError } from "../helpers/AppError";
import BoothManager from "./BoothManager";
import LoggerService from "./LoggerService";

const api = axios.create({
  baseURL: "https://timestamp.fun/api",
  headers: {
    Token: import.meta.env.VITE_BOOTH_TOKEN,
  },
});
export default class PaymentService {
  /**
   * Handle payment transaction, requesting backend for payment
   * @params {string} frameId - the Id number for the frame to be paid
   * @params {number} quantity  - numbers of frames to be printed
   * @returns {Promise<string|void>} will return a string of token for payment embed key, else thrown error
   *
   */
  public static async pay(
    frameId: string,
    quantity: number,
  ): Promise<string | void> {
    return await api
      .post("/transactions", {
        FrameId: frameId,
        quantity: quantity,
      })
      .then((response) => {
        LoggerService.info(`transaction is opened: ${response}`);
        console.log(response.data);
        return response.data.token;
      })
      .catch((error) => {
        throw new NetworkError(
          error,
          "We're very sorry but we cannot process your payment",
        );
      });
  }
}
