"use client";

import React from "react";
import { Search, RotateCcw, Building2, Landmark, GraduationCap, Star, ShieldAlert } from "lucide-react";

export interface FilterState {
  search: string;
  type: string[];
  ownership: string[];
  fees: number;
  rating: number | null;
  state: string;
}

interface FilterSidebarProps {
  filters: FilterState;
  onChange: (newFilters: FilterState) => void;
  onClear: () => void;
  availableStates: string[];
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onChange,
  onClear,
  availableStates,
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filters, search: e.target.value });
  };

  const handleTypeToggle = (type: string) => {
    const nextTypes = filters.type.includes(type)
      ? filters.type.filter((t) => t !== type)
      : [...filters.type, type];
    onChange({ ...filters, type: nextTypes });
  };

  const handleOwnershipToggle = (ownership: string) => {
    const nextOwnership = filters.ownership.includes(ownership)
      ? filters.ownership.filter((o) => o !== ownership)
      : [...filters.ownership, ownership];
    onChange({ ...filters, ownership: nextOwnership });
  };

  const handleFeesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filters, fees: Number(e.target.value) });
  };

  const handleRatingChange = (rating: number | null) => {
    onChange({ ...filters, rating });
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...filters, state: e.target.value });
  };

  const streams = ["Engineering", "Management", "Medical", "Commerce"];
  const ownerships = ["Government", "Private"];

  const formatCurrency = (val: number) => {
    if (val >= 100000) {
      return `₹${(val / 100000).toFixed(1)} Lakh`;
    }
    return `₹${val.toLocaleString()}`;
  };

  return (
    <aside className="w-full flex flex-col gap-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-800 shrink-0">
      {/* Filters Title & Reset */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
        <h3 className="font-bold text-slate-900 dark:text-white">Filters</h3>
        <button
          onClick={onClear}
          className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset All
        </button>
      </div>

      {/* Search Filter */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Search College
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="Search name or location..."
            value={filters.search}
            onChange={handleSearchChange}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:focus:border-indigo-400 transition-colors"
          />
          <Search className="absolute left-3.5 top-3 h-4.5 w-4.5 text-slate-455 dark:text-slate-505" />
        </div>
      </div>

      {/* Stream/Type Filter */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Stream / Discipline
        </label>
        <div className="flex flex-col gap-2">
          {streams.map((stream) => (
            <label
              key={stream}
              className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={filters.type.includes(stream)}
                onChange={() => handleTypeToggle(stream)}
                className="h-4.5 w-4.5 rounded border-slate-300 text-indigo-650 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950"
              />
              <span>{stream}</span>
            </label>
          ))}
        </div>
      </div>

      {/* State Filter */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Location (State)
        </label>
        <select
          value={filters.state}
          onChange={handleStateChange}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:focus:border-indigo-400 transition-colors"
        >
          <option value="">All States</option>
          {availableStates.map((st) => (
            <option key={st} value={st.toLowerCase()}>
              {st}
            </option>
          ))}
        </select>
      </div>

      {/* Fees Filter */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Max Annual Fees
          </label>
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
            {formatCurrency(filters.fees)}
          </span>
        </div>
        <input
          type="range"
          min="1000"
          max="1500000"
          step="10000"
          value={filters.fees}
          onChange={handleFeesChange}
          className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600 dark:accent-indigo-400"
        />
        <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-semibold">
          <span>₹1K</span>
          <span>₹15L</span>
        </div>
      </div>

      {/* Rating Filter */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Minimum Rating
        </label>
        <div className="grid grid-cols-4 gap-1.5">
          {[
            { value: null, label: "Any" },
            { value: 4.0, label: "4.0+" },
            { value: 4.5, label: "4.5+" },
            { value: 4.8, label: "4.8+" },
          ].map((opt) => (
            <button
              key={opt.label}
              onClick={() => handleRatingChange(opt.value)}
              className={`rounded-lg py-1.5 text-xs font-bold transition-all border ${
                filters.rating === opt.value
                  ? "bg-indigo-600 border-indigo-600 text-white dark:bg-indigo-500 dark:border-indigo-500"
                  : "bg-slate-55 border-slate-200 text-slate-650 hover:bg-slate-100 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-350 dark:hover:bg-slate-800"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Ownership Filter */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Ownership
        </label>
        <div className="flex flex-col gap-2">
          {ownerships.map((owner) => (
            <label
              key={owner}
              className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={filters.ownership.includes(owner)}
                onChange={() => handleOwnershipToggle(owner)}
                className="h-4.5 w-4.5 rounded border-slate-300 text-indigo-650 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950"
              />
              <span>{owner}</span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
};
