import Slider from "react-slick";
import "slick-carousel/slick/slick.scss";
import "slick-carousel/slick/slick-theme.css";
import "./PhaseTwoPage.css";
import { useRef, useState } from "react";

interface Coordinates {
  x1: number[];
  x2: number[];
  x3: number[];
  x4: number[];
}

interface Frame {
  title: string;
  src: string;
  coordinates?: Coordinates[];
  price: number;
}

const formatPrice = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number);
};

function Next(props: { style?: React.CSSProperties; onClick?: () => void }) {
  const { style, onClick } = props;
  return (
    <div
      className={`absolute block z-[2] top-[40%] right-[2rem] p-4 rounded-full cursor-pointer block shadow text-xl bg-surface-container-low text-on-surface`}
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
      className={`absolute block z-[2] top-[40%] left-[2rem] p-4 rounded-full cursor-pointer block shadow text-xl bg-surface-container-low text-on-surface`}
      style={{ ...style }}
      onClick={onClick}
    >
      &lt;
    </div>
  );
}

export default function PhaseTwoPage() {
  const slider = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);

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

  const frames: Frame[] = [
    {
      title: "Gibberish Infant Drawing",
      src: "/public/assets/frames/frame1.png",
      price: 2000,
    },
    {
      title: "Frame 2",
      src: "https://picsum.photos/id/100/200/300",
      price: 3000,
    },
    {
      title: "Adsokrg",
      src: "https://picsum.photos/id/200/200/300",
      price: 4000,
    },
    {
      title: "What the fuck frame",
      src: "https://picsum.photos/id/14/200/300",
      price: 5000,
    },
  ];

  return (
    <div className="min-h-lvh max-h-lvh flex flex-col justify-evenly gap-2 text-on-surface">
      <div className="mx-auto">
        <h1 className="text-xl flex items-center gap-4">
          You Select:
          <span className="rounded bg-primary-container px-4 py-2 shadow text-on-primary-container">
            {frames[activeSlide].title}
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
                src={item.src}
              ></img>
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
