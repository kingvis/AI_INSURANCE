"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { CountryFlag } from '@/components/ui/CountryFlag';
import { useCurrency, useCurrencyConverter } from '@/contexts/CurrencyContext';
import { 
  Rocket, Target, Trophy, Calendar, 
  DollarSign, TrendingUp, Calculator, X,
  CheckCircle, Clock, Zap
} from 'lucide-react';
import {
  type Country,
  type MotivationalContent,
  getMotivationalContent,
  calculateCompoundGrowth
} from '@/lib/insurance-api';

interface FIREGoalsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FIREGoals({
  isOpen,
  onClose
}: FIREGoalsProps) {
  // Currency context integration
  const { homeCountry, homeCurrency, formatHomeAmount, convertToComparison, refreshRates } = useCurrency();
  const { format, symbol } = useCurrencyConverter();

  const [isLoading, setIsLoading] = useState(false);
  const [motivationalContent, setMotivationalContent] = useState<MotivationalContent | null>(null);
  const [fireData, setFireData] = useState({
    current_age: 30,
    target_age: 50,
    current_net_worth: 50000,
    target_net_worth: 1000000,
    monthly_savings: 2000,
    expected_return: 7
  });

  // Refresh currency rates when FIRE Goals opens
  useEffect(() => {
    if (isOpen) {
      refreshRates().then(() => {
        console.log('🔄 Currency rates refreshed for FIRE Goals');
        console.log('💱 Current country:', homeCountry, homeCurrency?.code, homeCurrency?.symbol);
      });
    }
  }, [isOpen, homeCountry]);

  const generatePersonalizedFIREContent = (fireData: any, homeCountry: string): MotivationalContent => {
    const yearsToFIRE = fireData.target_age - fireData.current_age;
    const monthlyIncome = (fireData.target_net_worth * 0.04) / 12; // 4% rule monthly income
    const currentProgress = (fireData.current_net_worth / fireData.target_net_worth) * 100;
    const totalSavingsNeeded = fireData.target_net_worth - fireData.current_net_worth;
    const annualSavings = fireData.monthly_savings * 12;
    const currencySymbol = homeCountry ? (homeCountry === 'US' ? '$' : '€') : '$'; // Use homeCountry from context
    
    // Determine user's FIRE profile
    const isEarlyStarter = fireData.current_age < 30;
    const isAggressiveSaver = (annualSavings / 50000) > 0.5; // Assuming 50k average income
    const isHighNetWorth = fireData.target_net_worth >= 2000000;
    const isFastTracker = yearsToFIRE < 15;
    
    // Generate personalized success stories based on user profile
    const generateSuccessStories = () => {
      const stories = [];
      
      if (isEarlyStarter) {
        stories.push({
          scenario: `${fireData.current_age}-year-old starts FIRE journey`,
          description: `Started at ${fireData.current_age} with ${currencySymbol} ${fireData.current_net_worth} and reached ${currencySymbol} ${fireData.target_net_worth} by age ${fireData.target_age}`,
          lesson: "Starting young is your superpower - compound interest becomes your best friend!"
        });
      }
      
      if (isAggressiveSaver) {
        stories.push({
          scenario: "High Savings Rate Success",
          description: `By saving ${currencySymbol} ${fireData.monthly_savings} monthly (${currencySymbol} ${annualSavings}/year), they accelerated their timeline significantly`,
          lesson: "Your savings rate matters more than your salary - every extra dollar saved is a day closer to FIRE!"
        });
      }
      
      if (isFastTracker) {
        stories.push({
          scenario: `${yearsToFIRE}-Year FIRE Achievement`,
          description: `Aggressive but achievable plan to reach financial independence in just ${yearsToFIRE} years through focused investing and lifestyle optimization`,
          lesson: "Fast FIRE requires discipline, but the freedom it brings is worth every sacrifice!"
        });
      } else {
        stories.push({
          scenario: "Steady and Sustainable Path",
          description: `Taking a ${yearsToFIRE}-year approach allows for balanced living while building wealth consistently`,
          lesson: "Slow and steady wins the race - sustainable habits create lasting wealth!"
        });
      }
      
      return stories;
    };
    
    // Generate personalized daily motivation based on user's situation
    const generateDailyMotivation = () => {
      const motivations = [];
      
      if (currentProgress < 10) {
        motivations.push(`You're ${currentProgress.toFixed(1)}% toward your FIRE goal - every journey starts with a single step!`);
        motivations.push(`Each ${currencySymbol} ${fireData.monthly_savings} you save brings you ${(fireData.monthly_savings / fireData.target_net_worth * 100).toFixed(3)}% closer to freedom!`);
      } else if (currentProgress < 50) {
        motivations.push(`Amazing! You're ${currentProgress.toFixed(1)}% of the way there - momentum is building!`);
        motivations.push(`You've already built ${currencySymbol} ${fireData.current_net_worth} - that's real wealth!`);
      } else {
        motivations.push(`Incredible! You're ${currentProgress.toFixed(1)}% there - FIRE is within reach!`);
        motivations.push(`Just ${currencySymbol} ${totalSavingsNeeded} more to go - you can almost taste the freedom!`);
      }
      
      motivations.push(`At ${fireData.current_age}, you have ${yearsToFIRE} years to perfect your financial strategy`);
      motivations.push(`Your future self will thank you for every dollar you invest today`);
      motivations.push(`${currencySymbol} ${monthlyIncome} monthly passive income awaits you at FIRE!`);
      
      if (isEarlyStarter) {
        motivations.push("Starting in your 20s gives you a 10-20 year advantage over most people!");
      }
      
      if (isHighNetWorth) {
        motivations.push("Your high FIRE target means you're planning for true financial abundance!");
      }
      
      return motivations;
    };
    
    // Generate personalized action steps
    const generateActionSteps = () => {
      const steps = [];
      
      // Always include these foundational steps
      steps.push(`Open a high-yield savings account earning 4%+ APY for your ${currencySymbol} ${fireData.current_net_worth} emergency fund`);
      
      if (fireData.monthly_savings < 1000) {
        steps.push("Increase your monthly savings by $500 through expense optimization and side income");
      } else if (fireData.monthly_savings < 3000) {
        steps.push(`Maximize your savings rate - aim for ${currencySymbol} ${fireData.monthly_savings * 1.2} monthly`);
      } else {
        steps.push("Focus on investment optimization and tax-efficient accounts");
      }
      
      if (yearsToFIRE > 20) {
        steps.push("Invest in growth-focused index funds (80% stocks, 20% bonds) for long-term wealth building");
      } else if (yearsToFIRE > 10) {
        steps.push("Balance growth and stability (70% stocks, 30% bonds) as you approach FIRE");
      } else {
        steps.push("Gradually shift to more conservative investments (60% stocks, 40% bonds) as FIRE approaches");
      }
      
      steps.push("Automate your investments - set up automatic transfers on payday");
      steps.push(`Track your progress monthly - celebrate each ${currencySymbol} ${fireData.target_net_worth * 0.1} milestone!`);
      
      if (currentProgress < 25) {
        steps.push("Focus on building your emergency fund to 6 months of expenses first");
      }
      
      if (isAggressiveSaver) {
        steps.push("Consider house hacking or real estate investment to accelerate wealth building");
      }
      
      steps.push(`Plan your post-FIRE life - what will you do with ${currencySymbol} ${monthlyIncome} monthly passive income?`);
      
      return steps;
    };
    
    return {
      wealth_potential: {
        retirement_fund: fireData.target_net_worth,
        monthly_passive_income: monthlyIncome,
        currency: homeCountry ? (homeCountry === 'US' ? 'USD' : 'EUR') : 'USD', // Use homeCountry from context
        symbol: currencySymbol
      },
      success_stories: generateSuccessStories(),
      daily_motivation: generateDailyMotivation(),
      action_steps: generateActionSteps()
    };
  };

  const handleCalculateFIRE = async () => {
    setIsLoading(true);
    
    // Simulate loading time for better UX
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      // Generate personalized content based on user's actual data
      const personalizedContent = generatePersonalizedFIREContent(fireData, homeCountry);
      setMotivationalContent(personalizedContent);
    } catch (error) {
      console.error('FIRE calculation failed:', error);
      alert('Sorry, unable to calculate FIRE goals right now. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetFIRE = () => {
    setMotivationalContent(null);
    setFireData({
      current_age: 30,
      target_age: 50,
      current_net_worth: 50000,
      target_net_worth: 1000000,
      monthly_savings: 2000,
      expected_return: 7
    });
  };

  // Calculate FIRE metrics
  const yearsToFIRE = fireData.target_age - fireData.current_age;
  const monthsToFIRE = yearsToFIRE * 12;
  const projectedValue = calculateCompoundGrowth(
    fireData.current_net_worth,
    fireData.monthly_savings,
    fireData.expected_return / 100,
    yearsToFIRE
  );
  const shortfall = Math.max(0, fireData.target_net_worth - projectedValue);
  const onTrack = projectedValue >= fireData.target_net_worth;

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
        <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <CountryFlag 
                countryCode={homeCountry}
                countryName={homeCountry ? (homeCountry === 'US' ? 'United States' : 'Germany') : ''}
                size="lg"
                className="shadow-lg"
              />
              <div>
                <h2 className="text-2xl font-bold">FIRE Goals</h2>
                <p className="text-orange-100">
                  Financial Independence Retire Early in {homeCountry ? (homeCountry === 'US' ? 'United States' : 'Germany') : ''}
                </p>
              </div>
            </div>
            <Button
              onClick={onClose}
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-orange-600"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {!motivationalContent ? (
            // Input Form
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="text-center mb-8">
                <div className="bg-orange-100 p-4 rounded-xl mx-auto w-fit mb-4">
                  <Rocket className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">🎯 Plan Your Financial Independence Journey</h3>
                <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                  Let's create a personalized roadmap to help you achieve Financial Independence and Retire Early (FIRE). 
                  Each question helps us understand your unique situation and goals.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Section */}
                <div className="space-y-6">
                  {/* Age Section */}
                  <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                    <div className="flex items-center gap-3 mb-4">
                      <Calendar className="w-6 h-6 text-blue-600" />
                      <h4 className="text-lg font-semibold text-blue-900">📅 Your Age Timeline</h4>
                    </div>
                    <p className="text-blue-700 mb-4 text-sm">
                      Age is crucial for FIRE planning because it determines how long your money has to grow through compound interest. 
                      The earlier you start, the less you need to save monthly!
                    </p>
                    
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                          🎂 Current Age
                      </label>
                      <input
                        type="number"
                        value={fireData.current_age}
                        onChange={(e) => setFireData(prev => ({
                          ...prev,
                          current_age: parseInt(e.target.value) || 0
                        }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 bg-white"
                        min="18"
                        max="100"
                          placeholder="Your current age"
                        />
                        {fireData.current_age > 0 && (
                          <p className="text-xs text-blue-600 mt-1">
                            {fireData.current_age < 25 ? "Perfect! Starting young gives you a huge advantage! 🚀" : 
                             fireData.current_age < 35 ? "Great timing! You still have decades for compound growth! 💪" : 
                             fireData.current_age < 45 ? "Good choice! It's never too late to start your FIRE journey! ⭐" : 
                             "Excellent! Even starting later, you can still achieve financial independence! 🎯"}
                          </p>
                        )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                          🎯 Target FIRE Age
                      </label>
                      <input
                        type="number"
                        value={fireData.target_age}
                        onChange={(e) => setFireData(prev => ({
                          ...prev,
                          target_age: parseInt(e.target.value) || 0
                        }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 bg-white"
                        min={fireData.current_age + 1}
                        max="100"
                          placeholder="When to achieve FIRE"
                        />
                        {fireData.target_age > fireData.current_age && (
                          <p className="text-xs text-green-600 mt-1">
                            {yearsToFIRE} years to build your financial independence! 
                            {yearsToFIRE < 10 ? " Aggressive goal! 🔥" : 
                             yearsToFIRE < 20 ? " Solid timeline! 💯" : 
                             " Conservative and achievable! 🎯"}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Net Worth Section */}
                  <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-6 h-6 text-green-600 font-bold flex items-center justify-center text-lg">
                        {homeCurrency?.symbol || '$'}
                      </div>
                      <h4 className="text-lg font-semibold text-green-900">💰 Your Wealth Goals</h4>
                    </div>
                    <p className="text-green-700 mb-4 text-sm">
                      Net worth is your total assets minus debts. Your FIRE target should cover 25x your annual expenses 
                      (the 4% rule), allowing you to withdraw 4% annually without depleting your savings.
                    </p>

                    <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        💼 Current Net Worth ({homeCurrency?.symbol})
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 font-semibold flex items-center justify-center">
                        {homeCurrency?.symbol || '$'}
                      </div>
                      <input
                        type="number"
                        value={fireData.current_net_worth}
                        onChange={(e) => setFireData(prev => ({
                          ...prev,
                          current_net_worth: parseInt(e.target.value) || 0
                        }))}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 bg-white"
                        min="0"

                      />
                    </div>
                      {fireData.current_net_worth > 0 && (
                        <p className="text-xs text-green-600 mt-1">
                          {fireData.current_net_worth < 10000 ? "Every journey starts with a single step! Keep building! 🌱" : 
                           fireData.current_net_worth < 100000 ? "Great foundation! You're building real wealth! 💪" : 
                           fireData.current_net_worth < 500000 ? "Impressive progress! You're well on your way! 🚀" : 
                           "Outstanding! You're already building serious wealth! 🏆"}
                        </p>
                      )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        🎯 Target Net Worth ({homeCurrency?.symbol})
                    </label>
                    <div className="relative">
                      <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        value={fireData.target_net_worth}
                        onChange={(e) => setFireData(prev => ({
                          ...prev,
                          target_net_worth: parseInt(e.target.value) || 0
                        }))}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 bg-white"
                        min={fireData.current_net_worth}
                          placeholder="Your FIRE number goal"
                        />
                      </div>
                      {fireData.target_net_worth > 0 && (
                        <p className="text-xs text-orange-600 mt-1">
                          This could support {(() => {
                            // Convert 4% rule amount to current currency
                            const usdAmount = fireData.target_net_worth * 0.04;
                            const convertedAmount = homeCurrency?.code === 'USD' 
                              ? usdAmount 
                              : convertToComparison();
                            return formatHomeAmount(convertedAmount);
                          })()} 
                          annual spending using the 4% rule! 
                          {fireData.target_net_worth >= 1000000 ? " 🎖️ Millionaire goal!" : 
                           fireData.target_net_worth >= 500000 ? " 🏅 Half-million target!" : 
                           " 💯 Building toward freedom!"}
                        </p>
                      )}
                  </div>
                    </div>
                  </div>

                  {/* Savings & Investment Section */}
                  <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
                    <div className="flex items-center gap-3 mb-4">
                      <TrendingUp className="w-6 h-6 text-purple-600" />
                      <h4 className="text-lg font-semibold text-purple-900">📈 Your Investment Strategy</h4>
                    </div>
                    <p className="text-purple-700 mb-4 text-sm">
                      Consistent monthly savings and realistic return expectations are the foundation of FIRE. 
                      Higher savings rates matter more than perfect market timing!
                    </p>

                    <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                          💪 Monthly Savings ({homeCurrency?.symbol})
                    </label>
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 font-semibold flex items-center justify-center">
                          {homeCurrency?.symbol || '$'}
                        </div>
                      <input
                        type="number"
                        value={fireData.monthly_savings}
                        onChange={(e) => setFireData(prev => ({
                          ...prev,
                          monthly_savings: parseInt(e.target.value) || 0
                        }))}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 bg-white"
                        min="0"
                            placeholder="How much you save monthly"
                      />
                    </div>
                      {fireData.monthly_savings > 0 && (
                        <p className="text-xs text-purple-600 mt-1">
                          That's {(() => {
                            // Convert annual savings to current currency
                            const usdAmount = fireData.monthly_savings * 12;
                            const convertedAmount = homeCurrency?.code === 'USD' 
                              ? usdAmount 
                              : convertToComparison();
                            return formatHomeAmount(convertedAmount);
                          })()} per year! 
                          {fireData.monthly_savings < 500 ? " Every dollar counts - keep it up! 🌟" : 
                           fireData.monthly_savings < 2000 ? " Strong savings habit! 💪" : 
                           fireData.monthly_savings < 5000 ? " Impressive savings rate! 🚀" : 
                           " Amazing! You're a savings superstar! 🏆"}
                        </p>
                      )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                          📊 Expected Annual Return (%)
                    </label>
                    <div className="relative">
                      <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="number"
                        value={fireData.expected_return}
                        onChange={(e) => setFireData(prev => ({
                          ...prev,
                          expected_return: parseFloat(e.target.value) || 0
                        }))}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 bg-white"
                        min="0"
                        max="20"
                        step="0.1"
                            placeholder="Expected investment returns"
                          />
                        </div>
                        {fireData.expected_return > 0 && (
                          <p className="text-xs text-blue-600 mt-1">
                            {fireData.expected_return < 5 ? "Conservative approach - safer but slower growth 🛡️" : 
                             fireData.expected_return < 8 ? "Realistic expectation based on historical market averages! 📈" : 
                             fireData.expected_return < 12 ? "Optimistic but possible with good stock market exposure 🎯" : 
                             "Very aggressive - consider if this is sustainable long-term ⚠️"}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preview Section */}
                <div className="space-y-4">
                  <div className="bg-orange-50 p-6 rounded-xl">
                    <h4 className="font-semibold text-orange-900 mb-4 flex items-center gap-2">
                      <Calculator className="w-5 h-5" />
                      FIRE Preview
                    </h4>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-orange-700">Years to FIRE:</span>
                        <span className="font-bold text-orange-900 text-lg">
                          {yearsToFIRE} years
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-orange-700">Projected Value:</span>
                        <span className="font-bold text-orange-900">
                          {(() => {
                            // Convert USD projected value to current currency
                            const usdAmount = projectedValue;
                            const convertedAmount = homeCurrency?.code === 'USD' 
                              ? usdAmount 
                              : convertToComparison();
                            console.log(`🔥 Projected Value: $${usdAmount} USD → ${formatHomeAmount(convertedAmount)} (${homeCountry})`);
                            return formatHomeAmount(convertedAmount);
                          })()}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-orange-700">Target:</span>
                        <span className="font-bold text-orange-900">
                          {(() => {
                            // Convert USD target to current currency
                            const usdAmount = fireData.target_net_worth;
                            const convertedAmount = homeCurrency?.code === 'USD' 
                              ? usdAmount 
                              : convertToComparison();
                            console.log(`🎯 Target: $${usdAmount} USD → ${formatHomeAmount(convertedAmount)} (${homeCountry})`);
                            return formatHomeAmount(convertedAmount);
                          })()}
                        </span>
                      </div>

                      <hr className="border-orange-200" />

                      <div className={`p-4 rounded-lg ${onTrack ? 'bg-green-100' : 'bg-red-100'}`}>
                        <div className="flex items-center gap-2">
                          {onTrack ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <Clock className="w-5 h-5 text-red-600" />
                          )}
                          <span className={`font-semibold ${onTrack ? 'text-green-900' : 'text-red-900'}`}>
                            {onTrack ? 'On Track!' : 'Need Adjustment'}
                          </span>
                        </div>
                        <p className={`text-sm mt-1 ${onTrack ? 'text-green-700' : 'text-red-700'}`}>
                          {onTrack 
                            ? 'You\'re on track to reach your FIRE goal!'
                            : `You need an additional ${symbol} ${shortfall.toFixed(0)} to reach your goal.`
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-6 rounded-xl">
                    <h4 className="font-semibold text-blue-900 mb-4">Quick Tips</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <Zap className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                        <p className="text-blue-700">Start early - compound interest is powerful</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <Zap className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                        <p className="text-blue-700">Increase savings rate to accelerate FIRE</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <Zap className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                        <p className="text-blue-700">Diversify investments for steady returns</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>


            </motion.div>
          ) : (
            // Results Display
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-orange-100 p-3 rounded-xl">
                    <Trophy className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Your FIRE Journey</h3>
                    <p className="text-gray-600">Motivational content and milestones for {homeCountry ? (homeCountry === 'US' ? 'United States' : 'Germany') : ''}</p>
                  </div>
                </div>
                <Button
                  onClick={resetFIRE}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Calculator className="w-4 h-4" />
                  New Calculation
                </Button>
              </div>



              {/* Interactive Progress Tracking */}
              <div className="bg-purple-50 p-6 rounded-xl">
                <h4 className="font-semibold text-purple-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  🎯 Your FIRE Progress Dashboard
                </h4>
                
                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-purple-700 font-medium">Progress to FIRE Goal</span>
                    <span className="text-purple-900 font-bold">
                      {((fireData.current_net_worth / fireData.target_net_worth) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-purple-200 rounded-full h-4 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${((fireData.current_net_worth / fireData.target_net_worth) * 100)}%` }}
                      transition={{ duration: 2, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full relative"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                    </motion.div>
                  </div>
                  <p className="text-sm text-purple-600 mt-2">
                    {(() => {
                      // Convert current net worth from USD to current currency
                      const currentUSD = fireData.current_net_worth;
                      const currentConverted = homeCurrency?.code === 'USD' 
                        ? currentUSD 
                        : convertToComparison();
                      
                      // Convert target from USD to current currency  
                      const targetUSD = fireData.target_net_worth;
                      const targetConverted = homeCurrency?.code === 'USD' 
                        ? targetUSD 
                        : convertToComparison();
                      
                      console.log(`🔥 Progress: $${currentUSD} USD → ${formatHomeAmount(currentConverted)} of $${targetUSD} USD → ${formatHomeAmount(targetConverted)} (${homeCountry})`);
                      return `${formatHomeAmount(currentConverted)} of ${formatHomeAmount(targetConverted)}`;
                    })()}
                  </p>
                </div>

                {/* Interactive Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center p-4 bg-white rounded-lg border border-purple-200 hover:shadow-lg transition-all cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                  >
                    <motion.div
                      animate={{ 
                        rotate: [0, 360],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ 
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-2"
                    >
                      <Clock className="w-6 h-6 text-white" />
                    </motion.div>
                    <p className="text-purple-700 text-sm font-medium">Years Remaining</p>
                    <p className="text-2xl font-bold text-purple-900">{yearsToFIRE}</p>
                    <p className="text-xs text-purple-600">
                      {yearsToFIRE < 10 ? "🔥 Fast track!" : 
                       yearsToFIRE < 20 ? "💪 Strong pace!" : "🎯 Steady path!"}
                    </p>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gradient-to-br from-purple-100 to-pink-100 p-4 rounded-xl text-center"
                  >
                    <p className="text-purple-700 text-sm font-medium">Monthly Savings Power</p>
                    <p className="text-2xl font-bold text-purple-900">
                      {(() => {
                        // Convert monthly savings from USD to current currency
                        const usdAmount = fireData.monthly_savings;
                        const convertedAmount = homeCurrency?.code === 'USD' 
                          ? usdAmount 
                          : convertToComparison();
                        console.log(`💰 Monthly Savings: $${usdAmount} USD → ${formatHomeAmount(convertedAmount)} (${homeCountry})`);
                        return formatHomeAmount(convertedAmount);
                      })()}
                    </p>
                    <p className="text-xs text-purple-600">
                      {(() => {
                        // Convert annual savings from USD to current currency
                        const usdAmount = fireData.monthly_savings * 12;
                        const convertedAmount = homeCurrency?.code === 'USD' 
                          ? usdAmount 
                          : convertToComparison();
                        return `${formatHomeAmount(convertedAmount)} per year`;
                      })()}
                    </p>
                  </motion.div>

                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="bg-gradient-to-br from-orange-100 to-red-100 p-4 rounded-xl text-center"
                  >
                    <p className="text-purple-700 text-sm font-medium">Freedom Income</p>
                    <p className="text-2xl font-bold text-purple-900">
                      {(() => {
                        // Convert monthly passive income from USD to current currency
                        const usdAmount = fireData.target_net_worth * 0.04 / 12;
                        const convertedAmount = homeCurrency?.code === 'USD' 
                          ? usdAmount 
                          : convertToComparison();
                        console.log(`🏖️ Freedom Income: $${usdAmount} USD → ${formatHomeAmount(convertedAmount)} (${homeCountry})`);
                        return formatHomeAmount(convertedAmount);
                      })()}
                    </p>
                    <p className="text-xs text-purple-600">Monthly passive income at FIRE</p>
                  </motion.div>
                </div>

                {/* Milestone Celebration */}
                {((fireData.current_net_worth / fireData.target_net_worth) * 100) >= 25 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-yellow-100 to-orange-100 p-4 rounded-lg border border-yellow-300 mb-4"
                  >
                    <div className="flex items-center gap-3">
                      <motion.div
                        animate={{ 
                          rotate: [0, 360],
                          scale: [1, 1.3, 1]
                        }}
                        transition={{ 
                          duration: 1,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        🎉
                      </motion.div>
                      <div>
                        <h5 className="font-bold text-yellow-900">Milestone Achievement!</h5>
                        <p className="text-yellow-800 text-sm">
                          You've reached {((fireData.current_net_worth / fireData.target_net_worth) * 100).toFixed(0)}% of your FIRE goal! 
                          Keep up the amazing momentum!
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Interactive Timeline */}
                <div className="bg-white p-4 rounded-lg border border-purple-200">
                  <h5 className="font-semibold text-purple-900 mb-3">🗓️ Your FIRE Timeline</h5>
                  <div className="space-y-3">
                    {[0.25, 0.5, 0.75, 1.0].map((milestone, index) => {
                      const targetYear = new Date().getFullYear() + Math.round(yearsToFIRE * milestone);
                      const targetAge = fireData.current_age + Math.round(yearsToFIRE * milestone);
                      const targetAmount = fireData.target_net_worth * milestone;
                      const isAchieved = fireData.current_net_worth >= targetAmount;
                      
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.2 }}
                          className={`flex items-center gap-3 p-3 rounded-lg ${
                            isAchieved ? 'bg-green-100 border border-green-300' : 'bg-gray-50 border border-gray-200'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            isAchieved ? 'bg-green-500' : 'bg-gray-300'
                          }`}>
                            {isAchieved ? (
                              <CheckCircle className="w-5 h-5 text-white" />
                            ) : (
                              <span className="text-white font-bold text-sm">{index + 1}</span>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className={`font-medium ${isAchieved ? 'text-green-900' : 'text-gray-700'}`}>
                              {milestone === 1.0 ? '🎯 FIRE Achievement!' : `Milestone ${Math.round(milestone * 100)}%`}
                            </p>
                            <p className={`text-sm ${isAchieved ? 'text-green-700' : 'text-gray-600'}`}>
                              {targetYear} (Age {targetAge}) - {symbol} {targetAmount.toFixed(0)}
                            </p>
                          </div>
                          {isAchieved && (
                            <motion.div
                              animate={{ rotate: [0, 360] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              🏆
                            </motion.div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Wealth Potential */}
              {motivationalContent.wealth_potential && (
                <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-6 rounded-xl border border-orange-200">
                  <h4 className="font-semibold text-orange-900 mb-3 flex items-center gap-2">
                    <Rocket className="w-5 h-5" />
                    Your Wealth Potential
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-white rounded-lg">
                      <p className="text-sm text-orange-700">Projected Retirement Fund</p>
                      <p className="text-2xl font-bold text-orange-900">
                        {symbol} {motivationalContent.wealth_potential.retirement_fund.toFixed(0)}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg">
                      <p className="text-sm text-orange-700">Monthly Passive Income</p>
                      <p className="text-2xl font-bold text-orange-900">
                        {symbol} {motivationalContent.wealth_potential.monthly_passive_income.toFixed(0)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Success Stories */}
              {motivationalContent.success_stories && motivationalContent.success_stories.length > 0 && (
                <div className="bg-blue-50 p-6 rounded-xl">
                  <h4 className="font-semibold text-blue-900 mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Success Stories & Lessons
                  </h4>
                  <div className="space-y-3">
                    {motivationalContent.success_stories.map((story, index) => (
                      <div key={index} className="flex items-start gap-3 p-4 bg-white rounded-lg border border-blue-200">
                        <div className="bg-blue-100 p-2 rounded-full">
                          <CheckCircle className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-semibold text-blue-900">{story.scenario}</h5>
                          <p className="text-blue-700 text-sm mb-2">{story.description}</p>
                          <p className="text-blue-600 text-xs italic">💡 {story.lesson}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Daily Motivation */}
              {motivationalContent.daily_motivation && motivationalContent.daily_motivation.length > 0 && (
                <div className="bg-green-50 p-6 rounded-xl">
                  <h4 className="font-semibold text-green-900 mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Daily Motivation
                  </h4>
                  <div className="space-y-2">
                    {motivationalContent.daily_motivation.map((motivation, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                        <p className="text-green-700">{motivation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Steps */}
              {motivationalContent.action_steps && motivationalContent.action_steps.length > 0 && (
              <div className="bg-purple-50 p-6 rounded-xl">
                <h4 className="font-semibold text-purple-900 mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Your Action Steps
                </h4>
                  <div className="space-y-2">
                    {motivationalContent.action_steps.map((step, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="bg-purple-100 p-1 rounded-full">
                          <span className="text-xs font-bold text-purple-600 px-2">{index + 1}</span>
                  </div>
                        <p className="text-purple-700">{step}</p>
                  </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Fixed Navigation Footer */}
        {!motivationalContent && (
          <div className="flex-shrink-0 border-t border-gray-200 bg-gray-50 px-6 py-4">
            <div className="flex justify-center">
              <Button
                onClick={handleCalculateFIRE}
                disabled={isLoading || fireData.target_age <= fireData.current_age}
                className="bg-orange-600 hover:bg-orange-700 text-white py-3 px-8 text-lg font-semibold min-w-[200px]"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Rocket className="w-5 h-5" />
                    </motion.div>
                    "Calculating Your FIRE Journey..."
                  </div>
                ) : (
                  <>
                    <Rocket className="w-5 h-5 mr-2" />
                    Calculate My FIRE Plan
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {motivationalContent && (
          <div className="flex-shrink-0 border-t border-gray-200 bg-gradient-to-r from-orange-50 to-yellow-50 px-6 py-4">
            <div className="flex justify-center gap-4">
              <Button
                onClick={resetFIRE}
                variant="outline"
                className="flex items-center gap-2 border-orange-300 text-orange-700 hover:bg-orange-100"
              >
                <Calculator className="w-4 h-4" />
                New Calculation
              </Button>
              <Button
                onClick={() => {
                  // Simulate sharing functionality
                  if (navigator.share) {
                    navigator.share({
                      title: 'My FIRE Journey Plan',
                      text: `I'm planning to achieve Financial Independence by age ${fireData.target_age} with ${symbol} ${fireData.target_net_worth.toFixed(0)}!`,
                      url: window.location.href
                    });
                  } else {
                    // Fallback to clipboard
                    navigator.clipboard.writeText(`My FIRE Journey: Achieving ${symbol} ${fireData.target_net_worth.toFixed(0)} by age ${fireData.target_age}!`);
                    alert('FIRE plan copied to clipboard!');
                  }
                }}
                className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white"
              >
                <Trophy className="w-4 h-4" />
                Share My Plan
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
} 
