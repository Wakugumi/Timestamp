import { useEffect, useRef } from "react";
import BackendService from "../services/BackendService";

interface LiveviewProps {
  width?: string;
  height?: string;
}

export default function Liveview({
  width = "1920",
  height = "1080",
}: LiveviewProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!wsRef.current) _stream();

    let interval = setInterval(() => {
      if (wsRef.current)
        BackendService.sendMotion(
          canvasRef.current?.toDataURL("image/jpeg", 0.5)!,
        );
    }, 500);

    return () => {
      clearInterval(interval);
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, []);

  const _stream = () => {
    if (!canvasRef.current) return;

    wsRef.current = new WebSocket("ws://localhost:8080");
    wsRef.current.binaryType = "blob";

    let buffer: Uint8Array<ArrayBufferLike>[] = [];
    const canvas = canvasRef.current?.getContext("2d", {
      willReadFrequently: true,
    });

    window.electron?.onStream((chunk: Uint8Array) => {
      buffer.push(chunk);

      if (buffer.length > 32) buffer.shift();

      if (!buffer.length) return;
      const latestChunk = buffer[buffer.length - 1];

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
      buffer = [];
    });
    wsRef.current.onclose = () => {
      console.log("socket disconnected");
      wsRef.current = null;
    };
  };

  return (
    <>
      <div className="rounded-lg shadow outline outline-outline-variant">
        <canvas ref={canvasRef} width={width} height={height} />
      </div>
    </>
  );
}
