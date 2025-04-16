'use client';
import { useState, useEffect } from 'react';

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(initialValue);
  const [isMounted, setIsMounted] = useState(false);

  // Initialize from localStorage only once after mount
  useEffect(() => {
    setIsMounted(true);
    try {
      const storedValue = localStorage.getItem(key);
      if (storedValue !== null) {
        setValue(JSON.parse(storedValue));
      }
    } catch (error) {
      console.error('LocalStorage error:', error);
    }
  }, [key]); // Only depends on key

  // Save to localStorage when value changes (after mount)
  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('LocalStorage error:', error);
    }
  }, [value, key, isMounted]);

  return [value, setValue];
}