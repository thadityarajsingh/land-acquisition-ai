import apiClient from './client';
import { MOCK_PROJECT_DATA } from '../mockData';

export async function simulateWhatIf(payload) {
  try {
    const response = await apiClient.post('/what-if', payload);
    return response.data;
  } catch (error) {
    console.warn('[BhoomiIQ API] Fallback to dynamic simulation engine:', error.message);
    
    // Dynamic fallback simulation based on slider inputs
    const { compensationMultiplier = 1.0, surveyCompletionPct = 58, litigationCases = 7, solatiumTopUpPct = 0 } = payload;
    
    // Calculate realistic risk reduction
    const compBenefit = (compensationMultiplier - 1.0) * 22; // up to ~33 pts reduction
    const surveyBenefit = ((surveyCompletionPct - 58) / 42) * 14; // up to ~14 pts reduction
    const litBenefit = (7 - litigationCases) * 4; // up to 28 pts reduction
    const solBenefit = (solatiumTopUpPct / 25) * 8; // up to 8 pts reduction

    const totalReduction = Math.round(compBenefit + surveyBenefit + litBenefit + solBenefit);
    const simulatedScore = Math.max(12, Math.min(96, MOCK_PROJECT_DATA.riskScore - totalReduction));
    
    let category = "HIGH RISK";
    if (simulatedScore < 40) category = "LOW RISK";
    else if (simulatedScore < 70) category = "MEDIUM RISK";

    const simulatedDays = Math.max(15, Math.round(148 - (totalReduction * 1.8)));

    return {
      originalScore: MOCK_PROJECT_DATA.riskScore,
      simulatedScore: simulatedScore,
      scoreDelta: simulatedScore - MOCK_PROJECT_DATA.riskScore, // negative means improvement
      originalDelay: MOCK_PROJECT_DATA.estimatedDelay,
      simulatedDelay: `${simulatedDays} statutory days`,
      daysSaved: 148 - simulatedDays,
      simulatedCategory: category,
      updatedDrivers: MOCK_PROJECT_DATA.drivers.map(d => {
        if (d.name.includes("Valuation Gap")) {
          const adj = Math.max(2, Math.round(d.impact - compBenefit));
          return { ...d, impact: adj, displayImpact: `+${adj} pts` };
        }
        if (d.name.includes("Stay Writ")) {
          const adj = Math.max(4, Math.round(d.impact - litBenefit));
          return { ...d, impact: adj, displayImpact: `+${adj} pts` };
        }
        if (d.name.includes("Survey")) {
          const adj = Math.max(1, Math.round(d.impact - surveyBenefit));
          return { ...d, impact: adj, displayImpact: `+${adj} pts` };
        }
        return d;
      })
    };
  }
}
