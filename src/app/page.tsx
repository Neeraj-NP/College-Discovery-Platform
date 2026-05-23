"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Compass, Scale, Sparkles, Search, GraduationCap, ArrowRight, Award, TrendingUp, Users } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [searchVal, setSearchVal] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      router.push(`/colleges?search=${encodeURIComponent(searchVal.trim())}`);
    } else {
      router.push("/colleges");
    }
  };

  const featureCards = [
    {
      href: "/colleges",
      icon: Compass,
      title: "Explore Discovery Hub",
      desc: "Search and filter through premium institutes using location, ratings, discipline, and fee metrics.",
      color: "bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400",
      border: "hover:border-blue-300 dark:hover:border-blue-900"
    },
    {
      href: "/compare",
      icon: Scale,
      title: "Comparison Matrix",
      desc: "Compare up to 3 colleges side-by-side with automatic winner highlighting for cost, placement, and ratings.",
      color: "bg-indigo-50 text-indigo-650 dark:bg-indigo-950/30 dark:text-indigo-400",
      border: "hover:border-indigo-300 dark:hover:border-indigo-900"
    },
    {
      href: "/predictor",
      icon: Sparkles,
      title: "Admission Predictor",
      desc: "Input your entrance test marks to determine your probability of getting into target streams based on history.",
      color: "bg-violet-50 text-violet-650 dark:bg-violet-950/30 dark:text-violet-400",
      border: "hover:border-violet-300 dark:hover:border-violet-900"
    }
  ];

  return (
    <div className="w-full flex flex-col gap-16 py-6 md:py-10">
      {/* Hero Section */}
      <section className="relative text-center flex flex-col items-center max-w-4xl mx-auto gap-6 px-4">
        {/* Glow effect */}
        <div className="absolute -top-24 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl -z-10" />

        <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 border border-indigo-100 px-3 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-950/40 dark:border-indigo-900 dark:text-indigo-400">
          <GraduationCap className="h-4 w-4" />
          The Smart Way to College Decisions
        </span>

        <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 bg-clip-text text-transparent dark:from-white dark:via-indigo-200 dark:to-slate-100">
          Navigate Your Higher Education Journey
        </h1>

        <p className="text-slate-500 max-w-2xl text-sm md:text-base font-medium dark:text-slate-400 leading-relaxed">
          Discover top-tier Indian institutes, compare detailed fee and placement ROI tables side-by-side, and predict admission chances using historical exam cutoff ranks.
        </p>

        {/* Hero Search Box */}
        <form
          onSubmit={handleSearchSubmit}
          className="w-full max-w-2xl mt-4 flex items-center bg-white border border-slate-200 rounded-2xl p-2 shadow-lg dark:bg-slate-900 dark:border-slate-800"
        >
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by college name, city, or exam..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full bg-transparent pl-10 pr-4 py-3 text-sm outline-none text-slate-800 dark:text-slate-200"
            />
            <Search className="absolute left-3 top-3.5 h-4.5 w-4.5 text-slate-400" />
          </div>
          <button
            type="submit"
            className="rounded-xl bg-indigo-600 px-5 py-3 text-xs font-bold text-white shadow hover:bg-indigo-500 transition-colors shrink-0"
          >
            Search
          </button>
        </form>

        {/* Quick links search tags */}
        <div className="flex flex-wrap justify-center items-center gap-2 mt-2 text-xs font-bold text-slate-450 dark:text-slate-500">
          <span>Popular Searches:</span>
          {[
            { tag: "IIT Bombay", query: "IIT Bombay" },
            { tag: "AIIMS Delhi", query: "AIIMS" },
            { tag: "IIM Ahmedabad", query: "IIM" },
            { tag: "SRCC", query: "SRCC" }
          ].map((item) => (
            <button
              key={item.tag}
              onClick={() => router.push(`/colleges?search=${item.query}`)}
              className="rounded-lg bg-slate-100 px-2.5 py-1 hover:bg-indigo-50 hover:text-indigo-650 transition-colors dark:bg-slate-850 dark:text-slate-350 dark:hover:bg-slate-800"
            >
              {item.tag}
            </button>
          ))}
        </div>
      </section>

      {/* Interactive Features cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto w-full px-4">
        {featureCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.href}
              href={card.href}
              className={`group flex flex-col justify-between p-6 bg-white border border-slate-200 rounded-3xl transition-all shadow-sm ${card.border} hover:shadow-xl dark:bg-slate-900 dark:border-slate-800`}
            >
              <div className="space-y-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed dark:text-slate-400">
                    {card.desc}
                  </p>
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 mt-6 dark:text-indigo-400">
                Get Started
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </section>

      {/* Statistics Highlights Banner */}
      <section className="bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 md:p-12 shadow-xl flex flex-col md:flex-row justify-around items-center gap-8 max-w-6xl mx-auto w-full border border-indigo-900/40">
        <div className="text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 backdrop-blur border border-white/10 text-indigo-350 mx-auto mb-4">
            <Award className="h-6 w-6" />
          </div>
          <p className="text-4xl font-black text-white">#1</p>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">NIRF Verified Rankings</p>
        </div>

        <div className="h-px w-16 bg-white/10 md:h-16 md:w-px" />

        <div className="text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 backdrop-blur border border-white/10 text-emerald-450 mx-auto mb-4">
            <TrendingUp className="h-6 w-6" />
          </div>
          <p className="text-4xl font-black text-emerald-450">34.1 LPA</p>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Highest Average Package</p>
        </div>

        <div className="h-px w-16 bg-white/10 md:h-16 md:w-px" />

        <div className="text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 backdrop-blur border border-white/10 text-indigo-350 mx-auto mb-4">
            <Users className="h-6 w-6" />
          </div>
          <p className="text-4xl font-black text-white">100%</p>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Anonymized Student Reviews</p>
        </div>
      </section>
    </div>
  );
}
