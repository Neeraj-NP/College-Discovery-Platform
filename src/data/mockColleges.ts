export interface YearlyTrend {
  year: number;
  average: number; // in LPA
  highest: number; // in LPA
}

export interface PlacementData {
  averagePackage: number; // in LPA
  highestPackage: number; // in LPA
  placementRate: number; // percentage
  recruiters: string[];
  yearlyTrends: YearlyTrend[];
}

export interface CutoffRank {
  year: number;
  opening: number;
  closing: number;
}

export interface Cutoff {
  category: 'General' | 'OBC' | 'SC' | 'ST';
  quota: 'Home State' | 'Other State' | 'All India';
  ranks: CutoffRank[];
}

export interface Course {
  id: string;
  name: string;
  duration: string;
  fees: number; // annual
  seats: number;
  eligibility: string;
  examsAccepted: string[];
  cutoffs: Cutoff[];
}

export interface ReviewCategory {
  academics: number;
  infrastructure: number;
  placements: number;
  campusLife: number;
}

export interface Review {
  id: string;
  user: string;
  rating: number;
  date: string;
  comment: string;
  tags: string[];
  categories: ReviewCategory;
}

export interface Answer {
  id: string;
  answer: string;
  answeredBy: string;
  answeredDate: string;
  upvotes: number;
}

export interface QAItem {
  id: string;
  question: string;
  askedBy: string;
  askedDate: string;
  answers: Answer[];
}

export interface College {
  id: string;
  name: string;
  shortName: string;
  logoColor: string; // Tailwind gradient, e.g. "from-blue-600 to-indigo-600"
  type: 'Engineering' | 'Management' | 'Medical' | 'Commerce';
  ownership: 'Government' | 'Private';
  established: number;
  rating: number;
  location: {
    city: string;
    state: string;
  };
  fees: number; // average annual fee
  rankings: {
    nirf: number;
    world?: number;
  };
  exams: string[];
  placement: PlacementData;
  courses: Course[];
  overview: string;
  campusFacilities: string[];
  reviews: Review[];
  qa: QAItem[];
}

