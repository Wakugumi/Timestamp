import { useLocation, useNavigate, useParams } from "react-router";
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
import BackendService from "../services/BackendService";
import Button from "../components/Button";
import { usePopup } from "../contexts/PopupContext";
import { ConfirmPopup } from "../components/Popup";
import { usePhase } from "../contexts/PhaseContext";
import { globalData } from "../contexts/DataContext";

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
  const navigate = useNavigate();
  const phase = usePhase();
  const [searchParams, setSearchParams] = useSearchParams();
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
          LoggerService.info("A pending transaction process is closed by user");
          setState(State.ABORT);
        },
        onError: function (result: PaymentCallback) {
          console.error("payment error", result);
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

    /** @todo Work on this callback */
    const paymentCheck = async () => {
      const check = await BackendService.paymentCallback();
      console.log(check);
      if (check?.transaction_status === "settlement") {
        LoggerService.info("A transaction has been settled");
        return;
      }
    };
    if (state === State.SUCCESS) {
      paymentCheck();
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
}
