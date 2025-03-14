import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React, {
  useRef,
  useState,
  useEffect,
  act,
  MouseEventHandler,
} from "react";
import "./PhaseTwoPage.css";
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
import useIdleTimer from "../hooks/useIdleTimer.tsx";
import IdleMessage from "../components/IdleMessage.tsx";
import imageAspectRatio from "../utilities/imageAspectRatio.tsx";
import LoadingAnimation from "../components/LoadingAnimation.tsx";
import Page from "../components/Page.tsx";
import ExitButton from "../components/ExitButton.tsx";
import LoggerService from "../services/LoggerService.tsx";
import Select from "../components/Select.tsx";
import ThemeManager from "../services/ThemeManager.tsx";
import Theme from "../interfaces/Theme.tsx";
import Selector from "../components/Selector.tsx";
import Radio from "../components/inputs/Radio.tsx";
import { globalData } from "../contexts/DataContext.tsx";
enum State {
  LOADING = 0,
  RUNNING = 1,
  ERROR = 2,
  SELECT = 3,
  STARTUP = 4,
}

interface ConfirmPopupProps {
  frame: Frame;
  onCancel: () => void;
  onConfirm: () => void;
  onQuantity: (qty: number) => void;
}

/**
 * Dialog box for confirming frame selection
 * @params {Frame} frame - the selected frame for confirmation
 * @params {void} onCancel - the callback when user click cancel button
 * @params {void} onConfirm - the callback when user confirms
 */
function ConfirmPrompt({
  frame,
  onCancel,
  onConfirm,
  onQuantity,
}: ConfirmPopupProps) {
  if (!frame) onCancel();

  const [quantity, setQuantity] = useState<number>(frame.split ? 2 : 1);
  const [options, setOptions] = useState<number[]>([]);

  useEffect(() => {
    if (frame.split) {
      setQuantity(2);
      setOptions([2, 4, 6, 8, 10]);
    } else {
      setQuantity(1);
      setOptions([1, 2, 3, 4, 5]);
    }
  }, []);

  useEffect(() => {
    onQuantity(quantity);
  }, [quantity]);

  return (
    <>
      <Page
        className="flex flex-row justify-center
      bg-surface border-2 border-outline gap-12 min-h-full items-stretch"
      >
        <div className="flex-1 flex justify-center items-center">
          <LazyImage
            src={frame.url ? frame.url : ""}
            className="w-auto h-[48rem]"
          />
        </div>

        {/** Right Panel */}
        <div className="flex-1 flex flex-col gap-24 justify-center">
          <span className="text-6xl font-bold">{frame.name}</span>

          <div className="flex flex-wrap gap-12 text-4xl">
            <div className="flex flex-row justify-center items-center gap-4 text-on-surface">
              <Icon type="photo" size="3rem"></Icon>
              <span>{frame.count} photos in frame</span>
            </div>

            <div className="flex flex-row justify-center items-center gap-4 text-on-surface">
              <Icon type="print" size="3rem"></Icon>
              <span>{frame.count * 2}x capture</span>
            </div>
          </div>

          <div className="block bg-surface-container-lowest shadow-xl rounded-xl p-12">
            <span className="block text-2xl mb-8">
              Select how many prints you want?
            </span>
            <Radio
              options={options.map((value) => ({
                value: value,
                label: `${value} ${value > 1 ? `prints` : `print`}`,
              }))}
              onChange={(value) => setQuantity(value)}
              value={quantity}
            />
          </div>

          <div className="flex w-full flex-row justify-between items-center text-4xl">
            <div>Subtotal</div>
            <div className="font-bold">
              {formatPrice(frame.price * quantity)}
            </div>
          </div>

          <div className="flex w-full flex-row gap-4">
            <Button
              className="flex-1 text-4xl"
              type="danger"
              variant="outline"
              onClick={onCancel}
            >
              Cancel
            </Button>

            <Button
              className="flex-1 text-4xl"
              type="primary"
              variant="fill"
              onClick={onConfirm}
            >
              Confirm
            </Button>
          </div>
        </div>
      </Page>
    </>
  );
}
interface FrameFilters {
  theme: Theme[];
  count: number[];
}

