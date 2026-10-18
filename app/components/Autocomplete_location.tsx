"use client"

import { useState } from "react";
import FormField, { inputProps } from "./FormField";
import { COUNTRIES } from "@/lib/countries";

const MAX_SUGGESTIONS = 8;
type Props = {
  id: string;
  label: string;
  value: string;
  error?: string;
  onChangeAction: (value: string) => void;
};

export default function Autocomplete({ id, label, value, error, onChangeAction }: Props) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    onChangeAction(input);

    const query = input.trim().toLowerCase();
    if (query.length === 0) {
      setSuggestions([]);
      return;
    }

    setSuggestions(
      COUNTRIES.filter((country) => country.toLowerCase().includes(query)).slice(0, MAX_SUGGESTIONS)
    );
    setShowDropdown(true);
  };

  const handleSelect = (country: string) => {
    onChangeAction(country);
    setSuggestions([]);
    setShowDropdown(false);
  };

  return (
    <div className="relative">
      <FormField id={id} label={label} error={error}>
        <input
          {...inputProps(id, error)}
          value={value}
          onChange={handleInputChange}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setShowDropdown(false)}
          placeholder="Start typing a country"
          autoComplete="off"
          maxLength={60}
        />
      </FormField>

      {showDropdown && suggestions.length > 0 && (
        <ul className="absolute top-full left-0 z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
          {suggestions.map((country) => (
            <li
              key={country}
              // mousedown fires before the input's blur closes the list
              onMouseDown={(e) => { e.preventDefault(); handleSelect(country); }}
              className="cursor-pointer px-3 py-2 text-sm text-slate-700 hover:bg-sky-50"
            >
              {country}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
