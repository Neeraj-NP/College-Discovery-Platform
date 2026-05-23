"use client";

import React from "react";
import Link from "next/link";
import { X, Scale, Trash2 } from "lucide-react";
import { useAppState } from "@/context/AppStateContext";
import { mockColleges } from "@/data/mockColleges";

export const CompareBar: React.FC = () => {
  const { compareList, removeFromCompare, clearCompare } = useAppState();

  if (compareList.length === 0) return null;

  const selectedColleges = mockColleges.filter((c) => compareList.includes(c.id));

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 p-4 pointer-events-none">
      <div className="mx-auto max-w-3xl pointer-events-auto rounded-2xl border border-slate-200/90 bg-white/95 p-4 shadow-2xl backdrop-blur-md transition-all dark:border-slate-800/90 dark:bg-slate-900/95 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Selected Colleges List */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
            <Scale className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Compare Colleges ({compareList.length}/3)
            </h4>
            <p className="text-xs text-slate-500 hidden sm:block">
              Select up to 3 colleges to compare details.
            </p>
          </div>
        </div>

        {/* Selected Badges */}
        <div className="flex items-center gap-2">
          {selectedColleges.map((college) => (
            <div
              key={college.id}
              className="flex items-center gap-1.5 rounded-lg border border-slate-100 bg-slate-50/50 py-1.5 pl-3 pr-2 text-xs font-semibold text-slate-800 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-200"
            >
              <span>{college.shortName}</span>
              <button
                onClick={() => removeFromCompare(college.id)}
                className="rounded-md p-0.5 hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          {compareList.length < 3 && (
            <div className="hidden md:flex h-8 items-center justify-center rounded-lg border border-dashed border-slate-250 px-3 text-xs text-slate-400 dark:border-slate-800">
              Add {3 - compareList.length} more
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <button
            onClick={clearCompare}
            className="flex items-center justify-center gap-1 rounded-xl px-3 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear
          </button>
          <Link
            href="/compare"
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow transition-all hover:bg-indigo-500"
          >
            Compare Now
          </Link>
        </div>
      </div>
    </div>
  );
};
