import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Frame from "../interfaces/Frame";
import { useEffect, useState } from "react";
import FrameService from "../services/FrameService";
import LazyImage from "../components/LazyImage";
import Page from "../components/Page";
import Icon from "../components/Icon";
export default function TestPage() {
  const [frames, setFrames] = useState<Frame[]>([]);

  const [running, setRunning] = useState<boolean>(false);

  useEffect(() => {
    const getFrames = async () => {
      await FrameService.getFrames().then(async (value) => {
        setFrames(value);
        setRunning(true);
      });
    };

    getFrames();
  }, []);
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
    centerMode: true,
    focusOnSelect: true,
    infinite: true,
    centerPadding: "2rem",
    slidesToShow: 3,

    speed: 200,
  };

  if (running)
    return (
      <Page className="flex flex-col justify-center p-[8rem]">
        <div className="flex-none flex items-center">Pick your frame</div>

        <div className="flex-1">
          <div className="slider-container">
            <div
              className="absolute top-0 right-0 m-8 rounded-full p-4 border-4 border-outline text-on-surface"
              onClick={() => {}}
            >
              <Icon type="close" size="2rem" />
            </div>
            <Slider {...settings}>
              {frames.map((value, index) => (
                <div className="flex flex-col justify-center" key={index}>
                  <LazyImage
                    src={value.url as string}
                    className="object-fit h-[12rem]"
                  />
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </Page>
    );
}
