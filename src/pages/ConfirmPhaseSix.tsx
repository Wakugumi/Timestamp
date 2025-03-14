import { useEffect, useRef } from "react";
import { globalData } from "../contexts/DataContext";
import Page from "../components/Page";
import Button from "../components/Button";
import CanvasFraming from "../utilities/CanvasFraming";
import Frame from "../interfaces/Frame";

interface ConfirmPhaseSixProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmPhaseSix({
  onConfirm,
  onCancel,
}: ConfirmPhaseSixProps) {
  const { frame, canvas, pictures } = globalData();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvasFrame = new CanvasFraming(
      containerRef.current as HTMLDivElement,
      canvasRef.current as HTMLCanvasElement,
      frame as Frame,
    );

    (async () => {
      await canvasFrame.create();
      console.log(canvas);
    })()
      .then(() => {
        canvasFrame.deserialize(canvas);
      })
      .catch((error) => {
        console.error(error);
        onCancel();
      });

    return () => {
      canvasFrame.dispose();
    };
  }, []);

  return (
    <>
      <Page className="flex flex-row gap-8 justify-center items-center">
        <div className="flex-1 flex flex-row justify-evenly items-center">
          <div
            className="flex-1 flex items-center justify-center max-h-[80vh]"
            ref={containerRef}
          >
            <canvas ref={canvasRef} />
          </div>
        </div>

        <div className="flex flex-col justify-evenly items-stretch gap-8">
          <h1 className="text-4xl">Are you sure with your choice?</h1>
          <div className="flex flex-row items-stretch gap-8">
            <Button className="flex-1" onClick={() => onCancel()}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={() => onConfirm()}>
              Yes
            </Button>
          </div>
        </div>
      </Page>
    </>
  );
}
