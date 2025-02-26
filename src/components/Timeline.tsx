import { useState } from "react";

interface TimelineProps {
  elapsed: number;
  duration: number;
  interval: number;
}

export default function Timeline({
  elapsed,
  duration,
  interval,
}: TimelineProps) {
  // Generate checkpoints at specified intervals
  const checkpoints = [];
  for (let i = 0; i <= duration; i += interval) {
    checkpoints.push(i);
  }

  const cursorPosition = (elapsed / duration) * 100;

  return (
    <div className="flex items-center p-4 w-full">
      <div className="timer-container">
        <div className="timer-line">
          {checkpoints.map((checkpoint) => (
            <div
              key={checkpoint}
              className="checkpoint"
              style={{ left: `${(checkpoint / duration) * 100}%` }}
            ></div>
          ))}

          {/* Cursor */}
          <div
            className="cursor"
            style={{
              left: `${cursorPosition}%`,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}
