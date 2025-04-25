import { useEffect, useRef, useState } from "react";
import BackendService from "../services/BackendService";

interface LiveviewProps {
  width?: string;
  height?: string;
  pause?: boolean;
}

export default function Liveview({
  width = "1440",
  height = "720",
  pause = false,
}: LiveviewProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!wsRef.current && !pause) _stream();

    let interval = setInterval(() => {
      if (!pause)
        BackendService.saveMotion(
          canvasRef.current?.toDataURL("image/jpeg", 0.5)!,
        );
    }, 500);

    if (pause) {
      clearInterval(interval);
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    }
    return () => {
      clearInterval(interval);
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [pause]);

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

      if (buffer.length > 10) buffer.shift();

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
