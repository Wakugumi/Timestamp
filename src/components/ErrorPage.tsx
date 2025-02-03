interface ErrorPageProps {
  message: string;
  code?: string;
}
export default function ErrorPage({ message, code = "" }: ErrorPageProps) {
  return (
    <>
      <div
        className="m-8 p-8 rounded-lg bg-error w-[40vw] h-[60vh] flex
                  items-end justify-end text-wrap text-on-error text-[4rem] font-bold"
      >
        {message}
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
