import { Ref, RefAttributes, useEffect, useRef } from "react";

interface CameraPreviewProps {
  width?: string;
  height?: string;
  pause?: boolean;
}
const CameraPreview = ({
  width = "1640",
  height = "1080",
  pause = false,
}: CameraPreviewProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    console.log("CameraPreview mounts");
  }, []);
  useEffect(() => {
    if (wsRef.current) return;
    _videoStream();
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [wsRef.current]);

  useEffect(() => {
    if (pause) {
      wsRef.current?.close();
      const ctx = canvasRef.current?.getContext("2d");
      ctx?.clearRect(
        0,
        0,
        canvasRef.current?.width as number,
        canvasRef.current?.height as number,
      );
    } else if (!pause && wsRef.current) _videoStream();
  }, [pause]);

  /** Video stream hander */
  const _videoStream = () => {
    if (!canvasRef.current) return;

    wsRef.current = new WebSocket("ws://localhost:8080");
    wsRef.current.binaryType = "blob";

    window.electron?.onStream((chunk: Uint8Array) => {
      const canvas = canvasRef.current?.getContext("2d", {
        willReadFrequently: true,
      });
      const render = () => {
        const blob = new Blob([chunk.subarray(0, 8192)]);
        const img = new Image();
        img.src = URL.createObjectURL(blob);

        img.onload = function render() {
          canvas?.clearRect(
            0,
            0,
            canvasRef.current?.width as number,
            canvasRef.current?.height as number,
          );
          canvas?.drawImage(
            img,
            0,
            0,
            canvasRef.current?.width as number,
            canvasRef.current?.height as number,
          );
          URL.revokeObjectURL(img.src);
        };
      };
      requestAnimationFrame(render);
    });
    wsRef.current.onclose = () => console.log("socket disconnected");
  };
  return (
    <>
      <div className="rounded-lg shadow outline outline-outline-variant">
        <canvas ref={canvasRef} width={width} height={height} />
      </div>
    </>
  );
};
export default CameraPreview;
