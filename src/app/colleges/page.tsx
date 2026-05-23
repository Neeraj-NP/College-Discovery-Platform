"use client";

import React, { useState, useEffect, Suspense, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Grid, List, ChevronLeft, ChevronRight, SlidersHorizontal, Search, Sparkles, AlertCircle } from "lucide-react";
import { CollegeCard } from "@/components/colleges/CollegeCard";
import { FilterSidebar, FilterState } from "@/components/colleges/FilterSidebar";
import { College } from "@/data/mockColleges";

interface ApiResponse {
  colleges: College[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  analytics: {
    minFees: number;
    maxFees: number;
    avgPackage: number;
  };
}

const CollegesContent: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Local UI states
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<ApiResponse | null>(null);
  const [, startTransition] = useTransition();

  // States available in mock data
  const availableStates = ["Delhi", "Maharashtra", "Tamil Nadu", "Rajasthan", "Gujarat", "Karnataka"];

  // Read URL search params to initial filter state
  const getFiltersFromParams = (): FilterState => {
    const search = searchParams.get("search") || "";
    const type = searchParams.get("type")?.split(",").filter(Boolean) || [];
    const ownership = searchParams.get("ownership")?.split(",").filter(Boolean) || [];
    const fees = searchParams.get("fees") ? Number(searchParams.get("fees")) : 1500000;
    const rating = searchParams.get("rating") ? Number(searchParams.get("rating")) : null;
    const state = searchParams.get("state") || "";
    return { search, type, ownership, fees, rating, state };
  };

  const activeFilters = getFiltersFromParams();
  const activeSort = searchParams.get("sort") || "rating_desc";
  const activePage = Number(searchParams.get("page")) || 1;

