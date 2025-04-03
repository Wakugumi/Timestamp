import { useEffect, useRef } from "react";

interface CameraPreviewProps {
  width?: string;
  height?: string;
  pause?: boolean;
}
const CameraPreview = ({
  width = "1920",
  height = "1080",
  pause = false,
}: CameraPreviewProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    console.log("[CameraPreview] Mounts");

    return () => {
      console.log("[CameraPreview] Unmounts");
    };
  }, []);

  useEffect(() => {
    console.log("[CameraPreview] Pause: ", pause);

    if (pause && wsRef.current) {
      wsRef.current?.close();
      const ctx = canvasRef.current?.getContext("2d");
      ctx?.clearRect(
        0,
        0,
        canvasRef.current?.width as number,
        canvasRef.current?.height as number,
      );
    } else if (!pause) _videoStream();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [pause]);

  /** Video stream hander */
  const _videoStream = () => {
    console.log("Video stream called");
    if (!canvasRef.current) return;

    wsRef.current = new WebSocket("ws://localhost:8080");
    console.log("[CameraPreview] Websocket opens");
    wsRef.current.binaryType = "blob";

    let imageBuffer: Uint8Array<ArrayBufferLike>[] = [];
    const canvas = canvasRef.current?.getContext("2d", {
      willReadFrequently: true,
    });

    window.electron?.onStream((chunk: any) => {
      imageBuffer.push(chunk);

      if (imageBuffer.length > 10) imageBuffer.shift();

      if (!imageBuffer.length) return;
      const latestChunk = imageBuffer[imageBuffer.length - 1];

      const blob = new Blob([latestChunk], { type: "image/jpeg" });
      const url = URL.createObjectURL(blob);
      const img = new Image();

      img.onload = function render() {
        canvas?.drawImage(
          img,
          0,
          0,
          canvasRef.current?.width as number,
          canvasRef.current?.height as number,
        );
        URL.revokeObjectURL(img.src);
      };
      img.src = url;
      imageBuffer = [];
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
