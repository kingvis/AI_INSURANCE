"use client";

import { useState, useEffect } from "react";
import { useSupabase } from "@/hooks/useSupabase";
import AuthWrapper from "@/components/auth/AuthWrapper";
import { Button } from "@/components/ui/Button";
import { Loading } from "@/components/ui/Loading";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, Heart, Home, DollarSign, FileText, Car, Briefcase, Users,
  ChevronRight, CheckCircle, AlertTriangle, TrendingUp, Calculator,
  Target, PiggyBank, Globe, BookOpen, Award, ArrowRight, Lightbulb,
  Clock, Trophy, Star, Zap, BarChart3, Activity, Rocket
} from "lucide-react";

import {
  getSupportedCountries,
  getComprehensiveGlobalAssessment,
  calculateSavingsProjection,
  getFinancialAdvice,
  getMotivationalContent,
  getCountryPolicies,
  formatCurrency,
  formatPremium,
  formatPercentage,
  getRiskColor,
  getPriorityColor,
  getCountryFlag,
  getWealthMilestoneMessage,
  calculateCompoundGrowth,
  type GlobalHealthProfile,
  type GlobalPropertyProfile,
  type GlobalFinancialProfile,
  type Country,
  type GlobalAssessmentResult,
  type SavingsProjection,
  type FinancialAdvice,
  type MotivationalContent,
  type CountryPolicies
} from "@/lib/insurance-api";

// Enhanced interfaces for global features
interface HealthData extends GlobalHealthProfile {}
interface PropertyData extends GlobalPropertyProfile {}
interface FinancialData extends GlobalFinancialProfile {}

