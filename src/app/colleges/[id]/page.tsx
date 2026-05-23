"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Star,
  MapPin,
  Calendar,
  Award,
  BookOpen,
  DollarSign,
  TrendingUp,
  Users,
  Heart,
  Plus,
  Check,
  MessageSquare,
  MessageCircle,
  ThumbsUp,
  Send,
  Building,
  GraduationCap,
  Sparkles,
  ArrowLeft
} from "lucide-react";
import { useAppState } from "@/context/AppStateContext";
import { mockColleges, College, Course, Review, QAItem } from "@/data/mockColleges";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

export default function CollegeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { toggleBookmark, isBookmarked, addToCompare, removeFromCompare, isComparing } = useAppState();

  const [college, setCollege] = useState<College | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "courses" | "placements" | "reviews" | "qa">("overview");

  // Dynamic state for reviews and QA
  const [localReviews, setLocalReviews] = useState<Review[]>([]);
  const [localQA, setLocalQA] = useState<QAItem[]>([]);

  // Apply Now Modal state
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [applyName, setApplyName] = useState("");
  const [applyEmail, setApplyEmail] = useState("");
  const [applyPhone, setApplyPhone] = useState("");
  const [applyCourse, setApplyCourse] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  // New Review state
  const [newReviewUser, setNewReviewUser] = useState("");
  const [newReviewComment, setNewReviewComment] = useState("");
  const [newReviewAcademics, setNewReviewAcademics] = useState(5);
  const [newReviewPlacements, setNewReviewPlacements] = useState(5);
  const [newReviewInfra, setNewReviewInfra] = useState(5);
  const [newReviewLife, setNewReviewLife] = useState(5);
  const [newReviewTagInput, setNewReviewTagInput] = useState("");

  // New Q&A state
  const [newQuestionText, setNewQuestionText] = useState("");
  const [answerInputs, setAnswerInputs] = useState<{ [qId: string]: string }>({});

  useEffect(() => {
    const fetchCollegeDetails = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/colleges/${id}`);
        if (res.ok) {
          const data: College = await res.json();
          setCollege(data);
          setLocalReviews(data.reviews || []);
          setLocalQA(data.qa || []);
          if (data.courses.length > 0) {
            setApplyCourse(data.courses[0].name);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCollegeDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 animate-pulse">
        <div className="h-6 bg-slate-200 rounded w-24 mb-6" />
        <div className="h-40 bg-slate-200 rounded-3xl mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-12 bg-slate-200 rounded-xl" />
            <div className="h-96 bg-slate-200 rounded-3xl" />
          </div>
          <div className="h-80 bg-slate-200 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!college) {
    return (
      <div className="flex h-96 flex-col items-center justify-center text-center">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">College not found</h3>
        <button
          onClick={() => router.push("/colleges")}
          className="mt-4 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white"
        >
          Back to Colleges
        </button>
      </div>
    );
  }

  const bookmarked = isBookmarked(college.id);
  const comparing = isComparing(college.id);

  const handleCompareToggle = () => {
    if (comparing) {
      removeFromCompare(college.id);
    } else {
      const added = addToCompare(college.id);
      if (!added) {
        alert("You can compare up to 3 colleges at a time!");
      }
    }
  };

  // Submit Application handler
  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyName || !applyEmail || !applyPhone) {
      alert("Please fill in all details");
      return;
    }
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setIsApplyModalOpen(false);
      setApplyName("");
      setApplyEmail("");
      setApplyPhone("");
      alert(`Application submitted successfully for ${college.shortName}!`);
    }, 1500);
  };

  // Add Review handler
  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewUser || !newReviewComment) {
      alert("Please fill out name and comment");
      return;
    }

    const calculatedAvg = Number(
      ((newReviewAcademics + newReviewPlacements + newReviewInfra + newReviewLife) / 4).toFixed(1)
    );

    const tags = newReviewTagInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const newRev: Review = {
      id: `rev-local-${Date.now()}`,
      user: newReviewUser,
      rating: calculatedAvg,
      date: new Date().toISOString().split("T")[0],
      comment: newReviewComment,
      tags: tags.length > 0 ? tags : ["Alumni"],
      categories: {
        academics: newReviewAcademics,
        placements: newReviewPlacements,
        infrastructure: newReviewInfra,
        campusLife: newReviewLife,
      },
    };

    setLocalReviews([newRev, ...localReviews]);
    setNewReviewUser("");
    setNewReviewComment("");
    setNewReviewTagInput("");
    alert("Thank you! Review submitted successfully.");
  };

  // Ask Question handler
  const handleAskQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText) return;

    const newQ: QAItem = {
      id: `qa-local-${Date.now()}`,
      question: newQuestionText,
      askedBy: "Anonymous Student",
      askedDate: new Date().toISOString().split("T")[0],
      answers: [],
    };

    setLocalQA([newQ, ...localQA]);
    setNewQuestionText("");
  };

  // Add Answer handler
  const handleAddAnswer = (qId: string) => {
    const text = answerInputs[qId];
    if (!text) return;

    setLocalQA((prev) =>
      prev.map((q) => {
        if (q.id === qId) {
          return {
            ...q,
            answers: [
              ...q.answers,
              {
                id: `ans-local-${Date.now()}`,
                answer: text,
                answeredBy: "Student Guide",
                answeredDate: new Date().toISOString().split("T")[0],
                upvotes: 0,
              },
            ],
          };
        }
        return q;
      })
    );

    setAnswerInputs((prev) => ({ ...prev, [qId]: "" }));
  };

  // Upvote Answer handler
  const handleUpvoteAnswer = (qId: string, ansId: string) => {
    setLocalQA((prev) =>
      prev.map((q) => {
        if (q.id === qId) {
          return {
            ...q,
            answers: q.answers.map((ans) => {
              if (ans.id === ansId) {
                return { ...ans, upvotes: ans.upvotes + 1 };
              }
              return ans;
            }),
          };
        }
        return q;
      })
    );
  };

  // Review aggregate calculations
  const totalReviews = localReviews.length;
  const averageAcademics =
    totalReviews > 0
      ? Number((localReviews.reduce((sum, r) => sum + r.categories.academics, 0) / totalReviews).toFixed(1))
      : 0;
  const averagePlacements =
    totalReviews > 0
      ? Number((localReviews.reduce((sum, r) => sum + r.categories.placements, 0) / totalReviews).toFixed(1))
      : 0;
  const averageInfra =
    totalReviews > 0
      ? Number((localReviews.reduce((sum, r) => sum + r.categories.infrastructure, 0) / totalReviews).toFixed(1))
      : 0;
  const averageLife =
    totalReviews > 0
      ? Number((localReviews.reduce((sum, r) => sum + r.categories.campusLife, 0) / totalReviews).toFixed(1))
      : 0;

  const formattedFees = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(college.fees);

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Back to listings */}
      <button
        onClick={() => router.push("/colleges")}
        className="self-start inline-flex items-center gap-1 text-sm font-bold text-slate-500 hover:text-indigo-650 dark:text-slate-450 dark:hover:text-indigo-400 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Explore Colleges
      </button>

      {/* College Header Card */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white shadow-xl dark:bg-slate-950">
        {/* Background Visual Gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/40 opacity-90" />
        <div className={`absolute top-0 right-0 h-full w-2/3 bg-gradient-to-br ${college.logoColor} opacity-15 blur-3xl`} />

        <div className="relative flex flex-col md:flex-row items-center gap-6 p-6 md:p-8 z-10">
          <div className="flex h-24 w-24 md:h-28 md:w-28 shrink-0 items-center justify-center rounded-2xl bg-white/10 backdrop-blur border border-white/20 text-white shadow-2xl">
            <GraduationCap className="h-14 w-14" />
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
              <span className="rounded-lg bg-indigo-600/60 border border-indigo-500/20 px-2 py-0.5 text-xs font-bold uppercase tracking-wider">
                {college.type}
              </span>
              <span className="rounded-lg bg-white/10 px-2 py-0.5 text-xs font-semibold">
                {college.ownership} College
              </span>
              <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-600/30 px-2.5 py-0.5 text-xs font-bold text-emerald-350 border border-emerald-500/20">
                <Award className="h-3.5 w-3.5" />
                NIRF Rank #{college.rankings.nirf}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">{college.name}</h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-slate-350 mt-2">
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {college.location.city}, {college.location.state}
              </span>
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Established {college.established}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl p-4 self-center md:self-stretch justify-center flex-col shrink-0 min-w-32">
            <div className="flex items-center gap-1 text-2xl font-black text-amber-400">
              <Star className="h-6 w-6 fill-amber-400 text-amber-400" />
              {college.rating}
            </div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              {totalReviews} Student Reviews
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Details on Left, Sticky Stats Card on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Navigation Tabs & Tab Content */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Tabs header */}
          <div className="flex border-b border-slate-200 overflow-x-auto dark:border-slate-800 scrollbar-none">
            {[
              { id: "overview", label: "Overview", icon: BookOpen },
              { id: "courses", label: "Courses & Fees", icon: DollarSign },
              { id: "placements", label: "Placements", icon: TrendingUp },
              { id: "reviews", label: "Student Reviews", icon: Users },
              { id: "qa", label: "Discussion Q&A", icon: MessageSquare },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-5 py-3 border-b-2 font-bold text-sm transition-all whitespace-nowrap ${
                    isActive
                      ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-455"
                      : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-450 dark:hover:text-white"
                  }`}
                >
                  <Icon className="h-4.5 w-4.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Contents */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 dark:bg-slate-900 dark:border-slate-800 min-h-96">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3 dark:text-white">Institute Overview</h3>
                  <p className="text-slate-650 text-sm leading-relaxed dark:text-slate-350">
                    {college.overview}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3 dark:text-white">Campus Facilities</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {college.campusFacilities.map((fac) => (
                      <div
                        key={fac}
                        className="flex items-center gap-2 text-sm text-slate-650 dark:text-slate-350"
                      >
                        <div className="h-2 w-2 rounded-full bg-indigo-500" />
                        <span>{fac}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-5 dark:border-slate-800">
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Established</h4>
                    <p className="text-lg font-bold text-slate-850 dark:text-white mt-1">
                      {college.established}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Campus Type</h4>
                    <p className="text-lg font-bold text-slate-850 dark:text-white mt-1">
                      {college.ownership}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "courses" && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Available Streams & Intake</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-sm text-slate-500 dark:text-slate-400">
                    <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-700 dark:bg-slate-950 dark:text-slate-300">
                      <tr>
                        <th className="px-4 py-3 rounded-l-lg">Course Name</th>
                        <th className="px-4 py-3">Duration</th>
                        <th className="px-4 py-3">Annual Fees</th>
                        <th className="px-4 py-3">Seats</th>
                        <th className="px-4 py-3 rounded-r-lg">Eligibility</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {college.courses.map((course) => (
                        <tr key={course.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/50">
                          <td className="px-4 py-4 font-semibold text-slate-900 dark:text-white">
                            {course.name}
                            <div className="flex gap-1 mt-1">
                              {course.examsAccepted.map((ex) => (
                                <span
                                  key={ex}
                                  className="text-[9px] font-bold bg-slate-100 border border-slate-200 text-slate-600 rounded px-1 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
                                >
                                  {ex}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-4 font-medium">{course.duration}</td>
                          <td className="px-4 py-4 font-bold text-slate-800 dark:text-slate-200">
                            {new Intl.NumberFormat("en-IN", {
                              style: "currency",
                              currency: "INR",
                              maximumFractionDigits: 0,
                            }).format(course.fees)}
                          </td>
                          <td className="px-4 py-4 font-medium">{course.seats} Seats</td>
                          <td className="px-4 py-4 text-xs max-w-xs">{course.eligibility}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "placements" && (
              <div className="space-y-8">
                {/* Visual Chart Trend */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Placement Salary Trends</h3>
                  <div className="h-64 w-full text-slate-800">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={college.placement.yearlyTrends}
                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="colorMax" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="year" tickLine={false} />
                        <YAxis tickLine={false} label={{ value: 'LPA (Lakhs per Annum)', angle: -90, position: 'insideLeft', offset: -10, style: { fontSize: '10px' } }} />
                        <Tooltip />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="average"
                          name="Average Package"
                          stroke="#4f46e5"
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#colorAvg)"
                        />
                        <Area
                          type="monotone"
                          dataKey="highest"
                          name="Highest Package"
                          stroke="#10b981"
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#colorMax)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Placement Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-950/20">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Placement Rate</h4>
                    <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                      {college.placement.placementRate}%
                    </p>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden dark:bg-slate-800">
                      <div
                        className="bg-indigo-650 h-full rounded-full"
                        style={{ width: `${college.placement.placementRate}%` }}
                      />
                    </div>
                  </div>
                  <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-950/20">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Average Package</h4>
                    <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
                      {college.placement.averagePackage} LPA
                    </p>
                  </div>
                  <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-950/20">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Highest Package</h4>
                    <p className="text-2xl font-black text-emerald-600 dark:text-emerald-450 mt-1">
                      {college.placement.highestPackage} LPA
                    </p>
                  </div>
                </div>

                {/* Top Recruiters */}
                <div>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Top Recruiting Companies</h3>
                  <div className="flex flex-wrap gap-2">
                    {college.placement.recruiters.map((rec) => (
                      <span
                        key={rec}
                        className="rounded-xl border border-slate-200 px-3.5 py-1.5 text-xs font-bold bg-white text-slate-800 dark:border-slate-850 dark:bg-slate-950 dark:text-slate-200"
                      >
                        {rec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-8">
                {/* Aggregate Review Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 border-b border-slate-100 pb-6 dark:border-slate-800">
                  <div className="md:col-span-2 flex flex-col items-center justify-center bg-slate-50/50 border border-slate-100 rounded-2xl p-4 dark:border-slate-800 dark:bg-slate-950/20 text-center">
                    <p className="text-4xl font-black text-slate-900 dark:text-white">{college.rating}</p>
                    <div className="flex items-center gap-0.5 text-amber-500 mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.round(college.rating) ? "fill-current" : ""
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-slate-400 mt-2 font-semibold uppercase">
                      Based on {totalReviews} reviews
                    </p>
                  </div>

                  {/* Rating parameters */}
                  <div className="md:col-span-3 space-y-3">
                    {[
                      { label: "Academics", score: averageAcademics },
                      { label: "Infrastructure", score: averageInfra },
                      { label: "Placements", score: averagePlacements },
                      { label: "Campus Life", score: averageLife },
                    ].map((param) => (
                      <div key={param.label} className="flex items-center justify-between text-sm">
                        <span className="font-semibold text-slate-550 w-24 shrink-0">{param.label}</span>
                        <div className="flex-1 bg-slate-100 h-2 rounded-full mx-3 overflow-hidden dark:bg-slate-800">
                          <div
                            className="bg-indigo-600 h-full rounded-full"
                            style={{ width: `${(param.score / 5) * 100}%` }}
                          />
                        </div>
                        <span className="font-bold text-slate-800 dark:text-white shrink-0 min-w-8 text-right">
                          {param.score} / 5
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Submissions form */}
                <form onSubmit={handleAddReview} className="border border-indigo-100/50 rounded-2xl p-5 bg-indigo-50/20 dark:border-slate-800 dark:bg-slate-950/20 flex flex-col gap-4">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="h-4.5 w-4.5 text-indigo-600" />
                    <h4 className="font-bold text-slate-900 dark:text-white">Write a Student Review</h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-500">Your Name</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={newReviewUser}
                        onChange={(e) => setNewReviewUser(e.target.value)}
                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none dark:border-slate-800 dark:bg-slate-900"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-slate-500">Tags (comma separated)</label>
                      <input
                        type="text"
                        placeholder="Alumni, Campus Life, Coding Culture"
                        value={newReviewTagInput}
                        onChange={(e) => setNewReviewTagInput(e.target.value)}
                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none dark:border-slate-800 dark:bg-slate-900"
                      />
                    </div>
                  </div>

                  {/* Sub-ratings sliders */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white/60 p-3 rounded-xl dark:bg-slate-900/60">
                    {[
                      { label: "Academics", value: newReviewAcademics, setter: setNewReviewAcademics },
                      { label: "Infrastructure", value: newReviewInfra, setter: setNewReviewInfra },
                      { label: "Placements", value: newReviewPlacements, setter: setNewReviewPlacements },
                      { label: "Campus Life", value: newReviewLife, setter: setNewReviewLife },
                    ].map((rParam) => (
                      <div key={rParam.label} className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-slate-500">{rParam.label} ({rParam.value})</span>
                        <input
                          type="range"
                          min="1"
                          max="5"
                          step="1"
                          value={rParam.value}
                          onChange={(e) => rParam.setter(Number(e.target.value))}
                          className="w-full accent-indigo-650 h-1.5 rounded-lg cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500">Comment</label>
                    <textarea
                      placeholder="Share your real academic experience, infrastructure quality, social scene, and placement assistance..."
                      value={newReviewComment}
                      onChange={(e) => setNewReviewComment(e.target.value)}
                      rows={3}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none dark:border-slate-800 dark:bg-slate-900 resize-none"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="self-end rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-indigo-500"
                  >
                    Submit Review
                  </button>
                </form>

                {/* Reviews List */}
                <div className="space-y-4">
                  {localReviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="border border-slate-100 rounded-2xl p-5 bg-white dark:border-slate-850 dark:bg-slate-950/20"
                    >
                      <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div>
                          <h5 className="font-bold text-slate-900 dark:text-white">{rev.user}</h5>
                          <span className="text-[10px] text-slate-400 font-medium">Verified student • {rev.date}</span>
                        </div>
                        <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-lg text-xs font-bold text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
                          <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                          {rev.rating} / 5
                        </div>
                      </div>

                      <p className="text-sm text-slate-650 mt-3 dark:text-slate-350">{rev.comment}</p>

                      <div className="flex flex-wrap gap-1 mt-4">
                        {rev.tags.map((t) => (
                          <span
                            key={t}
                            className="text-[9px] font-bold border border-slate-200 text-slate-500 px-2 py-0.5 rounded-lg dark:border-slate-800"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "qa" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-100 pb-4 dark:border-slate-800">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Q&A Student Forum</h3>
                    <p className="text-xs text-slate-400 font-medium">Ask seniors and get verified answers about admissions and life.</p>
                  </div>
                </div>

                {/* Ask a question form */}
                <form onSubmit={handleAskQuestion} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ask a question about this college (e.g. Hostels, Cutoffs, Placements)..."
                    value={newQuestionText}
                    onChange={(e) => setNewQuestionText(e.target.value)}
                    className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-950 dark:focus:border-indigo-400"
                    required
                  />
                  <button
                    type="submit"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-650 text-white shadow hover:bg-indigo-500 shrink-0"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>

                {/* Discussion board questions list */}
                <div className="space-y-6">
                  {localQA.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 font-medium">
                      No questions asked yet. Be the first to ask!
                    </div>
                  ) : (
                    localQA.map((q) => (
                      <div
                        key={q.id}
                        className="border border-slate-100 rounded-2xl p-5 bg-white dark:border-slate-850 dark:bg-slate-950/20 space-y-4"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-650 shrink-0 dark:bg-indigo-950/30 dark:text-indigo-455">
                            <MessageCircle className="h-4.5 w-4.5" />
                          </div>
                          <div>
                            <h5 className="font-bold text-slate-900 dark:text-white leading-snug">{q.question}</h5>
                            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                              Asked by {q.askedBy} • {q.askedDate}
                            </span>
                          </div>
                        </div>

                        {/* Answers block */}
                        {q.answers.length > 0 && (
                          <div className="pl-6 border-l-2 border-slate-105 space-y-4 dark:border-slate-800">
                            {q.answers.map((ans) => (
                              <div key={ans.id} className="text-sm bg-slate-50/50 p-3 rounded-xl dark:bg-slate-900/40">
                                <p className="text-slate-700 dark:text-slate-300">{ans.answer}</p>
                                <div className="flex items-center justify-between gap-4 mt-2">
                                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                    By {ans.answeredBy} • {ans.answeredDate}
                                  </span>
                                  <button
                                    onClick={() => handleUpvoteAnswer(q.id, ans.id)}
                                    className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 hover:text-indigo-600 dark:text-slate-450 dark:hover:text-indigo-400"
                                  >
                                    <ThumbsUp className="h-3 w-3" />
                                    Helpful ({ans.upvotes})
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Write an answer form */}
                        <div className="flex items-center gap-2 pl-6">
                          <input
                            type="text"
                            placeholder="Write an answer..."
                            value={answerInputs[q.id] || ""}
                            onChange={(e) =>
                              setAnswerInputs((prev) => ({ ...prev, [q.id]: e.target.value }))
                            }
                            className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs outline-none focus:bg-white dark:border-slate-800 dark:bg-slate-950"
                          />
                          <button
                            onClick={() => handleAddAnswer(q.id)}
                            className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-400"
                          >
                            Answer
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Sticky Quick Actions Info Card */}
        <div className="lg:sticky lg:top-24 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm dark:bg-slate-900 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white border-b border-slate-100 pb-3 mb-4 dark:border-slate-800">
              Admission Summary
            </h3>

            {/* Quick Fact list */}
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Average Course Fee</span>
                <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                  {formattedFees} <span className="text-xs font-normal text-slate-450">/ Year</span>
                </p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Average Placement</span>
                <p className="text-xl font-extrabold text-emerald-600 dark:text-emerald-450 mt-0.5">
                  {college.placement.averagePackage} LPA
                </p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Entrance Exams</span>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {college.exams.map((ex) => (
                    <span
                      key={ex}
                      className="text-xs font-bold border border-slate-200 bg-slate-50 px-2 py-0.5 rounded-lg dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
                    >
                      {ex}
                    </span>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 dark:border-slate-800 flex flex-col gap-2">
                <button
                  onClick={() => setIsApplyModalOpen(true)}
                  className="w-full inline-flex items-center justify-center rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white shadow-md hover:bg-indigo-500 shadow-indigo-100 dark:shadow-none"
                >
                  Apply Now
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={handleCompareToggle}
                    className={`flex-1 inline-flex items-center justify-center gap-1 rounded-xl py-2.5 text-xs font-bold border transition-colors ${
                      comparing
                        ? "border-emerald-600 bg-emerald-50 text-emerald-700 dark:border-emerald-550 dark:bg-emerald-950/20 dark:text-emerald-400"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                    }`}
                  >
                    {comparing ? (
                      <>
                        <Check className="h-4 w-4" />
                        Comparing
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        Compare
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => toggleBookmark(college.id)}
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-colors ${
                      bookmarked
                        ? "border-red-500 bg-red-50 text-red-500 dark:border-red-950/30 dark:bg-red-950/20"
                        : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
                    }`}
                  >
                    <Heart className={`h-4.5 w-4.5 ${bookmarked ? "fill-red-500 text-red-500" : ""}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Now Form Modal Dialog */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setIsApplyModalOpen(false)} />
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden dark:bg-slate-900">
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-6 w-6 text-indigo-650" />
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Admission Application</h3>
                  </div>
                  <button
                    onClick={() => setIsApplyModalOpen(false)}
                    className="text-slate-400 hover:text-slate-655"
                  >
                    ✕
                  </button>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl dark:bg-slate-950 text-xs text-slate-500 font-semibold">
                  Applying to: <strong className="text-slate-800 dark:text-slate-300">{college.name}</strong>
                </div>

                <form onSubmit={handleApplySubmit} className="space-y-3.5">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-550">Full Name</label>
                    <input
                      type="text"
                      placeholder="Aarav Sharma"
                      value={applyName}
                      onChange={(e) => setApplyName(e.target.value)}
                      className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none dark:border-slate-800 dark:bg-slate-950"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-550">Email Address</label>
                    <input
                      type="email"
                      placeholder="aarav@gmail.com"
                      value={applyEmail}
                      onChange={(e) => setApplyEmail(e.target.value)}
                      className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none dark:border-slate-800 dark:bg-slate-950"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-550">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="+91 9876543210"
                      value={applyPhone}
                      onChange={(e) => setApplyPhone(e.target.value)}
                      className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none dark:border-slate-800 dark:bg-slate-950"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-slate-550">Target Stream / Course</label>
                    <select
                      value={applyCourse}
                      onChange={(e) => setApplyCourse(e.target.value)}
                      className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none dark:border-slate-800 dark:bg-slate-950"
                    >
                      {college.courses.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitted}
                    className="w-full inline-flex items-center justify-center rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white shadow hover:bg-indigo-500 disabled:opacity-50"
                  >
                    {isSubmitted ? "Submitting application..." : "Submit Admission Request"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
