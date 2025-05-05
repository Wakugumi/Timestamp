import { useState, useEffect, useRef, useMemo } from "react";
import LoadingAnimation from "../components/LoadingAnimation";
import Page from "../components/Page";
import BackendService from "../services/BackendService";
import { globalData } from "../contexts/DataContext";
import ErrorPage from "../components/ErrorPage";
import Frame, { Layout } from "../interfaces/Frame";
import Button from "../components/Button";
import CanvasFraming from "../utilities/CanvasFraming.tsx";
import { usePhase } from "../contexts/PhaseContext.tsx";
import ConfirmPhaseSix from "./ConfirmPhaseSix.tsx";

enum State {
  LOADING,
  PROCESSING,
  RUNNING,
  CONFIRMING,
  ERROR,
}

type Item = {
  src: string | null;
  picked: boolean;
};

type Slot = {
  layout: Layout;
  item: Item | null;
};

/**
 * Phase six of the cycle.
 * User should pick their choice of captures to be used in the frame.
 * @returns {Element}
 */
export default function PhaseSixPage() {
  const [state, setState] = useState<State>(State.LOADING);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { frame, saveCanvas, setScaleFactor, setPictures } = globalData();
  const [items, setItems] = useState<Item[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const Canvas = useRef<CanvasFraming>();
  const canvas = useMemo(() => <canvas ref={canvasRef} />, [Canvas.current]);
  const phase = usePhase();

  useEffect(() => {
    if (frame === null || frame === undefined) {
      setErrorMessage("Frame object is null");
      setState(State.ERROR);
      return;
    }
    if (state === State.LOADING) {
      setState(State.PROCESSING);
      (async () => {
        await BackendService.getCaptures()
          .then((value) => {
            setItems(
              (value as string[]).map((value) => ({
                src: value,
                picked: false,
              })),
            );
          })
          .catch((error) => {
            setState(State.ERROR);
            setErrorMessage(error);
          });

        setSlots(
          frame?.layouts.map((value) => ({
            layout: value,
            item: null,
          })) as Slot[],
        );

        Canvas.current = new CanvasFraming(
          containerRef.current as HTMLDivElement,
          canvasRef.current as HTMLCanvasElement,
          frame as Frame,
        );

        await Canvas.current.create();

        setState(State.RUNNING);
      })().catch((error) => {
        setState(State.ERROR);
        setErrorMessage(error);
      });
    }
  }, [state]);

  useEffect(() => {
    return () => {
      console.warn("PhaseSix umounted");
      Canvas.current?.dispose();
    };
  }, []);

  useEffect(() => {
    setScaleFactor(Canvas.current?.scalingFactor as number);
  }, [Canvas.current]);

  const handlePick = (index: number) => {
    setState(State.PROCESSING);
    setItems((prev) =>
      prev.map((item, idx) =>
        idx === index ? { ...item, picked: true } : item,
      ),
    );
    setSlots((prev) => {
      const updated = [...prev];
      const emptyIndex = updated.findIndex((slot) => slot.item == null);

      if (emptyIndex !== -1)
        updated[emptyIndex] = {
          item: {
            src: items[index].src,
            picked: true,
          },
          layout: updated[emptyIndex].layout,
        };

      Canvas.current?.addPicture(
        slots[emptyIndex].layout,
        `file://${items[index].src!}`,
      );
      return updated;
    });
    setState(State.RUNNING);
  };

  const handleReset = async () => {
    setState(State.PROCESSING);
    setSlots((prev) =>
      prev.map((value) => ({ item: null, layout: value.layout })),
    );
    setItems((prev) => prev.map((item) => ({ ...item, picked: false })));
    Canvas.current
      ?.dispose()
      .then((response) => {
        if (response === false)
          console.warn("Current canvas already disposed before");
        Canvas.current?.create();
        setState(State.RUNNING);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleSubmit = () => {
    setPictures(slots.map((slot) => slot.item?.src as string));
    phase.next();
  };

  const handleSave = () => {
    if (!isFull) {
      return;
    }
    const object = Canvas.current?.serialize() as string;
    saveCanvas(object);
    setState(State.CONFIRMING);
  };

  const isFull = slots?.every((slot) => slot.item !== null);

  if (state === State.RUNNING || state === State.PROCESSING)
    return (
      <>
        <Page className="flex flex-row items-center justify-center gap-4">
          <div
            className="flex-1 flex items-center justify-center max-h-[80vh]"
            ref={containerRef}
          >
            {canvas}
            {state === State.PROCESSING && <LoadingAnimation />}
          </div>

          <div className="flex-1 flex flex-col gap-8 items-stretch justify-start bg-surface-container p-8 shadow outline rounded">
            <span className="flex-none text-center text-4xl font-bold">
              Select your photos
            </span>
            <div
              className="flex-1 flex flex-wrap max-h-[60vh] overflow-y-auto overflow-x-hidden scroll-smooth gap-4 items-center justify-center
              [&::-webkit-scrollbar]:w-4
  [&::-webkit-scrollbar-track]:rounded-full
  [&::-webkit-scrollbar-track]:bg-surface-container-low
  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-surface-container-high
              [&::-webkit-scrollbar-thumb]:shadow-inset
            "
            >
              {state === State.RUNNING &&
                items.map((item, index) => (
                  <button
                    disabled={item.picked}
                    className={`relative block h-[12rem] w-[16rem] rounded-lg shadow ${item.picked ? "shadow-inset" : ""}`}
                    key={index}
                    style={{
                      backgroundImage: item.picked
                        ? "none"
                        : `url("file://${item.src}")`,
                      backgroundColor: item.picked
                        ? "var(--color-primary-container)"
                        : "none",
                      backgroundSize: "cover",
                    }}
                    onClick={() => !isFull && handlePick(index)}
                  ></button>
                ))}
            </div>
            <div className="flex flex-row items-stretch gap-8">
              <Button className="flex-1" onClick={() => handleReset()}>
                Reset
              </Button>
              <Button
                className="flex-1"
                onClick={() => handleSave()}
                disabled={!isFull}
              >
                Save
              </Button>
            </div>
          </div>
        </Page>
      </>
    );

  if (state === State.CONFIRMING)
    return (
      <>
        <ConfirmPhaseSix
          onCancel={() => setState(State.LOADING)}
          onConfirm={() => handleSubmit()}
        ></ConfirmPhaseSix>
      </>
    );

  if (state === State.LOADING)
    return (
      <>
        <Page>
          <LoadingAnimation />
          <span className="text-xl">Processing your captures</span>
        </Page>
      </>
    );

  if (state === State.ERROR) return <ErrorPage message={errorMessage} />;
}
