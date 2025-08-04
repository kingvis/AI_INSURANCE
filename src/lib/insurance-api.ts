// Enhanced Insurance API Client for WishInsured Global Finance Portal
// Multi-country support with financial advice and savings calculations

const API_BASE_URL = 'http://localhost:8004';

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
  code: string; // Add country code property
  currency: string;
  symbol: string;
  flag?: string;
  economic_stability?: string;
  inflation_rate?: number;
  interest_rates?: {
    savings: number;
    investment: number;
    conservative: number;
  };
  cultural_context?: {
    financial_priorities: string[];
    investment_preference: string;
    typical_savings_rate: number;
    retirement_age: number;
    social_security: boolean;
  };
  tax_advantages?: string[];
  living_costs?: {
    housing_percentage: number;
    essential_expenses: number;
    discretionary: number;
  };
  motivational_culture?: {
    success_metrics: string[];
    financial_heroes: string[];
    common_goals: string[];
  };
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
  country: string;
  currency_symbol: string;
  recommendations: {
    emergency_fund_target: number;
    monthly_savings_target: number;
    retirement_target: number;
    years_to_retirement: number;
  };
  current_status: {
    savings_rate: number;
    emergency_fund_coverage: number;
  };
  tips: string[];
  cultural_priorities?: string[];
  recommended_tax_advantages?: string[];
  investment_preference?: string;
  economic_context?: {
    inflation_rate: number;
    economic_stability: string;
    typical_savings_rate: number;
  };
  motivational_context?: {
    success_metrics: string[];
    financial_heroes: string[];
    common_goals: string[];
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
  try {
    const response = await fetch(`${API_BASE_URL}/countries`);
    if (!response.ok) {
      // Fallback to enhanced local country data
      return getEnhancedCountryData();
    }
    return response.json();
  } catch (error) {
    console.warn('Using enhanced local country data:', error);
    return getEnhancedCountryData();
  }
}

