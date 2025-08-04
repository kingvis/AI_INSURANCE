"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { CountryFlag } from '@/components/ui/CountryFlag';
import { useCurrency, useCurrencyConverter, useFinancialValue } from '@/contexts/CurrencyContext';
import currencyService from '@/lib/currency-service';
import { 
  PiggyBank, TrendingUp, Calculator, DollarSign, 
  Target, BarChart3, X, Calendar, Brain, Lightbulb,
  Trophy, Heart, Coffee, Car, Home, Plane, 
  GraduationCap, Baby, Users, Sparkles, Zap,
  ArrowRight, ChevronRight, Smile, Star,
  Gift, ShoppingBag, Gamepad2, Activity,
  ExternalLink, Shield, Building, CreditCard,
  Smartphone, Globe, Award, Banknote, Wallet,
  ChevronLeft, Lock, CheckCircle2, TrendingDown
} from 'lucide-react';
import {
  type Country,
  type SavingsProjection,
  calculateSavingsProjection,
  formatCurrency
} from '@/lib/insurance-api';

interface SavingsCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PersonalProfile {
  age: number;
  monthlyIncome: number;
  currentSavings: number;
  primaryGoal: string;
  timeFrame: string;
  lifestyle: string;
  motivation: string;
  savingsChallenges: string[];
  financialPersonality: string;
}

interface MotivationalInsight {
  title: string;
  message: string;
  icon: React.ComponentType<any>;
  type: 'tip' | 'challenge' | 'milestone' | 'strategy';
  actionable: boolean;
}

