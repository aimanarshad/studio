"use client";

import { Input } from "@/components/ui/input";
import { useAutocomplete } from "@/hooks/use-autocomplete";
import React, { useRef, useEffect } from 'react';

interface AutocompleteInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
}

export function AutocompleteInput({ onPlaceSelect, ...props }: AutocompleteInputProps) {
  const { inputRef, suggestions, getSuggestions, clearSuggestions } = useAutocomplete({
    onPlaceSelect
  });

  return (
    <div className="relative w-full">
      <Input
        ref={inputRef}
        {...props}
        onChange={(e) => {
            getSuggestions({ input: e.target.value });
            if (props.onChange) props.onChange(e);
        }}
      />
      {suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-background border border-border rounded-md shadow-lg">
          <ul className="py-1">
            {suggestions.map(({ place_id, description, structured_formatting }) => (
              <li
                key={place_id}
                className="px-3 py-2 cursor-pointer hover:bg-accent"
                onClick={() => {
                  if (inputRef.current) {
                    inputRef.current.value = description;
                  }
                  onPlaceSelect({
                      name: structured_formatting.main_text,
                      formatted_address: description,
                      place_id: place_id,
                  });
                  clearSuggestions();
                }}
              >
                <div className="font-semibold">{structured_formatting.main_text}</div>
                <div className="text-sm text-muted-foreground">{structured_formatting.secondary_text}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