// Enhanced country data with cultural, economic, and currency details
function getEnhancedCountryData(): Record<string, Country> {
  return {
    "US": {
      name: "United States",
      code: "US",
      currency: "USD",
      symbol: "$",
      flag: "🇺🇸",
      economic_stability: "high",
      inflation_rate: 3.2,
      interest_rates: { savings: 4.5, investment: 7.0, conservative: 4.0 },
      cultural_context: {
        financial_priorities: ["retirement", "homeownership", "emergency_fund"],
        investment_preference: "moderate_aggressive",
        typical_savings_rate: 13.0,
        retirement_age: 67,
        social_security: true
      },
      tax_advantages: ["401k", "IRA", "Roth IRA", "HSA"],
      living_costs: { 
        housing_percentage: 28,
        essential_expenses: 65,
        discretionary: 35 
      },
      motivational_culture: {
        success_metrics: ["net_worth", "passive_income", "early_retirement"],
        financial_heroes: ["Warren Buffett", "Dave Ramsey", "Suze Orman"],
        common_goals: ["FIRE movement", "debt freedom", "building wealth"]
      }
    },
    "IN": {
      name: "India",
      code: "IN",
      currency: "INR",
      symbol: "₹",
      flag: "🇮🇳",
      economic_stability: "moderate_high",
      inflation_rate: 5.8,
      interest_rates: { savings: 6.0, investment: 12.0, conservative: 7.0 },
      cultural_context: {
        financial_priorities: ["family_security", "property", "education", "gold"],
        investment_preference: "conservative_moderate",
        typical_savings_rate: 30.0,
        retirement_age: 60,
        social_security: false
      },
      tax_advantages: ["PPF", "ELSS", "EPF", "NSC", "Tax Saver FD"],
      living_costs: { 
        housing_percentage: 35,
        essential_expenses: 70,
        discretionary: 30 
      },
      motivational_culture: {
        success_metrics: ["property_ownership", "family_wealth", "gold_accumulation"],
        financial_heroes: ["Rakesh Jhunjhunwala", "Radhakishan Damani"],
        common_goals: ["house_purchase", "children_education", "retirement_corpus"]
      }
    },
    "UK": {
      name: "United Kingdom",
      code: "UK",
      currency: "GBP",
      symbol: "£",
      flag: "🇬🇧",
      economic_stability: "high",
      inflation_rate: 4.1,
      interest_rates: { savings: 4.0, investment: 6.5, conservative: 3.5 },
      cultural_context: {
        financial_priorities: ["pension", "property", "ISA_savings"],
        investment_preference: "moderate",
        typical_savings_rate: 8.5,
        retirement_age: 66,
        social_security: true
      },
      tax_advantages: ["ISA", "Pension", "SIPP", "LISA"],
      living_costs: { 
        housing_percentage: 40,
        essential_expenses: 75,
        discretionary: 25 
      },
      motivational_culture: {
        success_metrics: ["pension_pot", "property_ladder", "ISA_maximization"],
        financial_heroes: ["Tim Hale", "Monevator"],
        common_goals: ["mortgage_free", "pension_planning", "financial_independence"]
      }
    },
    "CA": {
      name: "Canada",
      code: "CA",
      currency: "CAD",
      symbol: "C$",
      flag: "🇨🇦",
      economic_stability: "high",
      inflation_rate: 3.5,
      interest_rates: { savings: 4.2, investment: 6.8, conservative: 3.8 },
      cultural_context: {
        financial_priorities: ["RRSP", "TFSA", "real_estate"],
        investment_preference: "moderate",
        typical_savings_rate: 11.0,
        retirement_age: 65,
        social_security: true
      },
      tax_advantages: ["RRSP", "TFSA", "RESP"],
      living_costs: { 
        housing_percentage: 32,
        essential_expenses: 68,
        discretionary: 32 
      },
      motivational_culture: {
        success_metrics: ["RRSP_room", "TFSA_growth", "property_equity"],
        financial_heroes: ["David Chilton", "Preet Banerjee"],
        common_goals: ["retirement_security", "home_ownership", "tax_optimization"]
      }
    },
    "AU": {
      name: "Australia",
      code: "AU",
      currency: "AUD",
      symbol: "A$",
      flag: "🇦🇺",
      economic_stability: "high",
      inflation_rate: 4.3,
      interest_rates: { savings: 4.8, investment: 7.2, conservative: 4.0 },
      cultural_context: {
        financial_priorities: ["superannuation", "property", "shares"],
        investment_preference: "moderate_aggressive",
        typical_savings_rate: 9.5,
        retirement_age: 67,
        social_security: true
      },
      tax_advantages: ["Superannuation", "FHSS", "CGT_discount"],
      living_costs: { 
        housing_percentage: 25,
        essential_expenses: 65,
        discretionary: 35 
      },
      motivational_culture: {
        success_metrics: ["super_balance", "property_portfolio", "share_investments"],
        financial_heroes: ["Scott Pape", "Peter Thornhill"],
        common_goals: ["super_optimization", "property_investment", "early_retirement"]
      }
    },
    "DE": {
      name: "Germany",
      code: "DE",
      currency: "EUR",
      symbol: "€",
      flag: "🇩🇪",
      economic_stability: "high",
      inflation_rate: 3.8,
      interest_rates: { savings: 3.0, investment: 5.5, conservative: 2.5 },
      cultural_context: {
        financial_priorities: ["security", "insurance", "conservative_growth"],
        investment_preference: "conservative",
        typical_savings_rate: 17.0,
        retirement_age: 67,
        social_security: true
      },
      tax_advantages: ["Riester", "Rürup", "ETF_Sparplan"],
      living_costs: { 
        housing_percentage: 30,
        essential_expenses: 70,
        discretionary: 30 
      },
      motivational_culture: {
        success_metrics: ["security_first", "long_term_stability", "insurance_coverage"],
        financial_heroes: ["Gerd Kommer", "Finanzwesir"],
        common_goals: ["financial_security", "insurance_optimization", "steady_growth"]
      }
    }
  };
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
  try {
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
  } catch (error) {
    console.warn('Backend API not available, using mock calculation:', error);
    // Fallback to mock calculation
    const mockResult = calculateMockSavingsProjection(monthlyAmount, years, country, riskLevel);
    return {
      ...mockResult,
      request_details: {
        monthly_amount: monthlyAmount,
        years: years,
        country: country,
        risk_level: riskLevel
      },
      calculation_date: new Date().toISOString()
    };
  }
}

