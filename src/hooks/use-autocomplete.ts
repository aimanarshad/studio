"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { useMapsLibrary } from '@vis.gl/react-google-maps';

type AutocompleteProps = {
  onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
};

export function useAutocomplete({ onPlaceSelect }: AutocompleteProps) {
  const [suggestions, setSuggestions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const places = useMapsLibrary('places');
  const sessionTokenRef = useRef<google.maps.places.AutocompleteSessionToken>();

  useEffect(() => {
    if (places) {
      sessionTokenRef.current = new places.AutocompleteSessionToken();
    }
  }, [places]);

  const getSuggestions = useCallback(
    (request: google.maps.places.AutocompletionRequest) => {
      if (!places || !inputRef.current) return;

      const service = new places.AutocompleteService();
      service.getPlacePredictions({ ...request, sessionToken: sessionTokenRef.current }, (predictions, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
          setSuggestions(predictions);
        } else {
          setSuggestions([]);
        }
      });
    },
    [places]
  );
  
  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
  }, []);

  return { inputRef, suggestions, getSuggestions, clearSuggestions };
}
