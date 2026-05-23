import { NextResponse } from "next/server";
import { mockColleges, College } from "@/data/mockColleges";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // Extract parameters
  const search = searchParams.get("search")?.toLowerCase() || "";
  const types = searchParams.get("type")?.split(",").filter(Boolean) || [];
  const ownerships = searchParams.get("ownership")?.split(",").filter(Boolean) || [];
  const maxFees = searchParams.get("fees") ? Number(searchParams.get("fees")) : null;
  const minRating = searchParams.get("rating") ? Number(searchParams.get("rating")) : null;
  const state = searchParams.get("state")?.toLowerCase() || "";
  const sort = searchParams.get("sort") || "rating_desc";
  
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 6;

  // Filter logic
  let filtered = mockColleges.filter((college) => {
    // Search keyword match
    if (search) {
      const matchName = college.name.toLowerCase().includes(search);
      const matchShortName = college.shortName.toLowerCase().includes(search);
      const matchCity = college.location.city.toLowerCase().includes(search);
      const matchState = college.location.state.toLowerCase().includes(search);
      if (!matchName && !matchShortName && !matchCity && !matchState) {
        return false;
      }
    }

    // Type/Stream match
    if (types.length > 0 && !types.includes(college.type)) {
      return false;
    }

    // Ownership match
    if (ownerships.length > 0 && !ownerships.includes(college.ownership)) {
      return false;
    }

    // Fees match
    if (maxFees !== null && college.fees > maxFees) {
      return false;
    }

    // Rating match
    if (minRating !== null && college.rating < minRating) {
      return false;
    }

    // State location match
    if (state && college.location.state.toLowerCase() !== state) {
      return false;
    }

    return true;
  });

  // Sorting logic
  filtered.sort((a, b) => {
    switch (sort) {
      case "fees_asc":
        return a.fees - b.fees;
      case "fees_desc":
        return b.fees - a.fees;
      case "rating_desc":
        return b.rating - a.rating;
      case "package_desc":
        return b.placement.averagePackage - a.placement.averagePackage;
      case "nirf_asc":
        return a.rankings.nirf - b.rankings.nirf;
      default:
        return b.rating - a.rating;
    }
  });

  // Pagination
  const total = filtered.length;
  const startIndex = (page - 1) * limit;
  const paginated = filtered.slice(startIndex, startIndex + limit);
  const totalPages = Math.ceil(total / limit);

  // Return artificial response with some analytics for dashboard
  return NextResponse.json({
    colleges: paginated,
    pagination: {
      total,
      page,
      limit,
      totalPages,
    },
    analytics: {
      minFees: total > 0 ? Math.min(...filtered.map(c => c.fees)) : 0,
      maxFees: total > 0 ? Math.max(...filtered.map(c => c.fees)) : 0,
      avgPackage: total > 0 ? Number((filtered.reduce((sum, c) => sum + c.placement.averagePackage, 0) / total).toFixed(2)) : 0,
    }
  });
}
