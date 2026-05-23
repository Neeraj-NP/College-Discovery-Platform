"use client";

import React from "react";
import Link from "next/link";
import { Star, MapPin, DollarSign, Award, GraduationCap, Heart, Check, Plus } from "lucide-react";
import { College } from "@/data/mockColleges";
import { useAppState } from "@/context/AppStateContext";

interface CollegeCardProps {
  college: College;
  viewMode: "grid" | "list";
}

export const CollegeCard: React.FC<CollegeCardProps> = ({ college, viewMode }) => {
  const { toggleBookmark, isBookmarked, addToCompare, removeFromCompare, isComparing } = useAppState();

  const bookmarked = isBookmarked(college.id);
  const comparing = isComparing(college.id);

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (comparing) {
      removeFromCompare(college.id);
    } else {
      const added = addToCompare(college.id);
      if (!added) {
        alert("You can compare up to 3 colleges at a time!");
      }
    }
  };

  const formattedFees = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(college.fees);

  const isGrid = viewMode === "grid";

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:border-indigo-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 dark:hover:shadow-none flex ${
        isGrid ? "flex-col" : "flex-col md:flex-row"
      }`}
    >
      {/* Header Visual */}
      <div
        className={`relative flex items-center justify-center bg-gradient-to-br ${college.logoColor} ${
          isGrid ? "h-40 w-full" : "h-40 w-full md:h-auto md:w-48 shrink-0"
        }`}
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-lg">
          <GraduationCap className="h-8 w-8" />
        </div>

        {/* Floating Top Actions */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleBookmark(college.id);
          }}
          className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-xl bg-white/90 text-slate-500 shadow-md backdrop-blur transition-all hover:scale-105 hover:bg-white hover:text-red-500 dark:bg-slate-900/90 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-red-400"
        >
          <Heart className={`h-4.5 w-4.5 ${bookmarked ? "fill-red-500 text-red-500" : ""}`} />
        </button>

        <span className="absolute bottom-4 left-4 rounded-lg bg-black/40 px-2 py-1 text-[10px] font-bold text-white backdrop-blur-sm tracking-wider uppercase">
          Est. {college.established}
        </span>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          {/* Rating, Ownership & Stream Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
              <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
              {college.rating}
            </span>
            <span className="rounded-lg bg-indigo-50 px-2 py-0.5 text-xs font-bold text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400">
              {college.type}
            </span>
            <span className="rounded-lg bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {college.ownership}
            </span>
          </div>

          {/* Name & Location */}
          <Link href={`/colleges/${college.id}`}>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors dark:text-white dark:group-hover:text-indigo-400">
              {college.name}
            </h3>
          </Link>
          <div className="flex items-center gap-1.5 text-slate-500 text-xs mt-1.5 dark:text-slate-400">
            <MapPin className="h-3.5 w-3.5" />
            <span>
              {college.location.city}, {college.location.state}
            </span>
          </div>

          {/* Placement & Fee Statistics */}
          <div className="grid grid-cols-2 gap-3 mt-4 border-t border-slate-100 pt-3 dark:border-slate-800">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-450 tracking-wider dark:text-slate-500">
                Average Annual Fees
              </p>
              <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                {formattedFees}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-450 tracking-wider dark:text-slate-500">
                Avg. Placement Package
              </p>
              <p className="text-sm font-bold text-emerald-600 dark:text-emerald-450 mt-0.5">
                {college.placement.averagePackage} LPA
              </p>
            </div>
          </div>

          {/* Exams Accepted */}
          <div className="mt-3">
            <p className="text-[10px] uppercase font-bold text-slate-450 tracking-wider dark:text-slate-500">
              Exams Accepted
            </p>
            <div className="flex flex-wrap gap-1 mt-1">
              {college.exams.map((exam) => (
                <span
                  key={exam}
                  className="rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-semibold text-slate-650 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400"
                >
                  {exam}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex items-center gap-2 mt-5 pt-3 border-t border-slate-150 dark:border-slate-800">
          <button
            onClick={handleCompareClick}
            className={`flex-1 inline-flex items-center justify-center gap-1 rounded-xl px-3 py-2 text-xs font-bold transition-all border ${
              comparing
                ? "border-emerald-600 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-500 dark:bg-emerald-950/20 dark:text-emerald-450"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-850 dark:hover:text-white"
            }`}
          >
            {comparing ? (
              <>
                <Check className="h-3.5 w-3.5" />
                Comparing
              </>
            ) : (
              <>
                <Plus className="h-3.5 w-3.5" />
                Compare
              </>
            )}
          </button>
          <Link
            href={`/colleges/${college.id}`}
            className="flex-1 inline-flex items-center justify-center rounded-xl bg-slate-900 px-3 py-2 text-xs font-bold text-white shadow transition-all hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};
