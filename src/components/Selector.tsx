import {
  useEffect,
  useRef,
  useState,
  Children,
  cloneElement,
  ReactElement,
  ReactNode,
} from "react";
import Icon from "./Icon";
import Slick from "react-slick";

interface ArrowProps {
  className?: string;
  styles?: string;
  onClick?: () => void;
}
function NextArrow({ className = "", onClick }: ArrowProps) {
  return (
    <div className={`block ${className}`} onClick={onClick}>
      <Icon type="right" size="4rem"></Icon>
    </div>
  );
}

function PrevArrow({ className = "", onClick }: ArrowProps) {
  return (
    <div className={`block ${className}`} onClick={onClick}>
      <Icon type="left" size="4rem"></Icon>
    </div>
  );
}

interface SelectorProps {
  children: ReactNode;
  onSelect: (index: number) => void;
}

export default function Selector({ children, onSelect }: SelectorProps) {
  let sliderRef = useRef(null);
  const [index, setIndex] = useState<number>(0);

  useEffect(() => {
    onSelect(index);
  }, [index]);
  useEffect(() => {
    if (Children.count(children) === 1) setIndex(0);
  }, [children]);

  const settings = {
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    className: "center",
    centerMode: true,
    dots: true,
    dotsClass: "slider-dots",
    slidesToShow: 3,
    beforeChange: (_: number, next: number) => setIndex(next),
    speed: 200,
  };

  if (Children.count(children) <= 0)
    return (
      <>
        <span className="text-xl">
          We have nothing here, try adjust filter again.
        </span>
      </>
    );
  else if (Children.count(children) <= 2)
    return (
      <>
        <div
          className="flex flex-row justify-evenly
          "
        >
          {Children.map(children, (child, i) =>
            cloneElement(child as ReactElement, {
              onClick: () => {
                setIndex(i);
              },
              className: `p-8 rounded-xl ${index === i ? `shadow-inset border-outline` : ``}`,
            }),
          )}
        </div>
      </>
    );
  else {
    return (
      <>
        <Slick {...settings} ref={(slider) => (sliderRef = slider)}>
          {children}
        </Slick>
      </>
    );
  }
}
