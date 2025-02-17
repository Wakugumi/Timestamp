interface IdleMessageProps {
  message: string;
}
export default function IdleMessage({ message }: IdleMessageProps) {
  if (message)
    return (
      <div className="absolute top-[2rem] left-[2rem] bg-tertiary text-on-tertiary p-4 rounded shadow">
        {message}
      </div>
    );
}
