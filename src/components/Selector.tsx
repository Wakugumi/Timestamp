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
function NextArrow({ className = "", styles = "", onClick }: ArrowProps) {
  return (
    <div className={`block ${className}`} onClick={onClick}>
      <Icon type="right" size="4rem"></Icon>
    </div>
  );
}

function PrevArrow({ className = "", styles = "", onClick }: ArrowProps) {
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

  const [settings, setSettings] = useState<Record<string, any>>({
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    className: "center",
    centerMode: true,
    dots: true,
    dotsClass: "slider-dots",
    slidesToShow: 3,
    beforeChange: (current: number, next: number) => setIndex(next),
    speed: 200,
  });

  if (Children.count(children) === 1)
    return (
      <>
        <div className="block relative overflow-hidden">{children}</div>
      </>
    );
  else if (Children.count(children) === 2)
    return (
      <>
        <div
          className="flex flex-row justify-evenly
          bg-surface-container-lowest rounded shadow-lg p-12"
        >
          {Children.map(children, (child, i) =>
            cloneElement(child as ReactElement, {
              onClick: () => {
                setIndex(i);
              },
              className: `p-8 rounded-xl ${index === i ? `bg-surface-container-highest border-outline` : ``}`,
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
