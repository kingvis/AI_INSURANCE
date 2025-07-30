// Enhanced Insurance API Client for WishInsured Global Finance Portal
// Multi-country support with financial advice and savings calculations

const API_BASE_URL = 'http://localhost:8001';

// Enhanced interfaces for global finance features
export interface GlobalHealthProfile {
  age: number;
  height: number;
  weight: number;
  gender: string;
  smoking: boolean;
  drinking: string;
  exercise_frequency: string;
  medical_conditions: string[];
  family_history: string[];
  country: string;
}

export interface GlobalPropertyProfile {
  property_type: string;
  value: number;
  year_built: number;
  security_features: string[];
  location_risk: string;
  previous_claims: number;
  country: string;
}

export interface GlobalFinancialProfile {
  annual_income: number;
  current_savings: number;
  dependents: number;
  employment_type: string;
  existing_insurance: string[];
  risk_tolerance: string;
  financial_goals: string[];
  country: string;
  emergency_fund: number;
}

export interface Country {
  name: string;
  currency: string;
  symbol: string;
}

export interface CountryPremium {
  amount: number;
  currency: string;
  symbol: string;
  usd_equivalent: number;
  monthly: number;
  quarterly: number;
}

export interface InsuranceRecommendation {
  type: string;
  priority: string;
  premium: CountryPremium;
  coverage: string;
  features: string[];
  reasoning: string;
}

export interface FinancialAdvice {
  country_context: {
    retirement_age: number;
    tax_rate: number;
    avg_salary: number;
    currency: string;
    symbol: string;
  };
  monthly_analysis: {
    income: number;
    estimated_expenses: number;
    disposable_income: number;
    savings_rate: number;
  };
  emergency_fund: {
    target_amount: number;
    months_to_build: number;
    priority: string;
  };
  insurance_recommendations: {
    monthly_budget: number;
    percentage_of_income: string;
    priority_order: string[];
  };
  investment_strategy: {
    monthly_capacity: number;
    recommended_allocation: Record<string, number>;
    tax_advantages: string[];
    investment_options: string[];
  };
  financial_independence: {
    fire_number: number;
    current_savings: number;
    projected_retirement_fund: number;
    monthly_investment_needed: number;
    years_to_retirement: number;
    fire_timeline_years?: number;
    financial_independence_age?: number;
    monthly_passive_income_at_retirement: number;
    motivational_message: string;
  };
}

export interface SavingsProjection {
  simple_savings: {
    total: number;
    monthly: number;
    currency: string;
    symbol: string;
  };
  investment_growth: {
    total: number;
    gains: number;
    return_rate: string;
    after_tax: number;
  };
  comparison: {
    additional_wealth: number;
    wealth_multiplier: number;
    monthly_passive_income: number;
  };
  milestones: Array<{
    amount: number;
    years: number;
    currency: string;
    symbol: string;
    monthly_income: number;
  }>;
}

export interface MotivationalContent {
  wealth_potential: {
    retirement_fund: number;
    monthly_passive_income: number;
    currency: string;
    symbol: string;
  };
  success_stories: Array<{
    scenario: string;
    description: string;
    lesson: string;
  }>;
  daily_motivation: string[];
  action_steps: string[];
}

export interface CountryPolicies {
  health_insurance: Array<{
    name: string;
    description: string;
  }>;
  life_insurance: Array<{
    name: string;
    description: string;
  }>;
  retirement: Array<{
    name: string;
    description: string;
  }>;
}

export interface ComprehensiveGlobalAssessment {
  health_profile: GlobalHealthProfile;
  property_profile?: GlobalPropertyProfile;
  financial_profile: GlobalFinancialProfile;
}

export interface GlobalAssessmentResult {
  bmi_assessment: {
    value: number;
    category: string;
    risk_level: string;
    health_impact: string;
    cardiovascular_warning: boolean;
    recommendation: string[];
    insurance_impact: string;
  };
  health_risks: {
    overall_risk: string;
    risk_score: number;
    risk_message: string;
    individual_risks: Array<{
      factor: string;
      level: string;
      description: string;
      impact: string;
    }>;
    recommendations: string[];
    cardiovascular_risk: boolean;
  };
  insurance_recommendations: InsuranceRecommendation[];
  financial_advice: FinancialAdvice;
  country_policies: CountryPolicies;
  motivational_content: MotivationalContent;
  assessment_summary: {
    total_monthly_premiums: number;
    currency: string;
    symbol: string;
    country: string;
    assessment_date: string;
  };
}

