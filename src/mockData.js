export const MOCK_PROJECTS = [
  {
    id: "IN-MH-PUN-2024-0094B",
    name: "Sector Assessment: Mauje Ambavane",
    chainage: "Chainage 164+000 to 165+200",
    corridor: "Pune Ring Road (West Arc - Phase II)",
    district: "Pune, Maharashtra",
    parcelsCount: 48,
    affectedFamilies: 132,
    totalAreaHa: 34.6,
    baseRiskScore: 82,
    status: "Statutory 20E Stage",
    notifiedDate: "14-Feb-2024"
  },
  {
    id: "IN-UP-JWR-2024-0112A",
    name: "Noida International Airport Express Link",
    chainage: "Chainage 12+400 to 18+900",
    corridor: "Yamuna Expressway Spur",
    district: "Gautam Buddha Nagar, UP",
    parcelsCount: 64,
    affectedFamilies: 210,
    totalAreaHa: 52.1,
    baseRiskScore: 64,
    status: "Section 19 Publication",
    notifiedDate: "02-Jan-2024"
  },
  {
    id: "IN-KA-BLR-2024-0045C",
    name: "Bengaluru Peripheral Satellite Ring Road",
    chainage: "Chainage 42+100 to 47+800",
    corridor: "NH-648 Expansion",
    district: "Bengaluru Rural, Karnataka",
    parcelsCount: 32,
    affectedFamilies: 88,
    totalAreaHa: 26.8,
    baseRiskScore: 38,
    status: "Award Determination (Sec 23)",
    notifiedDate: "28-Mar-2024"
  }
];

export const MOCK_PROJECT_DATA = {
  id: "IN-MH-PUN-2024-0094B",
  name: "Sector Assessment: Mauje Ambavane — Chainage 164+000 to 165+200",
  corridor: "Pune Ring Road Project (Package III)",
  district: "Pune",
  taluka: "Mulshi",
  village: "Ambavane",
  riskScore: 82,
  riskCategory: "HIGH RISK",
  estimatedDelay: "148 statutory days",
  budgetAtRisk: 142000000, // 14.20 Cr
  confidenceScore: 94.2,
  statutoryDeadline: "28-Oct-2024",
  section: "Section 20(E) RFCTLARR Act 2013",
  
  // Cadastral GIS parcels for map
  parcels: [
    {
      gutNo: "104/1A",
      owner: "Kashinath B. Jadhav & 4 Others",
      areaHa: 1.45,
      classification: "Jirayat (Agricultural)",
      riskScore: 88,
      riskLevel: "HIGH",
      disputeReason: "Stay Order WP-4182/2024 (Bombay HC)",
      coordinates: [18.495, 73.498],
      compensationDemanded: 4800000,
      awardedCompensation: 1850000
    },
    {
      gutNo: "104/1B",
      owner: "Grampanchayat Gairan / Common Land",
      areaHa: 0.92,
      classification: "Community Grazing Land",
      riskScore: 78,
      riskLevel: "HIGH",
      disputeReason: "Gram Sabha NOC Withheld",
      coordinates: [18.498, 73.502],
      compensationDemanded: 2200000,
      awardedCompensation: 950000
    },
    {
      gutNo: "105/2",
      owner: "Suresh Rama Patil",
      areaHa: 2.10,
      classification: "Bagayat (Irrigated Cash Crop)",
      riskScore: 84,
      riskLevel: "HIGH",
      disputeReason: "Tree & Well Valuation Discrepancy",
      coordinates: [18.502, 73.506],
      compensationDemanded: 6200000,
      awardedCompensation: 2400000
    },
    {
      gutNo: "106/3",
      owner: "Chandrakant G. More",
      areaHa: 0.85,
      classification: "Residential Non-Agricultural (NA)",
      riskScore: 46,
      riskLevel: "MEDIUM",
      disputeReason: "Title Partition Pending in Civil Court",
      coordinates: [18.506, 73.511],
      compensationDemanded: 3100000,
      awardedCompensation: 2100000
    },
    {
      gutNo: "107/1",
      owner: "Anand M. Shinde & Brothers",
      areaHa: 3.40,
      classification: "Jirayat (Agricultural)",
      riskScore: 28,
      riskLevel: "LOW",
      disputeReason: "Consent Accorded (Consent Award Pending)",
      coordinates: [18.511, 73.515],
      compensationDemanded: 4200000,
      awardedCompensation: 4100000
    }
  ],

  // SHAP Waterfall & Driver Breakdown
  drivers: [
    {
      name: "High Court Stay Writ (#4182/2024)",
      impact: 24,
      displayImpact: "+24 pts",
      direction: "up",
      category: "Legal / Judicial",
      description: "Interim injunction against physical possession under Section 20(E)"
    },
    {
      name: "Valuation Gap (3.8x Spread)",
      impact: 18,
      displayImpact: "+18 pts",
      direction: "up",
      category: "Financial / Circle Rate",
      description: "Market rate ₹3,200/sq.m vs Ready Reckoner benchmark ₹840/sq.m"
    },
    {
      name: "Pending Joint Measurement Survey",
      impact: 12,
      displayImpact: "+12 pts",
      direction: "up",
      category: "Administrative",
      description: "14 cadastral boundary markers disputed by contiguous plot holders"
    },
    {
      name: "Solatium & R&R Multiplier Clause",
      impact: -8,
      displayImpact: "-8 pts",
      direction: "down",
      category: "Statutory Mitigation",
      description: "100% solatium provision accepted by 68% of affected titleholders"
    }
  ],

  // Default simulation parameters for What-If
  simulationDefaults: {
    compensationMultiplier: 1.0, // 1.0x to 2.5x circle rate
    surveyCompletionPct: 58,     // % completed
    litigationCases: 7,          // active court writs
    solatiumTopUpPct: 0          // additional ex-gratia incentive %
  },

  // Actionable Mitigation Recommendations
  recommendations: [
    {
      id: "REC-01",
      title: "Disburse Special Solatium Package (1.25x Multiplier)",
      authority: "SLAO Pune & NHAI Project Director",
      impactEstimate: "-14 pts risk reduction",
      timeframe: "7 Days",
      statutoryRef: "Section 30(1) RFCTLARR First Schedule",
      urgency: "HIGH",
      description: "Issue administrative sanction for 25% ex-gratia bonus on circle rate for amicable possession within 30 days."
    },
    {
      id: "REC-02",
      title: "Convene Special Pre-Lok Adalat Bench",
      authority: "District Legal Services Authority (DLSA) Pune",
      impactEstimate: "-18 pts risk reduction",
      timeframe: "14 Days",
      statutoryRef: "Legal Services Authorities Act, 1987",
      urgency: "CRITICAL",
      description: "Refer High Court writ 4182/2024 to joint conciliatory committee with Advocate General representative."
    },
    {
      id: "REC-03",
      title: "Deploy DGPS Drone Resurvey Team",
      authority: "Superintendent of Land Records (SLR) Pune",
      impactEstimate: "-8 pts risk reduction",
      timeframe: "5 Days",
      statutoryRef: "Maharashtra Land Revenue Code Sec 126",
      urgency: "MEDIUM",
      description: "Conduct high-precision Differential GPS survey of Gut No. 104 and 105 to resolve boundary discrepancies."
    }
  ]
};
