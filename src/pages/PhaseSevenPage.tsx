import { useRef, useState, useEffect } from "react";
import { globalData } from "../contexts/DataContext";
import Page from "../components/Page";
import CanvasFraming from "../utilities/CanvasFraming";
import Frame from "../interfaces/Frame";
import BackendService from "../services/BackendService";
import { FilterPreset } from "../interfaces/ImageFilter";
import ImageFilterService from "../services/ImageFilterService";
import Button from "../components/Button.tsx";
import { usePhase } from "../contexts/PhaseContext.tsx";
import LoggerService from "../services/LoggerService.tsx";

enum State {
  LOADING,
  RUNNING,
  PROCCESSING,
  ERROR,
  CONFIRMING,
}

export default function PhaseSevenPage() {
  const [state, setState] = useState<State>(State.LOADING);
  const [presets, setPresets] = useState<FilterPreset[]>([]);
  const [selected, setSelected] = useState<number>(-1);
  const phase = usePhase();

  const data = globalData();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const Canvas = useRef<CanvasFraming | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvasFrame = new CanvasFraming(
      containerRef.current as HTMLDivElement,
      canvasRef.current as HTMLCanvasElement,
      data.frame as Frame,
    );

    Canvas.current = canvasFrame;

    (async () => {
      setPresets(await ImageFilterService.getFilters());

      await canvasFrame.create();
      await canvasFrame.deserialize(data.canvas as string);
    })()
      .then(() => {
        setState(State.RUNNING);
      })
      .catch((error) => {
        console.error(error);
      });

    return () => {
      canvasFrame.dispose();
    };
  }, []);

  function Confirm() {
    return (
      <>
        <div className="flex flex-col justify-between items-stretch gap-8">
          <span className="flex-1 text-4xl font-bold text-center">
            Are you sure?
          </span>

          <div className="flex flex-col gap-8">
            <Button
              type="danger"
              variant="fill"
              onClick={() => {
                setState(State.RUNNING);
              }}
            >
              Wait, I want to change
            </Button>
            <Button onClick={() => handleSave()}>Yes, I'm sure</Button>
          </div>
        </div>
      </>
    );
  }
  const handleApply = async (preset: FilterPreset, index: number) => {
    setState(State.PROCCESSING);
    setSelected(index);
    Canvas.current?.applyFilter(preset).then(() => {
      setState(State.RUNNING);
    });
  };

  const handleSave = async () => {
    const img = new Image();
    if (!data.frame?.url) {
      LoggerService.error(
        "Data for frame url is empty when saving attempting to save current canvas",
      );
      setState(State.ERROR);
    }
    img.src = data.frame?.url as string;
    img.onload = async () => {
      const exports = (await Canvas.current?.export(
        img.naturalWidth,
        img.naturalHeight,
      )) as string;
      await BackendService.saveCanvas(exports);

      const printedExports = await Canvas.current?.replicateAndExport(
        exports,
        img.naturalWidth,
        img.naturalHeight,
      );
      await BackendService.print(
        data.frame?.split ? (printedExports as string) : exports,
        data.quantity,
        data.frame?.split as boolean,
      );
    };

    data.saveCanvas(Canvas.current?.serialize() as string);

    phase?.next();
  };

  return (
    <>
      <Page className="flex flex-row justify-center items-stretch gap-8">
        <div
          className="flex flex-1 items-center justify-center max-h-[80vh]"
          ref={containerRef}
        >
          <canvas ref={canvasRef} />
        </div>

        <div className="flex-none flex flex-col jusfify-between items-stretch gap-8 p-8 outline shadow rounded bg-surface-container">
          {state === State.CONFIRMING && <Confirm />}
          {state === State.RUNNING && (
            <>
              <span className="text-4xl font-bold text-center">
                Apply image fitler
              </span>
              <div
                className="flex-1 flex flex-col gap-8 overflow-y-auto overflow-x-hidden scroll-smooth [&::-webkit-scrollbar]:w-4
            [&::-webkit-scrollbar-track]:rounded-full
            [&::-webkit-scrollbar-track]:bg-surface-container-low
            [&::-webkit-scrollbar-thumb]:rounded-full
            [&::-webkit-scrollbar-thumb]:bg-surface-container-high
            [&::-webkit-scrollbar-thumb]:shadow-inset"
              >
                {presets.map((preset, index) => (
                  <Button
                    key={index}
                    className="flex p-12 justify-center items-center bg-primary-container rounded-xl text-4xl"
                    disabled={selected === index}
                    onClick={() => handleApply(preset, index)}
                  >
                    {preset.name}
                  </Button>
                ))}
              </div>

              <Button className="" onClick={() => setState(State.CONFIRMING)}>
                Save
              </Button>
            </>
          )}
        </div>
      </Page>
    </>
  );
}
