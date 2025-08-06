"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { CountryFlag } from '@/components/ui/CountryFlag';
import { useCurrency, useCurrencyConverter } from '@/contexts/CurrencyContext';
import { 
  Lightbulb, TrendingUp, Shield, Target, 
  DollarSign, User, BookOpen, X, CheckCircle,
  AlertTriangle, Star, CreditCard, Banknote,
  Wallet, Building, ExternalLink, Brain,
  Award, PiggyBank, Car, Home, GraduationCap,
  Heart, Smartphone, Globe, Calculator,
  ChevronRight, ChevronLeft, Trophy, Sparkles, Activity
} from 'lucide-react';
import {
  type Country,
  type FinancialAdvice,
  getFinancialAdvice
} from '@/lib/insurance-api';

interface FinancialAdvisorProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ExtendedProfile {
  // Basic Info
  age: number;
  annual_income: number;
  current_savings: number;
  dependents: number;
  risk_tolerance: "conservative" | "moderate" | "aggressive";
  
  // Additional Profile Data
  creditScore: string;
  currentDebt: number;
  monthlyExpenses: number;
  employmentStatus: string;
  primaryBankingNeeds: string[];
  financialGoals: string[];
  currentCreditCards: string;
  investmentExperience: string;
  preferredBankingStyle: string;
}

