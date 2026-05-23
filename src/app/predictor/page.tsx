"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, Star, MapPin, DollarSign, Award, ChevronRight, SlidersHorizontal, Info, ShieldAlert, CheckCircle, AlertTriangle } from "lucide-react";

interface PredictionResult {
  collegeId: string;
  collegeName: string;
  collegeShortName: string;
  logoColor: string;
  collegeRating: number;
  collegeLocation: string;
  courseId: string;
  courseName: string;
  fees: number;
  averagePackage: number;
  latestCutoff: number;
  probability: "High" | "Medium" | "Low";
  probabilityText: string;
}

export default function PredictorPage() {
  const [exam, setExam] = useState("JEE Main");
  const [rank, setRank] = useState<number | "">("");
  const [category, setCategory] = useState<"General" | "OBC" | "SC" | "ST">("General");
  const [state, setState] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<PredictionResult[] | null>(null);
  const [activeChanceFilter, setActiveChanceFilter] = useState<"All" | "High" | "Medium" | "Low">("All");

  const exams = [
    { name: "JEE Advanced", type: "Rank", placeholder: "e.g. 500" },
    { name: "JEE Main", type: "Rank", placeholder: "e.g. 2500" },
    { name: "NEET", type: "Rank", placeholder: "e.g. 150" },
    { name: "CAT", type: "Percentile", placeholder: "e.g. 99.4" },
    { name: "MET", type: "Rank", placeholder: "e.g. 600" },
    { name: "CUET", type: "Score", placeholder: "e.g. 785" }
  ];

  const states = ["Delhi", "Maharashtra", "Tamil Nadu", "Rajasthan", "Gujarat", "Karnataka"];

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rank === "" || Number(rank) <= 0) {
      alert("Please enter a valid rank/score.");
      return;
    }

    setLoading(true);
    setResults(null);
    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exam,
          rank: Number(rank),
          category,
          state
        })
      });

      if (res.ok) {
        const data: PredictionResult[] = await res.json();
        setResults(data);
      } else {
        alert("Failed to predict. Please try again.");
      }
    } catch (e) {
      console.error(e);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const getActiveExamType = () => {
    return exams.find((e) => e.name === exam)?.type || "Rank";
  };

  const getActiveExamPlaceholder = () => {
    return exams.find((e) => e.name === exam)?.placeholder || "e.g. 500";
  };

  // Filter results by selected probability tab
  const filteredResults = results
    ? results.filter((r) => activeChanceFilter === "All" || r.probability === activeChanceFilter)
    : [];

  const getChanceBadge = (prob: "High" | "Medium" | "Low") => {
    switch (prob) {
      case "High":
        return (
          <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
            <CheckCircle className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            High Chance
          </span>
        );
      case "Medium":
        return (
          <span className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-750 dark:bg-indigo-950/40 dark:text-indigo-400">
            <Info className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
            Medium Chance
          </span>
        );
      case "Low":
        return (
          <span className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-500 dark:text-amber-450" />
            Reach (Low)
          </span>
        );
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-10 text-white shadow-xl">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-indigo-200 backdrop-blur-sm mb-4">
          <Sparkles className="h-3.5 w-3.5" />
          Predictor Wizard
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
          College Cutoff Predictor
        </h1>
        <p className="mt-2 text-slate-350 text-sm max-w-2xl">
          Input your entrance exam scores or ranks to predict admission probabilities for specific branches in top universities based on official historical cutoff data.
        </p>
      </div>

      {/* Main Grid: Form on left, Results on right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Wizard Form Panel */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm dark:bg-slate-900 dark:border-slate-800">
          <h3 className="font-bold text-slate-900 dark:text-white border-b border-slate-100 pb-3 mb-4 dark:border-slate-800">
            Enter Score Details
          </h3>

          <form onSubmit={handlePredict} className="flex flex-col gap-4">
            {/* Exam Selection */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Entrance Exam</label>
              <select
                value={exam}
                onChange={(e) => {
                  setExam(e.target.value);
                  setRank("");
                }}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:focus:border-indigo-400"
              >
                {exams.map((ex) => (
                  <option key={ex.name} value={ex.name}>
                    {ex.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Score/Rank input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Your {getActiveExamType()}
              </label>
              <input
                type="number"
                placeholder={getActiveExamPlaceholder()}
                value={rank}
                onChange={(e) => setRank(e.target.value ? Number(e.target.value) : "")}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:focus:border-indigo-400"
                min="1"
                step={getActiveExamType() === "Percentile" ? "0.01" : "1"}
                required
              />
            </div>

            {/* Category selection */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Reservation Category</label>
              <div className="grid grid-cols-2 gap-2">
                {(["General", "OBC", "SC", "ST"] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`rounded-xl py-2 text-xs font-bold transition-all border ${
                      category === cat
                        ? "bg-indigo-650 border-indigo-650 text-white dark:bg-indigo-500 dark:border-indigo-500"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* State selection */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">State of Eligibility (Domicile)</label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:focus:border-indigo-400"
              >
                <option value="">Select State</option>
                {states.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
                <option value="Other">Other State</option>
              </select>
            </div>

            {/* Submit prediction button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full inline-flex items-center justify-center rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white shadow-md hover:bg-indigo-500 shadow-indigo-100 dark:shadow-none disabled:opacity-50"
            >
              {loading ? "Matching database..." : "Predict Colleges"}
            </button>
          </form>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {loading && (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="animate-pulse border border-slate-200 bg-white rounded-2xl p-5 dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div className="h-6 bg-slate-200 rounded w-1/3" />
                    <div className="h-6 bg-slate-200 rounded w-20" />
                  </div>
                  <div className="h-4 bg-slate-200 rounded w-1/2 mb-3" />
                  <div className="h-8 bg-slate-100 rounded w-full" />
                </div>
              ))}
            </div>
          )}

          {!loading && results === null && (
            <div className="flex flex-col items-center justify-center text-center py-16 px-4 bg-white rounded-2xl border border-slate-200 dark:bg-slate-900 dark:border-slate-800 h-80">
              <Info className="h-10 w-10 text-indigo-400 mb-4" />
              <h4 className="font-bold text-slate-800 dark:text-white">Ready for Prediction</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs font-semibold">
                Submit the form on the left with your scores to display matching branches.
              </p>
            </div>
          )}

          {!loading && results !== null && (
            <div className="space-y-6">
              {/* Filter Tabs by probability */}
              <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-200 dark:bg-slate-900 dark:border-slate-800 flex-wrap gap-4">
                <div className="flex gap-1">
                  {(["All", "High", "Medium", "Low"] as const).map((prob) => (
                    <button
                      key={prob}
                      onClick={() => setActiveChanceFilter(prob)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                        activeChanceFilter === prob
                          ? "bg-slate-900 text-white dark:bg-indigo-650"
                          : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
                      }`}
                    >
                      {prob} Chance ({prob === "All" ? results.length : results.filter((r) => r.probability === prob).length})
                    </button>
                  ))}
                </div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Recommendations Sorted by Placements
                </span>
              </div>

              {/* Prediction Cards */}
              {filteredResults.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-12 px-4 bg-white rounded-2xl border border-slate-200 dark:bg-slate-900 dark:border-slate-800">
                  <ShieldAlert className="h-8 w-8 text-red-500 mb-4" />
                  <h4 className="font-bold text-slate-800 dark:text-white">No Matching Colleges found</h4>
                  <p className="text-xs text-slate-550 mt-1 max-w-sm">
                    No results match this selection for your input score. Try applying different exams, selecting SC/ST categories if applicable, or entering a lower rank.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredResults.map((res, index) => (
                    <div
                      key={`${res.collegeId}-${res.courseId}-${index}`}
                      className="border border-slate-200 bg-white rounded-2xl p-5 dark:border-slate-800 dark:bg-slate-900 flex flex-col gap-4 hover:shadow-md transition-shadow"
                    >
                      {/* Top segment: Names & Chance badge */}
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="space-y-1">
                          <Link href={`/colleges/${res.collegeId}`}>
                            <h4 className="font-bold text-slate-900 hover:text-indigo-650 transition-colors dark:text-white dark:hover:text-indigo-400 text-base leading-snug">
                              {res.collegeShortName}
                            </h4>
                          </Link>
                          <p className="text-sm font-semibold text-slate-700 dark:text-slate-350">{res.courseName}</p>
                          <div className="flex items-center gap-2 text-xs text-slate-450 dark:text-slate-500">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {res.collegeLocation}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                              {res.collegeRating}
                            </span>
                          </div>
                        </div>

                        {getChanceBadge(res.probability)}
                      </div>

                      {/* Middle description banner */}
                      <div className="bg-slate-50 p-3 rounded-xl dark:bg-slate-950/40 text-xs text-slate-650 dark:text-slate-400 font-semibold border-l-4 border-slate-300 dark:border-slate-800">
                        {res.probabilityText}
                      </div>

                      {/* Bottom info section: cutoff comparison & stats */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-100 pt-4 dark:border-slate-850 text-xs font-semibold">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase tracking-wider">Cutoff Rank (2025)</span>
                          <p className="text-sm font-extrabold text-slate-800 dark:text-white mt-0.5">{res.latestCutoff.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase tracking-wider">Your Rank</span>
                          <p className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400 mt-0.5">{Number(rank).toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase tracking-wider">Avg Placement</span>
                          <p className="text-sm font-extrabold text-emerald-600 dark:text-emerald-450 mt-0.5">{res.averagePackage} LPA</p>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase tracking-wider">Annual Fees</span>
                          <p className="text-sm font-extrabold text-slate-800 dark:text-white mt-0.5">
                            {new Intl.NumberFormat("en-IN", {
                              style: "currency",
                              currency: "INR",
                              maximumFractionDigits: 0,
                            }).format(res.fees)}
                          </p>
                        </div>
                      </div>

                      {/* Full detail link button */}
                      <div className="flex justify-end border-t border-slate-100 pt-3 dark:border-slate-850">
                        <Link
                          href={`/colleges/${res.collegeId}`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                        >
                          View College Profile
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
