import useScript from "../hooks/useScript";
import BoothManager from "../services/BoothManager";
import { useEffect, useState } from "react";
import Page from "../components/Page";
import PaymentService from "../services/PaymentService";
import LoadingAnimation from "../components/LoadingAnimation";
import "./PhaseThreePage.scss";
import LoggerService from "../services/LoggerService";
import PaymentCallback from "../interfaces/PaymentCallback";
import Button from "../components/Button";
import { usePopup } from "../contexts/PopupContext";
import { ConfirmPopup } from "../components/Popup";
import { usePhase } from "../contexts/PhaseContext";
import { globalData } from "../contexts/DataContext";
import ErrorPage from "../components/ErrorPage";

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
  const { frame, quantity, setPayment } = globalData();
  const phase = usePhase();
  const { showPopup, hidePopup } = usePopup();
  const [state, setState] = useState<State>(State.STARTUP);
  const [token, setToken] = useState<string>("");
  const [error, setError] = useState<string>("");
  useScript("https://app.sandbox.midtrans.com/snap/snap.js", {
    "data-client-key": BoothManager.Booth.clientKey,
  });

  if (!frame || !quantity) {
    setError("No Frame is selected for payment");
    setState(State.ERROR);
  }

  const handleExit = () => {
    showPopup(
      <ConfirmPopup
        message="Are you sure to cancel?"
        onReject={() => {
          hidePopup();
        }}
        onConfirm={() => {
          BoothManager.end();
          phase?.restart();
          hidePopup();
        }}
      ></ConfirmPopup>,
    );
  };
  const handleNext = () => {
    phase.next();
  };

  useEffect(() => {
    const pay = async () => {
      await PaymentService.pay(frame?.id as string, quantity)
        .then((token) => {
          setToken(token as string);
          setState(State.RUNNING);
          LoggerService.trace("Opened new payment", token as string);
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
      window.snap.pay(token, {
        onSuccess: function (result: PaymentCallback) {
          LoggerService.info(
            `Payment has been resolved ${result.transaction_id}`,
          );
          setPayment(result);

          setState(State.SUCCESS);
        },
        onPending: function (result: PaymentCallback) {
          LoggerService.info(
            "A pending transaction process is closed by user" +
              result.toString(),
          );
          setState(State.ABORT);
        },
        onError: function (result: PaymentCallback) {
          console.error("payment error", result);
          setError(result.status_message);
          setState(State.ERROR);
        },
        onClose: function (result: string) {
          console.log(result);
          setState(State.ABORT);
        },
      });
    }

    if (state === State.SUCCESS) {
      setToken("");
      (async () => {
        await setTimeout(() => {
          handleNext();
        }, 3000);
      })();
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
          <div className="border-2 w-full h-full" id="snap-container"></div>
        </Page>
      </>
    );

  if (state === State.SUCCESS)
    return (
      <>
        <Page className="flex flex-col justify-center items-center">
          <div className="flex flex-col justify-center items-center p-8 outline bg-white shadow rounded">
            <div className="success-checkmark">
              <div className="check-icon">
                <span className="icon-line line-tip"></span>
                <span className="icon-line line-long"></span>
                <div className="icon-circle"></div>
                <div className="icon-fix"></div>
              </div>
            </div>
            <span className="text-4xl font-bold text-on-surface slide-in">
              Payment Success :D
            </span>
          </div>
        </Page>
      </>
    );
  if (state === State.ABORT)
    return (
      <>
        <Page className="flex flex-col justify-center items-center p-[8rem]">
          <div
            className="
            flex flex-col justify-center items-center gap-12"
          >
            <span className="font-bold text-8xl text-error">
              Payment Failed
            </span>
            <span className="text-4xl">
              Seems like you close the payment window to cancel or
              unintentionally
            </span>

            <div className="flex flex-row justify-center gap-12">
              <Button type="danger" onClick={handleExit}>
                Cancel
              </Button>
              <Button
                type="primary"
                variant="fill"
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

  if (state === State.ERROR) {
    LoggerService.error(error);
    return <ErrorPage message={error} code="PAYMENT" />;
  }
}