// API Functions

export async function getSupportedCountries(): Promise<Record<string, Country>> {
  const response = await fetch(`${API_BASE_URL}/countries`);
  if (!response.ok) throw new Error('Failed to fetch countries');
  const data = await response.json();
  return data.countries;
}

export async function getComprehensiveGlobalAssessment(
  assessment: ComprehensiveGlobalAssessment
): Promise<GlobalAssessmentResult> {
  const response = await fetch(`${API_BASE_URL}/assess-global-comprehensive`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(assessment),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to get comprehensive assessment');
  }
  
  return response.json();
}

export async function calculateSavingsProjection(
  monthlyAmount: number,
  years: number,
  country: string,
  riskLevel: string = 'moderate'
): Promise<{
  projections: SavingsProjection;
  request_details: {
    monthly_amount: number;
    years: number;
    country: string;
    risk_level: string;
  };
  calculation_date: string;
}> {
  const response = await fetch(`${API_BASE_URL}/calculate-savings-projection`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      monthly_amount: monthlyAmount,
      years,
      country,
      risk_level: riskLevel,
    }),
  });
  
  if (!response.ok) throw new Error('Failed to calculate savings projection');
  return response.json();
}

export async function getFinancialAdvice(
  country: string,
  annualIncome: number,
  age: number,
  dependents: number = 0,
  currentSavings: number = 0,
  riskTolerance: string = 'moderate'
): Promise<{
  financial_advice: FinancialAdvice;
  user_profile: {
    annual_income: number;
    age: number;
    dependents: number;
    current_savings: number;
    risk_tolerance: string;
  };
  country: string;
}> {
  const params = new URLSearchParams({
    annual_income: annualIncome.toString(),
    age: age.toString(),
    dependents: dependents.toString(),
    current_savings: currentSavings.toString(),
    risk_tolerance: riskTolerance,
  });
  
  const response = await fetch(`${API_BASE_URL}/financial-advice/${country}?${params}`);
  if (!response.ok) throw new Error('Failed to get financial advice');
  return response.json();
}

export async function getCountryPolicies(country: string): Promise<{
  country: string;
  policies: CountryPolicies;
}> {
  const response = await fetch(`${API_BASE_URL}/country-policies/${country}`);
  if (!response.ok) throw new Error('Failed to get country policies');
  return response.json();
}

export async function getMotivationalContent(
  country: string,
  age: number,
  savingsRate: number
): Promise<{
  motivational_content: MotivationalContent;
  user_details: {
    age: number;
    savings_rate: number;
    country: string;
  };
}> {
  const params = new URLSearchParams({
    age: age.toString(),
    savings_rate: savingsRate.toString(),
  });
  
  const response = await fetch(`${API_BASE_URL}/motivational-content/${country}?${params}`);
  if (!response.ok) throw new Error('Failed to get motivational content');
  return response.json();
}

export async function calculateGlobalBMI(
  height: number,
  weight: number,
  country: string
): Promise<{
  bmi: {
    value: number;
    category: string;
    risk_level: string;
    health_impact: string;
    cardiovascular_warning: boolean;
    recommendation: string[];
    insurance_impact: string;
  };
  country_context: {
    country: string;
    currency: string;
    symbol: string;
    healthcare_system: string;
  };
  cardiovascular_warning?: {
    risk_level: string;
    message: string;
    recommendations: string[];
    insurance_impact: string;
  };
}> {
  const params = new URLSearchParams({
    height: height.toString(),
    weight: weight.toString(),
    country,
  });
  
  const response = await fetch(`${API_BASE_URL}/calculate-bmi-global?${params}`, {
    method: 'POST',
  });
  
  if (!response.ok) throw new Error('Failed to calculate global BMI');
  return response.json();
}

export async function getExchangeRates(): Promise<{
  exchange_rates: Record<string, number>;
}> {
  const response = await fetch(`${API_BASE_URL}/exchange-rates`);
  if (!response.ok) throw new Error('Failed to get exchange rates');
  return response.json();
}

