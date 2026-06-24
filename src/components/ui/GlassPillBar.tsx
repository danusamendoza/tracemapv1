import React from 'react';

interface CategoryOption {
  label: string;
  value: string;
}

interface GlassPillBarProps {
  categories: CategoryOption[];
  activeValue: string;
  onSelect: (value: string) => void;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  className?: string;
}

/**
 * Glass, pill-shaped top bar that floats over the immersive map.
 * Holds scrollable category pills with optional leading/trailing slots
 * (e.g. an avatar/back button on the left, a filter action on the right).
 */
export default function GlassPillBar({
  categories,
  activeValue,
  onSelect,
  leading,
  trailing,
  className = '',
}: GlassPillBarProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {leading}
      <div className="glass-card rounded-full h-11 px-1.5 flex items-center gap-1 overflow-x-auto no-scrollbar flex-1 min-w-0">
        {categories.map((cat) => {
          const isActive = activeValue === cat.value;
          return (
            <button
              key={cat.value}
              onClick={() => onSelect(cat.value)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-[11px] font-extrabold tracking-wide transition-all duration-200 ${
                isActive
                  ? 'bg-black text-white shadow-[0_4px_14px_rgba(0,0,0,0.25)]'
                  : 'text-neutral-700 hover:bg-white/60'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>
      {trailing}
    </div>
  );
}
