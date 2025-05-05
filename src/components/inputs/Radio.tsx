import { useEffect, useState } from "react";

type RadioProps<
  TValue extends string | number,
  TLabel extends string | number,
> = {
  options: { value: TValue; label: TLabel }[];
  className?: string;
  onChange: (value: TValue) => void;
  value: any;
};

export default function Radio<
  TValue extends string | number,
  TLabel extends string | number,
>({
  options = [],
  className = "",
  onChange,
  value,
}: RadioProps<TValue, TLabel>) {
  const [selected, setSelected] = useState<{ value: TValue; label: TLabel }>({
    value: value,
    label: value,
  });

  useEffect(() => onChange(selected.value), [selected]);

  return (
    <>
      <div className={`flex flex-wrap gap-4 ${className}`}>
        {options.map((value, index) => (
          <button
            className={`rounded-full px-8 py-4 border-4 border-outline-variant ${value.value === selected.value ? `bg-primary-container text-on-primary-container border-primary` : ""}`}
            onClick={() => setSelected(value)}
            key={index}
          >
            {value.label}
          </button>
        ))}
      </div>
    </>
  );
}
