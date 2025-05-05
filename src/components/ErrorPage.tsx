import { useEffect } from "react";
import LoggerService from "../services/LoggerService";

interface ErrorPageProps {
  message: string;
  code?: string;
}
export default function ErrorPage({ message, code = "" }: ErrorPageProps) {
  useEffect(() => {
    LoggerService.error(message);
  });
  return (
    <>
      <div
        className="m-8 p-8 rounded-lg bg-error w-[40vw] flex flex-col items-start
                  justify-end text-wrap text-on-error text-[4rem] font-bold"
      >
        We're very sorry for the inconvenient, but our machine is out of service
        at the moment.
        <small className="text-sm">{message}</small>
      </div>

      {code && (
        <span
          className="px-8 w-[40vw] flex
                  items-start justify-start text-wrap text-error font-bold"
        >
          Code: {code}
        </span>
      )}
    </>
  );
}