// Mock calculation function for offline mode
function calculateMockSavingsProjection(monthlyAmount: number, years: number, country: string, riskLevel: string) {
  const returnRates = {
    conservative: 0.04,
    moderate: 0.07,
    aggressive: 0.10
  };
  
  const rate = returnRates[riskLevel as keyof typeof returnRates] || 0.07;
  const monthlyRate = rate / 12;
  const months = years * 12;
  
  // Calculate compound interest
  const futureValue = monthlyAmount * (((1 + monthlyRate) ** months - 1) / monthlyRate);
  const totalContributed = monthlyAmount * months;
  const totalInterest = futureValue - totalContributed;
  
  const currency = country === 'US' ? 'USD' : country === 'IN' ? 'INR' : country === 'UK' ? 'GBP' : 'USD';
  const symbol = country === 'US' ? '$' : country === 'IN' ? '₹' : country === 'UK' ? '£' : '$';
  
  return {
    projections: {
      simple_savings: {
        total: Math.round(totalContributed),
        monthly: monthlyAmount,
        currency: currency,
        symbol: symbol
      },
      investment_growth: {
        total: Math.round(futureValue),
        gains: Math.round(totalInterest),
        return_rate: `${(rate * 100).toFixed(1)}%`,
        after_tax: Math.round(futureValue * 0.85) // Assuming 15% tax
      },
      comparison: {
        additional_wealth: Math.round(totalInterest),
        wealth_multiplier: Math.round(futureValue / totalContributed * 100) / 100,
        monthly_passive_income: Math.round(futureValue * 0.04 / 12)
      },
      milestones: [
        { amount: Math.round(monthlyAmount * 60 * 1.4), years: 5, currency: currency, symbol: symbol, monthly_income: Math.round(monthlyAmount * 60 * 1.4 * 0.04 / 12) },
        { amount: Math.round(monthlyAmount * 120 * 1.8), years: 10, currency: currency, symbol: symbol, monthly_income: Math.round(monthlyAmount * 120 * 1.8 * 0.04 / 12) },
        { amount: Math.round(monthlyAmount * 180 * 2.4), years: 15, currency: currency, symbol: symbol, monthly_income: Math.round(monthlyAmount * 180 * 2.4 * 0.04 / 12) }
      ].filter(m => m.years <= years)
    }
  };
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
  // Map country codes to flag image URLs using flagcdn.com
  const flagUrls: Record<string, string> = {
    'US': 'https://flagcdn.com/w20/us.png',
    'IN': 'https://flagcdn.com/w20/in.png',
    'UK': 'https://flagcdn.com/w20/gb.png', // UK uses GB code
    'CA': 'https://flagcdn.com/w20/ca.png',
    'AU': 'https://flagcdn.com/w20/au.png',
    'DE': 'https://flagcdn.com/w20/de.png'
  };
  return flagUrls[countryCode] || 'https://flagcdn.com/w20/un.png'; // Default to UN flag
}

// New function to get country flag as image element
export function getCountryFlagImage(countryCode: string, size: number = 20): string {
  const flagUrl = getCountryFlag(countryCode);
  return `<img src="${flagUrl}" alt="${countryCode} flag" width="${size}" height="${Math.round(size * 0.75)}" style="border-radius: 2px; box-shadow: 0 1px 3px rgba(0,0,0,0.2);" />`;
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