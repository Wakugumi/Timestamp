import { Children, useEffect, useState } from "react";

type RadioProps = {
  options: { value: any; label: any }[];
  className?: string;
  onChange: (value: any) => void;
  value: any;
  label?: string;
};

export default function Radio<T extends string | number>({
  options = [],
  className = "",
  onChange,
  value,
  label = "Radio",
}: RadioProps) {
  const [selected, setSelected] = useState<{ value: T; label: T }>({
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
