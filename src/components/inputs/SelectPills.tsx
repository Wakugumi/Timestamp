/**
 * SelectPills component
 *
 * @component
 * @param {string[]} options - Array of options to select
 * @param {(value: string) => void} onSelect - callback returning the selected options as string
 */

import React, { useState } from "react";

type Props = {
  /** optional CSS classes */
  className?: string;
  /** Array of options to select */
  options: string[];
  /** callback function returning the selected options as string */
  onSelect: (value: string) => void;
};

const SelectPills: React.FC<Props> = ({
  options,
  onSelect,
  className = "",
}) => {
  const [selected, setSelected] = useState(options[0]);

  const handleSelect = (value: string) => {
    setSelected(value);
    onSelect(value);
  };

  return (
    <div className={`flex flex-row items-center ${className}`}>
      {options.map((option) => (
        <button
          key={option}
          onClick={() => handleSelect(option)}
          className={`px-8 py-2 rounded-full border border-secondary transition text-xl ${
            selected === option
              ? "bg-secondary text-on-secondary"
              : "bg-transparent"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
};
export default SelectPills;