export default function WishInsuredHome() {
  const { user, loading } = useSupabase();
  const [theme, setTheme] = useLocalStorage("theme", "light");
  const [activeTab, setActiveTab] = useState("overview");
  
  // Multi-step form and UI states
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showSavingsCalculator, setShowSavingsCalculator] = useState(false);
  const [showFinancialAdvice, setShowFinancialAdvice] = useState(false);
  const [showMotivationalContent, setShowMotivationalContent] = useState(false);
  const [showPolicyGuide, setShowPolicyGuide] = useState(false);

  // Global finance data states
  const [countries, setCountries] = useState<Record<string, Country>>({});
  const [selectedCountry, setSelectedCountry] = useState<string>("US");
  const [healthData, setHealthData] = useState<HealthData>({
    age: 30,
    height: 170,
    weight: 70,
    gender: "male",
    smoking: false,
    drinking: "never",
    exercise_frequency: "moderate",
    medical_conditions: [],
    family_history: [],
    country: "US"
  });

  const [propertyData, setPropertyData] = useState<PropertyData>({
    property_type: "single-family",
    value: 300000,
    year_built: 2010,
    security_features: [],
    location_risk: "low",
    previous_claims: 0,
    country: "US"
  });

  const [financialData, setFinancialData] = useState<FinancialData>({
    annual_income: 75000,
    current_savings: 15000,
    dependents: 0,
    employment_type: "employed",
    existing_insurance: [],
    risk_tolerance: "moderate",
    financial_goals: [],
    country: "US",
    emergency_fund: 5000
  });

  // Results and recommendations
  const [assessmentResult, setAssessmentResult] = useState<GlobalAssessmentResult | null>(null);
  const [savingsProjections, setSavingsProjections] = useState<SavingsProjection | null>(null);
  const [financialAdvice, setFinancialAdvice] = useState<FinancialAdvice | null>(null);
  const [motivationalContent, setMotivationalContent] = useState<MotivationalContent | null>(null);
  const [countryPolicies, setCountryPolicies] = useState<CountryPolicies | null>(null);

  // Savings calculator states
  const [savingsAmount, setSavingsAmount] = useState<number>(500);
  const [savingsYears, setSavingsYears] = useState<number>(10);
  const [riskLevel, setRiskLevel] = useState<string>("moderate");

  // Load supported countries on component mount
  useEffect(() => {
    const loadCountries = async () => {
      try {
        const countriesData = await getSupportedCountries();
        setCountries(countriesData);
      } catch (error) {
        console.error("Failed to load countries:", error);
      }
    };
    loadCountries();
  }, []);

  // Update country in all data objects when selected country changes
  useEffect(() => {
    setHealthData(prev => ({ ...prev, country: selectedCountry }));
    setPropertyData(prev => ({ ...prev, country: selectedCountry }));
    setFinancialData(prev => ({ ...prev, country: selectedCountry }));
  }, [selectedCountry]);

  const handleComprehensiveAssessment = async () => {
    setIsLoading(true);
    try {
      const assessment = await getComprehensiveGlobalAssessment({
        health_profile: healthData,
        property_profile: propertyData,
        financial_profile: financialData
      });
      
      setAssessmentResult(assessment);
      setShowRecommendations(true);
      setShowSummary(true);
      setShowWelcome(false);
    } catch (error) {
      console.error("Assessment failed:", error);
      alert("Assessment failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavingsCalculation = async () => {
    setIsLoading(true);
    try {
      const result = await calculateSavingsProjection(
        savingsAmount,
        savingsYears,
        selectedCountry,
        riskLevel
      );
      setSavingsProjections(result.projections);
      setShowSavingsCalculator(true);
    } catch (error) {
      console.error("Savings calculation failed:", error);
      alert("Savings calculation failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinancialAdvice = async () => {
    setIsLoading(true);
    try {
      const advice = await getFinancialAdvice(
        selectedCountry,
        financialData.annual_income,
        healthData.age,
        financialData.dependents,
        financialData.current_savings,
        financialData.risk_tolerance
      );
      setFinancialAdvice(advice.financial_advice);
      setShowFinancialAdvice(true);
    } catch (error) {
      console.error("Financial advice failed:", error);
      alert("Failed to get financial advice. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMotivationalContent = async () => {
    setIsLoading(true);
    try {
      const content = await getMotivationalContent(
        selectedCountry,
        healthData.age,
        financialAdvice?.monthly_analysis.savings_rate || 20
      );
      setMotivationalContent(content.motivational_content);
      setShowMotivationalContent(true);
    } catch (error) {
      console.error("Motivational content failed:", error);
      alert("Failed to load motivational content. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePolicyGuide = async () => {
    setIsLoading(true);
    try {
      const policies = await getCountryPolicies(selectedCountry);
      setCountryPolicies(policies.policies);
      setShowPolicyGuide(true);
    } catch (error) {
      console.error("Policy guide failed:", error);
      alert("Failed to load policy guide. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!user) {
    return <AuthWrapper />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Enhanced Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-lg border-b border-blue-100 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-xl">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  WishInsured Global
                </h1>
                <p className="text-sm text-gray-600">Your Global Financial Independence Advisor</p>
              </div>
            </div>
            
            {/* Country Selector */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Globe className="w-5 h-5 text-blue-600" />
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="bg-white border border-blue-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Object.entries(countries).map(([code, country]) => (
                    <option key={code} value={code}>
                      {getCountryFlag(code)} {country.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="text-sm text-gray-600">
                Welcome, <span className="font-semibold text-blue-600">{user.email}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {showWelcome && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-8"
            >
              {/* Hero Section */}
              <div className="text-center space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                    Achieve <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      Financial Independence
                    </span>
                  </h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Get personalized insurance recommendations, financial advice, and savings strategies 
                    tailored to your country with currency-specific calculations.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
                >
                  {[
                    { icon: Shield, title: "Insurance", desc: "Smart coverage recommendations" },
                    { icon: TrendingUp, title: "Investments", desc: "Country-specific strategies" },
                    { icon: PiggyBank, title: "Savings", desc: "Compound growth projections" },
                    { icon: Target, title: "FIRE Goals", desc: "Financial independence planning" }
                  ].map((item, index) => (
                    <div key={index} className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-blue-100">
                      <item.icon className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                      <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Global Finance Tools */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {/* Comprehensive Assessment */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-100 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-blue-100 p-3 rounded-xl">
                      <Activity className="w-6 h-6 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                      Complete Analysis
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Insurance Assessment
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Get comprehensive insurance recommendations with {countries[selectedCountry]?.symbol} pricing, 
                    BMI analysis, and risk assessment.
                  </p>
                  <Button
                    onClick={() => setShowForm(true)}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    Start Assessment
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>

                {/* Savings Calculator */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-100 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-green-100 p-3 rounded-xl">
                      <Calculator className="w-6 h-6 text-green-600" />
                    </div>
                    <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
                      Wealth Builder
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Savings Projector
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Calculate compound growth, investment returns, and wealth milestones 
                    in {countries[selectedCountry]?.currency}.
                  </p>
                  
                  <div className="space-y-3 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Monthly Savings ({countries[selectedCountry]?.symbol})
                      </label>
                      <input
                        type="number"
                        value={savingsAmount}
                        onChange={(e) => setSavingsAmount(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Years</label>
                        <input
                          type="number"
                          value={savingsYears}
                          onChange={(e) => setSavingsYears(Number(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="10"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Risk</label>
                        <select
                          value={riskLevel}
                          onChange={(e) => setRiskLevel(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="conservative">Conservative</option>
                          <option value="moderate">Moderate</option>
                          <option value="aggressive">Aggressive</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    onClick={handleSavingsCalculation}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    {isLoading ? <Loading /> : <>Calculate Projections <BarChart3 className="w-4 h-4 ml-2" /></>}
                  </Button>
                </div>

                {/* Financial Advice */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-100 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-purple-100 p-3 rounded-xl">
                      <Lightbulb className="w-6 h-6 text-purple-600" />
                    </div>
                    <span className="text-sm font-medium text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                      Smart Insights
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Financial Advisor
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Get personalized financial advice, FIRE calculations, and investment 
                    strategies for {countries[selectedCountry]?.name}.
                  </p>
                  <Button
                    onClick={handleFinancialAdvice}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    {isLoading ? <Loading /> : <>Get Advice <Rocket className="w-4 h-4 ml-2" /></>}
                  </Button>
                </div>

                {/* Motivational Content */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-100 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-yellow-100 p-3 rounded-xl">
                      <Star className="w-6 h-6 text-yellow-600" />
                    </div>
                    <span className="text-sm font-medium text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full">
                      Motivation
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Success Stories
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Discover inspiring financial independence stories and daily motivation 
                    to achieve your wealth goals.
                  </p>
                  <Button
                    onClick={handleMotivationalContent}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                  >
                    {isLoading ? <Loading /> : <>Get Inspired <Trophy className="w-4 h-4 ml-2" /></>}
                  </Button>
                </div>

                {/* Policy Guide */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-100 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-indigo-100 p-3 rounded-xl">
                      <BookOpen className="w-6 h-6 text-indigo-600" />
                    </div>
                    <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                      Education
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Policy Guide
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Learn about insurance policies, retirement plans, and financial products 
                    available in {countries[selectedCountry]?.name}.
                  </p>
                  <Button
                    onClick={handlePolicyGuide}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
                  >
                    {isLoading ? <Loading /> : <>Explore Policies <BookOpen className="w-4 h-4 ml-2" /></>}
                  </Button>
                </div>

                {/* Emergency Fund Calculator */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-100 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-red-100 p-3 rounded-xl">
                      <Zap className="w-6 h-6 text-red-600" />
                    </div>
                    <span className="text-sm font-medium text-red-600 bg-red-50 px-3 py-1 rounded-full">
                      Emergency
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Emergency Fund
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Calculate your emergency fund needs and get a plan to build 
                    financial security in {countries[selectedCountry]?.currency}.
                  </p>
                  
                  {financialAdvice && (
                    <div className="bg-red-50 rounded-lg p-3 mb-4">
                      <div className="text-sm font-medium text-red-800">
                        Target: {formatCurrency(financialAdvice.emergency_fund.target_amount, countries[selectedCountry]?.symbol)}
                      </div>
                      <div className="text-xs text-red-600">
                        {financialAdvice.emergency_fund.months_to_build} months to build at current rate
                      </div>
                    </div>
                  )}
                  
                  <Button
                    onClick={handleFinancialAdvice}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
                  >
                    Calculate Fund
                    <Clock className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Assessment Form Modal */}
          {showForm && (
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
                className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {getCountryFlag(selectedCountry)} Insurance Assessment
                    </h3>
                    <Button
                      onClick={() => setShowForm(false)}
                      variant="outline"
                      className="px-3 py-1"
                    >
                      ×
                    </Button>
                  </div>

                  {/* Multi-step form content would go here */}
                  <div className="space-y-6">
                    {/* Step indicator */}
                    <div className="flex items-center justify-center space-x-4 mb-8">
                      {[1, 2, 3].map((step) => (
                        <div key={step} className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                            currentStep >= step 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-gray-200 text-gray-600'
                          }`}>
                            {step}
                          </div>
                          {step < 3 && (
                            <div className={`w-12 h-0.5 ${
                              currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                            }`} />
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Form steps would be implemented here with health, property, and financial data inputs */}
                    
                    <div className="flex justify-between pt-6">
                      <Button
                        onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                        variant="outline"
                        disabled={currentStep === 1}
                      >
                        Previous
                      </Button>
                      
                      {currentStep < 3 ? (
                        <Button
                          onClick={() => setCurrentStep(Math.min(3, currentStep + 1))}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Next
                        </Button>
                      ) : (
                        <Button
                          onClick={handleComprehensiveAssessment}
                          disabled={isLoading}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {isLoading ? <Loading /> : "Get Recommendations"}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Results Modals would be implemented here for savings projections, financial advice, etc. */}
        </AnimatePresence>
      </main>
    </div>
  );
}
