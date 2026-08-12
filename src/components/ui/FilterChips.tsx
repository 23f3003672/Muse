"use client";

import { useState } from "react";

interface FilterChipsProps {
  categories: string[];
  activeCategory: string;
  onSelect: (category: string) => void;
}

export default function FilterChips({ categories, activeCategory, onSelect }: FilterChipsProps) {
  return (
    <div className="flex items-center gap-3 overflow-x-auto pb-4 mb-8 hide-scrollbar snap-x">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelect(category)}
          className={`shrink-0 snap-center px-6 py-2 rounded-full text-xs font-medium uppercase tracking-wider transition-colors border ${
            activeCategory === category
              ? "bg-primary border-primary text-primary-foreground"
              : "bg-transparent border-border text-foreground hover:border-primary hover:text-primary"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