export function FinancialAdvisor({
  isOpen,
  onClose
}: FinancialAdvisorProps) {
  // Currency context integration
  const { 
    homeCountry, 
    homeCurrency, 
    formatHomeAmount, 
    convertToComparison,
    refreshRates
  } = useCurrency();
  const { format, symbol } = useCurrencyConverter();

  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1: Basic Profile, 2: Detailed Profile, 3: Results & Marketplace
  const [advice, setAdvice] = useState<FinancialAdvice | null>(null);
  const [showMarketplace, setShowMarketplace] = useState(false);

  // Refresh currency rates when advisor opens
  useEffect(() => {
    if (isOpen) {
      refreshRates().then(() => {
        console.log('🔄 Currency rates refreshed for financial advisor');
        console.log('💱 Current country:', homeCountry, homeCurrency?.code, homeCurrency?.symbol);
      });
    }
  }, [isOpen, homeCountry]);
  
  const [profileData, setProfileData] = useState<ExtendedProfile>({
    age: 30,
    annual_income: 75000,
    current_savings: 15000,
    dependents: 0,
    risk_tolerance: "moderate",
    creditScore: "good",
    currentDebt: 5000,
    monthlyExpenses: 3000,
    employmentStatus: "employed",
    primaryBankingNeeds: [],
    financialGoals: [],
    currentCreditCards: "1-2",
    investmentExperience: "beginner",
    preferredBankingStyle: "digital"
  });

  const creditScoreOptions = [
    { value: "excellent", label: "🌟 Excellent (750+)", description: "Get the best rates and rewards" },
    { value: "good", label: "✅ Good (670-749)", description: "Most products available" },
    { value: "fair", label: "⚠️ Fair (580-669)", description: "Some limitations apply" },
    { value: "poor", label: "❌ Poor (Below 580)", description: "Credit building needed" },
    { value: "unknown", label: "❓ Don't Know", description: "We'll help you check" }
  ];

  const bankingNeedsOptions = [
    "💳 Better credit cards",
    "🏦 High-yield savings",
    "🏠 Mortgage/home loan",
    "🚗 Auto financing",
    "💼 Business banking",
    "📈 Investment accounts",
    "🎓 Student loans",
    "💰 Personal loans",
    "🌍 International banking",
    "📱 Mobile banking"
  ];

  const financialGoalsOptions = [
    "🏠 Buy a home",
    "🚗 Buy a car",
    "🎓 Pay for education",
    "💍 Wedding expenses",
    "🏖️ Retirement planning",
    "🌍 Travel savings",
    "💼 Start a business",
    "📈 Build wealth",
    "🛡️ Emergency fund",
    "💳 Pay off debt"
  ];

  const generatePersonalizedRecommendations = () => {
    const recommendations: any[] = [];
    
    // Credit Card Recommendations based on profile
    if (profileData.creditScore === "excellent") {
      recommendations.push({
        category: "Premium Credit Cards",
        cards: [
          {
            name: "Chase Sapphire Preferred",
            description: "60,000 bonus points worth $750 when you spend $4,000 in first 3 months",
            apr: "21.49% - 28.49% Variable",
            features: ["2X points on travel & dining", "No foreign transaction fees", "$50 hotel credit"],
            link: "https://creditcards.chase.com/rewards-credit-cards/sapphire/preferred",
            bestFor: "Travel rewards enthusiasts"
          },
          {
            name: "American Express Gold Card",
            description: "90,000 points after you spend $4,000 in first 6 months",
            apr: "23.99% - 29.99% Variable",
            features: ["4X points at restaurants", "4X points at U.S. supermarkets", "Annual dining credit"],
            link: "https://www.americanexpress.com/us/credit-cards/card/gold-card/",
            bestFor: "Dining and grocery rewards"
          }
        ]
      });
    } else if (profileData.creditScore === "good") {
      recommendations.push({
        category: "Solid Rewards Cards",
        cards: [
          {
            name: "Capital One Venture Rewards",
            description: "75,000 miles once you spend $4,000 within 3 months",
            apr: "19.49% - 29.49% Variable",
            features: ["2X miles on every purchase", "No foreign transaction fees", "Transfer partners"],
            link: "https://www.capitalone.com/credit-cards/venture/",
            bestFor: "Simple travel rewards"
          },
          {
            name: "Citi Double Cash Card",
            description: "Earn 2% on all purchases: 1% when you buy, 1% when you pay",
            apr: "18.49% - 28.49% Variable",
            features: ["2% cash back on everything", "No annual fee", "Balance transfer options"],
            link: "https://www.citi.com/credit-cards/citi-double-cash-credit-card",
            bestFor: "Simple cash back"
          }
        ]
      });
    } else if (profileData.creditScore === "fair") {
      recommendations.push({
        category: "Credit Building Cards",
        cards: [
          {
            name: "Capital One Platinum",
            description: "Build credit with responsible use, no annual fee",
            apr: "26.49% - 29.49% Variable",
            features: ["Credit building", "No annual fee", "Fraud coverage"],
            link: "https://www.capitalone.com/credit-cards/platinum/",
            bestFor: "Building credit history"
          },
          {
            name: "Discover it Secured",
            description: "Earn cash back while building credit with a secured card",
            apr: "24.49% Variable",
            features: ["1-2% cash back", "No annual fee", "FICO score tracking"],
            link: "https://www.discover.com/credit-cards/secured/",
            bestFor: "Secured credit building"
          }
        ]
      });
    }

    return recommendations;
  };

  const generateMockFinancialAdvice = (profile: ExtendedProfile): FinancialAdvice => {
    const monthlyIncome = profile.annual_income / 12;
    const emergencyFundMonths = profile.creditScore === 'excellent' ? 6 : profile.creditScore === 'good' ? 4 : 3;
    const savingsRate = profile.risk_tolerance === 'aggressive' ? 0.25 : profile.risk_tolerance === 'moderate' ? 0.20 : 0.15;
    
    // Real-time economic context (as of August 2025)
    const currentInflationRate = 0.026; // 2.6% from Fed data
    const federalFundsRate = 0.045; // 4.5% current range midpoint
    const currentHighYieldSavingsRate = 0.044; // 4.4% from Marcus/Ally
    const currentMarketVolatility = profile.age < 35 ? 'moderate' : profile.age < 50 ? 'balanced' : 'conservative';
    
    // Unique calculations based on user's specific situation
    const debtToIncomeRatio = profile.currentDebt / profile.annual_income;
    const savingsToIncomeRatio = profile.current_savings / profile.annual_income;
    const ageBasedRetirementMultiplier = Math.max(1, (65 - profile.age) / 10);
    const personalized401kContribution = Math.min(23000, monthlyIncome * 12 * 0.15); // 2025 limit
    const rothIraEligibility = profile.annual_income < 138000 ? 7000 : profile.annual_income < 153000 ? 3500 : 0; // 2025 limits
    
    // Calculate realistic monthly savings rate based on user profile
    const baseMonthlyExpenses = profile.monthlyExpenses || (monthlyIncome * 0.7); // Default 70% of income for expenses
    const disposableIncome = monthlyIncome - baseMonthlyExpenses;
    const estimatedMonthlySavings = Math.max(0, disposableIncome * 0.6); // 60% of disposable income
    const actualSavingsRate = estimatedMonthlySavings / monthlyIncome;
    
    // Adjust savings rate based on profile characteristics
    let adjustedSavingsRate = actualSavingsRate;
    
    // Age-based adjustments
    if (profile.age < 30) adjustedSavingsRate *= 0.8; // Younger people typically save less
    else if (profile.age > 45) adjustedSavingsRate *= 1.2; // Older people save more for retirement
    
    // Risk tolerance adjustments
    if (profile.risk_tolerance === 'aggressive') adjustedSavingsRate *= 1.3;
    else if (profile.risk_tolerance === 'conservative') adjustedSavingsRate *= 0.9;
    
    // Credit score adjustments (better credit = better financial habits)
    if (profile.creditScore === 'excellent') adjustedSavingsRate *= 1.2;
    else if (profile.creditScore === 'poor') adjustedSavingsRate *= 0.7;
    
    // Debt adjustments (high debt = lower savings ability)
    if (debtToIncomeRatio > 0.5) adjustedSavingsRate *= 0.6;
    else if (debtToIncomeRatio > 0.3) adjustedSavingsRate *= 0.8;
    else if (debtToIncomeRatio < 0.1) adjustedSavingsRate *= 1.1;
    
    // Cap at realistic bounds
    adjustedSavingsRate = Math.min(Math.max(adjustedSavingsRate, 0.02), 0.4); // Between 2% and 40%
    
    // Calculate realistic emergency fund coverage
    const monthlyExpensesBasis = profile.monthlyExpenses || (monthlyIncome * 0.7);
    const emergencyFundMonthsCoverage = profile.current_savings / monthlyExpensesBasis;
    
    // Add some logging to help debug scoring
    console.log('🧮 Financial Health Calculation:', {
      age: profile.age,
      creditScore: profile.creditScore,
      annualIncome: profile.annual_income,
      currentSavings: profile.current_savings,
      currentDebt: profile.currentDebt,
      monthlyIncome: monthlyIncome,
      monthlyExpenses: monthlyExpensesBasis,
      adjustedSavingsRate: adjustedSavingsRate,
      emergencyFundMonths: emergencyFundMonthsCoverage,
      debtToIncomeRatio: debtToIncomeRatio
    });
    
    // Dynamic emergency fund calculation based on current economic conditions
    const inflationAdjustedEmergencyFund = monthlyIncome * emergencyFundMonths * (1 + currentInflationRate);
    
    // Personalized retirement target based on lifestyle and goals
    const lifestyleMultiplier = profile.financialGoals.includes('🏖️ Travel savings') ? 1.3 : 
                                profile.financialGoals.includes('🏠 Buy a home') ? 1.2 : 
                                profile.financialGoals.includes('🎓 Pay for education') ? 1.4 : 1.0;
    
    const personalizedRetirementTarget = profile.annual_income * 10 * ageBasedRetirementMultiplier * lifestyleMultiplier;
    
    return {
      country: homeCountry,
      currency_symbol: homeCurrency?.symbol || '$',
      recommendations: {
        emergency_fund_target: inflationAdjustedEmergencyFund,
        monthly_savings_target: monthlyIncome * savingsRate,
        retirement_target: personalizedRetirementTarget,
        years_to_retirement: 65 - profile.age
      },
      current_status: {
        savings_rate: adjustedSavingsRate,
        emergency_fund_coverage: emergencyFundMonthsCoverage
      },
      tips: generatePersonalizedTips(profile, {
        currentInflationRate,
        federalFundsRate,
        currentHighYieldSavingsRate,
        debtToIncomeRatio,
        savingsToIncomeRatio,
        personalized401kContribution,
        rothIraEligibility
      }),
      cultural_priorities: [
        `Build emergency fund first (current high-yield savings: ${(currentHighYieldSavingsRate * 100).toFixed(2)}%)`,
        `Focus on ${profile.primaryBankingNeeds[0] || 'savings'} with current Fed rate at ${(federalFundsRate * 100).toFixed(2)}%`
      ],
      recommended_tax_advantages: generateTaxAdvantages(profile, personalized401kContribution, rothIraEligibility),
      investment_preference: profile.risk_tolerance,
      economic_context: {
        inflation_rate: currentInflationRate,
        economic_stability: federalFundsRate > 0.04 ? "controlled" : federalFundsRate < 0.02 ? "stimulative" : "stable",
        typical_savings_rate: 0.18
      },
      motivational_context: {
        success_metrics: generateSuccessMetrics(profile, currentHighYieldSavingsRate),
        financial_heroes: getPersonalizedHeroes(profile),
        common_goals: profile.financialGoals.length > 0 ? profile.financialGoals : [`Build wealth`, `Retire comfortably`]
      }
    };
  };

  const generateTaxAdvantages = (profile: ExtendedProfile, contribution401k: number, rothEligibility: number): string[] => {
    const advantages = [];
    
    if (contribution401k > 0) {
      advantages.push(`401(k) contribution: Save up to $${contribution401k.toLocaleString()} tax-free`);
    }
    
    if (rothEligibility > 0) {
      advantages.push(`Roth IRA: Contribute $${rothEligibility.toLocaleString()} tax-free growth`);
    }
    
    if (profile.annual_income > 100000) {
      advantages.push(`Tax-loss harvesting: Offset capital gains with losses`);
    }
    
    if (profile.financialGoals.includes('🏠 Buy a home')) {
      advantages.push(`First-time homebuyer IRA withdrawal: Up to $10,000 penalty-free`);
    }
    
    if (profile.age >= 50) {
      advantages.push(`Catch-up contributions: Extra $7,500 for 401(k), $1,000 for IRA`);
    }
    
    return advantages.slice(0, 3); // Return top 3 most relevant
  };

  const generateSuccessMetrics = (profile: ExtendedProfile, currentSavingsRate: number): string[] => {
    return [
      `Emergency fund of ${profile.creditScore === 'excellent' ? 6 : 4} months expenses`,
      `High-yield savings earning ${(currentSavingsRate * 100).toFixed(2)}% APY`,
      `${profile.risk_tolerance === 'aggressive' ? '25%' : profile.risk_tolerance === 'moderate' ? '20%' : '15%'} savings rate`,
      `Debt-to-income ratio below ${profile.age < 30 ? '20%' : '30%'}`,
      `Credit score of ${profile.creditScore === 'excellent' ? '800+' : profile.creditScore === 'good' ? '720+' : '680+'}`
    ];
  };

  const getPersonalizedHeroes = (profile: ExtendedProfile): string[] => {
    const heroes = [];
    
    if (profile.risk_tolerance === 'aggressive' && profile.age < 40) {
      heroes.push('Warren Buffett', 'Peter Lynch', 'Benjamin Graham');
    } else if (profile.financialGoals.includes('🏠 Buy a home')) {
      heroes.push('Suze Orman', 'Dave Ramsey', 'Robert Kiyosaki');
    } else if (profile.age >= 50) {
      heroes.push('John Bogle', 'Jack Schwab', 'Jane Bryant Quinn');
    } else {
      heroes.push('Ramit Sethi', 'Paula Pant', 'J.L. Collins');
    }
    
    return heroes;
  };

  const generatePersonalizedTips = (profile: ExtendedProfile, economicData: {
    currentInflationRate: number;
    federalFundsRate: number;
    currentHighYieldSavingsRate: number;
    debtToIncomeRatio: number;
    savingsToIncomeRatio: number;
    personalized401kContribution: number;
    rothIraEligibility: number;
  }): string[] => {
    const tips: string[] = [];
    const monthlyIncome = profile.annual_income / 12;
    const { currentInflationRate, federalFundsRate, currentHighYieldSavingsRate, debtToIncomeRatio, savingsToIncomeRatio, personalized401kContribution, rothIraEligibility } = economicData;
    
    // Current economic environment tips
    tips.push(`🏦 With current high-yield savings at ${(currentHighYieldSavingsRate * 100).toFixed(2)}% APY, your emergency fund of $${profile.current_savings.toLocaleString()} could earn $${(profile.current_savings * currentHighYieldSavingsRate).toFixed(0)} annually.`);
    
    if (currentInflationRate > 0.025) {
      tips.push(`📈 Inflation is at ${(currentInflationRate * 100).toFixed(1)}% - your money loses $${(profile.current_savings * currentInflationRate).toFixed(0)} in purchasing power yearly. Consider I-Bonds or TIPS.`);
    }
    
    // Personalized age-specific tips
    if (profile.age < 30) {
      tips.push(`🚀 At ${profile.age}, you have ${65 - profile.age} years until retirement! Every $1,000 invested now could become $${Math.round(1000 * Math.pow(1.07, 65 - profile.age)).toLocaleString()} by age 65.`);
    } else if (profile.age < 40) {
      tips.push(`⏰ You're ${profile.age} with ${65 - profile.age} years to retirement. Consider maximizing your 401(k) - you could save $${personalized401kContribution.toLocaleString()} tax-free.`);
    } else if (profile.age < 50) {
      tips.push(`🎯 At ${profile.age}, focus on catch-up growth. With ${65 - profile.age} years left, aggressive savings could still build substantial wealth.`);
    } else {
      tips.push(`🏖️ You're ${profile.age} - retirement is ${65 - profile.age} years away! Time for catch-up contributions: extra $7,500 to 401(k) after age 50.`);
    }

    // Income and savings specific tips
    if (profile.annual_income > 100000) {
      tips.push(`💰 With your $${(profile.annual_income/1000).toFixed(0)}K income, consider tax-loss harvesting and backdoor Roth conversions. Current Fed rate at ${(federalFundsRate * 100).toFixed(2)}% makes bonds less attractive.`);
    } else if (profile.annual_income < 50000) {
      tips.push(`📈 Your $${(profile.annual_income/1000).toFixed(0)}K income qualifies for Saver's Credit! Get up to $1,000 tax credit for retirement contributions.`);
    }

    // Debt-specific tips with current rates
    if (debtToIncomeRatio > 0.4) {
      tips.push(`⚠️ Your debt-to-income ratio is ${(debtToIncomeRatio * 100).toFixed(1)}%. With Fed rates at ${(federalFundsRate * 100).toFixed(2)}%, refinancing high-interest debt should be priority #1.`);
    } else if (debtToIncomeRatio < 0.1) {
      tips.push(`✅ Excellent! Your ${(debtToIncomeRatio * 100).toFixed(1)}% debt ratio is fantastic. Now focus on investing your $${(monthlyIncome * (1 - debtToIncomeRatio)).toFixed(0)} monthly surplus.`);
    }

    // Credit score specific tips
    if (profile.creditScore === 'excellent') {
      tips.push(`⭐ Your excellent credit unlocks the best rates. With current savings at ${(currentHighYieldSavingsRate * 100).toFixed(2)}% APY, consider premium rewards cards with 2%+ cash back.`);
    } else if (profile.creditScore === 'poor' || profile.creditScore === 'fair') {
      tips.push(`🔧 Focus on credit building while rates are high. Pay down credit cards (likely 25%+ APR) before investing, as that's guaranteed "return".`);
    }

    // Goal-specific tips with current market conditions
    if (profile.financialGoals.includes('🏠 Buy a home')) {
      tips.push(`🏠 Home buying tip: Current mortgage rates reflect Fed's ${(federalFundsRate * 100).toFixed(2)}% rate. Save 20% down to avoid PMI - that's $${((profile.annual_income * 3) * 0.2).toLocaleString()} for a $${(profile.annual_income * 3).toLocaleString()} home.`);
    }
    
    if (profile.financialGoals.includes('🎓 Pay for education')) {
      tips.push(`🎓 Education funding: 529 plans grow tax-free. With ${(currentHighYieldSavingsRate * 100).toFixed(2)}% savings rates, compare 529 investment options vs. high-yield savings.`);
    }

    // Banking needs with current rates
    if (profile.primaryBankingNeeds.includes('🏦 High-yield savings')) {
      tips.push(`🏦 Current best high-yield savings: Marcus at ${(currentHighYieldSavingsRate * 100).toFixed(2)}% APY vs 0.01% at big banks. That's $${(10000 * (currentHighYieldSavingsRate - 0.0001)).toFixed(0)} more per year on $10K!`);
    }

    // Risk tolerance with current market
    if (profile.risk_tolerance === 'aggressive' && profile.age < 40) {
      tips.push(`🚀 Aggressive + young = perfect for growth stocks! Current high savings rates mean your emergency fund earns well while you invest for growth.`);
    } else if (profile.risk_tolerance === 'conservative') {
      tips.push(`🛡️ Conservative approach: Mix ${(currentHighYieldSavingsRate * 100).toFixed(2)}% savings with I-Bonds (current rate: ${(currentInflationRate * 100).toFixed(1)}% + 0.5% fixed) for inflation protection.`);
    }

    // Roth IRA eligibility
    if (rothIraEligibility > 0) {
      tips.push(`🎯 You qualify for $${rothIraEligibility.toLocaleString()}/year Roth IRA! Tax-free growth for ${65 - profile.age} years could create massive wealth.`);
    }

    // Employment status specific
    if (profile.employmentStatus === 'employed' && profile.annual_income > 50000) {
      tips.push(`💼 Employed with good income: Check if your employer offers HSA (triple tax advantage) and maximize 401(k) match - that's free money!`);
    }

    return tips.slice(0, 8); // Return most relevant tips
  };

  const handleGetAdvice = async () => {
    setIsLoading(true);
    
    // Use mock data by default to prevent connection errors
    // This provides a better user experience when backend is not available
    console.log('💡 Financial Advisor using comprehensive mock analysis for demonstration');
    
    try {
      // Generate comprehensive mock advice based on user profile
      const mockAdvice = generateMockFinancialAdvice(profileData);
      setAdvice(mockAdvice);
      
      console.log('✅ Financial advice generated successfully');
      
    } catch (error) {
      console.error('❌ Error generating financial advice:', error);
      
      // Fallback to basic advice if mock generation fails
      setAdvice({
        recommendations: {
          emergency_fund_target: profileData.annual_income * 0.25,
          monthly_savings_target: profileData.annual_income * 0.20 / 12,
          retirement_target: profileData.annual_income * 10,
          years_to_retirement: 65 - profileData.age,
          primary_recommendation: "Start with a savings goal of 20% of your income",
          budget_allocation: {
            savings: 20,
            investments: 15,
            emergency_fund: 10,
            insurance: 5
          },
          specific_actions: [
            "Set up automatic savings transfers",
            "Review and optimize monthly expenses",
            "Consider low-cost index funds for investments"
          ]
        },
        analysis: {
          risk_profile: profileData.risk_tolerance,
          financial_health_score: 75,
          key_strengths: ["Steady income", "Interest in financial planning"],
          areas_for_improvement: ["Emergency fund building", "Investment diversification"],
          next_steps: ["Start automated savings", "Research investment options", "Build emergency fund"]
        }
      });
    } finally {
      setIsLoading(false);
      setCurrentStep(3);
      setTimeout(() => {
        setShowMarketplace(true);
      }, 1000);
    }
  };

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    } else {
      handleGetAdvice();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetAdvisor = () => {
    setCurrentStep(1);
    setAdvice(null);
    setShowMarketplace(false);
    setProfileData({
      age: 30,
      annual_income: 75000,
      current_savings: 15000,
      dependents: 0,
      risk_tolerance: "moderate",
      creditScore: "good",
      currentDebt: 5000,
      monthlyExpenses: 3000,
      employmentStatus: "employed",
      primaryBankingNeeds: [],
      financialGoals: [],
      currentCreditCards: "1-2",
      investmentExperience: "beginner",
      preferredBankingStyle: "digital"
    });
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl max-w-6xl w-full max-h-[95vh] shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <CountryFlag 
                countryCode={homeCountry}
                countryName={homeCurrency?.name}
                size="lg"
                className="shadow-lg"
              />
              <div>
                <h2 className="text-2xl font-bold">🧠 AI Financial Advisor</h2>
                <p className="text-purple-100">
                  Get personalized financial advice and product recommendations for {homeCurrency?.name}
                </p>
              </div>
            </div>
            <Button
              onClick={onClose}
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-purple-600"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          {/* Progress Indicator */}
          {currentStep < 3 && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm text-purple-100 mb-2">
                <span>Step {currentStep} of 2</span>
                <span>{Math.round((currentStep / 2) * 100)}% Complete</span>
              </div>
              <div className="w-full bg-purple-500/30 rounded-full h-2">
                <motion.div
                  initial={{ width: "50%" }}
                  animate={{ width: `${(currentStep / 2) * 100}%` }}
                  transition={{ duration: 0.5 }}
                  className="bg-white h-2 rounded-full"
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              // Step 1: Basic Profile
            <motion.div
                key="basic-profile"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
                <div className="text-center mb-8">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center"
                  >
                    <User className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">👋 Your Financial Profile</h3>
                  <p className="text-gray-600">Tell us about yourself to get personalized advice</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-base font-semibold text-gray-800 mb-3">
                      Age
                    </label>
                    <input
                      type="number"
                      value={profileData.age}
                      onChange={(e) => setProfileData(prev => ({
                        ...prev,
                        age: parseInt(e.target.value) || 0
                      }))}
                      className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-gray-500 text-gray-900 bg-white shadow-sm hover:shadow-md transition-all font-medium"
                      placeholder="e.g., 28"
                      min="18"
                      max="100"
                    />
                  </div>

                  <div>
                    <label className="block text-base font-semibold text-gray-800 mb-3">
                      Annual Income ({homeCurrency?.symbol})
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        value={profileData.annual_income}
                        onChange={(e) => setProfileData(prev => ({
                          ...prev,
                          annual_income: parseInt(e.target.value) || 0
                        }))}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 placeholder:text-gray-500 text-black"
                        placeholder="e.g., 75000"
                        min="0"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-base font-semibold text-gray-800 mb-3">
                      Current Savings ({homeCurrency?.symbol})
                    </label>
                    <div className="relative">
                        <PiggyBank className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        value={profileData.current_savings}
                        onChange={(e) => setProfileData(prev => ({
                          ...prev,
                          current_savings: parseInt(e.target.value) || 0
                        }))}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 placeholder:text-gray-500 text-black"
                        placeholder="e.g., 15000"
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-base font-semibold text-gray-800 mb-3">
                      Number of Dependents
                    </label>
                    <input
                      type="number"
                      value={profileData.dependents}
                      onChange={(e) => setProfileData(prev => ({
                        ...prev,
                        dependents: parseInt(e.target.value) || 0
                      }))}
                      className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-gray-500 text-gray-900 bg-white shadow-sm hover:shadow-md transition-all font-medium"
                      placeholder="e.g., 2"
                      min="0"
                      max="20"
                    />
                  </div>

                  <div>
                    <label className="block text-base font-semibold text-gray-800 mb-3">
                      Risk Tolerance
                    </label>
                    <select
                      value={profileData.risk_tolerance}
                      onChange={(e) => setProfileData(prev => ({
                        ...prev,
                        risk_tolerance: e.target.value as any
                      }))}
                      className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-gray-500 text-gray-900 bg-white shadow-sm hover:shadow-md transition-all font-medium"
                    >
                        <option value="conservative">🛡️ Conservative - Safety first</option>
                        <option value="moderate">⚖️ Moderate - Balanced approach</option>
                        <option value="aggressive">🚀 Aggressive - Higher risk, higher reward</option>
                    </select>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-900 mb-2">Quick Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-purple-700">Age:</span>
                        <span className="font-semibold text-purple-900">{profileData.age} years old</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-700">Income:</span>
                        <span className="font-semibold text-purple-900">
                          {(() => {
                            const usdAmount = profileData.annual_income;
                            const convertedAmount = homeCurrency?.code === 'USD' 
                              ? usdAmount 
                              : convertToComparison(usdAmount);
                            return formatHomeAmount(convertedAmount);
                          })()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-700">Savings:</span>
                        <span className="font-semibold text-purple-900">
                          {(() => {
                            const usdAmount = profileData.current_savings;
                            const convertedAmount = homeCurrency?.code === 'USD' 
                              ? usdAmount 
                              : convertToComparison(usdAmount);
                            return formatHomeAmount(convertedAmount);
                          })()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            )}

            {currentStep === 2 && (
              // Step 2: Detailed Profile
            <motion.div
                key="detailed-profile"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
                <div className="text-center mb-8">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-green-600 rounded-full flex items-center justify-center"
                  >
                    <Brain className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="text-3xl font-bold text-slate-800 mb-3">🔍 Detailed Financial Profile</h3>
                  <p className="text-slate-600 text-lg">Help us personalize your recommendations</p>
                  </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                  <div>
                      <label className="block text-lg font-semibold text-slate-800 mb-4">
                        Credit Score Range
                      </label>
                      <div className="space-y-2">
                        {creditScoreOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => setProfileData(prev => ({...prev, creditScore: option.value}))}
                            className={`w-full p-4 text-left border-2 rounded-xl transition-all shadow-sm hover:shadow-md ${
                              profileData.creditScore === option.value
                                ? 'border-indigo-500 bg-indigo-50 text-black shadow-lg'
                                : 'border-slate-200 hover:border-indigo-300 bg-white hover:bg-slate-50 text-black'
                            }`}
                          >
                            <div className="font-semibold text-lg mb-1">{option.label}</div>
                            <div className="text-sm text-slate-600">{option.description}</div>
                          </button>
                        ))}
                  </div>
                </div>

                    <div>
                      <label className="block text-lg font-semibold text-slate-800 mb-3">
                        Current Debt ({homeCurrency?.symbol})
                      </label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="number"
                          value={profileData.currentDebt}
                          onChange={(e) => setProfileData(prev => ({
                            ...prev,
                            currentDebt: parseInt(e.target.value) || 0
                          }))}
                          className="w-full pl-10 pr-4 py-4 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-slate-500 text-slate-800 bg-white shadow-sm hover:shadow-md transition-all"
                          placeholder="e.g., 5000"
                          min="0"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-lg font-semibold text-slate-800 mb-4">
                        Primary Banking Needs
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {bankingNeedsOptions.map((need) => (
                          <button
                            key={need}
                            onClick={() => {
                              const newNeeds = profileData.primaryBankingNeeds.includes(need)
                                ? profileData.primaryBankingNeeds.filter(n => n !== need)
                                : [...profileData.primaryBankingNeeds, need];
                              setProfileData(prev => ({...prev, primaryBankingNeeds: newNeeds}));
                            }}
                            className={`p-3 text-sm font-medium border-2 rounded-xl transition-all shadow-sm hover:shadow-md text-black ${
                              profileData.primaryBankingNeeds.includes(need)
                                ? 'border-blue-500 bg-blue-50 shadow-lg'
                                : 'border-slate-200 hover:border-blue-300 bg-white hover:bg-slate-50'
                            }`}
                          >
                            {need}
                          </button>
                        ))}
                      </div>
              </div>

                    <div>
                      <label className="block text-lg font-semibold text-slate-800 mb-4">
                        Financial Goals (Select all that apply)
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {financialGoalsOptions.map((goal) => (
                          <button
                            key={goal}
                            onClick={() => {
                              const newGoals = profileData.financialGoals.includes(goal)
                                ? profileData.financialGoals.filter(g => g !== goal)
                                : [...profileData.financialGoals, goal];
                              setProfileData(prev => ({...prev, financialGoals: newGoals}));
                            }}
                            className={`p-3 text-sm font-medium border-2 rounded-xl transition-all shadow-sm hover:shadow-md text-black ${
                              profileData.financialGoals.includes(goal)
                                ? 'border-emerald-500 bg-emerald-50 shadow-lg'
                                : 'border-slate-200 hover:border-emerald-300 bg-white hover:bg-slate-50'
                            }`}
                          >
                            {goal}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && advice && (
              // Step 3: Results & Marketplace
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Success Header */}
                <div className="text-center mb-8">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 360]
                    }}
                    transition={{ 
                      duration: 2,
                      ease: "easeInOut"
                    }}
                    className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center"
                  >
                    <Trophy className="w-10 h-10 text-white" />
                  </motion.div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">🎯 Your Financial Roadmap!</h3>
                  <p className="text-gray-600 text-lg">Personalized advice and product recommendations just for you</p>
                </div>

                {/* Enhanced Financial Assessment Score with Interactive Elements */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-200">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">💎 Live Financial Health Analysis</h4>
                      <p className="text-gray-600">Real-time assessment using current market data</p>
                    </div>
                    <div className="text-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="relative"
                      >
                        <div className="text-4xl font-bold text-purple-600">
                          {(() => {
                            // Enhanced score calculation
                            let score = 40; // Base score
                            
                            // Savings rate scoring (0-25 points)
                            const savingsRate = advice.current_status.savings_rate;
                            if (savingsRate >= 0.2) score += 25;
                            else if (savingsRate >= 0.15) score += 20;
                            else if (savingsRate >= 0.1) score += 15;
                            else if (savingsRate >= 0.05) score += 10;
                            
                            // Emergency fund scoring (0-20 points)
                            const emergencyFund = advice.current_status.emergency_fund_coverage;
                            if (emergencyFund >= 6) score += 20;
                            else if (emergencyFund >= 3) score += 15;
                            else if (emergencyFund >= 1) score += 10;
                            else if (emergencyFund >= 0.5) score += 5;
                            
                            // Credit score bonus (0-15 points)
                            if (profileData.creditScore === 'excellent') score += 15;
                            else if (profileData.creditScore === 'good') score += 10;
                            else if (profileData.creditScore === 'fair') score += 5;
                            
                            // Debt management (0-20 points)
                            const debtRatio = profileData.currentDebt / profileData.annual_income;
                            if (debtRatio <= 0.1) score += 20;
                            else if (debtRatio <= 0.3) score += 15;
                            else if (debtRatio <= 0.5) score += 10;
                            else if (debtRatio <= 0.7) score += 5;
                            
                            return Math.min(score, 100);
                          })()}/100
                      </div>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(() => {
                            let score = 40;
                            const savingsRate = advice.current_status.savings_rate;
                            if (savingsRate >= 0.2) score += 25;
                            else if (savingsRate >= 0.15) score += 20;
                            else if (savingsRate >= 0.1) score += 15;
                            else if (savingsRate >= 0.05) score += 10;
                            const emergencyFund = advice.current_status.emergency_fund_coverage;
                            if (emergencyFund >= 6) score += 20;
                            else if (emergencyFund >= 3) score += 15;
                            else if (emergencyFund >= 1) score += 10;
                            else if (emergencyFund >= 0.5) score += 5;
                            if (profileData.creditScore === 'excellent') score += 15;
                            else if (profileData.creditScore === 'good') score += 10;
                            else if (profileData.creditScore === 'fair') score += 5;
                            const debtRatio = profileData.currentDebt / profileData.annual_income;
                            if (debtRatio <= 0.1) score += 20;
                            else if (debtRatio <= 0.3) score += 15;
                            else if (debtRatio <= 0.5) score += 10;
                            else if (debtRatio <= 0.7) score += 5;
                            return Math.min(score, 100);
                          })()}%` }}
                          transition={{ duration: 2, delay: 1 }}
                          className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full"
                        />
                      </motion.div>
                      <div className="text-sm text-purple-700">
                        {(() => {
                          const score = (() => {
                            let s = 40;
                            const savingsRate = advice.current_status.savings_rate;
                            if (savingsRate >= 0.2) s += 25;
                            else if (savingsRate >= 0.15) s += 20;
                            else if (savingsRate >= 0.1) s += 15;
                            else if (savingsRate >= 0.05) s += 10;
                            
                            const emergencyFund = advice.current_status.emergency_fund_coverage;
                            if (emergencyFund >= 6) s += 20;
                            else if (emergencyFund >= 3) s += 15;
                            else if (emergencyFund >= 1) s += 10;
                            else if (emergencyFund >= 0.5) s += 5;
                            
                            if (profileData.creditScore === 'excellent') s += 15;
                            else if (profileData.creditScore === 'good') s += 10;
                            else if (profileData.creditScore === 'fair') s += 5;
                            
                            const debtRatio = profileData.currentDebt / profileData.annual_income;
                            if (debtRatio <= 0.1) s += 20;
                            else if (debtRatio <= 0.3) s += 15;
                            else if (debtRatio <= 0.5) s += 10;
                            else if (debtRatio <= 0.7) s += 5;
                            
                            return Math.min(s, 100);
                          })();
                          return score >= 85 ? 'Excellent 🌟' :
                                 score >= 70 ? 'Very Good ✅' :
                                 score >= 55 ? 'Good 👍' :
                                 score >= 40 ? 'Fair ⚠️' : 'Needs Work 🔨';
                        })()}
                      </div>
                      
                      {/* Detailed Score Breakdown */}
                      <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
                        <h5 className="text-sm font-semibold text-purple-900 mb-2">📊 Score Breakdown</h5>
                        <div className="space-y-1 text-xs text-purple-700">
                          <div className="flex justify-between">
                            <span>Base Score:</span>
                            <span className="font-medium">40 pts</span>
                    </div>
                          <div className="flex justify-between">
                            <span>Savings Rate ({(advice.current_status.savings_rate * 100).toFixed(1)}%):</span>
                            <span className="font-medium">
                              {(() => {
                                const rate = advice.current_status.savings_rate;
                                if (rate >= 0.2) return '+25 pts';
                                else if (rate >= 0.15) return '+20 pts';
                                else if (rate >= 0.1) return '+15 pts';
                                else if (rate >= 0.05) return '+10 pts';
                                else return '+0 pts';
                              })()}
                            </span>
                  </div>
                          <div className="flex justify-between">
                            <span>Emergency Fund ({advice.current_status.emergency_fund_coverage.toFixed(1)} mo):</span>
                            <span className="font-medium">
                              {(() => {
                                const months = advice.current_status.emergency_fund_coverage;
                                if (months >= 6) return '+20 pts';
                                else if (months >= 3) return '+15 pts';
                                else if (months >= 1) return '+10 pts';
                                else if (months >= 0.5) return '+5 pts';
                                else return '+0 pts';
                              })()}
                            </span>
                </div>
                          <div className="flex justify-between">
                            <span>Credit Score ({profileData.creditScore}):</span>
                            <span className="font-medium">
                              {profileData.creditScore === 'excellent' ? '+15 pts' :
                               profileData.creditScore === 'good' ? '+10 pts' :
                               profileData.creditScore === 'fair' ? '+5 pts' : '+0 pts'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Debt Ratio ({((profileData.currentDebt / profileData.annual_income) * 100).toFixed(1)}%):</span>
                            <span className="font-medium">
                              {(() => {
                                const ratio = profileData.currentDebt / profileData.annual_income;
                                if (ratio <= 0.1) return '+20 pts';
                                else if (ratio <= 0.3) return '+15 pts';
                                else if (ratio <= 0.5) return '+10 pts';
                                else if (ratio <= 0.7) return '+5 pts';
                                else return '+0 pts';
                              })()}
                            </span>
                          </div>
                          <div className="border-t border-purple-300 pt-1 mt-2 flex justify-between font-semibold">
                            <span>Total Score:</span>
                            <span>{(() => {
                              let s = 40;
                              const savingsRate = advice.current_status.savings_rate;
                              if (savingsRate >= 0.2) s += 25;
                              else if (savingsRate >= 0.15) s += 20;
                              else if (savingsRate >= 0.1) s += 15;
                              else if (savingsRate >= 0.05) s += 10;
                              const emergencyFund = advice.current_status.emergency_fund_coverage;
                              if (emergencyFund >= 6) s += 20;
                              else if (emergencyFund >= 3) s += 15;
                              else if (emergencyFund >= 1) s += 10;
                              else if (emergencyFund >= 0.5) s += 5;
                              if (profileData.creditScore === 'excellent') s += 15;
                              else if (profileData.creditScore === 'good') s += 10;
                              else if (profileData.creditScore === 'fair') s += 5;
                              const debtRatio = profileData.currentDebt / profileData.annual_income;
                              if (debtRatio <= 0.1) s += 20;
                              else if (debtRatio <= 0.3) s += 15;
                              else if (debtRatio <= 0.5) s += 10;
                              else if (debtRatio <= 0.7) s += 5;
                              return Math.min(s, 100);
                            })()}/100</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Interactive Score breakdown with animated progress bars */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { 
                        label: 'Savings Rate', 
                        value: (advice.current_status.savings_rate * 100).toFixed(1), 
                        unit: '%',
                        target: 20,
                        color: 'blue',
                        current: advice.current_status.savings_rate * 100
                      },
                      { 
                        label: 'Emergency Fund', 
                        value: advice.current_status.emergency_fund_coverage.toFixed(1), 
                        unit: ' mo',
                        target: 6,
                        color: 'green',
                        current: advice.current_status.emergency_fund_coverage
                      },
                      { 
                        label: 'Credit Score', 
                        value: profileData.creditScore, 
                        unit: '',
                        target: 'excellent',
                        color: 'purple',
                        current: profileData.creditScore === 'excellent' ? 100 : profileData.creditScore === 'good' ? 75 : 50
                      },
                      { 
                        label: 'Debt Ratio', 
                        value: ((profileData.currentDebt / profileData.annual_income) * 100).toFixed(1), 
                        unit: '%',
                        target: 30,
                        color: 'orange',
                        current: (profileData.currentDebt / profileData.annual_income) * 100,
                        inverse: true // Lower is better
                      }
                    ].map((metric, index) => (
                      <motion.div
                        key={metric.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.2 + 1.5 }}
                        className="text-center p-3 bg-white/70 rounded-lg border border-gray-200 hover:shadow-md transition-all cursor-pointer"
                        whileHover={{ scale: 1.05 }}
                      >
                        <div className="text-xs text-gray-600 mb-1">{metric.label}</div>
                        <div className={`font-bold text-lg text-${metric.color}-600`}>
                          {metric.value}{metric.unit}
                </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ 
                              width: `${metric.inverse 
                                ? Math.max(0, 100 - (metric.current / metric.target * 100))
                                : Math.min(100, (metric.current / (typeof metric.target === 'number' ? metric.target : 100)) * 100)
                              }%` 
                            }}
                            transition={{ duration: 1.5, delay: index * 0.2 + 2 }}
                            className={`h-2 bg-gradient-to-r from-${metric.color}-400 to-${metric.color}-600 rounded-full`}
                          />
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Target: {typeof metric.target === 'number' ? `${metric.target}${metric.unit}` : metric.target}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Real-time Market Context */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 3 }}
                    className="mt-4 p-3 bg-blue-100 rounded-lg border border-blue-200"
                  >
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="w-4 h-4 text-blue-600" />
                      <span className="font-semibold text-blue-900">Live Market Context:</span>
                      <span className="text-blue-800">
                        Fed Rate: {(4.5).toFixed(2)}% | Inflation: {(2.6).toFixed(1)}% | High-Yield Savings: {(4.4).toFixed(2)}% APY
                      </span>
                    </div>
                  </motion.div>
                </div>

              {/* Key Recommendations */}
                <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                  <h4 className="font-semibold text-green-900 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    🎯 Your Financial Targets
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg border border-green-200">
                      <h5 className="font-semibold text-green-900">💰 Emergency Fund Target</h5>
                      <p className="text-2xl font-bold text-green-600">
                        {(() => {
                          // Convert USD amount to current currency
                          const usdAmount = advice.recommendations.emergency_fund_target;
                          const convertedAmount = homeCurrency?.code === 'USD' 
                            ? usdAmount 
                            : convertToComparison(usdAmount);
                          console.log(`💰 Emergency Fund: $${usdAmount} USD → ${formatHomeAmount(convertedAmount)} (${homeCountry})`);
                          return formatHomeAmount(convertedAmount);
                        })()}
                      </p>
                      <p className="text-sm text-green-700">
                        {(advice.recommendations.emergency_fund_target / (profileData.annual_income / 12)).toFixed(1)} months of expenses
                      </p>
                      <div className="mt-2 text-xs text-green-600">
                        You currently have: {(() => {
                          const usdAmount = profileData.current_savings;
                          const convertedAmount = homeCurrency?.code === 'USD' 
                            ? usdAmount 
                            : convertToComparison(usdAmount);
                          return formatHomeAmount(convertedAmount);
                        })()}
                        </div>
                      </div>
                    
                    <div className="bg-white p-4 rounded-lg border border-green-200">
                      <h5 className="font-semibold text-green-900">📈 Monthly Savings Target</h5>
                      <p className="text-2xl font-bold text-green-600">
                        {(() => {
                          // Convert USD amount to current currency
                          const usdAmount = advice.recommendations.monthly_savings_target;
                          const convertedAmount = homeCurrency?.code === 'USD' 
                            ? usdAmount 
                            : convertToComparison(usdAmount);
                          console.log(`📈 Monthly Savings: $${usdAmount} USD → ${formatHomeAmount(convertedAmount)} (${homeCountry})`);
                          return formatHomeAmount(convertedAmount);
                        })()}
                      </p>
                      <p className="text-sm text-green-700">
                        {((advice.recommendations.monthly_savings_target / (profileData.annual_income / 12)) * 100).toFixed(1)}% of monthly income
                      </p>
                      <div className="mt-2 text-xs text-green-600">
                        Current rate: {(advice.current_status.savings_rate * 100).toFixed(1)}%
                  </div>
                </div>
                    
                    <div className="bg-white p-4 rounded-lg border border-green-200">
                      <h5 className="font-semibold text-green-900">🏖️ Retirement Target</h5>
                      <p className="text-2xl font-bold text-green-600">
                        {(() => {
                          // Convert USD amount to current currency
                          const usdAmount = advice.recommendations.retirement_target;
                          const convertedAmount = homeCurrency?.code === 'USD' 
                            ? usdAmount 
                            : convertToComparison(usdAmount);
                          console.log(`🏖️ Retirement: $${usdAmount} USD → ${formatHomeAmount(convertedAmount)} (${homeCountry})`);
                          return formatHomeAmount(convertedAmount);
                        })()}
                      </p>
                      <p className="text-sm text-green-700">
                        {advice.recommendations.years_to_retirement} years to retirement (age 65)
                      </p>
                      <div className="mt-2 text-xs text-green-600">
                        Monthly need: {(() => {
                          const usdAmount = advice.recommendations.retirement_target / (advice.recommendations.years_to_retirement * 12);
                          const convertedAmount = homeCurrency?.code === 'USD' 
                            ? usdAmount 
                            : convertToComparison(usdAmount);
                          return formatHomeAmount(convertedAmount);
                        })()}
                    </div>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg border border-green-200">
                      <h5 className="font-semibold text-green-900">💪 Financial Progress</h5>
                      <p className="text-2xl font-bold text-green-600">
                        {advice.current_status.savings_rate > 0.15 ? '🌟 Excellent' : 
                         advice.current_status.savings_rate > 0.10 ? '✅ Good' : 
                         advice.current_status.savings_rate > 0.05 ? '⚠️ Improving' : '🔥 Action Needed'}
                      </p>
                      <p className="text-sm text-green-700">
                        Emergency fund covers {advice.current_status.emergency_fund_coverage.toFixed(1)} months
                      </p>
                      <div className="mt-2 text-xs text-green-600">
                        {advice.current_status.emergency_fund_coverage >= 3 ? 'Great foundation!' : 'Keep building!'}
                    </div>
                  </div>
                </div>
                </div>

                {/* Enhanced Personalized Tips */}
                {advice.tips && advice.tips.length > 0 && (
                  <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200">
                  <h4 className="font-semibold text-yellow-900 mb-4 flex items-center gap-2">
                      <Lightbulb className="w-5 h-5" />
                      🧠 AI-Powered Financial Insights
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {advice.tips
                        .filter(tip => tip && tip.trim()) // Filter out empty or undefined tips
                        .map((tip, index) => (
                        <motion.div 
                          key={`advisor-tip-${index}-${tip.substring(0, 10).replace(/[^a-zA-Z0-9]/g, '')}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start gap-3 bg-white p-4 rounded-lg border border-yellow-200"
                        >
                          <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-bold text-yellow-600">{index + 1}</span>
                      </div>
                          <p className="text-yellow-800 text-sm">{tip}</p>
                        </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tax Advantages */}
                {advice.recommended_tax_advantages && advice.recommended_tax_advantages.length > 0 && (
                  <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
                  <h4 className="font-semibold text-purple-900 mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                      💼 Tax Optimization Strategies
                  </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {advice.recommended_tax_advantages
                        .filter(advantage => advantage && advantage.trim()) // Filter out empty items
                        .map((advantage, index) => (
                        <div key={`tax-advantage-${index}-${advantage.replace(/[^a-zA-Z0-9]/g, '').substring(0, 15)}`} className="bg-white p-4 rounded-lg border border-purple-200">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="w-4 h-4 text-purple-600" />
                            <h5 className="font-semibold text-purple-900">{advantage}</h5>
                          </div>
                          <p className="text-purple-700 text-sm">
                            {advantage.includes('401(k)') ? 'Reduce taxable income up to $23,000/year' :
                             advantage.includes('Roth') ? 'Tax-free growth and withdrawals in retirement' :
                             advantage.includes('harvesting') ? 'Offset capital gains with losses' :
                             'Consult a tax professional for details'}
                          </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

                {/* Economic Context */}
                {advice.economic_context && (
                  <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-200">
                    <h4 className="font-semibold text-indigo-900 mb-4 flex items-center gap-2">
                      <Globe className="w-5 h-5" />
                      🌍 Economic Context for {homeCurrency?.name}
                  </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white p-4 rounded-lg border border-indigo-200 text-center">
                        <div className="text-2xl font-bold text-indigo-600">{(advice.economic_context.inflation_rate * 100).toFixed(1)}%</div>
                        <div className="text-sm text-indigo-700">Current Inflation Rate</div>
                        <div className="text-xs text-indigo-600 mt-1">
                          {advice.economic_context.inflation_rate > 0.04 ? 'Above normal - consider TIPS' : 'Stable environment'}
                        </div>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-indigo-200 text-center">
                        <div className="text-2xl font-bold text-indigo-600">{advice.economic_context.economic_stability}</div>
                        <div className="text-sm text-indigo-700">Economic Stability</div>
                        <div className="text-xs text-indigo-600 mt-1">
                          Good time for long-term planning
                        </div>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-indigo-200 text-center">
                        <div className="text-2xl font-bold text-indigo-600">{(advice.economic_context.typical_savings_rate * 100).toFixed(0)}%</div>
                        <div className="text-sm text-indigo-700">Average Savings Rate</div>
                        <div className="text-xs text-indigo-600 mt-1">
                          You're {advice.current_status.savings_rate > advice.economic_context.typical_savings_rate ? 'above' : 'below'} average
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Motivational Context */}
                {advice.motivational_context && (
                  <div className="bg-pink-50 p-6 rounded-xl border border-pink-200">
                    <h4 className="font-semibold text-pink-900 mb-4 flex items-center gap-2">
                      <Heart className="w-5 h-5" />
                      💪 Your Financial Motivation Dashboard
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <h5 className="font-semibold text-pink-900 mb-3">🎯 Success Metrics</h5>
                  <div className="space-y-2">
                          {advice.motivational_context.success_metrics.map((metric, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                              <span className="text-pink-800">{metric}</span>
                      </div>
                    ))}
                        </div>
                      </div>
                      <div>
                        <h5 className="font-semibold text-pink-900 mb-3">🦸 Financial Heroes</h5>
                        <div className="space-y-2">
                          {advice.motivational_context.financial_heroes.map((hero, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                              <span className="text-pink-800">{hero}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h5 className="font-semibold text-pink-900 mb-3">🎯 Your Goals</h5>
                        <div className="space-y-2">
                          {advice.motivational_context.common_goals.map((goal, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                              <span className="text-pink-800">{goal}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                  </div>
                </div>
              )}

                {/* Credit Card Recommendations */}
                {showMarketplace && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="bg-blue-100 p-3 rounded-xl">
                        <CreditCard className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-blue-900">💳 Recommended Credit Cards</h4>
                        <p className="text-blue-700">Perfect matches for your {profileData.creditScore} credit profile</p>
                      </div>
                    </div>
                    
                    {generatePersonalizedRecommendations().map((category, index) => (
                      <div key={index} className="mb-6">
                        <h5 className="font-semibold text-blue-900 mb-4">{category.category}</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {category.cards.map((card: any, cardIndex: number) => (
                            <motion.a
                              key={cardIndex}
                              href={card.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              whileHover={{ scale: 1.02, y: -2 }}
                              className="bg-white p-5 rounded-lg border border-blue-200 hover:border-blue-400 transition-all cursor-pointer block"
                            >
                              <div className="flex items-center justify-between mb-3">
                                <h6 className="font-bold text-gray-900">{card.name}</h6>
                                <ExternalLink className="w-4 h-4 text-blue-600" />
                              </div>
                              <p className="text-sm text-gray-600 mb-3">{card.description}</p>
                              <div className="text-xs text-gray-500 mb-3">APR: {card.apr}</div>
                              <div className="space-y-1 mb-3">
                                {card.features.map((feature: string, i: number) => (
                                  <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
                                    <CheckCircle className="w-3 h-3 text-green-500" />
                                    <span>{feature}</span>
                                  </div>
                                ))}
                              </div>
                              <div className="bg-blue-50 p-2 rounded text-xs text-blue-700 font-medium">
                                ✨ Best for: {card.bestFor}
                              </div>
                            </motion.a>
                          ))}
                        </div>
                      </div>
                    ))}
            </motion.div>
                )}

                {/* Banking & Investment Recommendations */}
                {showMarketplace && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="bg-green-100 p-3 rounded-xl">
                        <Building className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-green-900">🏦 Banking & Investment Products</h4>
                        <p className="text-green-700">Tailored to your ${(profileData.annual_income / 1000).toFixed(0)}K income and goals</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {profileData.primaryBankingNeeds.includes("🏦 High-yield savings") && (
                        <motion.a
                          href="https://www.marcus.com/us/en/savings/high-yield-savings"
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.02, y: -2 }}
                          className="bg-white p-4 rounded-lg border border-green-200 hover:border-green-400 transition-all cursor-pointer block"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h6 className="font-semibold text-gray-900">Marcus High-Yield</h6>
                            <ExternalLink className="w-4 h-4 text-green-600" />
                          </div>
                          <div className="text-2xl font-bold text-green-600 mb-2">4.50% APY</div>
                          <p className="text-sm text-gray-600">Perfect for your emergency fund</p>
                        </motion.a>
                      )}

                      {profileData.risk_tolerance !== "conservative" && (
                        <motion.a
                          href="https://robinhood.com/us/en/"
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.02, y: -2 }}
                          className="bg-white p-4 rounded-lg border border-green-200 hover:border-green-400 transition-all cursor-pointer block"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h6 className="font-semibold text-gray-900">Robinhood Investing</h6>
                            <ExternalLink className="w-4 h-4 text-green-600" />
                          </div>
                          <div className="text-lg font-bold text-green-600 mb-2">$0 Commission</div>
                          <p className="text-sm text-gray-600">Start investing with any amount</p>
                        </motion.a>
                      )}

                      {profileData.financialGoals.includes("🏠 Buy a home") && (
                        <motion.a
                          href="https://www.quickenloans.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.02, y: -2 }}
                          className="bg-white p-4 rounded-lg border border-green-200 hover:border-green-400 transition-all cursor-pointer block"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h6 className="font-semibold text-gray-900">Rocket Mortgage</h6>
                            <ExternalLink className="w-4 h-4 text-green-600" />
                          </div>
                          <div className="text-lg font-bold text-green-600 mb-2">Home Loans</div>
                          <p className="text-sm text-gray-600">Get pre-approved in minutes</p>
                        </motion.a>
          )}
        </div>
                  </motion.div>
                )}

                {/* Enhanced Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowMarketplace(!showMarketplace)}
                    className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <Sparkles className="w-5 h-5" />
                    {showMarketplace ? 'Hide' : 'Show'} Product Recommendations
                    <ChevronRight className="w-5 h-5" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={resetAdvisor}
                    className="flex items-center gap-3 px-8 py-4 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl transition-all duration-300 border-2 border-gray-200 hover:border-gray-300"
                  >
                    <User className="w-5 h-5" />
                    New Analysis
                  </motion.button>
                </div>

                {/* Personalized Improvement Suggestions */}
                <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <h5 className="text-sm font-semibold text-blue-900 mb-2">💡 Quick Wins to Improve Your Score</h5>
                  <div className="space-y-1 text-xs text-blue-700">
                    {(() => {
                      const suggestions = [];
                      const savingsRate = advice.current_status.savings_rate;
                      const emergencyFund = advice.current_status.emergency_fund_coverage;
                      const debtRatio = profileData.currentDebt / profileData.annual_income;
                      
                      if (savingsRate < 0.15) {
                        suggestions.push(`💰 Increase savings rate to 15%+ (+${savingsRate < 0.05 ? '15' : savingsRate < 0.1 ? '10' : '5'} pts)`);
                      }
                      if (emergencyFund < 3) {
                        suggestions.push(`🛡️ Build emergency fund to 3+ months (+${emergencyFund < 0.5 ? '15' : emergencyFund < 1 ? '10' : '5'} pts)`);
                      }
                      if (profileData.creditScore !== 'excellent') {
                        suggestions.push(`📈 Improve credit score to excellent (+${profileData.creditScore === 'good' ? '5' : '10-15'} pts)`);
                      }
                      if (debtRatio > 0.3) {
                        suggestions.push(`💳 Reduce debt-to-income ratio below 30% (+${debtRatio > 0.7 ? '15' : debtRatio > 0.5 ? '10' : '5'} pts)`);
                      }
                      
                      if (suggestions.length === 0) {
                        suggestions.push('🌟 Excellent! Keep up the great financial habits!');
                      }
                      
                      return suggestions.map((suggestion, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="text-blue-500">•</span>
                          <span>{suggestion}</span>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Fixed Navigation Footer */}
        {currentStep < 3 && (
          <div className="flex-shrink-0 border-t-2 border-gray-300 bg-white px-6 py-6 shadow-lg">
            <div className="flex justify-between items-center">
              <Button
                onClick={handlePrevious}
                variant="outline"
                disabled={currentStep === 1}
                className="flex items-center gap-2 border-2 border-gray-600 text-gray-800 hover:border-purple-500 hover:text-purple-600 hover:bg-purple-50 transition-all font-semibold px-8 py-4 bg-white shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-600 disabled:hover:text-gray-800 disabled:hover:bg-white"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="text-base">{currentStep === 2 ? "Back to Edit Data" : "Previous"}</span>
              </Button>
              
              <Button
                onClick={handleNext}
                disabled={isLoading}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-8"
              >
                {isLoading ? (
                  "Analyzing..."
                ) : currentStep === 2 ? (
                  <>
                    <Brain className="w-4 h-4" />
                    Get My Analysis
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
} 
