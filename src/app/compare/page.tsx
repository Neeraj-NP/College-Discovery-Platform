"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Scale, ArrowLeft, Trash2, Plus, Star, MapPin, DollarSign, Award, Check, Sparkles } from "lucide-react";
import { useAppState } from "@/context/AppStateContext";
import { mockColleges, College } from "@/data/mockColleges";

export default function ComparePage() {
  const { compareList, removeFromCompare, addToCompare, clearCompare } = useAppState();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDropdownIndex, setActiveDropdownIndex] = useState<number | null>(null);

  const selectedColleges = mockColleges.filter((c) => compareList.includes(c.id));

  // Determine row winners
  const getWinner = (rowKey: "fees" | "rating" | "avgPackage" | "maxPackage" | "placementRate" | "roi") => {
    if (selectedColleges.length < 2) return null;

    let bestVal: number;
    let bestId: string | null = null;

    selectedColleges.forEach((c) => {
      // Calculate values
      let val = 0;
      if (rowKey === "fees") {
        val = c.fees;
      } else if (rowKey === "rating") {
        val = c.rating;
      } else if (rowKey === "avgPackage") {
        val = c.placement.averagePackage;
      } else if (rowKey === "maxPackage") {
        val = c.placement.highestPackage;
      } else if (rowKey === "placementRate") {
        val = c.placement.placementRate;
      } else if (rowKey === "roi") {
        val = c.fees > 0 ? c.placement.averagePackage / (c.fees / 100000) : 999;
      }

      if (bestId === null) {
        bestVal = val;
        bestId = c.id;
      } else {
        if (rowKey === "fees") {
          // Lower fees is better
          if (val < bestVal!) {
            bestVal = val;
            bestId = c.id;
          }
        } else {
          // Higher is better
          if (val > bestVal!) {
            bestVal = val;
            bestId = c.id;
          }
        }
      }
    });

    return bestId;
  };

  const winners = {
    fees: getWinner("fees"),
    rating: getWinner("rating"),
    avgPackage: getWinner("avgPackage"),
    maxPackage: getWinner("maxPackage"),
    placementRate: getWinner("placementRate"),
    roi: getWinner("roi"),
  };

  // Get colleges not in compare list for inline drop-down search selector
  const availableColleges = mockColleges.filter(
    (c) => !compareList.includes(c.id) && c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInlineAdd = (collegeId: string) => {
    addToCompare(collegeId);
    setActiveDropdownIndex(null);
    setSearchQuery("");
  };

  // Render empty comparison state
  if (compareList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20 px-4 bg-white rounded-3xl border border-slate-200 shadow-sm dark:bg-slate-900 dark:border-slate-800">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-650 dark:bg-indigo-950/20 dark:text-indigo-400 mb-6">
          <Scale className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Your Comparison Matrix is Empty</h2>
        <p className="mt-2 text-slate-500 max-w-sm text-sm">
          Select colleges from the explore tab to compare their fees, placement packages, ratings, and locations.
        </p>
        <Link
          href="/colleges"
          className="mt-6 inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow hover:bg-indigo-500"
        >
          Browse Colleges
        </Link>
      </div>
    );
  }

  // ROI formatting function
  const getRoi = (fees: number, avgPackage: number) => {
    if (fees === 0) return "N/A";
    const multiplier = avgPackage / (fees / 100000);
    return `${multiplier.toFixed(1)}x`;
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Top Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-1 text-sm font-bold text-slate-500 hover:text-indigo-600 dark:text-slate-450 dark:hover:text-indigo-400 transition-colors mb-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Compare Colleges
          </h1>
          <p className="text-slate-500 text-xs mt-0.5 font-medium">
            Side-by-side analysis of fees, ROI, ratings, and packages.
          </p>
        </div>

        <button
          onClick={clearCompare}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-red-655 hover:bg-red-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-red-950/20 transition-colors"
        >
          <Trash2 className="h-4 w-4" />
          Clear Comparison
        </button>
      </div>

      {/* Comparison Grid Layout */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm dark:bg-slate-900 dark:border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm min-w-[700px]">
            {/* Headers */}
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 dark:bg-slate-950 dark:border-slate-850">
                <th className="px-6 py-6 font-extrabold text-slate-900 dark:text-white w-1/4">College Parameters</th>
                
                {/* Dynamic Columns for Selected Colleges */}
                {Array.from({ length: 3 }).map((_, index) => {
                  const college = selectedColleges[index];

                  if (!college) {
                    // Render Empty Column Selector
                    return (
                      <th key={`empty-${index}`} className="px-6 py-6 w-1/4 relative align-top">
                        <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl p-6 h-full text-center dark:border-slate-800">
                          <Plus className="h-6 w-6 text-slate-400 mb-2" />
                          <button
                            onClick={() => setActiveDropdownIndex(activeDropdownIndex === index ? null : index)}
                            className="text-xs font-bold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                          >
                            Add College
                          </button>
                        </div>

                        {/* Inline Search Dropdown */}
                        {activeDropdownIndex === index && (
                          <div className="absolute top-24 left-6 right-6 z-35 bg-white border border-slate-200 rounded-xl p-3 shadow-xl dark:bg-slate-950 dark:border-slate-800">
                            <input
                              type="text"
                              placeholder="Search college name..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs outline-none focus:bg-white dark:border-slate-800 dark:bg-slate-900"
                            />
                            <div className="mt-2 max-h-40 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-850">
                              {availableColleges.length === 0 ? (
                                <div className="text-[10px] text-slate-400 py-2 text-center font-medium">No results found</div>
                              ) : (
                                availableColleges.map((col) => (
                                  <button
                                    key={col.id}
                                    onClick={() => handleInlineAdd(col.id)}
                                    className="w-full text-left py-2 px-1 text-xs font-semibold text-slate-700 hover:text-indigo-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                                  >
                                    {col.shortName} ({col.type})
                                  </button>
                                ))
                              )}
                            </div>
                          </div>
                        )}
                      </th>
                    );
                  }

                  // Render College Column Header
                  return (
                    <th key={college.id} className="px-6 py-6 w-1/4 relative align-top">
                      <button
                        onClick={() => removeFromCompare(college.id)}
                        className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors p-1"
                      >
                        ✕
                      </button>
                      <div className="space-y-3">
                        <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr ${college.logoColor} text-white shadow-md`}>
                          <Sparkles className="h-5 w-5" />
                        </div>
                        <div>
                          <Link href={`/colleges/${college.id}`}>
                            <h3 className="font-extrabold text-slate-900 hover:text-indigo-600 transition-colors dark:text-white dark:hover:text-indigo-400">
                              {college.shortName}
                            </h3>
                          </Link>
                          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                            {college.location.city}, {college.location.state}
                          </p>
                        </div>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            {/* Comparison Rows */}
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {/* Type / Stream */}
              <tr>
                <td className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-xs">Stream</td>
                {Array.from({ length: 3 }).map((_, index) => {
                  const college = selectedColleges[index];
                  return (
                    <td key={index} className="px-6 py-4 font-semibold text-slate-800 dark:text-slate-200">
                      {college ? college.type : "—"}
                    </td>
                  );
                })}
              </tr>

              {/* Ownership */}
              <tr>
                <td className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-xs">Ownership</td>
                {Array.from({ length: 3 }).map((_, index) => {
                  const college = selectedColleges[index];
                  return (
                    <td key={index} className="px-6 py-4 font-semibold text-slate-800 dark:text-slate-200">
                      {college ? college.ownership : "—"}
                    </td>
                  );
                })}
              </tr>

              {/* Established */}
              <tr>
                <td className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-xs">Established</td>
                {Array.from({ length: 3 }).map((_, index) => {
                  const college = selectedColleges[index];
                  return (
                    <td key={index} className="px-6 py-4 font-medium text-slate-800 dark:text-slate-200">
                      {college ? college.established : "—"}
                    </td>
                  );
                })}
              </tr>

              {/* Annual Fees */}
              <tr className="bg-slate-50/30 dark:bg-slate-900/10">
                <td className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-xs">Annual Fees</td>
                {Array.from({ length: 3 }).map((_, index) => {
                  const college = selectedColleges[index];
                  if (!college) return <td key={index} className="px-6 py-4 text-slate-400">—</td>;
                  const isWinner = winners.fees === college.id;
                  return (
                    <td
                      key={index}
                      className={`px-6 py-4 font-extrabold ${
                        isWinner
                          ? "bg-emerald-50/55 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-400"
                          : "text-slate-800 dark:text-slate-200"
                      }`}
                    >
                      {new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        currency: "INR",
                        maximumFractionDigits: 0,
                      }).format(college.fees)}
                      {isWinner && (
                        <span className="block text-[9px] font-black text-emerald-600 dark:text-emerald-450 uppercase mt-0.5 tracking-wider">
                          Lowest Fees
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>

              {/* Average Placement Package */}
              <tr>
                <td className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-xs">Average Package</td>
                {Array.from({ length: 3 }).map((_, index) => {
                  const college = selectedColleges[index];
                  if (!college) return <td key={index} className="px-6 py-4 text-slate-400">—</td>;
                  const isWinner = winners.avgPackage === college.id;
                  return (
                    <td
                      key={index}
                      className={`px-6 py-4 font-extrabold ${
                        isWinner
                          ? "bg-emerald-50/55 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-400"
                          : "text-slate-800 dark:text-slate-200"
                      }`}
                    >
                      {college.placement.averagePackage} LPA
                      {isWinner && (
                        <span className="block text-[9px] font-black text-emerald-600 dark:text-emerald-455 uppercase mt-0.5 tracking-wider">
                          Highest Salary
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>

              {/* Highest Placement Package */}
              <tr>
                <td className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-xs">Highest Package</td>
                {Array.from({ length: 3 }).map((_, index) => {
                  const college = selectedColleges[index];
                  if (!college) return <td key={index} className="px-6 py-4 text-slate-400">—</td>;
                  const isWinner = winners.maxPackage === college.id;
                  return (
                    <td
                      key={index}
                      className={`px-6 py-4 font-extrabold ${
                        isWinner
                          ? "bg-indigo-50/40 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400"
                          : "text-slate-850 dark:text-slate-300"
                      }`}
                    >
                      {college.placement.highestPackage} LPA
                    </td>
                  );
                })}
              </tr>

              {/* Placement Rate */}
              <tr>
                <td className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-xs">Placement Rate</td>
                {Array.from({ length: 3 }).map((_, index) => {
                  const college = selectedColleges[index];
                  if (!college) return <td key={index} className="px-6 py-4 text-slate-400">—</td>;
                  const isWinner = winners.placementRate === college.id;
                  return (
                    <td
                      key={index}
                      className={`px-6 py-4 font-bold ${
                        isWinner
                          ? "bg-emerald-50/55 text-emerald-850 dark:bg-emerald-950/20 dark:text-emerald-400"
                          : "text-slate-800 dark:text-slate-200"
                      }`}
                    >
                      {college.placement.placementRate}%
                    </td>
                  );
                })}
              </tr>

              {/* Return on Investment ROI */}
              <tr className="bg-indigo-50/15 dark:bg-indigo-950/5">
                <td className="px-6 py-4 font-bold text-indigo-600 uppercase tracking-wider text-xs dark:text-indigo-400">
                  ROI Multiplier
                </td>
                {Array.from({ length: 3 }).map((_, index) => {
                  const college = selectedColleges[index];
                  if (!college) return <td key={index} className="px-6 py-4 text-slate-400">—</td>;
                  const isWinner = winners.roi === college.id;
                  return (
                    <td
                      key={index}
                      className={`px-6 py-4 font-black ${
                        isWinner
                          ? "bg-indigo-100/40 text-indigo-805 dark:bg-indigo-950/30 dark:text-indigo-350"
                          : "text-indigo-600 dark:text-indigo-400"
                      }`}
                    >
                      {getRoi(college.fees, college.placement.averagePackage)}
                      {isWinner && (
                        <span className="block text-[9px] font-black text-indigo-600 dark:text-indigo-400 uppercase mt-0.5 tracking-wider">
                          Best ROI Value
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>

              {/* Rating */}
              <tr className="bg-slate-50/30 dark:bg-slate-900/10">
                <td className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-xs">Student Rating</td>
                {Array.from({ length: 3 }).map((_, index) => {
                  const college = selectedColleges[index];
                  if (!college) return <td key={index} className="px-6 py-4 text-slate-400">—</td>;
                  const isWinner = winners.rating === college.id;
                  return (
                    <td
                      key={index}
                      className={`px-6 py-4 font-bold ${
                        isWinner
                          ? "bg-amber-50/40 text-amber-800 dark:bg-amber-950/20 dark:text-amber-400"
                          : "text-slate-800 dark:text-slate-200"
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                        {college.rating} / 5
                      </div>
                    </td>
                  );
                })}
              </tr>

              {/* Exams Accepted */}
              <tr>
                <td className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-xs">Exams accepted</td>
                {Array.from({ length: 3 }).map((_, index) => {
                  const college = selectedColleges[index];
                  return (
                    <td key={index} className="px-6 py-4">
                      {college ? (
                        <div className="flex flex-wrap gap-1">
                          {college.exams.map((ex) => (
                            <span
                              key={ex}
                              className="text-[10px] font-semibold border border-slate-200 bg-slate-50 px-1.5 py-0.5 rounded-md dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400"
                            >
                              {ex}
                            </span>
                          ))}
                        </div>
                      ) : (
                        "—"
                      )}
                    </td>
                  );
                })}
              </tr>

              {/* Recruiters */}
              <tr>
                <td className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-xs">Top recruiters</td>
                {Array.from({ length: 3 }).map((_, index) => {
                  const college = selectedColleges[index];
                  return (
                    <td key={index} className="px-6 py-4 text-xs font-semibold text-slate-650 dark:text-slate-400">
                      {college ? college.placement.recruiters.slice(0, 3).join(", ") : "—"}
                    </td>
                  );
                })}
              </tr>

              {/* Actions */}
              <tr>
                <td className="px-6 py-4 font-bold text-slate-500 uppercase tracking-wider text-xs">Details</td>
                {Array.from({ length: 3 }).map((_, index) => {
                  const college = selectedColleges[index];
                  return (
                    <td key={index} className="px-6 py-4">
                      {college ? (
                        <Link
                          href={`/colleges/${college.id}`}
                          className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 transition-colors"
                        >
                          View Full Details
                        </Link>
                      ) : (
                        "—"
                      )}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
