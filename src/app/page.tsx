"use client";

import { useState, useEffect } from "react";

import { Button } from "@/components/ui/Button";
import { CountryFlag } from "@/components/ui/CountryFlag";
import { InlineCountryFlag } from "@/components/ui/InlineCountryFlag";
import { FlyingCashBackground } from "@/components/ui/FlyingCashBackground";
import { TorchLightEffect } from "@/components/ui/TorchLightEffect";
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
  ChevronDown,
  X
} from "lucide-react";

import {
  type Country,
  type GlobalAssessmentResult
} from "@/lib/insurance-api";

export default function WishInsuredHome() {
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

  // Global data states with default fallback countries
  const [countries, setCountries] = useState<Record<string, Country>>({
    "US": {
      name: "United States",
      code: "US", 
      currency: "USD",
      symbol: "$",
      flag: "🇺🇸"
    },
    "IN": {
      name: "India",
      code: "IN",
      currency: "INR", 
      symbol: "₹",
      flag: "🇮🇳"
    },
    "UK": {
      name: "United Kingdom",
      code: "UK",
      currency: "GBP",
      symbol: "£", 
      flag: "🇬🇧"
    },
    "CA": {
      name: "Canada",
      code: "CA",
      currency: "CAD",
      symbol: "C$",
      flag: "🇨🇦"
    },
    "AU": {
      name: "Australia", 
      code: "AU",
      currency: "AUD",
      symbol: "A$",
      flag: "🇦🇺"
    },
    "DE": {
      name: "Germany",
      code: "DE",
      currency: "EUR",
      symbol: "€",
      flag: "🇩🇪"
    }
  });
  const [selectedCountry, setSelectedCountry] = useState<string>("US");
  
  // Debug logging
  console.log('WishInsuredHome rendered, selectedCountry:', selectedCountry);

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

  // Initialize currency context on mount
  useEffect(() => {
    console.log('Initializing currency context with:', selectedCountry);
    setHomeCountry(mapToCurrencyCode(selectedCountry));
  }, [selectedCountry, setHomeCountry]);

  // Handle assessment completion
  const handleAssessmentComplete = (result: GlobalAssessmentResult) => {
    setAssessmentResult(result);
    setShowRecommendations(true);
    setShowSummary(true);
    setShowWelcome(false);
  };

  // Don't block on Supabase loading for now - app should work without auth
  // if (loading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
  //       <Loading />
  //     </div>
  //   );
  // }

  return (
    <div className={`min-h-screen transition-colors duration-300 relative overflow-hidden ${
      theme === "dark" 
        ? "bg-gradient-to-br from-gray-900 to-blue-900 text-white" 
        : "bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-900"
    }`}>
      {/* Background Effects */}
      <FlyingCashBackground />
      <TorchLightEffect />
      
      <main className="container mx-auto px-4 py-8 relative z-10">
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
                  <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4 drop-shadow-lg">
                    WishInsured
                  </h1>
                  <p className="text-xl md:text-2xl text-gray-800 dark:text-white max-w-3xl mx-auto font-semibold drop-shadow-sm bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3">
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
                  <span className="text-xl font-bold text-black bg-white/90 px-4 py-2 rounded-lg shadow-lg border-2 border-blue-300">
                    Select your country: <small className="text-sm text-blue-600">(Current: {selectedCountry})</small>
                  </span>
                  
                  <div className="relative">
                    <select
                      value={selectedCountry}
                      onChange={(e) => {
                        const newCountry = e.target.value;
                        console.log('🏁 Country selected:', newCountry, 'Current selectedCountry:', selectedCountry);
                        setSelectedCountry(newCountry);
                        // Set as home country in currency context
                        setHomeCountry(mapToCurrencyCode(newCountry));
                        console.log('🌍 Updated selectedCountry to:', newCountry);
                      }}
                      className="appearance-none bg-white border-2 border-blue-300 rounded-xl px-4 py-3 pr-10 text-lg font-bold text-black shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer min-w-[250px]"
                      style={{ color: '#000000', backgroundColor: '#ffffff' }}
                    >
                      <option value="US" style={{ color: '#000000', backgroundColor: '#ffffff', padding: '8px' }}>
                        🇺🇸 United States (USD)
                      </option>
                      <option value="IN" style={{ color: '#000000', backgroundColor: '#ffffff', padding: '8px' }}>
                        🇮🇳 India (INR)
                      </option>
                      <option value="UK" style={{ color: '#000000', backgroundColor: '#ffffff', padding: '8px' }}>
                        🇬🇧 United Kingdom (GBP)
                      </option>
                      <option value="CA" style={{ color: '#000000', backgroundColor: '#ffffff', padding: '8px' }}>
                        🇨🇦 Canada (CAD)
                      </option>
                      <option value="AU" style={{ color: '#000000', backgroundColor: '#ffffff', padding: '8px' }}>
                        🇦🇺 Australia (AUD)
                      </option>
                      <option value="DE" style={{ color: '#000000', backgroundColor: '#ffffff', padding: '8px' }}>
                        🇩🇪 Germany (EUR)
                        </option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-600 pointer-events-none" />
                  </div>

                  {/* Selected Country Display */}
                  <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-lg border-2 border-blue-200 min-w-[220px]">
                    <div className="flex items-center justify-center w-16 h-16 bg-blue-50 rounded-xl relative border-2 border-blue-200">
                      <InlineCountryFlag 
                      countryCode={selectedCountry}
                        size={56}
                        className=""
                      />
                      {/* Debug info */}
                      <div className="absolute -bottom-1 -right-1 text-xs bg-green-600 text-white px-1 rounded text-[8px] font-bold">
                        {selectedCountry}
                      </div>
                    </div>
                    <div className="text-left min-w-[140px]">
                      <div className="font-bold text-black text-lg">
                        {selectedCountry === "US" && "United States"}
                        {selectedCountry === "IN" && "India"}
                        {selectedCountry === "UK" && "United Kingdom"}
                        {selectedCountry === "CA" && "Canada"}
                        {selectedCountry === "AU" && "Australia"}
                        {selectedCountry === "DE" && "Germany"}
                      </div>
                      <div className="text-base text-gray-700 font-semibold">
                        {selectedCountry === "US" && "USD ($)"}
                        {selectedCountry === "IN" && "INR (₹)"}
                        {selectedCountry === "UK" && "GBP (£)"}
                        {selectedCountry === "CA" && "CAD (C$)"}
                        {selectedCountry === "AU" && "AUD (A$)"}
                        {selectedCountry === "DE" && "EUR (€)"}
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
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch"
              >
                {/* Insurance Assessment */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-100 hover:shadow-lg transition-all duration-300 flex flex-col justify-between h-full">
                  <div className="flex-grow">
                    <div className="flex items-center justify-between mb-4 min-h-[48px]">
                      <div className="bg-blue-100 p-3 rounded-xl flex items-center justify-center w-12 h-12">
                      <Activity className="w-6 h-6 text-blue-600" />
                    </div>
                      <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full whitespace-nowrap">
                      Complete Analysis
                    </span>
                  </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 min-h-[56px] flex items-center">
                    Insurance Assessment
                  </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      Get comprehensive insurance recommendations with local currency pricing, 
                    BMI analysis, and risk assessment.
                  </p>
                  </div>
                  <Button
                    onClick={() => setShowInsuranceAssessment(true)}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    Start Assessment
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>

                {/* Savings Calculator */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-100 hover:shadow-lg transition-all duration-300 flex flex-col justify-between h-full">
                  <div className="flex-grow">
                    <div className="flex items-center justify-between mb-4 min-h-[48px]">
                      <div className="bg-green-100 p-3 rounded-xl flex items-center justify-center w-12 h-12">
                      <PiggyBank className="w-6 h-6 text-green-600" />
                    </div>
                      <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full whitespace-nowrap">
                      Projections
                    </span>
                  </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 min-h-[56px] flex items-center">
                    Savings Calculator
                  </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                    Calculate compound growth, investment returns, and wealth milestones 
                      in your local currency.
                  </p>
                  </div>
                  <Button
                    onClick={() => setShowSavingsCalculator(true)}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    Calculate Returns
                    <Calculator className="w-4 h-4 ml-2" />
                  </Button>
                </div>

                {/* Financial Advisor */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-100 hover:shadow-lg transition-all duration-300 flex flex-col justify-between h-full">
                  <div className="flex-grow">
                    <div className="flex items-center justify-between mb-4 min-h-[48px]">
                      <div className="bg-purple-100 p-3 rounded-xl flex items-center justify-center w-12 h-12">
                      <Lightbulb className="w-6 h-6 text-purple-600" />
                    </div>
                      <span className="text-sm font-medium text-purple-600 bg-purple-50 px-3 py-1 rounded-full whitespace-nowrap">
                      AI Powered
                    </span>
                  </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 min-h-[56px] flex items-center">
                    Smart Financial Advisor
                  </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                    Get personalized financial advice, investment strategies, and 
                    wealth optimization tips for your goals.
                  </p>
                  </div>
                  <Button
                    onClick={() => setShowFinancialAdvisor(true)}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    Get Smart Advice
                    <Lightbulb className="w-4 h-4 ml-2" />
                  </Button>
                </div>

                {/* FIRE Goals */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-100 hover:shadow-lg transition-all duration-300 flex flex-col justify-between h-full">
                  <div className="flex-grow">
                    <div className="flex items-center justify-between mb-4 min-h-[48px]">
                      <div className="bg-orange-100 p-3 rounded-xl flex items-center justify-center w-12 h-12">
                      <Rocket className="w-6 h-6 text-orange-600" />
                    </div>
                      <span className="text-sm font-medium text-orange-600 bg-orange-50 px-3 py-1 rounded-full whitespace-nowrap">
                      Independence
                    </span>
                  </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 min-h-[56px] flex items-center">
                    FIRE Goals
                  </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                    Plan your path to Financial Independence Retire Early with goal tracking 
                    and milestone planning framework.
                  </p>
                  </div>
                  <Button
                    onClick={() => setShowFIREGoals(true)}
                    className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
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
