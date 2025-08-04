"use client";

import { useState, useEffect } from "react";
import { useSupabase } from "@/hooks/useSupabase";
import { Button } from "@/components/ui/Button";
import { Loading } from "@/components/ui/Loading";
import { CountryFlag } from "@/components/ui/CountryFlag";
import { InsuranceAssessment } from "@/components/insurance/InsuranceAssessment";
import { SavingsCalculator } from "@/components/savings/SavingsCalculator";
import { FinancialAdvisor } from "@/components/advisor/FinancialAdvisor";
import { FIREGoals } from "@/components/fire/FIREGoals";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useCurrency } from "@/contexts/CurrencyContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  PiggyBank,
  Lightbulb,
  Rocket,
  ArrowRight,
  Calculator,
  Sun,
  Moon,
  Globe,
  TrendingUp,
  Shield,
  Target,
  DollarSign,
  BarChart3,
  Zap,
  BookOpen,
  Star,
  Trophy,
  Clock,
  ChevronDown,
  X
} from "lucide-react";

import {
  type Country,
  type GlobalAssessmentResult,
  type GlobalFinancialProfile,
  getSupportedCountries,
  formatCurrency
} from "@/lib/insurance-api";

export default function WishInsuredHome() {
  const { user, loading } = useSupabase();
  const [theme, setTheme] = useLocalStorage("theme", "light");
  const [activeTab, setActiveTab] = useState("overview");
  const { setHomeCountry } = useCurrency();
  
  // UI states for modular components
  const [isLoading, setIsLoading] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  
  // Modular component states
  const [showInsuranceAssessment, setShowInsuranceAssessment] = useState(false);
  const [showSavingsCalculator, setShowSavingsCalculator] = useState(false);
  const [showFinancialAdvisor, setShowFinancialAdvisor] = useState(false);
  const [showFIREGoals, setShowFIREGoals] = useState(false);

  // Global data states
  const [countries, setCountries] = useState<Record<string, Country>>({});
  const [selectedCountry, setSelectedCountry] = useState<string>("US");

  // Map UI country codes to currency service codes
  const mapToCurrencyCode = (countryCode: string): string => {
    const mapping: Record<string, string> = {
      'US': 'usa',
      'IN': 'india',
      'UK': 'uk',
      'CA': 'canada',
      'AU': 'australia',
      'DE': 'germany'
    };
    return mapping[countryCode] || countryCode.toLowerCase();
  };

  // Results and recommendations
  const [assessmentResult, setAssessmentResult] = useState<GlobalAssessmentResult | null>(null);

  // Load supported countries on component mount
  useEffect(() => {
    const loadCountries = async () => {
      try {
        const countriesData = await getSupportedCountries();
        setCountries(countriesData);
        // Initialize currency context with US as home country
        setHomeCountry(mapToCurrencyCode(selectedCountry));
      } catch (error) {
        console.error("Failed to load countries:", error);
      }
    };
    loadCountries();
  }, []);

  // Handle assessment completion
  const handleAssessmentComplete = (result: GlobalAssessmentResult) => {
    setAssessmentResult(result);
    setShowRecommendations(true);
    setShowSummary(true);
    setShowWelcome(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Loading />
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === "dark" 
        ? "bg-gradient-to-br from-gray-900 to-blue-900 text-white" 
        : "bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-900"
    }`}>
      <main className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {showWelcome && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
            >
              {/* Header */}
              <div className="text-center mb-12">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="mb-6"
                >
                  <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                    WishInsured
                  </h1>
                  <p className="text-xl md:text-2xl text-white max-w-3xl mx-auto">
                    Your Global Financial Intelligence Platform - 
                    Smart Insurance, Investment Planning & Wealth Building
                  </p>
                </motion.div>

                {/* Country Selector */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center justify-center gap-4 mb-8"
                >
                  <Globe className="w-6 h-6 text-blue-600" />
                  <span className="text-lg font-medium">Select your country:</span>
                  
                  <div className="relative">
                    <select
                      value={selectedCountry}
                      onChange={(e) => {
                        const newCountry = e.target.value;
                        setSelectedCountry(newCountry);
                        // Set as home country in currency context
                        setHomeCountry(mapToCurrencyCode(newCountry));
                      }}
                      className="appearance-none bg-white border border-gray-300 rounded-xl px-4 py-3 pr-10 text-lg font-medium text-gray-700 shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                    >
                      {Object.entries(countries)
                        .filter(([code, country]) => code && country?.name) // Filter out invalid entries
                        .map(([code, country]) => (
                        <option key={`country-option-${code}-${country.name.replace(/\s+/g, '')}`} value={code}>
                          {country.name} ({country.currency})
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>

                  {/* Selected Country Display */}
                  <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-3 shadow-lg">
                    <CountryFlag
                      countryCode={selectedCountry}
                      countryName={countries[selectedCountry]?.name}
                      size="lg"
                      className="shadow-sm"
                    />
                    <div className="text-left">
                      <div className="font-semibold text-gray-900">
                        {countries[selectedCountry]?.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {countries[selectedCountry]?.currency}
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Theme Toggle */}
                <button
                  onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                  className="mb-8 bg-white/20 backdrop-blur-sm rounded-full p-3 hover:bg-white/30 transition-all duration-300"
                >
                  {theme === "light" ? (
                    <Moon className="w-6 h-6 text-blue-600" />
                  ) : (
                    <Sun className="w-6 h-6 text-yellow-400" />
                  )}
                </button>
              </div>

              {/* Global Finance Tools */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {/* Insurance Assessment */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-100 hover:shadow-lg transition-all duration-300 flex flex-col h-full min-h-[320px]">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-blue-100 p-3 rounded-xl">
                      <Activity className="w-6 h-6 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                      Complete Analysis
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Insurance Assessment
                  </h3>
                  <p className="text-gray-600 mb-6 flex-grow leading-relaxed">
                    Get comprehensive insurance recommendations with {countries[selectedCountry]?.symbol} pricing, 
                    BMI analysis, and risk assessment.
                  </p>
                  <Button
                    onClick={() => setShowInsuranceAssessment(true)}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 mt-auto"
                  >
                    Start Assessment
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>

                {/* Savings Calculator */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-100 hover:shadow-lg transition-all duration-300 flex flex-col h-full min-h-[320px]">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-green-100 p-3 rounded-xl">
                      <PiggyBank className="w-6 h-6 text-green-600" />
                    </div>
                    <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
                      Projections
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Savings Calculator
                  </h3>
                  <p className="text-gray-600 mb-6 flex-grow leading-relaxed">
                    Calculate compound growth, investment returns, and wealth milestones 
                    in {countries[selectedCountry]?.currency}.
                  </p>
                  <Button
                    onClick={() => setShowSavingsCalculator(true)}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 mt-auto"
                  >
                    Calculate Returns
                    <Calculator className="w-4 h-4 ml-2" />
                  </Button>
                </div>

                {/* Financial Advisor */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-100 hover:shadow-lg transition-all duration-300 flex flex-col h-full min-h-[320px]">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-purple-100 p-3 rounded-xl">
                      <Lightbulb className="w-6 h-6 text-purple-600" />
                    </div>
                    <span className="text-sm font-medium text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                      AI Powered
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Smart Financial Advisor
                  </h3>
                  <p className="text-gray-600 mb-6 flex-grow leading-relaxed">
                    Get personalized financial advice, investment strategies, and 
                    wealth optimization tips for your goals.
                  </p>
                  <Button
                    onClick={() => setShowFinancialAdvisor(true)}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 mt-auto"
                  >
                    Get Smart Advice
                    <Lightbulb className="w-4 h-4 ml-2" />
                  </Button>
                </div>

                {/* FIRE Goals */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-100 hover:shadow-lg transition-all duration-300 flex flex-col h-full min-h-[320px]">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-orange-100 p-3 rounded-xl">
                      <Rocket className="w-6 h-6 text-orange-600" />
                    </div>
                    <span className="text-sm font-medium text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                      Independence
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    FIRE Goals
                  </h3>
                  <p className="text-gray-600 mb-6 flex-grow leading-relaxed">
                    Plan your path to Financial Independence Retire Early with goal tracking 
                    and milestone planning framework.
                  </p>
                  <Button
                    onClick={() => setShowFIREGoals(true)}
                    className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 mt-auto"
                  >
                    Plan FIRE Journey
                    <Rocket className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Results Display */}
          {assessmentResult && showRecommendations && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                      <CountryFlag 
                        countryCode={selectedCountry}
                        countryName={countries[selectedCountry]?.name}
                        size="lg"
                        className="shadow-sm"
                      />
                      <span>Assessment Results</span>
                    </h2>
                    <button
                      onClick={() => {
                        setShowRecommendations(false);
                        setShowSummary(false);
                        setShowWelcome(true);
                      }}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    {/* Display assessment results here */}
                    <div className="bg-blue-50 rounded-xl p-6">
                      <h3 className="text-xl font-semibold text-blue-900 mb-4">📊 Assessment Summary</h3>
                      <p className="text-blue-700">
                        Your comprehensive insurance assessment has been completed. 
                        Check your personalized recommendations below.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Modular Components */}
          <InsuranceAssessment
            isOpen={showInsuranceAssessment}
            onClose={() => setShowInsuranceAssessment(false)}
            onAssessmentComplete={handleAssessmentComplete}
          />

          <SavingsCalculator
            isOpen={showSavingsCalculator}
            onClose={() => setShowSavingsCalculator(false)}
          />

          <FinancialAdvisor
            isOpen={showFinancialAdvisor}
            onClose={() => setShowFinancialAdvisor(false)}
          />

          <FIREGoals
            isOpen={showFIREGoals}
            onClose={() => setShowFIREGoals(false)}
          />
        </AnimatePresence>
      </main>
    </div>
  );
}
