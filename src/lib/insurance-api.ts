// Insurance API Client for WishInsured
const API_BASE_URL = 'http://localhost:8001';

export interface HealthProfile {
  age: number;
  gender: string;
  height: number;
  weight: number;
  smoking: boolean;
  drinking: boolean;
  exercise_frequency: string;
  medical_conditions: string[];
  family_history: string[];
  medications: string[];
}

export interface PropertyProfile {
  property_type: string;
  property_value: number;
  location: string;
  year_built: number;
  security_features: string[];
  previous_claims: boolean;
  mortgage: boolean;
}

export interface FinancialProfile {
  annual_income: number;
  employment_type: string;
  dependents: number;
  existing_insurance: string[];
  monthly_expenses: number;
  savings: number;
  investment_risk_tolerance: string;
}

export interface InsuranceRecommendation {
  insurance_type: string;
  product_name: string;
  annual_premium: number;
  monthly_premium: number;
  coverage_amount: number;
  deductible: number;
  risk_level: string;
  priority: string;
  features: string[];
  exclusions: string[];
  explanation: string;
}

export interface AssessmentSummary {
  total_annual_premium: number;
  total_monthly_premium: number;
  total_coverage: number;
  critical_recommendations: number;
  required_recommendations: number;
  recommendations: InsuranceRecommendation[];
  assessment_date: string;
  user_profile_summary: {
    age: number;
    bmi: number;
    bmi_category: string;
    dependents: number;
    annual_income: number;
    property_value?: number;
    risk_factors: {
      smoking: boolean;
      medical_conditions: number;
      high_bmi: boolean;
    };
  };
}

export interface ComprehensiveAssessmentRequest {
  health_profile: HealthProfile;
  property_profile?: PropertyProfile;
  financial_profile: FinancialProfile;
}

// API Functions
export async function getInsuranceTypes() {
  const response = await fetch(`${API_BASE_URL}/insurance-types`);
  if (!response.ok) throw new Error('Failed to fetch insurance types');
  return response.json();
}

export async function calculateBMI(height: number, weight: number) {
  const response = await fetch(`${API_BASE_URL}/calculate-bmi?height=${height}&weight=${weight}`, {
    method: 'POST',
  });
  if (!response.ok) throw new Error('Failed to calculate BMI');
  return response.json();
}

export async function getQuickQuote(
  insurance_type: string,
  options: {
    age?: number;
    property_value?: number;
    annual_income?: number;
    health_conditions?: string[];
  }
) {
  const response = await fetch(`${API_BASE_URL}/quick-quote`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      insurance_type,
      ...options,
    }),
  });
  
  if (!response.ok) throw new Error('Failed to get quote');
  return response.json();
}

export async function getComprehensiveAssessment(
  request: ComprehensiveAssessmentRequest
): Promise<AssessmentSummary> {
  const response = await fetch(`${API_BASE_URL}/assess-comprehensive`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to get assessment');
  }
  
  return response.json();
}

export async function getRiskFactors() {
  const response = await fetch(`${API_BASE_URL}/risk-factors`);
  if (!response.ok) throw new Error('Failed to fetch risk factors');
  return response.json();
}

// Helper functions
export function calculateBMILocal(height: number, weight: number): number {
  const heightM = height / 100;
  return weight / (heightM ** 2);
}

export function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPremium(amount: number): string {
  return formatCurrency(amount);
}

export function getRiskColor(riskLevel: string): string {
  switch (riskLevel.toLowerCase()) {
    case 'low': return 'text-green-600';
    case 'moderate': return 'text-yellow-600';
    case 'high': return 'text-red-600';
    case 'critical': return 'text-red-800';
    default: return 'text-gray-600';
  }
}

export function getPriorityColor(priority: string): string {
  switch (priority.toLowerCase()) {
    case 'critical': return 'bg-red-100 text-red-800';
    case 'required': return 'bg-orange-100 text-orange-800';
    case 'recommended': return 'bg-blue-100 text-blue-800';
    case 'optional': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
} 