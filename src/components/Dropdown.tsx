/**
 * SelectInput Component
 *
 *
 * @template T - The type of the select input value (string or number).
 *
 * @param {Object} props - The properties passed to the component.
 * @param {{ value: T; label: string }[]} props.options - An array of options where each option has a `value` and a `label`.
 * @param {(value: T) => void} props.onChange - Callback function triggered when the selected value changes.
 * @param {T} props.value - The currently selected value.
 * @param {string} [props.label] - Optional label for the select input.
 * @param {string} [props.className] - Optional additional CSS classes for styling.
 *
 * @returns {JSX.Element} The rendered select input component.
 */

type DropdownProps<T extends string | number> = {
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
  value: T;
  label?: string;
  className?: string;
};

const Dropdown = <T extends string | number>({
  options,
  onChange,
  value,
  label,
  className = "",
}: DropdownProps<T>): JSX.Element => {
  return (
    <div
      className={`flex items-center px-4 py-2 border rounded-full ${className}`}
    >
      {label && (
        <span className="text-sm font-medium text-gray-600 mr-2">{label}</span>
      )}
      <div className="flex-1 border-l pl-2 relative">
        <select
          className="w-full bg-transparent focus:outline-none appearance-none cursor-pointer"
          value={value}
          onChange={(e) => onChange(e.target.value as T)}
        >
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="bg-white text-black p-2 hover:bg-gray-200"
            >
              {option.label}
            </option>
          ))}
        </select>
        <span className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
          ▼
        </span>
        <style>{`
          select::-webkit-scrollbar {
            width: 8px;
          }
          select::-webkit-scrollbar-track {
            background: #f1f1f1;
          }
          select::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 4px;
          }
          select::-webkit-scrollbar-thumb:hover {
            background: #555;
          }
          select option {
            padding: 10px;
            background-color: white;
            color: black;
          }
          select option:hover {
            background-color: #f3f3f3;
          }
        `}</style>
      </div>
    </div>
  );
};

export default Dropdown;
