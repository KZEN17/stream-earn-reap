import { Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export function FontToggle() {
  const [isClashDisplay, setIsClashDisplay] = useState(() => {
    return localStorage.getItem("font-preference") === "clash";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isClashDisplay) {
      root.classList.add("font-clash");
      localStorage.setItem("font-preference", "clash");
    } else {
      root.classList.remove("font-clash");
      localStorage.setItem("font-preference", "space-grotesk");
    }
  }, [isClashDisplay]);

  const toggleFont = () => {
    setIsClashDisplay(!isClashDisplay);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleFont}
      className="relative group"
      title={isClashDisplay ? "Switch to Space Grotesk" : "Switch to Clash Display"}
    >
      <Type className="h-5 w-5 transition-all group-hover:scale-110" />
      <span className="sr-only">Toggle font family</span>
      <div className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full bg-primary/60 animate-pulse" />
    </Button>
  );
}