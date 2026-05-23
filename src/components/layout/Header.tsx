"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Bookmark, Sparkles, Scale, Menu, X, Trash2, GraduationCap } from "lucide-react";
import { useAppState } from "@/context/AppStateContext";
import { mockColleges } from "@/data/mockColleges";

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { bookmarks, toggleBookmark } = useAppState();
  const [isSavedOpen, setIsSavedOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const savedColleges = mockColleges.filter((c) => bookmarks.includes(c.id));

  const navLinks = [
    { href: "/colleges", label: "Explore Colleges", icon: Compass },
    { href: "/compare", label: "Compare Colleges", icon: Scale },
    { href: "/predictor", label: "Rank Predictor", icon: Sparkles },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/colleges" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-200 dark:shadow-none">
              <GraduationCap className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-indigo-950 bg-clip-text text-transparent dark:from-white dark:to-indigo-200">
              CollegeCompass
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || pathname?.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "text-indigo-600 bg-indigo-50/50 dark:text-indigo-400 dark:bg-indigo-950/30"
                      : "text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => setIsSavedOpen(true)}
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition-all hover:bg-slate-50 hover:text-indigo-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/80 dark:hover:text-indigo-400"
            >
              <Bookmark className="h-5 w-5" />
              {bookmarks.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white shadow-sm">
                  {bookmarks.length}
                </span>
              )}
            </button>
          </div>

          {/* Mobile menu and actions */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setIsSavedOpen(true)}
              className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
            >
              <Bookmark className="h-4 w-4" />
              {bookmarks.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-indigo-600 text-[9px] font-bold text-white">
                  {bookmarks.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-30 bg-slate-950/20 backdrop-blur-sm dark:bg-slate-950/60">
          <div className="flex flex-col bg-white px-4 py-6 border-b border-slate-200 shadow-xl dark:bg-slate-900 dark:border-slate-800">
            <nav className="flex flex-col gap-3">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href || pathname?.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold ${
                      isActive
                        ? "text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-950/40"
                        : "text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Saved Items / Bookmarks Slider */}
      {isSavedOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsSavedOpen(false)} />
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <div className="pointer-events-auto w-screen max-w-md transform bg-white shadow-2xl transition-all dark:bg-slate-900">
              <div className="flex h-full flex-col divide-y divide-slate-100 dark:divide-slate-800">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 bg-slate-50 dark:bg-slate-950">
                  <div className="flex items-center gap-2">
                    <Bookmark className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Saved Colleges</h2>
                  </div>
                  <button
                    onClick={() => setIsSavedOpen(false)}
                    className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                  {savedColleges.length === 0 ? (
                    <div className="flex h-64 flex-col items-center justify-center text-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 dark:bg-slate-850">
                        <Bookmark className="h-8 w-8" />
                      </div>
                      <h3 className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">No saved colleges</h3>
                      <p className="mt-1 text-sm text-slate-500">
                        Bookmarks will show up here. Explore colleges to add them.
                      </p>
                      <Link
                        href="/colleges"
                        onClick={() => setIsSavedOpen(false)}
                        className="mt-6 inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-indigo-500"
                      >
                        Explore Colleges
                      </Link>
                    </div>
                  ) : (
                    <ul className="-my-4 divide-y divide-slate-100 dark:divide-slate-800">
                      {savedColleges.map((college) => (
                        <li key={college.id} className="flex items-center justify-between py-4 gap-4">
                          <Link
                            href={`/colleges/${college.id}`}
                            onClick={() => setIsSavedOpen(false)}
                            className="flex-1 group"
                          >
                            <h4 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors dark:text-white dark:group-hover:text-indigo-400">
                              {college.name}
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {college.location.city}, {college.location.state} • {college.type}
                            </p>
                          </Link>
                          <button
                            onClick={() => toggleBookmark(college.id)}
                            className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
