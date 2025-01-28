import Slider from "react-slick";
import "slick-carousel/slick/slick.scss";
import "slick-carousel/slick/slick-theme.css";
import { useRef, useState } from "react";

export default function FramePicker() {
  const slider = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const settings = {
    className: "center",
    centerMode: true,
    infinite: true,
    slidesToShow: 3,

    speed: 500,
    afterChange: (current: number) => setActiveSlide(current),
  };

  const frames = [
    { title: "Frame 1", src: "https://picsum.photos/id/237/200/300" },
    { title: "Frame 2", src: "https://picsum.photos/id/237/200/300" },
    { title: "Adsokrg", src: "https://picsum.photos/id/237/200/300" },
    {
      title: "What the fuck frame",
      src: "https://picsum.photos/id/237/200/300",
    },
  ];

  return (
    <div className="slider-container">
      <h1>You Select: {frames[activeSlide].title}</h1>
      <Slider {...settings} ref={slider}>
        {frames.map((item, index) => (
          <div
            key={index}
            className="flex flex-col justify-center gap-2 items-center align-center text-center mx-auto"
          >
            <span>{item.title}</span>
            <img className="rounded mx-auto" src={item.src}></img>
          </div>
        ))}
      </Slider>
    </div>
  );
}