  // Fetch data from Next.js mock API route
  const fetchColleges = async () => {
    setIsLoading(true);
    try {
      const queryString = searchParams.toString();
      const res = await fetch(`/api/colleges?${queryString}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (e) {
      console.error("Failed to fetch colleges", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchColleges();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Update URL search parameters
  const updateUrl = (newFilters: FilterState, sortVal = activeSort, pageVal = 1) => {
    const params = new URLSearchParams();

    if (newFilters.search) params.set("search", newFilters.search);
    if (newFilters.type.length > 0) params.set("type", newFilters.type.join(","));
    if (newFilters.ownership.length > 0) params.set("ownership", newFilters.ownership.join(","));
    if (newFilters.fees !== 1500000) params.set("fees", newFilters.fees.toString());
    if (newFilters.rating !== null) params.set("rating", newFilters.rating.toString());
    if (newFilters.state) params.set("state", newFilters.state);
    
    if (sortVal !== "rating_desc") params.set("sort", sortVal);
    if (pageVal !== 1) params.set("page", pageVal.toString());

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleFilterChange = (newFilters: FilterState) => {
    updateUrl(newFilters, activeSort, 1);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateUrl(activeFilters, e.target.value, 1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || (data && newPage > data.pagination.totalPages)) return;
    updateUrl(activeFilters, activeSort, newPage);
  };

  const handleClearFilters = () => {
    const resetFilters: FilterState = {
      search: "",
      type: [],
      ownership: [],
      fees: 1500000,
      rating: null,
      state: "",
    };
    updateUrl(resetFilters, "rating_desc", 1);
  };

  // Render Skeleton Cards
  const renderSkeletons = () => {
    return Array.from({ length: 4 }).map((_, idx) => (
      <div
        key={idx}
        className={`animate-pulse border border-slate-200 bg-white rounded-2xl p-5 flex ${
          viewMode === "grid" ? "flex-col" : "flex-col md:flex-row gap-5"
        }`}
      >
        <div className={`bg-slate-200 rounded-xl ${viewMode === "grid" ? "h-40 w-full" : "h-40 w-full md:w-48 shrink-0"}`} />
        <div className="flex-1 mt-4 md:mt-0 flex flex-col justify-between">
          <div>
            <div className="h-4 bg-slate-200 rounded w-1/3 mb-4" />
            <div className="h-6 bg-slate-200 rounded w-3/4 mb-3" />
            <div className="h-4 bg-slate-200 rounded w-1/2 mb-4" />
            <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-3">
              <div className="h-10 bg-slate-100 rounded" />
              <div className="h-10 bg-slate-100 rounded" />
            </div>
          </div>
          <div className="flex gap-2 mt-5">
            <div className="h-8 bg-slate-200 rounded flex-1" />
            <div className="h-8 bg-slate-200 rounded flex-1" />
          </div>
        </div>
      </div>
    ));
  };

  const colleges = data?.colleges || [];
  const pagination = data?.pagination || { total: 0, page: 1, limit: 6, totalPages: 1 };
  const analytics = data?.analytics || { minFees: 0, maxFees: 0, avgPackage: 0 };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Search Header Banner */}
      <div className="rounded-3xl bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-10 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-indigo-200 backdrop-blur-sm mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            Discovery Hub
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
            Find Your Dream College
          </h1>
          <p className="mt-2 text-slate-350 text-sm max-w-xl">
            Explore and filter through the top-tier institutions of engineering, business administration, medical studies, and commerce.
          </p>
        </div>

        {/* Dynamic Analytics Panel */}
        {data && data.pagination.total > 0 && (
          <div className="flex gap-4 flex-wrap bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-4 self-stretch md:self-auto justify-around">
            <div className="px-2">
              <p className="text-[10px] uppercase font-bold text-slate-400">Total Found</p>
              <p className="text-xl font-black text-indigo-400 mt-1">{pagination.total}</p>
            </div>
            <div className="w-px bg-white/10" />
            <div className="px-2">
              <p className="text-[10px] uppercase font-bold text-slate-400">Avg Package</p>
              <p className="text-xl font-black text-emerald-450 mt-1">{analytics.avgPackage} LPA</p>
            </div>
          </div>
        )}
      </div>

      {/* Main Layout Area */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Filters Sidebar (Desktop) */}
        <div className="hidden lg:block w-80 shrink-0">
          <FilterSidebar
            filters={activeFilters}
            onChange={handleFilterChange}
            onClear={handleClearFilters}
            availableStates={availableStates}
          />
        </div>

        {/* Mobile Filters Trigger */}
        <div className="flex lg:hidden items-center justify-between w-full border border-slate-200 bg-white p-3 rounded-xl dark:bg-slate-900 dark:border-slate-800">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-50 px-4 py-2 text-xs font-bold text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Configure Filters
          </button>

          <span className="text-xs font-bold text-slate-500">
            {isLoading ? "Searching..." : `${pagination.total} colleges found`}
          </span>
        </div>

        {/* Mobile Filters Drawer */}
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden overflow-y-auto">
            <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setIsMobileFilterOpen(false)} />
            <div className="relative min-h-screen flex flex-col justify-end p-4">
              <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl p-5 dark:bg-slate-900">
                <FilterSidebar
                  filters={activeFilters}
                  onChange={handleFilterChange}
                  onClear={handleClearFilters}
                  availableStates={availableStates}
                />
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="mt-4 w-full rounded-xl bg-slate-900 py-3 text-sm font-bold text-white shadow dark:bg-indigo-650"
                >
                  Apply Filters & Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Listings and Sorting Section */}
        <div className="flex-1 w-full flex flex-col gap-6">
          {/* Top Bar (Sort, Layout Toggle, Count) */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 dark:bg-slate-900 dark:border-slate-800">
            <div className="hidden lg:block text-sm text-slate-500 dark:text-slate-400 font-medium">
              {isLoading ? (
                "Fetching matching colleges..."
              ) : (
                <span>
                  Showing <strong className="text-slate-800 dark:text-white">{colleges.length}</strong> of{" "}
                  <strong className="text-slate-800 dark:text-white">{pagination.total}</strong> Colleges
                </span>
              )}
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
              {/* Sorting Selection */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:inline">
                  Sort By
                </span>
                <select
                  value={activeSort}
                  onChange={handleSortChange}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold outline-none focus:border-indigo-500 dark:border-slate-850 dark:bg-slate-950"
                >
                  <option value="rating_desc">Top Rated</option>
                  <option value="fees_asc">Fees: Low to High</option>
                  <option value="fees_desc">Fees: High to Low</option>
                  <option value="package_desc">Average Package</option>
                  <option value="nirf_asc">NIRF Rank</option>
                </select>
              </div>

              {/* View Layout Selector */}
              <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-950">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`rounded-lg p-1.5 transition-colors ${
                    viewMode === "grid"
                      ? "bg-white text-indigo-650 shadow-sm dark:bg-slate-850 dark:text-indigo-400"
                      : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-350"
                  }`}
                >
                  <Grid className="h-4.5 w-4.5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`rounded-lg p-1.5 transition-colors ${
                    viewMode === "list"
                      ? "bg-white text-indigo-650 shadow-sm dark:bg-slate-850 dark:text-indigo-400"
                      : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-350"
                  }`}
                >
                  <List className="h-4.5 w-4.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Cards List or Skeletons */}
          <div
            className={`grid gap-6 ${
              viewMode === "grid" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
            }`}
          >
            {isLoading ? (
              renderSkeletons()
            ) : colleges.length === 0 ? (
              /* Empty Search Results */
              <div className="col-span-full flex flex-col items-center justify-center text-center py-16 px-4 bg-white rounded-2xl border border-slate-200 dark:bg-slate-900 dark:border-slate-800">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500 dark:bg-red-950/20 dark:text-red-400 mb-4">
                  <AlertCircle className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Colleges Match Your Search</h3>
                <p className="mt-1 text-sm text-slate-500 max-w-sm">
                  We couldn&apos;t find any colleges matching your criteria. Try adjusting filters or search keyword.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="mt-6 inline-flex items-center justify-center rounded-xl bg-indigo-655 px-4 py-2.5 text-xs font-bold text-white shadow hover:bg-indigo-500"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              colleges.map((college) => (
                <CollegeCard key={college.id} college={college} viewMode={viewMode} />
              ))
            )}
          </div>

          {/* Pagination Controls */}
          {data && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-200 pt-6 dark:border-slate-800 mt-4">
              <button
                onClick={() => handlePageChange(activePage - 1)}
                disabled={activePage === 1}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>

              <div className="flex items-center gap-1.5">
                {Array.from({ length: pagination.totalPages }).map((_, idx) => {
                  const pNum = idx + 1;
                  return (
                    <button
                      key={pNum}
                      onClick={() => handlePageChange(pNum)}
                      className={`h-9 w-9 rounded-xl text-xs font-bold transition-all ${
                        activePage === pNum
                          ? "bg-indigo-600 text-white dark:bg-indigo-500"
                          : "border border-slate-200 bg-white text-slate-750 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                      }`}
                    >
                      {pNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(activePage + 1)}
                disabled={activePage === pagination.totalPages}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function CollegesPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full h-96 flex items-center justify-center text-slate-500 font-semibold animate-pulse">
          Loading Discovery Hub...
        </div>
      }
    >
      <CollegesContent />
    </Suspense>
  );
}
