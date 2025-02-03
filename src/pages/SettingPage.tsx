import { useCallback, useRef, useState } from "react";
import { Camera } from "web-gphoto2";
import { useNavigate } from "react-router";

interface Log {
  timestamp: string;
  message: string;
}

export default function SettingPage() {
  const navigate = useNavigate();
  const [logState, setLogState] = useState<Log[]>([]);

  const log = (message: string) => {
    const datetime = new Date().toLocaleDateString();
    const newLog: Log = {
      timestamp: datetime,
      message: message,
    };
    setLogState([...logState, newLog]);
  };

  return (
    <>
      <div className="grid grid-rows-2 grid-cols-6 min-h-lvh max-h-lvh p-12 gap-12 bg-surface-container">
        <div
          className="row-span-1 col-span-6 flex flex-col justify-end items-start p-8
      rounded-lg bg-inverse-surface text-slate-50"
        >
          {logState && (
            <>
              {logState.map((value, index) => (
                <span key={index} className="font-mono">
                  [{value.timestamp.toString()}] {value.message.toString()}
                </span>
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
}