export default function PhaseTwoPage() {
  const [state, setState] = useState<State>(State.STARTUP);
  const navigate = useNavigate();
  const phase = usePhase();
  const [isIdle, setIsIdle] = useState<boolean>(true);
  const idleMessage = useIdleTimer(300000, isIdle);
  const errorIdle = useIdleTimer(10000, state === State.ERROR);
  const [rawFrames, setRawFrames] = useState<Frame[]>([]);
  const [frames, setFrames] = useState<Frame[]>([]);
  const [filters, setFilters] = useState<FrameFilters>({
    theme: [],
    count: [],
  });
  const [filterTheme, setFilterTheme] = useState<string>("");
  const [filterCount, setFilterCount] = useState<number>(-1);
  const [error, setError] = useState<Error | null>(null);
  const [selected, setSelected] = useState<Frame | null>(null);
  const { setFrame, setQuantity, originalWidth, originalHeight } = globalData();

  const framesWithRatio = async (frames: Frame[]) => {
    return await Promise.all(
      frames.map(async (frame) => {
        const aspectRatio = await imageAspectRatio(frame.url as string);
        return { ...frame, aspectRatio };
      }),
    );
  };
  const startup = async () => {
    try {
      await FrameService.getFrames().then(async (value) => {
        setRawFrames(value as Frame[]);
        setFrames(value as Frame[]);
        setFilters({
          count: [...new Set((value as Frame[]).map((x) => x.count))],
          theme: [],
        });

        const themeName = await ThemeManager.getThemeNames();

        setFilters((prev) => ({
          ...prev,
          theme: themeName,
        }));
        setState(State.RUNNING);
      });
    } catch (error) {
      LoggerService.error(error as string);
      setState(State.ERROR);
      setError(error as AppError);
    }
  };
  useEffect(() => {
    if (state === State.STARTUP) startup();
  }, [state]);

  /** Handles filter for number of pictures */
  useEffect(() => {
    if (state !== State.RUNNING && rawFrames.length <= 0) return;
    if (filterCount < 0)
      setFrames(rawFrames.filter((frame) => frame.themeId === filterTheme));
    else
      setFrames(
        rawFrames.filter(
          (frame) =>
            frame.count === filterCount && frame.themeId === filterTheme,
        ),
      );
  }, [filterCount, filterTheme, rawFrames]);

  useEffect(() => {
    setSelected(frames[0]);
  }, [frames]);

  const handleSelect = () => {
    setState(State.SELECT);
  };

  const handleConfirm = async () => {
    setState(State.LOADING);

    setFrame(selected as Frame);
    const img = new Image();
    img.src = selected?.url!;
    img.onload = () => {
      originalHeight.current = img.naturalHeight;
      originalWidth.current = img.naturalWidth;
    };
    img.onerror = (event, src, line, col, error) => {
      setState(State.ERROR);
      setError(error!);
    };

    phase.setCurrentPhase(6);
    navigate("/phase6", { state: selected });
  };
  if (state === State.LOADING)
    return (
      <Page>
        <LoadingAnimation />
      </Page>
    );

  if (state === State.SELECT)
    return (
      <ConfirmPrompt
        onQuantity={(qty) => setQuantity(qty)}
        frame={selected as Frame}
        onCancel={() => {
          setState(State.RUNNING);
        }}
        onConfirm={() => {
          handleConfirm();
        }}
      />
    );

  if (state === State.RUNNING)
    return (
      <Page className="flex flex-col justify-center text-on-surface gap-8">
        <div className="flex-none flex justify-center">
          <h1 className="font-bold text-[4rem]">Select Frame</h1>
        </div>

        {/** <!-- RENDER: Filters menu -->*/}
        <div className="flex-none flex justify-center gap-8">
          <Select
            options={filters.count.map((x) => ({
              value: x,
              label: x,
            }))}
            value={filterCount}
            label="No. of Pictures"
            onChange={(x) => setFilterCount(x)}
          />

          <Select
            options={filters.theme.map((x) => ({ value: x.id, label: x.name }))}
            value={filterTheme}
            label="Theme"
            onChange={(x) => setFilterTheme(x)}
          />
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <ExitButton />
          <Selector
            onSelect={(index) => {
              setSelected(frames[index]);
            }}
          >
            {frames.map((value, index) => (
              <div className="" key={index}>
                <LazyImage
                  src={value.url as string}
                  className="object-fit h-[24rem] mx-auto"
                />
                <span className="flex text-4xl justify-center mt-4">
                  {formatPrice(value.price) as string}
                </span>
              </div>
            ))}
          </Selector>
        </div>
        <div className="flex flex-row justify-end items-center">
          <Button
            type="primary"
            variant="fill"
            onClick={handleSelect}
            className="text-4xl px-12"
          >
            Select
          </Button>
        </div>
      </Page>
    );

  if (state === State.ERROR)
    return (
      <>
        <IdleMessage message={errorIdle as string}></IdleMessage>
        <ErrorPage
          message={
            error instanceof AppError
              ? (error?.userMessage as string)
              : error?.message!
          }
          code={error instanceof AppError ? error?.code! : error?.name!}
        />
      </>
    );
}