export function SavingsCalculator({
  isOpen,
  onClose
}: SavingsCalculatorProps) {
  // Currency context integration  
  const { homeCountry, homeCurrency, formatHomeAmount, refreshRates } = useCurrency();
  const { format, symbol } = useCurrencyConverter();
  
  // Simple formatting using home currency
  const formatAmount = (amount: number): string => {
    return formatHomeAmount(amount);
  };

  // Get home currency symbol
  const getCurrencySymbol = (): string => {
    return homeCurrency?.symbol || '$';
  };



  // Financial value hooks for automatic conversion
  const monthlyIncomeValue = useFinancialValue('income');
  const currentSavingsValue = useFinancialValue('savings');
  const monthlySavingsValue = useFinancialValue('monthlySavings');
  
  // Map country codes to currency service format
  const countryMapping: Record<string, string> = {
    'US': 'usa',
    'IN': 'india', 
    'UK': 'uk',
    'CA': 'canada',
    'AU': 'australia',
    'DE': 'germany'
  };
  
  // Get the mapped country key for currency service
  const getMappedCountry = (country: string) => {
    return countryMapping[country] || country.toLowerCase();
  };
  
  // Currency conversion helper function for USD amounts in marketplace
  const convertUSDPrice = (usdAmount: number): string => {
    // Always show USD for US country selection
    if (homeCountry === 'US' || !homeCurrency) {
      return `$${usdAmount.toLocaleString()}`;
    }
    
    const mappedCountry = getMappedCountry(homeCountry);
    
    try {
      const convertedAmount = currencyService.convertFromUSD(usdAmount, mappedCountry);
      return currencyService.formatAmount(convertedAmount, mappedCountry);
    } catch (error) {
      console.error('Currency conversion error for', homeCountry, '→', mappedCountry, ':', error);
      // Fallback to showing USD with proper symbol
      return `$${usdAmount.toLocaleString()}`;
    }
  };

  const [currentStep, setCurrentStep] = useState(1); // 1: Profile, 2: Calculator, 3: Results
  const [isLoading, setIsLoading] = useState(false);
  const [showAIAnalysis, setShowAIAnalysis] = useState(false);
  const [showMarketplace, setShowMarketplace] = useState(false);
  
  // Existing savings calculator states
  const [savingsAmount, setSavingsAmount] = useState(500);
  const [savingsYears, setSavingsYears] = useState(10);
  const [riskLevel, setRiskLevel] = useState('moderate');
  const [projections, setProjections] = useState<SavingsProjection | null>(null);

  // Personal profile for personalized insights
  const [personalProfile, setPersonalProfile] = useState<PersonalProfile>({
    age: 28,
    monthlyIncome: 5000,
    currentSavings: 10000,
    primaryGoal: 'emergency',
    timeFrame: '5-10',
    lifestyle: 'balanced',
    motivation: 'security',
    savingsChallenges: [],
    financialPersonality: 'planner'
  });

  const [motivationalInsights, setMotivationalInsights] = useState<MotivationalInsight[]>([]);

  // Refresh currency rates when calculator opens
  useEffect(() => {
    if (isOpen) {
      refreshRates().then(() => {
        console.log('🔄 Currency rates refreshed for savings calculator');
        console.log('💱 Current country:', homeCountry, homeCurrency?.code, homeCurrency?.symbol);
        console.log('🗺️ Mapped country for currency service:', getMappedCountry(homeCountry));
      });
    }
  }, [isOpen, homeCountry]);

  const savingsGoals = [
    { id: 'emergency_fund', label: '🛡️ Emergency Fund', description: 'Build 6-12 months of expenses' },
    { id: 'house_down_payment', label: '🏠 House Down Payment', description: 'Save for your dream home' },
    { id: 'retirement', label: '🌅 Retirement', description: 'Secure your future' },
    { id: 'vacation', label: '✈️ Dream Vacation', description: 'Travel the world' },
    { id: 'education', label: '🎓 Education Fund', description: 'Invest in learning' },
    { id: 'new_car', label: '🚗 New Car', description: 'Upgrade your ride' },
    { id: 'wedding', label: '💍 Wedding', description: 'Perfect celebration' },
    { id: 'business', label: '💼 Start Business', description: 'Be your own boss' }
  ];

  const motivationTypes = [
    { id: 'financial_security', label: '🛡️ Financial Security', description: 'Peace of mind and stability' },
    { id: 'freedom', label: '🗽 Financial Freedom', description: 'Do what you love' },
    { id: 'family', label: '👨‍👩‍👧‍👦 Family Future', description: 'Provide for loved ones' },
    { id: 'experiences', label: '🌍 Life Experiences', description: 'Travel and adventures' },
    { id: 'legacy', label: '🏛️ Leave a Legacy', description: 'Impact future generations' },
    { id: 'early_retirement', label: '🏖️ Early Retirement', description: 'Retire on your terms' }
  ];

  const lifestyleTypes = [
    { id: 'minimalist', label: '🎯 Minimalist', description: 'Focus on essentials' },
    { id: 'moderate', label: '⚖️ Balanced', description: 'Enjoy life responsibly' },
    { id: 'luxury', label: '💎 Premium', description: 'Appreciate finer things' },
    { id: 'social', label: '🎉 Social', description: 'Love experiences with others' },
    { id: 'homebody', label: '🏠 Homebody', description: 'Prefer comfort at home' }
  ];

  const generateMotivationalInsights = (profile: PersonalProfile, projections: SavingsProjection | null) => {
    const insights: MotivationalInsight[] = [];
    
    // Personalized insights based on profile
    if (profile.age < 30) {
      insights.push({
        title: "⚡ Youth Advantage",
        message: `At ${profile.age}, you have the ultimate superpower: TIME! Every ${homeCurrency?.symbol || '$'}1 you save now becomes ${convertUSDPrice(10)}-${convertUSDPrice(20)} in retirement thanks to compound interest. You're literally getting paid to wait!`,
        icon: Zap,
        type: 'tip',
        actionable: true
      });
    }

    // Goal-specific motivation
    const goalInsights = {
      emergency_fund: {
        title: "🛡️ Your Financial Shield",
        message: "An emergency fund isn't just money—it's confidence, security, and the ability to sleep soundly. You're building a fortress against life's uncertainties!",
        icon: Target
      },
      house_down_payment: {
        title: "🏠 Your Future Address",
        message: "Every dollar saved brings you closer to holding those house keys. Imagine opening the door to YOUR home for the first time!",
        icon: Home
      },
      retirement: {
        title: "🌅 Freedom Fund",
        message: "You're not just saving for retirement—you're buying freedom. The freedom to choose how you spend every single day of your future!",
        icon: Trophy
      },
      vacation: {
        title: "✈️ Adventure Awaits",
        message: "Your savings aren't just numbers—they're passport stamps, sunset photos, and memories that will last forever!",
        icon: Plane
      }
    };

    const goalInsight = goalInsights[profile.primaryGoal as keyof typeof goalInsights];
    if (goalInsight) {
      insights.push({
        ...goalInsight,
        type: 'milestone',
        actionable: true
      });
    }

    // Behavioral nudges based on financial personality
    if (profile.financialPersonality === 'spender') {
      insights.push({
        title: "💡 The Spender's Secret",
        message: "Turn your love of spending into a superpower! Set up automatic transfers right after payday—pay yourself first, then enjoy spending the rest guilt-free!",
        icon: Lightbulb,
        type: 'strategy',
        actionable: true
      });
    }

    // Lifestyle-specific tips
    if (profile.lifestyle === 'social') {
      insights.push({
        title: "🎉 Social Savings Challenge",
        message: `Host a 'savings party' with friends! Everyone brings ${convertUSDPrice(20)} to put in savings instead of spending on drinks. Make saving social and fun!`,
        icon: Users,
        type: 'challenge',
        actionable: true
      });
    }

    if (profile.lifestyle === 'luxury') {
      insights.push({
        title: "💎 Luxury Mindset Shift",
        message: "True luxury is choice. By saving now, you're buying the ultimate luxury: the power to choose your future without financial constraints!",
        icon: Star,
        type: 'strategy',
        actionable: true
      });
    }

    // Innovative savings ideas
    insights.push({
      title: "🎮 The 52-Week Game",
              message: `Week 1: Save ${convertUSDPrice(1)}, Week 2: Save ${convertUSDPrice(2)}... by Week 52, you'll have saved ${convertUSDPrice(1378)}! Turn saving into a fun weekly challenge!`,
      icon: Gamepad2,
      type: 'challenge',
      actionable: true
    });

    insights.push({
      title: "☕ Coffee Shop Revelation",
              message: `Skip one coffee shop visit per week and save the money instead. In 10 years, that ${convertUSDPrice(5)} coffee becomes ${convertUSDPrice(3380)} through compound growth!`,
      icon: Coffee,
      type: 'tip',
      actionable: true
    });

    // Income-based strategies
    if (profile.monthlyIncome > 7000) {
      insights.push({
        title: "🚀 High Earner Strategy",
        message: "With your income level, try the 50/30/20 rule on steroids: 50% needs, 20% wants, 30% savings. You could be financially independent in 10-15 years!",
        icon: TrendingUp,
        type: 'strategy',
        actionable: true
      });
    }

    // Projections-based insights
    if (projections) {
      const totalGrowth = projections.investment_growth.total - projections.simple_savings.total;
      if (totalGrowth > 50000) {
        insights.push({
          title: "🌟 Millionaire Path",
          message: `Your plan generates ${homeCountry === 'US' ? `$${totalGrowth.toLocaleString()}` : formatCurrency(totalGrowth, 'USD')} in growth! You're on track to serious wealth—stay consistent!`,
          icon: Trophy,
          type: 'milestone',
          actionable: false
        });
      }
    }

    return insights.slice(0, 6); // Return top 6 most relevant insights
  };

  const handleCalculate = async () => {
    setIsLoading(true);
    try {
      const result = await calculateSavingsProjection(
        savingsAmount, 
        savingsYears, 
        'USD', // Assuming 'USD' for now, will be replaced by context
        riskLevel
      );
      setProjections(result.projections);
      
      // Generate personalized motivational insights  
      const insights = generateMotivationalInsights(personalProfile, result.projections);
      setMotivationalInsights(insights);
      
      // Show AI analysis after calculation
      setTimeout(() => {
        setShowAIAnalysis(true);
      }, 1000);
      
      setCurrentStep(3);
    } catch (error) {
      console.error('Savings calculation failed:', error);
      alert('Sorry, the savings calculation failed. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
      // Auto-suggest savings amount based on income
      if (currentStep === 1) {
        const suggestedAmount = Math.min(Math.max(personalProfile.monthlyIncome * 0.2, 100), 2000);
        setSavingsAmount(Math.round(suggestedAmount));
      }
    } else {
      handleCalculate();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetCalculator = () => {
    setCurrentStep(1);
    setProjections(null);
    setShowAIAnalysis(false);
    setMotivationalInsights([]);
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
        className="bg-white rounded-2xl max-w-5xl w-full max-h-[95vh] shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <CountryFlag 
                countryCode="USD" // Assuming 'USD' for now, will be replaced by context
                countryName="United States" // Assuming 'United States' for now, will be replaced by context
                size="lg"
                className="shadow-lg"
              />
              <div>
                <h2 className="text-2xl font-bold">🚀 AI Savings Coach</h2>
                <p className="text-green-100">
                                     Your personalized path to financial success in {homeCurrency?.code || 'your currency'}
                </p>
              </div>
            </div>
            <Button
              onClick={onClose}
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-green-600"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          {/* Progress Indicator */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-green-100 mb-2">
              <span>Step {currentStep} of 3</span>
              <span>{Math.round((currentStep / 3) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-green-500/30 rounded-full h-2">
              <motion.div
                initial={{ width: "33%" }}
                animate={{ width: `${(currentStep / 3) * 100}%` }}
                transition={{ duration: 0.5 }}
                className="bg-white h-2 rounded-full"
              />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              // Step 1: Personal Profile
            <motion.div
                key="profile"
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
                    className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center"
                  >
                    <Brain className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-black mb-2">👋 Let's Get Personal!</h3>
                  <p className="text-black">Tell us about yourself so we can create your perfect savings strategy</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Your Age
                      </label>
                      <input
                        type="number"
                        value={personalProfile.age}
                        onChange={(e) => setPersonalProfile({...personalProfile, age: parseInt(e.target.value) || 0})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-black bg-white placeholder:text-gray-400"
                        placeholder="Enter your age"
                        min="18"
                        max="100"
                      />
                    </div>

                    <div>
                                            <label className="block text-sm font-medium text-black mb-2">
                        Monthly Income
                      </label>
                      <input
                        type="number"
                        value={personalProfile.monthlyIncome}
                        onChange={(e) => setPersonalProfile({...personalProfile, monthlyIncome: parseInt(e.target.value) || 0})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-black bg-white placeholder:text-gray-400"
                        placeholder="Enter monthly income"
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Current Savings
                      </label>
                      <input
                        type="number"
                        value={personalProfile.currentSavings}
                        onChange={(e) => setPersonalProfile({...personalProfile, currentSavings: parseInt(e.target.value) || 0})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-black bg-white placeholder:text-gray-400"
                        placeholder="How much do you have saved?"
                        min="0"
                      />
                    </div>
                  </div>

                  {/* Goals and Motivation */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        Primary Savings Goal
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {savingsGoals
                          .filter((goal) => goal && (goal.id || goal.label)) // Validate goal data
                          .map((goal, goalIndex) => {
                            const safeKey = goal.id || `goal-${goalIndex}-${goal.label?.replace(/[^a-zA-Z0-9]/g, '') || 'unknown'}`;
                            return (
                              <button
                                key={`savings-goal-${safeKey}`}
                                onClick={() => setPersonalProfile({...personalProfile, primaryGoal: goal.id})}
                                className={`p-3 text-left border rounded-lg transition-all ${
                                  personalProfile.primaryGoal === goal.id
                                    ? 'border-green-500 bg-green-50 text-green-800'
                                    : 'border-gray-200 hover:border-green-300 text-black'
                                }`}
                              >
                                <div className="font-medium text-sm text-black">{goal.label}</div>
                                <div className="text-xs text-gray-700">{goal.description}</div>
                              </button>
                            );
                          })}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-black mb-2">
                        What Motivates You Most?
                      </label>
                      <div className="space-y-2">
                        {motivationTypes
                          .filter((motivation) => motivation && (motivation.id || motivation.label)) // Validate motivation data
                          .map((motivation, motivationIndex) => {
                            const safeKey = motivation.id || `motivation-${motivationIndex}-${motivation.label?.replace(/[^a-zA-Z0-9]/g, '') || 'unknown'}`;
                            return (
                              <button
                                key={`motivation-type-${safeKey}`}
                                onClick={() => setPersonalProfile({...personalProfile, motivation: motivation.id})}
                                className={`w-full p-3 text-left border rounded-lg transition-all ${
                                  personalProfile.motivation === motivation.id
                                    ? 'border-blue-500 bg-blue-50 text-blue-800'
                                    : 'border-gray-200 hover:border-blue-300 text-black'
                                }`}
                              >
                                <div className="font-medium">{motivation.label}</div>
                                <div className="text-sm text-gray-700">{motivation.description}</div>
                              </button>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Your Lifestyle
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                    {lifestyleTypes
                      .filter((lifestyle) => lifestyle && (lifestyle.id || lifestyle.label)) // Validate lifestyle data
                      .map((lifestyle, lifestyleIndex) => {
                        const safeKey = lifestyle.id || `lifestyle-${lifestyleIndex}-${lifestyle.label?.replace(/[^a-zA-Z0-9]/g, '') || 'unknown'}`;
                        return (
                          <button
                            key={`lifestyle-type-${safeKey}`}
                            onClick={() => setPersonalProfile({...personalProfile, lifestyle: lifestyle.id})}
                            className={`p-3 text-left border rounded-lg transition-all ${
                              personalProfile.lifestyle === lifestyle.id
                                ? 'border-purple-500 bg-purple-50 text-purple-800'
                                : 'border-gray-200 hover:border-purple-300 text-black'
                            }`}
                          >
                            <div className="font-medium text-sm text-black">{lifestyle.label}</div>
                            <div className="text-xs text-gray-700">{lifestyle.description}</div>
                          </button>
                        );
                      })}
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              // Step 2: Enhanced Calculator
              <motion.div
                key="calculator"
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
                    className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center"
                  >
                    <Calculator className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-black mb-2">🎯 Your Personalized Plan</h3>
                  <p className="text-black">Based on your profile, here's our recommended savings strategy</p>
                </div>

                {/* AI Recommendation Banner */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-200">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 p-3 rounded-xl">
                      <Sparkles className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-black mb-2">💡 AI Recommendation</h4>
                      <p className="text-blue-800 mb-3">
                        Based on your {personalProfile.age}-year-old profile with {formatAmount(personalProfile.monthlyIncome)} monthly income,
                        we recommend saving <strong>{formatAmount(Math.round((personalProfile.monthlyIncome * 0.2)))}</strong> per month (20% of income) 
                        for your {savingsGoals.find(g => g.id === personalProfile.primaryGoal)?.label || 'financial goal'}.
                      </p>
                      <div className="bg-white/50 p-3 rounded-lg">
                        <div className="text-sm text-blue-700">
                          <strong>Why this amount?</strong> The 20% rule ensures you're building wealth while still enjoying life. 
                          At your age, this could make you financially independent by {personalProfile.age + 25}!
                        </div>
                      </div>
                    </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {/* Monthly Savings Amount */}
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Monthly Savings Amount ({getCurrencySymbol()})
                    </label>
                      <input
                        type="number"
                      value={savingsAmount}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value) || 0;
                        setSavingsAmount(value);
                      }}
                      className="w-full p-3 text-black bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 placeholder:text-gray-400"
                      placeholder="500"
                      min="10"
                    />
                  </div>

                  {/* Years */}
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Time Horizon (Years)
                    </label>
                    <select
                        value={savingsYears}
                      onChange={(e) => setSavingsYears(parseInt(e.target.value))}
                      className="w-full p-3 text-black bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      {[1, 2, 3, 5, 10, 15, 20, 25, 30].map((year, yearIndex) => {
                        const safeKey = `time-horizon-${year}-years-${yearIndex}`;
                        return (
                          <option key={safeKey} value={year}>{year} years</option>
                        );
                      })}
                    </select>
                  </div>

                  {/* Risk Level */}
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Investment Risk Level
                    </label>
                    <select
                      value={riskLevel}
                      onChange={(e) => setRiskLevel(e.target.value)}
                      className="w-full p-3 text-black bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      <option value="conservative">🛡️ Conservative (Lower risk, stable returns)</option>
                      <option value="moderate">⚖️ Moderate (Balanced risk and growth)</option>
                      <option value="aggressive">🚀 Aggressive (Higher risk, higher potential)</option>
                    </select>
                  </div>
                </div>

                  {/* Enhanced Preview */}
                  <div className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-xl border border-green-200">
                    <h4 className="font-semibold text-black mb-4 flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Your Savings Preview
                    </h4>
                    <div className="space-y-4">
                      <div className="bg-white/60 p-3 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-green-700">Monthly Commitment:</span>
                          <span className="font-bold text-black">
                        {formatAmount(savingsAmount)}
                      </span>
                    </div>
                        <div className="text-xs text-green-600 mt-1">
                          Just {formatAmount(savingsAmount / 30)} per day!
                        </div>
                    </div>
                      
                      <div className="bg-white/60 p-3 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-blue-700">Total Contributions:</span>
                          <span className="font-bold text-black">
                        {formatAmount(savingsAmount * savingsYears * 12)}
                      </span>
                    </div>
                      </div>

                      <div className="bg-white/60 p-3 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-purple-700">Goal Timeline:</span>
                          <span className="font-bold text-black">{savingsYears} years</span>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-3 rounded-lg border border-yellow-200">
                        <div className="text-center">
                          <div className="text-xs text-orange-700 mb-1">Estimated Total Growth</div>
                          <div className="text-lg font-bold text-black">
                            🎯 {formatAmount(savingsAmount * savingsYears * 12 * 1.6)}
                          </div>
                          <div className="text-xs text-orange-600">With compound interest magic!</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && projections && (
              // Step 3: Enhanced Results with AI Analysis
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
                  <h3 className="text-3xl font-bold text-black mb-2">🎉 Your Wealth Building Plan!</h3>
                  <p className="text-black text-lg">Amazing! You're on track to build serious wealth. Here's your personalized roadmap:</p>
                </div>

                {/* Main Results Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl text-center border border-blue-200"
                  >
                    <Target className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                    <h4 className="font-semibold text-black">Total Invested</h4>
                    <p className="text-3xl font-bold text-blue-600 mt-2">
                      {(() => {
                        // Values already in home currency
                        const amount = projections.simple_savings.total;
                        return formatAmount(amount);
                      })()}
                    </p>
                    <p className="text-sm text-blue-700 mt-1">Your discipline pays off!</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl text-center border border-green-200"
                  >
                    <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-3" />
                    <h4 className="font-semibold text-black">Interest Earned</h4>
                    <p className="text-3xl font-bold text-green-600 mt-2">
                      {(() => {
                        // Values already in home currency
                        const amount = projections.investment_growth.gains;
                        return formatAmount(amount);
                      })()}
                    </p>
                    <p className="text-sm text-green-700 mt-1">Money working for you!</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-gradient-to-br from-yellow-50 to-orange-100 p-6 rounded-xl text-center border border-orange-200"
                  >
                    <PiggyBank className="w-8 h-8 text-orange-600 mx-auto mb-3" />
                    <h4 className="font-semibold text-black">Final Wealth</h4>
                    <p className="text-3xl font-bold text-orange-600 mt-2">
                      {(() => {
                        // Values already in home currency
                        const amount = projections.investment_growth.total;
                        return formatAmount(amount);
                      })()}
                    </p>
                    <p className="text-sm text-orange-700 mt-1">Your future self thanks you!</p>
                  </motion.div>
                </div>

                {/* AI Motivational Insights */}
                {showAIAnalysis && motivationalInsights.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="bg-purple-100 p-3 rounded-xl">
                        <Brain className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-black">🧠 AI-Powered Insights & Motivation</h4>
                        <p className="text-purple-700">Personalized strategies to supercharge your savings journey</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {motivationalInsights
                        .filter(insight => insight && insight.title && insight.type) // Filter out invalid insights
                        .map((insight, index) => {
                        const IconComponent = insight.icon;
                        const safeTitle = insight.title.replace(/[^a-zA-Z0-9]/g, '').substring(0, 20); // Safe title for key
                        return (
                          <motion.div
                            key={`motivational-insight-${index}-${insight.type}-${safeTitle}`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1 + index * 0.1 }}
                            className={`p-4 rounded-lg border-2 ${
                              insight.type === 'tip' ? 'bg-blue-50 border-blue-200' :
                              insight.type === 'challenge' ? 'bg-green-50 border-green-200' :
                              insight.type === 'milestone' ? 'bg-yellow-50 border-yellow-200' :
                              'bg-purple-50 border-purple-200'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`p-2 rounded-lg ${
                                insight.type === 'tip' ? 'bg-blue-100' :
                                insight.type === 'challenge' ? 'bg-green-100' :
                                insight.type === 'milestone' ? 'bg-yellow-100' :
                                'bg-purple-100'
                              }`}>
                                <IconComponent className={`w-5 h-5 ${
                                  insight.type === 'tip' ? 'text-blue-600' :
                                  insight.type === 'challenge' ? 'text-green-600' :
                                  insight.type === 'milestone' ? 'text-yellow-600' :
                                  'text-purple-600'
                                }`} />
                              </div>
                              <div className="flex-1">
                                <h5 className="font-semibold text-black mb-2">{insight.title}</h5>
                                <p className="text-black text-sm">{insight.message}</p>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* Enhanced Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowMarketplace(true)}
                    className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <Sparkles className="w-5 h-5" />
                    Start My Savings Journey
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={resetCalculator}
                    className="flex items-center gap-3 px-8 py-4 bg-white hover:bg-gray-50 text-black font-semibold rounded-xl transition-all duration-300 border-2 border-gray-200 hover:border-gray-300"
                  >
                    <Calculator className="w-5 h-5" />
                    Try Different Scenario
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

              </div>

        {/* Fixed Navigation Footer */}
        {currentStep < 3 && (
          <div className="flex-shrink-0 border-t border-gray-200 bg-gray-50 px-6 py-4">
            <div className="flex justify-between items-center">
              <Button
                onClick={handlePrevious}
                variant="outline"
                disabled={currentStep === 1}
                className="flex items-center gap-2"
              >
                Previous
              </Button>

              <Button
                onClick={handleNext}
                disabled={isLoading}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8"
              >
                {isLoading ? (
                  "Processing..."
                ) : currentStep === 2 ? (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate My Plan
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
      
      {/* Financial Marketplace Overlay */}
      <AnimatePresence>
        {showMarketplace && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4"
            onClick={(e) => e.target === e.currentTarget && setShowMarketplace(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-2xl max-w-6xl w-full max-h-[95vh] shadow-2xl flex flex-col"
            >
              {/* Marketplace Header */}
              <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 text-white p-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <Building className="w-6 h-6" />
                  </div>
                  <div>
                      <h2 className="text-2xl font-bold">🚀 Your Financial Marketplace</h2>
                      <p className="text-purple-100">
                        Curated financial products to supercharge your {savingsGoals.find(g => g.id === personalProfile.primaryGoal)?.label || 'savings goal'}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => setShowMarketplace(false)}
                    variant="outline"
                    className="text-white border-white hover:bg-white hover:text-purple-600"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-8">
                  {/* Personalized Recommendations Header */}
                  <div className="text-center">
                    <motion.div
                      animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ 
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center"
                    >
                      <Award className="w-8 h-8 text-white" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-black mb-2">💎 Handpicked for You</h3>
                    <p className="text-black">
                                              Based on your {personalProfile.age}-year-old profile, {personalProfile.lifestyle} lifestyle, and {formatAmount(personalProfile.monthlyIncome)} monthly income
                    </p>
                                          {homeCurrency && homeCountry !== 'usa' && homeCurrency.code !== 'USD' && (
                      <div className="mt-2 flex flex-col gap-1">
                        <div className="text-xs text-blue-600 bg-blue-50 px-3 py-1 rounded-full inline-flex items-center gap-1">
                          <Globe className="w-3 h-3" />
                          Prices automatically converted to {homeCurrency.code} ({homeCurrency.symbol}) based on current exchange rates
                          <button 
                            onClick={() => refreshRates()}
                            className="ml-2 hover:text-blue-800 transition-colors"
                            title="Refresh exchange rates"
                          >
                            🔄
                          </button>
                        </div>
                        <div className="text-xs text-gray-500 text-center">
                          Current rate: 1 USD = {(() => {
                            try {
                              return currencyService.convert(1, 'usa', getMappedCountry(homeCountry)).toFixed(2);
                            } catch (error) {
                              return '1.00';
                            }
                          })()} {homeCurrency.code}
                        </div>
                      </div>
                    )}
                </div>

                  {/* High-Yield Savings Accounts */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="bg-green-100 p-3 rounded-xl">
                        <PiggyBank className="w-6 h-6 text-green-600" />
                </div>
                      <div>
                        <h4 className="text-xl font-bold text-black">🏦 High-Yield Savings Accounts</h4>
                        <p className="text-green-700">Earn 4-5% APY on your emergency fund - 10x better than traditional banks!</p>
                </div>
              </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <motion.a
                        href="https://www.marcus.com/us/en/savings/high-yield-savings"
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.02, y: -2 }}
                        className="bg-white p-4 rounded-lg border border-green-200 hover:border-green-400 transition-all cursor-pointer block"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="font-semibold text-black">Marcus by Goldman Sachs</h5>
                          <ExternalLink className="w-4 h-4 text-green-600" />
                        </div>
                        <div className="text-2xl font-bold text-green-600 mb-2">4.50% APY</div>
                        <p className="text-sm text-black mb-3">No minimum balance • FDIC insured • No fees</p>
                        <div className="flex items-center gap-2 text-xs text-green-700">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Perfect for emergency funds</span>
                        </div>
                      </motion.a>

                      <motion.a
                        href="https://www.ally.com/bank/online-savings-account/"
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.02, y: -2 }}
                        className="bg-white p-4 rounded-lg border border-green-200 hover:border-green-400 transition-all cursor-pointer block"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="font-semibold text-black">Ally Bank</h5>
                          <ExternalLink className="w-4 h-4 text-green-600" />
                        </div>
                        <div className="text-2xl font-bold text-green-600 mb-2">4.25% APY</div>
                        <p className="text-sm text-black mb-3">{convertUSDPrice(0)} minimum • Mobile app • 24/7 support</p>
                        <div className="flex items-center gap-2 text-xs text-green-700">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Best mobile experience</span>
                        </div>
                      </motion.a>

                      <motion.a
                        href="https://www.capitalone.com/bank/savings-accounts/360-performance-savings/"
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.02, y: -2 }}
                        className="bg-white p-4 rounded-lg border border-green-200 hover:border-green-400 transition-all cursor-pointer block"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="font-semibold text-black">Capital One 360</h5>
                          <ExternalLink className="w-4 h-4 text-green-600" />
                        </div>
                        <div className="text-2xl font-bold text-green-600 mb-2">4.30% APY</div>
                        <p className="text-sm text-black mb-3">No fees • Easy transfers • Multiple savings goals</p>
                        <div className="flex items-center gap-2 text-xs text-green-700">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Great for goal-based saving</span>
                        </div>
                      </motion.a>
                    </div>
                  </div>

                  {/* Investment Platforms */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="bg-blue-100 p-3 rounded-xl">
                        <TrendingUp className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-black">📈 Investment Platforms</h4>
                        <p className="text-blue-700">Start investing with as little as {convertUSDPrice(1)} - Build long-term wealth!</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <motion.a
                        href="https://robinhood.com/us/en/"
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.02, y: -2 }}
                        className="bg-white p-4 rounded-lg border border-blue-200 hover:border-blue-400 transition-all cursor-pointer block"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="font-semibold text-black">Robinhood</h5>
                          <ExternalLink className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="text-lg font-bold text-blue-600 mb-2">{convertUSDPrice(0)} Commission</div>
                        <p className="text-sm text-black mb-3">Fractional shares • Crypto • Easy interface</p>
                        <div className="flex items-center gap-2 text-xs text-blue-700">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Perfect for beginners</span>
                        </div>
                      </motion.a>

                      <motion.a
                        href="https://www.fidelity.com/open-account/overview"
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.02, y: -2 }}
                        className="bg-white p-4 rounded-lg border border-blue-200 hover:border-blue-400 transition-all cursor-pointer block"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="font-semibold text-black">Fidelity</h5>
                          <ExternalLink className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="text-lg font-bold text-blue-600 mb-2">Zero Expense Ratio Funds</div>
                        <p className="text-sm text-black mb-3">Research tools • IRAs • Professional advice</p>
                        <div className="flex items-center gap-2 text-xs text-blue-700">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Best for retirement planning</span>
                        </div>
                      </motion.a>

                      <motion.a
                        href="https://investor.vanguard.com/investment-products/etfs"
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.02, y: -2 }}
                        className="bg-white p-4 rounded-lg border border-blue-200 hover:border-blue-400 transition-all cursor-pointer block"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="font-semibold text-black">Vanguard</h5>
                          <ExternalLink className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="text-lg font-bold text-blue-600 mb-2">Low-Cost ETFs</div>
                        <p className="text-sm text-black mb-3">Index funds • Long-term focus • Low fees</p>
                        <div className="flex items-center gap-2 text-xs text-blue-700">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Warren Buffett approved</span>
                        </div>
                      </motion.a>
                    </div>
                  </div>

                  {/* Insurance Products */}
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl border border-orange-200">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="bg-orange-100 p-3 rounded-xl">
                        <Shield className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-black">🛡️ Essential Insurance Protection</h4>
                        <p className="text-orange-700">Protect your savings journey - Insurance is your financial safety net!</p>
                      </div>
                    </div>

                    <div className="bg-white/70 p-4 rounded-lg mb-4 border border-orange-200">
                      <div className="flex items-start gap-3">
                        <Heart className="w-5 h-5 text-red-500 mt-1" />
                        <div>
                          <h5 className="font-semibold text-black mb-2">💡 Why Insurance Matters for Savers</h5>
                          <p className="text-sm text-black">
                            Without insurance, one medical emergency or accident could wipe out years of savings! 
                            Insurance protects your wealth-building journey and gives you peace of mind to invest confidently.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <motion.a
                        href="https://www.policygenius.com/life-insurance/"
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.02, y: -2 }}
                        className="bg-white p-4 rounded-lg border border-orange-200 hover:border-orange-400 transition-all cursor-pointer block"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="font-semibold text-black">Policygenius Life Insurance</h5>
                          <ExternalLink className="w-4 h-4 text-orange-600" />
                        </div>
                        <div className="text-lg font-bold text-orange-600 mb-2">Term Life from {convertUSDPrice(20)}/mo</div>
                        <p className="text-sm text-black mb-3">Compare 30+ insurers • Online quotes • Expert advice</p>
                        <div className="flex items-center gap-2 text-xs text-orange-700">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Protect your family's future</span>
                        </div>
                      </motion.a>

                      <motion.a
                        href="https://www.healthcare.gov/"
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.02, y: -2 }}
                        className="bg-white p-4 rounded-lg border border-orange-200 hover:border-orange-400 transition-all cursor-pointer block"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="font-semibold text-black">Health Insurance Marketplace</h5>
                          <ExternalLink className="w-4 h-4 text-orange-600" />
                        </div>
                        <div className="text-lg font-bold text-orange-600 mb-2">ACA Plans Available</div>
                        <p className="text-sm text-black mb-3">Subsidies available • Essential health benefits • Preventive care</p>
                        <div className="flex items-center gap-2 text-xs text-orange-700">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Don't skip health coverage!</span>
                        </div>
                      </motion.a>

                      <motion.a
                        href="https://www.guardian.com/disability-insurance"
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.02, y: -2 }}
                        className="bg-white p-4 rounded-lg border border-orange-200 hover:border-orange-400 transition-all cursor-pointer block"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="font-semibold text-black">Guardian Disability Insurance</h5>
                          <ExternalLink className="w-4 h-4 text-orange-600" />
                        </div>
                        <div className="text-lg font-bold text-orange-600 mb-2">Protect Your Income</div>
                        <p className="text-sm text-black mb-3">1 in 4 workers become disabled • Income replacement • Professional coverage</p>
                        <div className="flex items-center gap-2 text-xs text-orange-700">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Your income IS your wealth</span>
                        </div>
                      </motion.a>
                    </div>
                  </div>

                  {/* Financial Planning & Education */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="bg-purple-100 p-3 rounded-xl">
                        <GraduationCap className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-black">🎓 Financial Education & Planning</h4>
                        <p className="text-purple-700">Level up your financial knowledge - Knowledge is wealth!</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <motion.a
                        href="https://www.khanacademy.org/economics-finance-domain/core-finance"
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.02, y: -2 }}
                        className="bg-white p-4 rounded-lg border border-purple-200 hover:border-purple-400 transition-all cursor-pointer block"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="font-semibold text-black">Khan Academy Finance</h5>
                          <ExternalLink className="w-4 h-4 text-purple-600" />
                        </div>
                        <div className="text-lg font-bold text-purple-600 mb-2">Free Courses</div>
                        <p className="text-sm text-black mb-3">Personal finance • Investing • Economics</p>
                        <div className="flex items-center gap-2 text-xs text-purple-700">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Start with the basics</span>
                        </div>
                      </motion.a>

                      <motion.a
                        href="https://www.mint.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.02, y: -2 }}
                        className="bg-white p-4 rounded-lg border border-purple-200 hover:border-purple-400 transition-all cursor-pointer block"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="font-semibold text-black">Mint Budget Tracker</h5>
                          <ExternalLink className="w-4 h-4 text-purple-600" />
                        </div>
                        <div className="text-lg font-bold text-purple-600 mb-2">Free Budgeting</div>
                        <p className="text-sm text-black mb-3">Track spending • Set goals • Credit monitoring</p>
                        <div className="flex items-center gap-2 text-xs text-purple-700">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>See where your money goes</span>
                        </div>
                      </motion.a>

                      <motion.a
                        href="https://www.bogleheads.org/"
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.02, y: -2 }}
                        className="bg-white p-4 rounded-lg border border-purple-200 hover:border-purple-400 transition-all cursor-pointer block"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="font-semibold text-black">Bogleheads Community</h5>
                          <ExternalLink className="w-4 h-4 text-purple-600" />
                        </div>
                        <div className="text-lg font-bold text-purple-600 mb-2">Investment Philosophy</div>
                        <p className="text-sm text-black mb-3">Index investing • Long-term thinking • Community support</p>
                        <div className="flex items-center gap-2 text-xs text-purple-700">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Time-tested strategies</span>
                        </div>
                      </motion.a>
                    </div>
                  </div>

                  {/* Personalized Action Plan */}
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl border border-yellow-300">
                    <div className="text-center">
                      <Trophy className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
                      <h4 className="text-2xl font-bold text-black mb-3">🎯 Your Personalized Action Plan</h4>
                      <div className="max-w-3xl mx-auto space-y-4">
                        <div className="bg-white/70 p-4 rounded-lg border border-yellow-200">
                          <div className="flex items-start gap-3 text-left">
                            <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center font-bold">1</div>
                            <div>
                              <h5 className="font-semibold text-black">Emergency Fund First</h5>
                              <p className="text-sm text-black">Open a high-yield savings account and save {convertUSDPrice(1000)} for emergencies. Then work toward 3-6 months of expenses.</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-white/70 p-4 rounded-lg border border-yellow-200">
                          <div className="flex items-start gap-3 text-left">
                            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">2</div>
                            <div>
                              <h5 className="font-semibold text-black">Get Essential Insurance</h5>
                              <p className="text-sm text-black">Protect your income with health and disability insurance. Add life insurance if you have dependents.</p>
                  </div>
                </div>
              </div>

                        <div className="bg-white/70 p-4 rounded-lg border border-yellow-200">
                          <div className="flex items-start gap-3 text-left">
                            <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">3</div>
                            <div>
                              <h5 className="font-semibold text-black">Start Investing</h5>
                              <p className="text-sm text-black">Open an investment account and start with low-cost index funds. Automate your {formatAmount(savingsAmount)} monthly contribution.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            </motion.div>
          )}
      </AnimatePresence>
    </motion.div>
  );
} 
