"use client"

import {useState} from "react";


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
  label: string;
  value: string;
  onChangeAction: (value: string) => void;
};

export default function Autocomplete({ label, value, onChangeAction }: Props) {
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
    <div className="flex flex-col relative">
      <label className="mb-1 font-medium">{label}</label>

      <input
        className="border p-2 rounded"
        value={value}
        onChange={handleInputChange}
        onFocus={() => setShowDropdown(true)}
        placeholder="e.g City, Country"
        required

      />

      {showDropdown && suggestions.length > 0 && (
        <ul className="absolute top-full left-0 w-full bg-white border rounded shadow mt-1 z-10 max-h-40 overflow-y-auto">
          {suggestions.map((city) => (
            <li
              key={city}
              onClick={() => handleSelect(city)}
              className="p-2 hover:bg-blue-100 cursor-pointer"
            >
              {city}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

