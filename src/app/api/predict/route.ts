import { NextResponse } from "next/server";
import { mockColleges, College, Course } from "@/data/mockColleges";

interface PredictRequest {
  exam: string;
  rank: number;
  category: 'General' | 'OBC' | 'SC' | 'ST';
  state: string;
}

export async function POST(request: Request) {
  try {
    const body: PredictRequest = await request.json();
    const { exam, rank, category, state } = body;

    if (!exam || !rank || !category) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    const predictions: Array<{
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
    }> = [];

    mockColleges.forEach((college) => {
      college.courses.forEach((course) => {
        // Check if course accepts the selected exam
        if (!course.examsAccepted.includes(exam)) return;

        // Determine appropriate quota: Home State if user state matches college state, otherwise Other State/All India
        const isHomeState = state.toLowerCase() === college.location.state.toLowerCase();
        
        // Find matching cutoff by category
        const categoryCutoff = course.cutoffs.find((c) => c.category === category);
        if (!categoryCutoff) return;

        // Try to find quota match: Home State vs Other State
        let selectedCutoffList = categoryCutoff.ranks;
        
        // If there are multiple quotas, try to filter by state quota
        const hasQuotaFiltering = course.cutoffs.some(c => c.quota !== "All India");
        if (hasQuotaFiltering) {
          const matchedQuota = categoryCutoff.quota;
          const isTargetQuota = isHomeState ? matchedQuota === "Home State" : matchedQuota === "Other State";
          if (!isTargetQuota && matchedQuota !== "All India") {
            // Find another one for the user's quota if available
            const alternative = course.cutoffs.find(
              c => c.category === category && (isHomeState ? c.quota === "Home State" : c.quota === "Other State")
            );
            if (alternative) {
              selectedCutoffList = alternative.ranks;
            }
          }
        }

        if (selectedCutoffList.length === 0) return;

        // Find the latest year (2025)
        const sortedCutoffs = [...selectedCutoffList].sort((a, b) => b.year - a.year);
        const latest = sortedCutoffs[0];
        const closingRank = latest.closing;

        // If it's a percentile exam (like CAT), higher is better
        const isPercentile = exam === "CAT";

        let probability: "High" | "Medium" | "Low" | "None" = "None";
        let probabilityText = "";

        if (isPercentile) {
          // For percentile, user score/percentile should be >= closing percentile
          // Closing rank in CAT is represented as percentile, e.g. 99.0
          if (rank >= closingRank) {
            probability = "High";
            probabilityText = "Your percentile is comfortably above the cutoff.";
          } else if (rank >= closingRank - 1.0) {
            probability = "Medium";
            probabilityText = "You are close to the cutoff boundary. Strong interview required.";
          } else if (rank >= closingRank - 3.0) {
            probability = "Low";
            probabilityText = "This is a stretch target. Admission chances are low.";
          }
        } else {
          // For rank exams, lower rank is better
          if (rank <= closingRank * 0.8) {
            probability = "High";
            probabilityText = "Safe Choice: Your rank is well within safe margins.";
          } else if (rank <= closingRank) {
            probability = "Medium";
            probabilityText = "Realistic Choice: Your rank is near the boundary, solid chance.";
          } else if (rank <= closingRank * 1.25) {
            probability = "Low";
            probabilityText = "Reach Choice: Borderline possibility based on historical trends.";
          }
        }

        if (probability !== "None") {
          predictions.push({
            collegeId: college.id,
            collegeName: college.name,
            collegeShortName: college.shortName,
            logoColor: college.logoColor,
            collegeRating: college.rating,
            collegeLocation: `${college.location.city}, ${college.location.state}`,
            courseId: course.id,
            courseName: course.name,
            fees: course.fees,
            averagePackage: college.placement.averagePackage,
            latestCutoff: closingRank,
            probability: probability as "High" | "Medium" | "Low",
            probabilityText,
          });
        }
      });
    });

    // Sort predictions: High chance first, then Medium, then Low. Then sort by average package desc
    predictions.sort((a, b) => {
      const probPriority = { High: 3, Medium: 2, Low: 1 };
      const probDiff = probPriority[b.probability] - probPriority[a.probability];
      if (probDiff !== 0) return probDiff;
      return b.averagePackage - a.averagePackage;
    });

    return NextResponse.json(predictions);
  } catch (e) {
    console.error("Predictor error", e);
    return NextResponse.json({ error: "Failed to process request" }, { status: 550 });
  }
}
