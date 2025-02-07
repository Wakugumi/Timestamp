import Slider from "react-slick";
import "slick-carousel/slick/slick.scss";
import "slick-carousel/slick/slick-theme.css";
import "./PhaseTwoPage.css";
import React, {
  useRef,
  useState,
  useEffect,
  act,
  MouseEventHandler,
} from "react";
import { usePopup } from "../contexts/PopupContext.tsx";
import { ConfirmPopup, GenericPopup } from "../components/Popup.tsx";
import { useNavigate } from "react-router";
import Icon from "../components/Icon.tsx";
import formatPrice from "../utilities/formatPrice.tsx";
import Frame from "../interfaces/Frame.tsx";
import FrameService from "../services/FrameService.tsx";
import Button from "../components/Button.tsx";
import LazyImage from "../components/LazyImage.tsx";
import ErrorPage from "../components/ErrorPage.tsx";
import { AppError } from "../helpers/AppError.tsx";
import { usePhase } from "../contexts/PhaseContext.tsx";
enum State {
  LOADING = 0,
  RUNNING = 1,
  ERROR = 2,
  SELECT = 3,
}

interface ConfirmPopupProps {
  frame: Frame;
  onCancel: () => void;
  onConfirm: () => void;
}

/**
 * Dialog box for confirming frame selection
 * @params {Frame} frame - the selected frame for confirmation
 * @params {void} onCancel - the callback when user click cancel button
 * @params {void} onConfirm - the callback when user confirms
 */
function ConfirmPrompt({ frame, onCancel, onConfirm }: ConfirmPopupProps) {
  return (
    <>
      <div
        className="flex flex-row justify-center items-center
      bg-surface border-2 border-outline p-12"
      >
        <div className="flex-1 flex justify-center items-center">
          <LazyImage
            src={frame.url ? frame.url : ""}
            className="w-auto h-[18rem]"
          />
        </div>

        <div className="flex-1 flex flex-col justify-start items-start gap-4">
          <span className="text-4xl">{frame.name}</span>

          <div className="flex flex-wrap gap-4">
            <div
              className="flex flex-row justify-center items-center gap-4
            p-4 border border-outline rounded-full bg-surface-container-low text-on-surface"
            >
              <Icon type="print"></Icon>
              <span>
                {frame.split ? "2 piece of paper" : "1 piece of paper"}
              </span>
            </div>

            <div
              className="flex flex-row justify-center items-center gap-4
            p-4 border border-outline rounded-full bg-surface-container-low text-on-surface"
            >
              <Icon type="photo"></Icon>
              <span>{frame.count} photos in frame</span>
            </div>

            <div
              className="flex flex-row justify-center items-center gap-4
            p-4 border border-outline rounded-full bg-surface-container-low text-on-surface"
            >
              <Icon type="print"></Icon>
              <span>{frame.count * 2}x capture</span>
            </div>
          </div>

          <div className="flex w-full flex-row justify-between items-center">
            <div>Subtotal</div>
            <div className="font-bold text-xl">{formatPrice(frame.price)}</div>
          </div>

          <div className="flex w-full flex-row gap-4">
            <Button
              className="flex"
              type="danger"
              variant="outline"
              onClick={onCancel}
            >
              Cancel
            </Button>

            <Button
              className="flex"
              type="primary"
              variant="fill"
              onClick={onConfirm}
            >
              Confirm
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default function PhaseTwoPage() {
  const navigate = useNavigate();
  const phase = usePhase();
  const [activeSlide, setActiveSlide] = useState(0);
  const { showPopup, hidePopup } = usePopup();
  const [frames, setFrames] = useState<Frame[]>([]);
  const [state, setState] = useState<State>(State.LOADING);
  const [error, setError] = useState<AppError | null>(null);

  useEffect(() => {
    const getFrames = async () => {
      try {
        const fetchedFrames = await FrameService.getFrames();

        setFrames(fetchedFrames);

        setState(State.RUNNING);
      } catch (error) {
        setState(State.ERROR);
        setError(error as AppError);
      }
    };

    if (state === State.LOADING) {
      getFrames();
    }
  }, [state, frames]);

  const handleExit = () => {
    showPopup(
      <ConfirmPopup
        message="Are you sure to cancel?"
        onReject={() => {
          hidePopup();
        }}
        onConfirm={() => {
          navigate("/");
          hidePopup();
        }}
      ></ConfirmPopup>,
    );
  };

  const handleSelect = (index: number) => {
    setActiveSlide(index);
    setState(State.SELECT);
  };

  const handleConfirm = () => {};

  const settings = {
    customPaging: function (i: number) {
      return (
        <a>
          <img
            src={frames[i].url}
            className="slick-item bg-surface object-fit"
          />
        </a>
      );
    },
    className: "center",
    dotsClass: "slick-dots slick-items",
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: true,

    speed: 200,
  };

  return (
    <div className="min-h-lvh max-h-lvh flex flex-col items-center gap-12 text-on-surface p-8">
      {/* ------------------------------ FRAME SELECTOR ------------------------------ */}

      <div className="flex-none flex items-center my-8">
        <h1 className="font-bold text-[4rem]">PICK YOUR FRAME</h1>
      </div>

      <div className="flex-1">
        {state === State.SELECT && (
          <ConfirmPrompt
            frame={frames[activeSlide]}
            onCancel={() => {
              setState(State.RUNNING);
            }}
            onConfirm={() => {
              handleConfirm();
            }}
          />
        )}

        {state === State.RUNNING && (
          <>
            <div
              className="absolute top-0 left-0 m-[4rem] rounded-full border-4 p-4 border-outline text-on-surface"
              onClick={() => handleExit()}
            >
              <Icon type="close" size="4rem" />
            </div>

            <div className="flex flex-wrap gap-[12rem]">
              {frames.map((frame, index) => {
                return (
                  <div
                    key={index}
                    className="flex flex-col items-center gap-4"
                    onClick={() => handleSelect(index)}
                  >
                    <span
                      className="font-bold text-xl py-4 px-8 bg-surface-container-lowest text-on-surface
                  border border-outline-variant rounded-full"
                    >
                      {frame.name}
                    </span>
                    <LazyImage
                      src={frame.url as string}
                      className="w-auto h-[24rem]"
                    />
                    <span className="text-xl font-bold">
                      {formatPrice(frame.price)}
                    </span>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {state === State.ERROR && (
          <ErrorPage
            message={error?.userMessage as string}
            code={error?.code}
          />
        )}
      </div>
    </div>
  );
}
