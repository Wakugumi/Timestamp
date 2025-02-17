import { useLocation, useParams } from "react-router";
import useScript from "../hooks/useScript";
import BoothManager from "../services/BoothManager";
import { useEffect, useState } from "react";
import Frame from "../interfaces/Frame";
import Page from "../components/Page";
import PaymentService from "../services/PaymentService";
import LoadingAnimation from "../components/LoadingAnimation";
import "./PhaseThreePage.scss";
import LoggerService from "../services/LoggerService";
import { useSearchParams } from "react-router";
import PaymentCallback from "../interfaces/PaymentCallback";
import { Payment } from "electron/main";
import BackendService from "../services/BackendService";
import Button from "../components/Button";

enum State {
  STARTUP = 0,
  LOADING = 1,
  RUNNING = 2,
  SUCCESS = 3,
  ABORT = 4,
  ERROR = -1,
}

/**
 * Phase three of the app, payment
 * @returns {Element}
 */
export default function PhaseThreePage() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [state, setState] = useState<State>(State.STARTUP);
  const [token, setToken] = useState<string>("");
  const [error, setError] = useState<string>("");
  const frame: Frame = location.state;
  useScript("https://app.sandbox.midtrans.com/snap/snap.js", {
    "data-client-key": BoothManager.Booth.clientKey,
  });
  const isHandlingPayment = () => {
    if (
      searchParams.get("order_id") &&
      searchParams.get("status_code") &&
      searchParams.get("transaction_status")
    )
      return true;
    else return false;
  };

  useEffect(() => {
    window.span?.show();
    const pay = async () => {
      await PaymentService.pay(frame.id)
        .then((token) => {
          setToken(token as string);
          setState(State.RUNNING);
        })
        .catch((error) => {
          setState(State.ERROR);
          setError(error);
        });
    };

    // Running State, Payment processing here
    if (state === State.STARTUP) {
      pay();
    }

    // Handles when payment token exist and valid
    if (state === State.RUNNING) {
      window.snap.embed(token, {
        embedId: "snap-container",
        onSuccess: function (result: PaymentCallback) {
          LoggerService.info(
            `Payment has been resolved ${result.transaction_id}`,
          );
          setState(State.SUCCESS);
          window.snap.hide();
          return;
        },
        onPending: function (result: PaymentCallback) {
          LoggerService.info("A pending transaction process is closed by user");
          window.snap?.hide();
          setState(State.ABORT);
        },
        onError: function (result: PaymentCallback) {
          setError(result.status_message);
          setState(State.ERROR);
        },
        onClose: function (result) {
          console.log(result);
          LoggerService.info("Payment window has been closed");
          setState(State.ABORT);
        },
      });
    }

    if (state === State.SUCCESS) {
      BackendService.paymentCallback().then((params) => {
        if (params?.transaction_status !== "success") {
          setState(State.ERROR);
          setError("Payment callback returns error");
        }
      });
    }
  }, [state]);

  if (state === State.LOADING || state === State.STARTUP)
    return (
      <Page className="flex flex-col justify-center items-center">
        <LoadingAnimation />
      </Page>
    );

  if (state === State.RUNNING)
    return (
      <>
        <Page className="flex flex-col justify-center items-center p-[8rem]">
          <div className="border-2 border-outline" id="snap-container"></div>
        </Page>
      </>
    );

  if (state === State.SUCCESS)
    return (
      <>
        <Page className="flex flex-col justify-center items-center p-[8rem]">
          <div className="success-checkmark">
            <div className="check-icon">
              <span className="icon-line line-tip"></span>
              <span className="icon-line line-long"></span>
              <div className="icon-circle"></div>
              <div className="icon-fix"></div>
            </div>
          </div>
          <span className="text-xl font-bold text-on-surface slide-in">
            PAYMENT SUCCESS
          </span>
        </Page>
      </>
    );
  if (state === State.ABORT)
    return (
      <>
        <Page className="flex flex-col justify-center items-center p-[8rem]">
          <div
            className="border-2 border-outline p-4
            flex flex-col justify-center items-center"
          >
            <span className="font-bold text-xl">PAYMENT FAILED</span>
            <span>
              Seems like you close the payment window to cancel or
              unintentionally
            </span>

            <div className="flex flex-col justify-between">
              <Button type="danger">Cancel</Button>
              <Button
                type="primary"
                onClick={() => {
                  setState(State.RUNNING);
                }}
              >
                Pay again
              </Button>
            </div>
          </div>
        </Page>
      </>
    );
}
