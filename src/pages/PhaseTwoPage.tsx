import Slider from "react-slick";
import "slick-carousel/slick/slick.scss";
import "slick-carousel/slick/slick-theme.css";
import "./PhaseTwoPage.css";
import { useRef, useState, useEffect } from "react";
import { usePopup } from "../contexts/PopupContext";
import { ConfirmPopup } from "../components/Popup.tsx";
import { useNavigate } from "react-router";
import Icon from "../components/Icon.tsx";
import formatPrice from "../utilities/formatPrice.tsx";
import Frame from "../interfaces/Frame.tsx";
import FrameService from "../services/FrameService.tsx";

function Next(props: { style?: React.CSSProperties; onClick?: () => void }) {
  const { style, onClick } = props;
  return (
    <div
      className={`absolute block z-[2] top-[40%] right-[2rem] p-4 rounded-full cursor-pointer block shadow text-4xl bg-secondary text-on-secondary`}
      style={{ ...style }}
      onClick={onClick}
    >
      &gt;
    </div>
  );
}

function Prev(props: { style?: React.CSSProperties; onClick?: () => void }) {
  const { style, onClick } = props;
  return (
    <div
      className={`absolute block z-[2] top-[40%] left-[2rem] p-4 rounded-full cursor-pointer block shadow text-4xl bg-secondary text-on-secondary`}
      style={{ ...style }}
      onClick={onClick}
    >
      &lt;
    </div>
  );
}

enum State {
  LOADING = 0,
  RUNNING = 1,
  ERROR = 2,
}

export default function PhaseTwoPage() {
  const slider = useRef(null);
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0);
  const { showPopup, hidePopup } = usePopup();
  const [frames, setFrames] = useState<Frame[]>([]);
  const [state, setState] = useState<State>(State.LOADING);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getFrames = async () => {
      try {
        setFrames(await FrameService.getFrames());
        setState(State.RUNNING);
      } catch (error) {
        setState(State.ERROR);
        setError(error as string);
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

  const settings = {
    className: "center",
    centerMode: true,
    focusOnSelect: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    dots: true,

    nextArrow: <Next />,
    prevArrow: <Prev />,

    speed: 200,
    afterChange: (current: number) => {
      setActiveSlide(current);
    },
  };

  if (state === State.RUNNING)
    return (
      <div className="min-h-lvh max-h-lvh flex flex-col justify-evenly gap-2 text-on-surface">
        <button
          className="absolute top-[4rem] left-[4rem] p-4 w-[4rem] h-[4rem] rounded-full shadow bg-error text-on-error"
          onClick={handleExit}
        >
          <Icon type="close" />
        </button>

        <div className="mx-auto">
          <h1 className="text-2xl flex items-center gap-4">
            You Select:
            <span className="rounded bg-primary px-4 py-2 shadow text-on-primary font-bold text-4xl">
              {frames[activeSlide].name}
            </span>
          </h1>
        </div>

        <div className="slider-container bg-surface mx-32 px-4 py-12 rounded-lg">
          <Slider {...settings} ref={slider}>
            {frames.map((item, index) => (
              <div
                key={index}
                className="flex flex-col justify-center gap-2 items-center align-center content-center text-center"
              >
                <img
                  className="rounded mx-auto w-auto h-[20rem] object-fit shadow-lg"
                  src={item.url}
                ></img>
                <span>{item.name}</span>
              </div>
            ))}
          </Slider>
        </div>

        <div className="flex flex-row justify-evenly">
          <h1 className="text-8xl text-primary font-bold">
            {formatPrice(frames[activeSlide].price)}
          </h1>

          <button className="btn px-12 text-xl">Select</button>
        </div>
      </div>
    );
}
