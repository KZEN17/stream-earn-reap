import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Type } from 'lucide-react';

export const FontToggle = () => {
  const [useClashDisplay, setUseClashDisplay] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('use-clash-display');
    if (stored) {
      setUseClashDisplay(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--font-heading',
      useClashDisplay ? '"Clash Display", "Inter", sans-serif' : '"Inter", sans-serif'
    );
    localStorage.setItem('use-clash-display', JSON.stringify(useClashDisplay));
  }, [useClashDisplay]);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setUseClashDisplay(!useClashDisplay)}
      className="relative"
      title={`Switch to ${useClashDisplay ? 'Inter' : 'Clash Display'} headings`}
    >
      <Type className="h-4 w-4" />
      {useClashDisplay && (
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full glow-accent" />
      )}
    </Button>
  );
};