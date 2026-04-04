"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const countryCodes = [
  { code: "+1", flag: "🇺🇸" },
  { code: "+1", flag: "🇨🇦" },
  { code: "+44", flag: "🇬🇧" },
  { code: "+33", flag: "🇫🇷" },
  { code: "+49", flag: "🇩🇪" },
  { code: "+91", flag: "🇮🇳" },
  { code: "+61", flag: "🇦🇺" },
  { code: "+81", flag: "🇯🇵" },
  { code: "+86", flag: "🇨🇳" },
  { code: "+55", flag: "🇧🇷" },
  { code: "+34", flag: "🇪🇸" },
  { code: "+39", flag: "🇮🇹" },
  { code: "+82", flag: "🇰🇷" },
  { code: "+7", flag: "🇷🇺" },
  { code: "+52", flag: "🇲🇽" },
  { code: "+31", flag: "🇳🇱" },
  { code: "+46", flag: "🇸🇪" },
  { code: "+41", flag: "🇨🇭" },
  { code: "+90", flag: "🇹🇷" },
  { code: "+966", flag: "🇸🇦" },
  { code: "+971", flag: "🇦🇪" },
  { code: "+20", flag: "🇪🇬" },
  { code: "+27", flag: "🇿🇦" },
  { code: "+234", flag: "🇳🇬" },
  { code: "+254", flag: "🇰🇪" },
  { code: "+212", flag: "🇲🇦" },
  { code: "+213", flag: "🇩🇿" },
  { code: "+216", flag: "🇹🇳" },
];

interface CountryCodeSelectProps {
  value: string;
  onChange: (code: string) => void;
}

const CountryCodeSelect = ({ value, onChange }: CountryCodeSelectProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected =
    countryCodes.find((c) => c.code === value) || countryCodes[0];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* Button */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1 px-3 h-12 rounded-l-xl border-2 border-r-0 border-border bg-muted/50 hover:bg-muted transition-colors text-sm font-medium"
      >
        <span className="text-lg">{selected.flag}</span>
        <span className="text-foreground">{selected.code}</span>
        <ChevronDown className="w-3 h-3 text-muted-foreground" />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-1 w-40 max-h-60 overflow-y-auto bg-card border border-border rounded-xl shadow-lg z-50"
          >
            {countryCodes.map((c, index) => (
              <button
                key={`${c.code}-${index}`}
                type="button"
                onClick={() => {
                  onChange(c.code);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors ${
                  c.code === value
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-foreground"
                }`}
              >
                <span className="text-lg">{c.flag}</span>
                <span className="text-muted-foreground">{c.code}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CountryCodeSelect;