export const mockColleges: College[] = [
  {
    id: "iit-bombay",
    name: "Indian Institute of Technology, Bombay",
    shortName: "IIT Bombay",
    logoColor: "from-blue-600 to-indigo-700",
    type: "Engineering",
    ownership: "Government",
    established: 1958,
    rating: 4.9,
    location: {
      city: "Mumbai",
      state: "Maharashtra"
    },
    fees: 220000,
    rankings: {
      nirf: 3,
      world: 149
    },
    exams: ["JEE Advanced", "GATE"],
    placement: {
      averagePackage: 23.5,
      highestPackage: 168.0,
      placementRate: 98,
      recruiters: ["Google", "Microsoft", "Qualcomm", "TATA", "Goldman Sachs", "Uber"],
      yearlyTrends: [
        { year: 2023, average: 21.8, highest: 150.0 },
        { year: 2024, average: 22.7, highest: 162.0 },
        { year: 2025, average: 23.5, highest: 168.0 }
      ]
    },
    courses: [
      {
        id: "btech-cse",
        name: "B.Tech in Computer Science and Engineering",
        duration: "4 Years",
        fees: 225000,
        seats: 120,
        eligibility: "Class 12 with 75% marks and JEE Advanced score",
        examsAccepted: ["JEE Advanced"],
        cutoffs: [
          {
            category: "General",
            quota: "All India",
            ranks: [
              { year: 2023, opening: 1, closing: 67 },
              { year: 2024, opening: 1, closing: 62 },
              { year: 2025, opening: 1, closing: 59 }
            ]
          },
          {
            category: "OBC",
            quota: "All India",
            ranks: [
              { year: 2023, opening: 5, closing: 32 },
              { year: 2024, opening: 3, closing: 28 },
              { year: 2025, opening: 2, closing: 25 }
            ]
          }
        ]
      },
      {
        id: "btech-ee",
        name: "B.Tech in Electrical Engineering",
        duration: "4 Years",
        fees: 225000,
        seats: 90,
        eligibility: "Class 12 with 75% marks and JEE Advanced score",
        examsAccepted: ["JEE Advanced"],
        cutoffs: [
          {
            category: "General",
            quota: "All India",
            ranks: [
              { year: 2023, opening: 75, closing: 290 },
              { year: 2024, opening: 80, closing: 285 },
              { year: 2025, opening: 72, closing: 275 }
            ]
          }
        ]
      },
      {
        id: "btech-mech",
        name: "B.Tech in Mechanical Engineering",
        duration: "4 Years",
        fees: 225000,
        seats: 100,
        eligibility: "Class 12 with 75% marks and JEE Advanced score",
        examsAccepted: ["JEE Advanced"],
        cutoffs: [
          {
            category: "General",
            quota: "All India",
            ranks: [
              { year: 2023, opening: 350, closing: 1120 },
              { year: 2024, opening: 320, closing: 1050 },
              { year: 2025, opening: 310, closing: 1010 }
            ]
          }
        ]
      }
    ],
    overview: "IIT Bombay is a leading public engineering institution located in Powai, Mumbai. Renowned for its world-class faculty, highly competitive admissions, and extensive industry linkages, IIT Bombay stands as a pinnacle of technological research and education in India.",
    campusFacilities: ["State-of-the-art Labs", "Olympic-sized Swimming Pool", "Hostels (18)", "Central Library", "Innovation Hub", "Hospital"],
    reviews: [
      {
        id: "rev-iitb-1",
        user: "Aarav Sharma",
        rating: 5,
        date: "2026-04-12",
        comment: "Outstanding coding culture, world-class placement packages, and great campus life next to Powai Lake. Coding clubs are highly active and placement prep is top-notch.",
        tags: ["Campus Life", "Placements", "Academics"],
        categories: { academics: 5, infrastructure: 5, placements: 5, campusLife: 5 }
      },
      {
        id: "rev-iitb-2",
        user: "Neha Patel",
        rating: 4.8,
        date: "2026-03-05",
        comment: "Excellent faculty, but academic pressure can get very intense. The infrastructure is top-tier with labs open 24/7.",
        tags: ["Infrastructure", "Academics"],
        categories: { academics: 5, infrastructure: 4.8, placements: 4.8, campusLife: 4.5 }
      }
    ],
    qa: [
      {
        id: "qa-iitb-1",
        question: "What JEE Advanced rank is typically needed for B.Tech CSE?",
        askedBy: "Rahul Kumar",
        askedDate: "2026-05-10",
        answers: [
          {
            id: "ans-iitb-1-1",
            answer: "For General category in All India quota, you need to rank under 60 in JEE Advanced. Competition is extremely high.",
            answeredBy: "Siddharth (CSE Student)",
            answeredDate: "2026-05-11",
            upvotes: 45
          }
        ]
      }
    ]
  },
  {
    id: "iit-madras",
    name: "Indian Institute of Technology, Madras",
    shortName: "IIT Madras",
    logoColor: "from-sky-700 to-indigo-800",
    type: "Engineering",
    ownership: "Government",
    established: 1959,
    rating: 4.9,
    location: {
      city: "Chennai",
      state: "Tamil Nadu"
    },
    fees: 215000,
    rankings: {
      nirf: 1,
      world: 285
    },
    exams: ["JEE Advanced", "GATE"],
    placement: {
      averagePackage: 21.4,
      highestPackage: 131.0,
      placementRate: 96,
      recruiters: ["Intel", "Cisco", "Nvidia", "Adobe", "Microsoft", "Goldman Sachs"],
      yearlyTrends: [
        { year: 2023, average: 19.8, highest: 120.0 },
        { year: 2024, average: 20.9, highest: 125.0 },
        { year: 2025, average: 21.4, highest: 131.0 }
      ]
    },
    courses: [
      {
        id: "iitm-btech-cse",
        name: "B.Tech in Computer Science and Engineering",
        duration: "4 Years",
        fees: 220000,
        seats: 90,
        eligibility: "Class 12 with 75% marks and JEE Advanced score",
        examsAccepted: ["JEE Advanced"],
        cutoffs: [
          {
            category: "General",
            quota: "All India",
            ranks: [
              { year: 2023, opening: 10, closing: 148 },
              { year: 2024, opening: 8, closing: 132 },
              { year: 2025, opening: 5, closing: 110 }
            ]
          }
        ]
      },
      {
        id: "iitm-btech-ee",
        name: "B.Tech in Electrical Engineering",
        duration: "4 Years",
        fees: 220000,
        seats: 80,
        eligibility: "Class 12 with 75% marks and JEE Advanced score",
        examsAccepted: ["JEE Advanced"],
        cutoffs: [
          {
            category: "General",
            quota: "All India",
            ranks: [
              { year: 2023, opening: 180, closing: 450 },
              { year: 2024, opening: 150, closing: 420 },
              { year: 2025, opening: 140, closing: 390 }
            ]
          }
        ]
      }
    ],
    overview: "Ranked #1 by NIRF in India, IIT Madras is celebrated for its sprawling green campus, state-of-the-art Research Park, and pioneering research output. Located in Chennai, it offers some of the country's best educational resources.",
    campusFacilities: ["Research Park", "Wildlife Sanctuary Inside Campus", "Hostels (20)", "Advanced Supercomputing lab", "Open Air Theatre"],
    reviews: [
      {
        id: "rev-iitm-1",
        user: "Karthik Raja",
        rating: 4.9,
        date: "2026-05-01",
        comment: "Excellent research culture and the Research Park is unparalleled. The coding environment is extremely competitive.",
        tags: ["Research", "Campus Life", "Placements"],
        categories: { academics: 5, infrastructure: 5, placements: 4.8, campusLife: 4.8 }
      }
    ],
    qa: []
  },
  {
    id: "bits-pilani",
    name: "Birla Institute of Technology and Science, Pilani",
    shortName: "BITS Pilani",
    logoColor: "from-indigo-600 to-purple-600",
    type: "Engineering",
    ownership: "Private",
    established: 1964,
    rating: 4.7,
    location: {
      city: "Pilani",
      state: "Rajasthan"
    },
    fees: 520000,
    rankings: {
      nirf: 25
    },
    exams: ["BITSAT"],
    placement: {
      averagePackage: 19.5,
      highestPackage: 85.0,
      placementRate: 95,
      recruiters: ["Amazon", "Uber", "Apple", "Salesforce", "JPMorgan", "Boston Consulting Group"],
      yearlyTrends: [
        { year: 2023, average: 17.5, highest: 72.0 },
        { year: 2024, average: 18.2, highest: 78.0 },
        { year: 2025, average: 19.5, highest: 85.0 }
      ]
    },
    courses: [
      {
        id: "bits-cse",
        name: "B.E. in Computer Science",
        duration: "4 Years",
        fees: 540000,
        seats: 120,
        eligibility: "Class 12 with 75% in PCM and BITSAT score",
        examsAccepted: ["BITSAT"],
        cutoffs: [
          {
            category: "General",
            quota: "All India",
            ranks: [
              { year: 2023, opening: 290, closing: 331 }, // Cutoff marks in BITSAT (out of 390)
              { year: 2024, opening: 300, closing: 328 },
              { year: 2025, opening: 310, closing: 335 }
            ]
          }
        ]
      },
      {
        id: "bits-ece",
        name: "B.E. in Electronics and Communication Engineering",
        duration: "4 Years",
        fees: 540000,
        seats: 100,
        eligibility: "Class 12 with 75% in PCM and BITSAT score",
        examsAccepted: ["BITSAT"],
        cutoffs: [
          {
            category: "General",
            quota: "All India",
            ranks: [
              { year: 2023, opening: 260, closing: 296 },
              { year: 2024, opening: 265, closing: 290 },
              { year: 2025, opening: 270, closing: 295 }
            ]
          }
        ]
      }
    ],
    overview: "BITS Pilani is India's premium private engineering university, famous for its 'No Attendance Policy' and dual-degree programs. It operates on BITSAT admission scores and boasts a massive global alumni network.",
    campusFacilities: ["Zero Attendance Policy", "Modern Labs", "Fully Wi-Fi Campus", "Student Activity Center", "Alumni Library"],
    reviews: [
      {
        id: "rev-bits-1",
        user: "Rohan Verma",
        rating: 4.7,
        date: "2026-03-22",
        comment: "The absolute freedom of no attendance policy helps you build startups and pursue coding projects. Fees are high, but ROI in CSE is solid.",
        tags: ["Campus Life", "Placements", "Fees"],
        categories: { academics: 4.5, infrastructure: 4.8, placements: 4.9, campusLife: 5 }
      }
    ],
    qa: [
      {
        id: "qa-bits-1",
        question: "Is there any reservation quota in BITS Pilani?",
        askedBy: "Sandeep S.",
        askedDate: "2026-04-10",
        answers: [
          {
            id: "ans-bits-1-1",
            answer: "No, BITS Pilani does not have any category-based reservation (OBC/SC/ST/State). Admissions are solely on BITSAT merit.",
            answeredBy: "Ananya BITSian",
            answeredDate: "2026-04-11",
            upvotes: 18
          }
        ]
      }
    ]
  },
  {
    id: "nit-trichy",
    name: "National Institute of Technology, Tiruchirappalli",
    shortName: "NIT Trichy",
    logoColor: "from-teal-600 to-cyan-700",
    type: "Engineering",
    ownership: "Government",
    established: 1964,
    rating: 4.6,
    location: {
      city: "Tiruchirappalli",
      state: "Tamil Nadu"
    },
    fees: 145000,
    rankings: {
      nirf: 9
    },
    exams: ["JEE Main", "GATE"],
    placement: {
      averagePackage: 15.8,
      highestPackage: 52.8,
      placementRate: 93,
      recruiters: ["Samsung", "Amazon", "Texas Instruments", "Qualcomm", "Oracle", "Paypal"],
      yearlyTrends: [
        { year: 2023, average: 14.1, highest: 45.0 },
        { year: 2024, average: 15.0, highest: 50.0 },
        { year: 2025, average: 15.8, highest: 52.8 }
      ]
    },
    courses: [
      {
        id: "nitt-cse",
        name: "B.Tech in Computer Science and Engineering",
        duration: "4 Years",
        fees: 150000,
        seats: 120,
        eligibility: "Class 12 with 75% and JEE Main rank",
        examsAccepted: ["JEE Main"],
        cutoffs: [
          {
            category: "General",
            quota: "Other State",
            ranks: [
              { year: 2023, opening: 350, closing: 1200 },
              { year: 2024, opening: 320, closing: 1050 },
              { year: 2025, opening: 300, closing: 950 }
            ]
          },
          {
            category: "General",
            quota: "Home State",
            ranks: [
              { year: 2023, opening: 1200, closing: 4500 },
              { year: 2024, opening: 1100, closing: 4200 },
              { year: 2025, opening: 1050, closing: 3800 }
            ]
          }
        ]
      },
      {
        id: "nitt-ece",
        name: "B.Tech in Electronics and Communication Engineering",
        duration: "4 Years",
        fees: 150000,
        seats: 100,
        eligibility: "Class 12 with 75% and JEE Main rank",
        examsAccepted: ["JEE Main"],
        cutoffs: [
          {
            category: "General",
            quota: "Other State",
            ranks: [
              { year: 2023, opening: 1800, closing: 3200 },
              { year: 2024, opening: 1600, closing: 2900 },
              { year: 2025, opening: 1500, closing: 2700 }
            ]
          }
        ]
      }
    ],
    overview: "NIT Trichy is ranked #1 among all NITs in India. Located in Tamil Nadu, it is highly renowned for engineering academics, massive cultural festivals (Festember), and outstanding placements across core and IT roles.",
    campusFacilities: ["Huge Campus (800 Acres)", "Sports Complex", "Central Library", "State-of-the-art Labs", "Cafeterias"],
    reviews: [
      {
        id: "rev-nitt-1",
        user: "Vikram R.",
        rating: 4.6,
        date: "2026-04-18",
        comment: "Top-tier coding ecosystem. Culturally active, Festember is amazing. Only drawback is the weather, which can get extremely hot.",
        tags: ["Festivals", "Campus Life", "Placements"],
        categories: { academics: 4.5, infrastructure: 4.2, placements: 4.8, campusLife: 4.8 }
      }
    ],
    qa: []
  },
  {
    id: "aiims-delhi",
    name: "All India Institute of Medical Sciences, Delhi",
    shortName: "AIIMS Delhi",
    logoColor: "from-emerald-600 to-teal-700",
    type: "Medical",
    ownership: "Government",
    established: 1956,
    rating: 5.0,
    location: {
      city: "New Delhi",
      state: "Delhi"
    },
    fees: 1628,
    rankings: {
      nirf: 1
    },
    exams: ["NEET"],
    placement: {
      averagePackage: 18.0, // Calculated average stipend/starting salary for MD/MS
      highestPackage: 35.0,
      placementRate: 100,
      recruiters: ["Max Healthcare", "Fortis", "Apollo Hospitals", "AIIMS Residency", "Medanta"],
      yearlyTrends: [
        { year: 2023, average: 15.0, highest: 30.0 },
        { year: 2024, average: 16.5, highest: 32.0 },
        { year: 2025, average: 18.0, highest: 35.0 }
      ]
    },
    courses: [
      {
        id: "mbbs",
        name: "Bachelor of Medicine and Bachelor of Surgery (MBBS)",
        duration: "5.5 Years",
        fees: 1628,
        seats: 125,
        eligibility: "Class 12 with 50% in PCB + English, and NEET Score",
        examsAccepted: ["NEET"],
        cutoffs: [
          {
            category: "General",
            quota: "All India",
            ranks: [
              { year: 2023, opening: 1, closing: 57 },
              { year: 2024, opening: 1, closing: 53 },
              { year: 2025, opening: 1, closing: 50 }
            ]
          },
          {
            category: "OBC",
            quota: "All India",
            ranks: [
              { year: 2023, opening: 15, closing: 230 },
              { year: 2024, opening: 12, closing: 210 },
              { year: 2025, opening: 10, closing: 195 }
            ]
          }
        ]
      }
    ],
    overview: "AIIMS Delhi is India's premier medical research university and public hospital. With a negligible fee structure and an unmatched clinical exposure, it is the ultimate dream of every medical aspirant in India.",
    campusFacilities: ["World-class Research Labs", "Extensive OPD Clinical Exposure", "Hostel Accommodation", "Sports Ground", "24/7 Library"],
    reviews: [
      {
        id: "rev-aiims-1",
        user: "Dr. Aditya Sen",
        rating: 5.0,
        date: "2026-05-15",
        comment: "Virtually free education with the best clinical exposure in Asia. The volume of patients gives clinical confidence you can't get anywhere else.",
        tags: ["Clinical Exposure", "Fees", "Academics"],
        categories: { academics: 5, infrastructure: 5, placements: 5, campusLife: 4.8 }
      }
    ],
    qa: [
      {
        id: "qa-aiims-1",
        question: "Is AIIMS Delhi MBBS fee really less than 2000 rupees for the whole course?",
        askedBy: "Meera Nair",
        askedDate: "2026-03-12",
        answers: [
          {
            id: "ans-aiims-1-1",
            answer: "Yes, the tuition and hostel fee combined for 5.5 years is around ₹1,628. It is highly subsidized by the Government of India.",
            answeredBy: "Deepak (MBBS Batch 2023)",
            answeredDate: "2026-03-13",
            upvotes: 82
          }
        ]
      }
    ]
  },
  {
    id: "iim-ahmedabad",
    name: "Indian Institute of Management, Ahmedabad",
    shortName: "IIM Ahmedabad",
    logoColor: "from-amber-700 to-yellow-800",
    type: "Management",
    ownership: "Government",
    established: 1961,
    rating: 5.0,
    location: {
      city: "Ahmedabad",
      state: "Gujarat"
    },
    fees: 1250000, // Annual PGDM fee
    rankings: {
      nirf: 1
    },
    exams: ["CAT"],
    placement: {
      averagePackage: 32.8,
      highestPackage: 115.0,
      placementRate: 100,
      recruiters: ["McKinsey & Co", "Boston Consulting Group", "Bain & Co", "Goldman Sachs", "HUL", "TAS"],
      yearlyTrends: [
        { year: 2023, average: 30.1, highest: 98.0 },
        { year: 2024, average: 31.5, highest: 108.0 },
        { year: 2025, average: 32.8, highest: 115.0 }
      ]
    },
    courses: [
      {
        id: "pgp-mgmt",
        name: "Post Graduate Programme in Management (MBA)",
        duration: "2 Years",
        fees: 1250000,
        seats: 380,
        eligibility: "Graduation (50% marks) and CAT score",
        examsAccepted: ["CAT"],
        cutoffs: [
          {
            category: "General",
            quota: "All India",
            ranks: [
              { year: 2023, opening: 99, closing: 99.98 }, // represented as percentile
              { year: 2024, opening: 99, closing: 99.99 },
              { year: 2025, opening: 99, closing: 99.99 }
            ]
          }
        ]
      }
    ],
    overview: "IIM Ahmedabad (WIMA) is the top-ranked management institute in India. Known for its rigorous case-study methodology, iconic Louis Kahn brick architecture, and unmatched placement records, it is the premier destination for MBA education.",
    campusFacilities: ["Louis Kahn Plaza Campus", "Harvard Case Method Study Rooms", "Hostels (Fully Single Rooms)", "Massive Business Library", "Sports Complex"],
    reviews: [
      {
        id: "rev-iima-1",
        user: "Sanjay Mehta",
        rating: 5,
        date: "2026-02-14",
        comment: "Extremely rigorous academics. Case study method teaches real-world management. The brand value is immense and consulting placements are the best.",
        tags: ["Academics", "Brand Value", "Consulting"],
        categories: { academics: 5, infrastructure: 4.8, placements: 5, campusLife: 4.5 }
      }
    ],
    qa: []
  },
  {
    id: "srcc-delhi",
    name: "Shri Ram College of Commerce, Delhi University",
    shortName: "SRCC",
    logoColor: "from-orange-600 to-red-700",
    type: "Commerce",
    ownership: "Government",
    established: 1926,
    rating: 4.7,
    location: {
      city: "New Delhi",
      state: "Delhi"
    },
    fees: 30000,
    rankings: {
      nirf: 11
    },
    exams: ["CUET"],
    placement: {
      averagePackage: 10.15,
      highestPackage: 35.0,
      placementRate: 92,
      recruiters: ["McKinsey & Co", "EY", "Deloitte", "PwC", "Nomura", "KPMG"],
      yearlyTrends: [
        { year: 2023, average: 8.5, highest: 30.0 },
        { year: 2024, average: 9.4, highest: 33.0 },
        { year: 2025, average: 10.15, highest: 35.0 }
      ]
    },
    courses: [
      {
        id: "bcom-hons",
        name: "B.Com (Honours)",
        duration: "3 Years",
        fees: 29000,
        seats: 620,
        eligibility: "Class 12 + CUET score",
        examsAccepted: ["CUET"],
        cutoffs: [
          {
            category: "General",
            quota: "All India",
            ranks: [
              { year: 2023, opening: 780, closing: 795 }, // CUET score (out of 800)
              { year: 2024, opening: 785, closing: 798 },
              { year: 2025, opening: 790, closing: 799 }
            ]
          }
        ]
      },
      {
        id: "ba-economics",
        name: "B.A. (Honours) Economics",
        duration: "3 Years",
        fees: 29000,
        seats: 150,
        eligibility: "Class 12 + CUET score with Mathematics",
        examsAccepted: ["CUET"],
        cutoffs: [
          {
            category: "General",
            quota: "All India",
            ranks: [
              { year: 2023, opening: 775, closing: 792 },
              { year: 2024, opening: 780, closing: 795 },
              { year: 2025, opening: 785, closing: 797 }
            ]
          }
        ]
      }
    ],
    overview: "Shri Ram College of Commerce (SRCC) is the premier college for commerce and economics education in India under Delhi University. It is highly sought after for its stellar placement opportunities and alumni who lead top corporate offices.",
    campusFacilities: ["Air-Conditioned Classrooms", "Modern Seminar Room", "Boys & Girls Hostels", "Gymnasium", "Cooperative Mess"],
    reviews: [
      {
        id: "rev-srcc-1",
        user: "Karan Johar",
        rating: 4.7,
        date: "2026-04-03",
        comment: "If you want to enter Big 4 consulting or investment banking right after undergrad, this is the place. Incredible peer group and affordable fees.",
        tags: ["Placements", "Fees", "Peer Group"],
        categories: { academics: 4.5, infrastructure: 4.2, placements: 4.9, campusLife: 4.5 }
      }
    ],
    qa: []
  },
  {
    id: "fms-delhi",
    name: "Faculty of Management Studies, Delhi University",
    shortName: "FMS Delhi",
    logoColor: "from-rose-600 to-pink-700",
    type: "Management",
    ownership: "Government",
    established: 1954,
    rating: 4.8,
    location: {
      city: "New Delhi",
      state: "Delhi"
    },
    fees: 100000, // Very low MBA fee compared to IIMs
    rankings: {
      nirf: 35 // DU is listed differently, but FMS is highly ranked in top 5 B-Schools
    },
    exams: ["CAT"],
    placement: {
      averagePackage: 34.1, // Famous for ROI
      highestPackage: 123.0,
      placementRate: 100,
      recruiters: ["Morgan Stanley", "Avendus", "TAS", "HUL", "BCG", "E&Y", "Microsoft"],
      yearlyTrends: [
        { year: 2023, average: 31.0, highest: 100.0 },
        { year: 2024, average: 32.9, highest: 115.0 },
        { year: 2025, average: 34.1, highest: 123.0 }
      ]
    },
    courses: [
      {
        id: "fms-mba",
        name: "Master of Business Administration (MBA)",
        duration: "2 Years",
        fees: 100000,
        seats: 220,
        eligibility: "Graduation (50% marks) and CAT score",
        examsAccepted: ["CAT"],
        cutoffs: [
          {
            category: "General",
            quota: "All India",
            ranks: [
              { year: 2023, opening: 98.5, closing: 99.85 }, // CAT percentile
              { year: 2024, opening: 98.8, closing: 99.9 },
              { year: 2025, opening: 99.0, closing: 99.92 }
            ]
          }
        ]
      }
    ],
    overview: "Faculty of Management Studies (FMS) under the University of Delhi is famous as the 'Red Building of Dreams'. It is globally recognized for having the highest Return on Investment (ROI) of any business school in India, offering placement statistics on par with top IIMs at a fraction of the cost.",
    campusFacilities: ["AC Classrooms", "Delhi University Central Library Access", "Seminar Hall", "Hostels Access", "Discussion Chambers"],
    reviews: [
      {
        id: "rev-fms-1",
        user: "Abhishek Goyal",
        rating: 4.8,
        date: "2026-05-12",
        comment: "Unbelievable ROI. Placements are exactly equal to IIM A/B/C, but fees are under 2 Lakhs for the whole MBA. The campus is small, but the corporate exposure is elite.",
        tags: ["ROI", "Fees", "Placements"],
        categories: { academics: 4.8, infrastructure: 3.8, placements: 5.0, campusLife: 4.2 }
      }
    ],
    qa: [
      {
        id: "qa-fms-1",
        question: "Does FMS provide its own hostel for all outstation students?",
        askedBy: "Riya S.",
        askedDate: "2026-02-28",
        answers: [
          {
            id: "ans-fms-1-1",
            answer: "FMS itself doesn't have an exclusive hostel, but students get accommodation in DU post-graduate hostels like VKRV Rao Hostel and PG Men's Hostel. It is limited, so many rent flats in nearby areas like Kamla Nagar.",
            answeredBy: "FMS Senior PGP2",
            answeredDate: "2026-03-02",
            upvotes: 24
          }
        ]
      }
    ]
  },
  {
    id: "manipal-mit",
    name: "Manipal Institute of Technology",
    shortName: "MIT Manipal",
    logoColor: "from-blue-500 to-cyan-500",
    type: "Engineering",
    ownership: "Private",
    established: 1957,
    rating: 4.4,
    location: {
      city: "Manipal",
      state: "Karnataka"
    },
    fees: 405000,
    rankings: {
      nirf: 61
    },
    exams: ["MET", "JEE Main"],
    placement: {
      averagePackage: 12.5,
      highestPackage: 54.7,
      placementRate: 89,
      recruiters: ["Microsoft", "AWS", "Deloitte", "Goldman Sachs", "Accenture", "Infosys"],
      yearlyTrends: [
        { year: 2023, average: 10.8, highest: 44.0 },
        { year: 2024, average: 11.5, highest: 49.0 },
        { year: 2025, average: 12.5, highest: 54.7 }
      ]
    },
    courses: [
      {
        id: "mit-cse",
        name: "B.Tech in Computer Science and Engineering",
        duration: "4 Years",
        fees: 410000,
        seats: 180,
        eligibility: "Class 12 with 50% in PCM and MET rank",
        examsAccepted: ["MET", "JEE Main"],
        cutoffs: [
          {
            category: "General",
            quota: "All India",
            ranks: [
              { year: 2023, opening: 500, closing: 1080 }, // MET rank
              { year: 2024, opening: 450, closing: 950 },
              { year: 2025, opening: 400, closing: 890 }
            ]
          }
        ]
      }
    ],
    overview: "Manipal Institute of Technology (MIT) is a private research institute in Karnataka, highly admired for its global infrastructure, student exchange programs, and rich campus environment.",
    campusFacilities: ["World-class Campus", "AC Hostels", "Student Innovation Center", "Massive Library", "Arena Sports Arena"],
    reviews: [
      {
        id: "rev-mit-1",
        user: "Tushar Mehta",
        rating: 4.5,
        date: "2026-05-18",
        comment: "Excellent lifestyle and infrastructure. The placement cell is highly supportive. CSE curriculum is up-to-date with industry standards.",
        tags: ["Campus Life", "Infrastructure", "Placements"],
        categories: { academics: 4.0, infrastructure: 5.0, placements: 4.3, campusLife: 5.0 }
      }
    ],
    qa: []
  },
  {
    id: "mamc-delhi",
    name: "Maulana Azad Medical College, Delhi",
    shortName: "MAMC Delhi",
    logoColor: "from-green-700 to-emerald-800",
    type: "Medical",
    ownership: "Government",
    established: 1959,
    rating: 4.8,
    location: {
      city: "New Delhi",
      state: "Delhi"
    },
    fees: 4500,
    rankings: {
      nirf: 32 // Under DU, but ranks 3rd best for medical in general surveys
    },
    exams: ["NEET"],
    placement: {
      averagePackage: 15.0,
      highestPackage: 24.0,
      placementRate: 100,
      recruiters: ["LNJP Hospital", "GB Pant Hospital", "Fortis", "Apollo Hospitals"],
      yearlyTrends: [
        { year: 2023, average: 12.0, highest: 20.0 },
        { year: 2024, average: 13.8, highest: 22.0 },
        { year: 2025, average: 15.0, highest: 24.0 }
      ]
    },
    courses: [
      {
        id: "mamc-mbbs",
        name: "Bachelor of Medicine and Bachelor of Surgery (MBBS)",
        duration: "5.5 Years",
        fees: 4400,
        seats: 250,
        eligibility: "Class 12 with 50% in PCB + NEET Score",
        examsAccepted: ["NEET"],
        cutoffs: [
          {
            category: "General",
            quota: "All India",
            ranks: [
              { year: 2023, opening: 10, closing: 87 },
              { year: 2024, opening: 8, closing: 82 },
              { year: 2025, opening: 7, closing: 78 }
            ]
          },
          {
            category: "General",
            quota: "Home State", // Delhi state quota
            ranks: [
              { year: 2023, opening: 85, closing: 950 },
              { year: 2024, opening: 75, closing: 890 },
              { year: 2025, opening: 70, closing: 850 }
            ]
          }
        ]
      }
    ],
    overview: "Maulana Azad Medical College is an elite public medical college affiliated with Delhi University. Associated with the massive Lok Nayak Hospital, it provides some of the most intensive clinical training and internships in the country.",
    campusFacilities: ["Associated LNJP Hospital", "Modern Pathology Labs", "Large Auditorium", "Hostel Block", "Recreational Lounge"],
    reviews: [
      {
        id: "rev-mamc-1",
        user: "Dr. Sneha Verma",
        rating: 4.8,
        date: "2026-03-30",
        comment: "MAMC clinical training is legendary. The sheer diversity of medical cases you see in Lok Nayak hospital prepares you for any medical emergency. Fees are very nominal.",
        tags: ["Clinical Practice", "Lok Nayak Hospital", "Academics"],
        categories: { academics: 5, infrastructure: 4.2, placements: 5, campusLife: 4.5 }
      }
    ],
    qa: []
  }
];