export async function getInvestmentReturns(country: string): Promise<{
  country: string;
  currency: string;
  symbol: string;
  expected_returns: {
    conservative: number;
    moderate: number;
    aggressive: number;
  };
  investment_options: string[];
  tax_advantages: string[];
}> {
  const response = await fetch(`${API_BASE_URL}/investment-returns/${country}`);
  if (!response.ok) throw new Error('Failed to get investment returns');
  return response.json();
}

// Legacy API functions for backward compatibility
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
  insuranceType: string,
  age?: number,
  propertyValue?: number,
  annualIncome?: number,
  healthConditions: string[] = []
) {
  const requestData: any = {
    insurance_type: insuranceType,
    health_conditions: healthConditions
  };
  
  if (age !== undefined) requestData.age = age;
  if (propertyValue !== undefined) requestData.property_value = propertyValue;
  if (annualIncome !== undefined) requestData.annual_income = annualIncome;
  
  const response = await fetch(`${API_BASE_URL}/quick-quote`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestData),
  });
  
  if (!response.ok) throw new Error('Failed to get quote');
  return response.json();
}

export async function getRiskFactors() {
  const response = await fetch(`${API_BASE_URL}/risk-factors`);
  if (!response.ok) throw new Error('Failed to fetch risk factors');
  return response.json();
}

// Helper functions for financial calculations and formatting
export function calculateBMILocal(height: number, weight: number): number {
  if (height <= 0 || weight <= 0) return 0;
  const heightInMeters = height / 100;
  return weight / (heightInMeters * heightInMeters);
}

export function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal Weight';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
}

export function formatCurrency(amount: number, symbol: string = '$'): string {
  return `${symbol}${amount.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

export function formatPremium(amount: number, symbol: string = '$'): string {
  return `${symbol}${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatPercentage(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
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
    case 'critical': return 'bg-red-100 text-red-800 border-red-200';
    case 'required': return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'recommended': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'optional': return 'bg-gray-100 text-gray-800 border-gray-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

export function calculateMonthsToReachGoal(
  currentAmount: number,
  goalAmount: number,
  monthlyContribution: number,
  annualReturn: number = 0.07
): number {
  if (goalAmount <= currentAmount) return 0;
  if (monthlyContribution <= 0) return Infinity;
  
  const monthlyReturn = annualReturn / 12;
  
  if (monthlyReturn === 0) {
    return Math.ceil((goalAmount - currentAmount) / monthlyContribution);
  }
  
  const months = Math.log(
    (goalAmount * monthlyReturn + monthlyContribution) /
    (currentAmount * monthlyReturn + monthlyContribution)
  ) / Math.log(1 + monthlyReturn);
  
  return Math.ceil(months);
}

export function calculateCompoundGrowth(
  principal: number,
  monthlyContribution: number,
  annualReturn: number,
  years: number
): number {
  const monthlyReturn = annualReturn / 12;
  const months = years * 12;
  
  // Future value of principal
  const principalGrowth = principal * Math.pow(1 + annualReturn, years);
  
  // Future value of monthly contributions
  const contributionGrowth = monthlyReturn > 0
    ? monthlyContribution * (Math.pow(1 + monthlyReturn, months) - 1) / monthlyReturn
    : monthlyContribution * months;
  
  return principalGrowth + contributionGrowth;
}

export function getCountryFlag(countryCode: string): string {
  const flags: Record<string, string> = {
    'US': '🇺🇸',
    'IN': '🇮🇳',
    'UK': '🇬🇧',
    'CA': '🇨🇦',
    'AU': '🇦🇺',
    'DE': '🇩🇪'
  };
  return flags[countryCode] || '🌍';
}

export function getWealthMilestoneMessage(amount: number, symbol: string): string {
  if (amount >= 1000000) {
    return `🎉 Congratulations! You're on track to become a millionaire with ${symbol}${(amount / 1000000).toFixed(1)}M!`;
  } else if (amount >= 500000) {
    return `🚀 Excellent progress! You're building serious wealth with ${symbol}${(amount / 1000).toFixed(0)}K!`;
  } else if (amount >= 100000) {
    return `💪 Great job! You're well on your way to financial security with ${symbol}${(amount / 1000).toFixed(0)}K!`;
  } else if (amount >= 50000) {
    return `📈 Good start! You're building a solid foundation with ${symbol}${(amount / 1000).toFixed(0)}K!`;
  } else {
    return `🌱 Every dollar counts! You're starting your wealth-building journey!`;
  }
} 