"use client"

import {useState} from "react";
import FormField, { inputClass } from "./FormField";


const cities = [
  "Dublin, Ireland",
  "New York, USA",
  "London, UK",
  "Paris, France",
  "Berlin, Germany",
  "Madrid, Spain",
  "Rome, Italy",
];

type Props = {
  id: string;
  label: string;
  value: string;
  onChangeAction: (value: string) => void;
};

export default function Autocomplete({ id, label, value, onChangeAction }: Props) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    onChangeAction(input);

    if (input.length === 0) {
      setSuggestions([]);
      return;
    }

    const filtered = cities.filter((city) =>
      city.toLowerCase().includes(input.toLowerCase())
    );

    setSuggestions(filtered);
    setShowDropdown(true);
  };

  const handleSelect = (city: string) => {
    onChangeAction(city);
    setSuggestions([]);
    setShowDropdown(false);
  };

  return (
    <div className="relative">
      <FormField id={id} label={label}>
        <input
          id={id}
          className={inputClass}
          value={value}
          onChange={handleInputChange}
          onFocus={() => setShowDropdown(true)}
          placeholder="e.g. City, Country"
          autoComplete="off"
          required
        />
      </FormField>

      {showDropdown && suggestions.length > 0 && (
        <ul className="absolute top-full left-0 z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
          {suggestions.map((city) => (
            <li
              key={city}
              onClick={() => handleSelect(city)}
              className="cursor-pointer px-3 py-2 text-sm text-slate-700 hover:bg-sky-50"
            >
              {city}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
