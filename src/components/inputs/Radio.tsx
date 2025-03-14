import { useEffect, useState } from "react";

type RadioProps<T extends string | number> = {
  options: { value: T; label: T }[];
  className?: string;
  onChange: (value: T) => void;
  value: T;
};

export default function Radio<T extends string | number>({
  options = [],
  className = "",
  onChange,
  value,
}: RadioProps<T>) {
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
