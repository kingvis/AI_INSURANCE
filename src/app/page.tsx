"use client";

import { useState } from "react";
import { useSupabase } from "@/hooks/useSupabase";
import AuthWrapper from "@/components/auth/AuthWrapper";
import { Button } from "@/components/ui/Button";
import { Loading } from "@/components/ui/Loading";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { motion } from "framer-motion";
import { 
  Shield, 
  Heart, 
  Home, 
  DollarSign,
  FileText,
  Car,
  Briefcase,
  Users,
  ChevronRight,
  CheckCircle,
  AlertTriangle,
  TrendingUp
} from "lucide-react";

// Insurance form interfaces
interface HealthData {
  age: number;
  gender: string;
  height: number;
  weight: number;
  smoking: boolean;
  drinking: boolean;
  exercise: string;
  medicalConditions: string[];
  familyHistory: string[];
  medications: string[];
}

interface PropertyData {
  propertyType: string;
  propertyValue: number;
  location: string;
  yearBuilt: number;
  securityFeatures: string[];
  previousClaims: boolean;
  mortgage: boolean;
}

interface FinancialData {
  annualIncome: number;
  employmentType: string;
  dependents: number;
  existingInsurance: string[];
  monthlyExpenses: number;
  savings: number;
  investmentRisk: string;
}

export default function WishInsuredHome() {
  const { user, loading } = useSupabase();
  const [theme, setTheme] = useLocalStorage("theme", "light");
  const [activeTab, setActiveTab] = useState("overview");
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Form data states
  const [healthData, setHealthData] = useState<HealthData>({
    age: 0,
    gender: "",
    height: 0,
    weight: 0,
    smoking: false,
    drinking: false,
    exercise: "",
    medicalConditions: [],
    familyHistory: [],
    medications: []
  });

  const [propertyData, setPropertyData] = useState<PropertyData>({
    propertyType: "",
    propertyValue: 0,
    location: "",
    yearBuilt: 0,
    securityFeatures: [],
    previousClaims: false,
    mortgage: false
  });

  const [financialData, setFinancialData] = useState<FinancialData>({
    annualIncome: 0,
    employmentType: "",
    dependents: 0,
    existingInsurance: [],
    monthlyExpenses: 0,
    savings: 0,
    investmentRisk: ""
  });

  const [recommendations, setRecommendations] = useState<any[]>([]);

  // Calculate insurance recommendations
  const calculateRecommendations = async () => {
    setIsLoading(true);
    
    // Calculate BMI for health assessment
    const bmi = healthData.weight / ((healthData.height / 100) ** 2);
    
    // Simulate API call to backend
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const recs = [];
    
    // Health insurance recommendation
    let healthRisk = "Low";
    let healthPremium = 2000;
    
    if (bmi > 30 || healthData.smoking || healthData.medicalConditions.length > 0) {
      healthRisk = "High";
      healthPremium = 4500;
    } else if (bmi > 25 || healthData.drinking || healthData.age > 45) {
      healthRisk = "Medium";
      healthPremium = 3000;
    }
    
    recs.push({
      type: "Health Insurance",
      icon: Heart,
      risk: healthRisk,
      premium: healthPremium,
      coverage: healthPremium * 20,
      features: [
        "Comprehensive medical coverage",
        "Emergency hospitalization",
        "Prescription medications",
        "Preventive care",
        healthRisk === "High" ? "Specialist consultations included" : "Regular check-ups"
      ],
      priority: healthRisk === "High" ? "Critical" : "Recommended"
    });

    // Property insurance recommendation
    if (propertyData.propertyValue > 0) {
      let propertyRisk = "Low";
      let propertyPremium = propertyData.propertyValue * 0.003;
      
      if (propertyData.yearBuilt < 1980 || propertyData.previousClaims) {
        propertyRisk = "High";
        propertyPremium = propertyData.propertyValue * 0.008;
      } else if (propertyData.yearBuilt < 2000) {
        propertyRisk = "Medium";
        propertyPremium = propertyData.propertyValue * 0.005;
      }
      
      recs.push({
        type: "Property Insurance",
        icon: Home,
        risk: propertyRisk,
        premium: propertyPremium,
        coverage: propertyData.propertyValue,
        features: [
          "Property damage protection",
          "Natural disaster coverage",
          "Theft and vandalism",
          "Personal liability",
          propertyData.securityFeatures.length > 2 ? "Security system discount" : "Basic protection"
        ],
        priority: propertyData.mortgage ? "Required" : "Recommended"
      });
    }

    // Life insurance recommendation
    const lifeMultiplier = financialData.dependents > 0 ? 15 : 8;
    const lifePremium = (financialData.annualIncome * 0.005) + (healthData.age * 10);
    
    recs.push({
      type: "Life Insurance",
      icon: Users,
      risk: financialData.dependents > 2 ? "High Priority" : "Standard",
      premium: lifePremium,
      coverage: financialData.annualIncome * lifeMultiplier,
      features: [
        "Income replacement protection",
        "Debt coverage included",
        "Beneficiary support",
        "Tax-free benefits",
        financialData.dependents > 0 ? "Family protection plan" : "Individual coverage"
      ],
      priority: financialData.dependents > 0 ? "Critical" : "Important"
    });

    setRecommendations(recs);
    setIsLoading(false);
    setActiveTab("recommendations");
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // Show authentication UI if not logged in
  if (!user) {
    return <AuthWrapper />;
  }

  // Navigation tabs
  const tabs = [
    { id: "overview", label: "Dashboard", icon: TrendingUp },
    { id: "health", label: "Health Profile", icon: Heart },
    { id: "property", label: "Property Details", icon: Home },
    { id: "financial", label: "Financial Status", icon: DollarSign },
    { id: "recommendations", label: "Insurance Plans", icon: Shield }
  ];

  return (
    <div className={`min-h-screen transition-colors ${
      theme === "dark" 
        ? "bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white" 
        : "bg-gradient-to-br from-blue-50 via-white to-indigo-50 text-gray-900"
    }`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-12 h-12 text-blue-600 mr-3" />
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              WishInsured
            </h1>
          </div>
          <p className={`text-lg ${theme === "dark" ? "text-gray-300" : "text-gray-600"} max-w-2xl mx-auto`}>
            Your personalized insurance advisor. Get tailored insurance recommendations based on your health, property, and financial profile.
          </p>
        </motion.div>

        {/* Welcome Message */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className={`${
            theme === "dark" 
              ? "bg-white/10 border-white/20" 
              : "bg-white/70 border-white/40"
          } backdrop-blur-xl rounded-2xl p-6 mb-8 border shadow-lg`}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">
                Welcome to WishInsured, {user.user_metadata?.full_name || user.email?.split('@')[0]}!
              </h2>
              <p className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>
                Let's find the perfect insurance coverage for your needs
              </p>
            </div>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto mb-8 space-x-1 bg-white/20 rounded-xl p-1">
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-white shadow-md text-blue-600"
                  : theme === "dark" 
                    ? "text-gray-300 hover:text-white hover:bg-white/10"
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="grid md:grid-cols-3 gap-6">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className={`${theme === "dark" ? "bg-white/10" : "bg-white"} rounded-xl p-6 shadow-lg`}
              >
                <Heart className="w-8 h-8 text-red-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Health Assessment</h3>
                <p className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"} mb-4`}>
                  Complete your health profile for personalized health insurance recommendations
                </p>
                <Button 
                  onClick={() => setActiveTab("health")}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  Start Health Profile <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className={`${theme === "dark" ? "bg-white/10" : "bg-white"} rounded-xl p-6 shadow-lg`}
              >
                <Home className="w-8 h-8 text-green-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Property Protection</h3>
                <p className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"} mb-4`}>
                  Secure your property with comprehensive insurance coverage
                </p>
                <Button 
                  onClick={() => setActiveTab("property")}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  Add Property <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className={`${theme === "dark" ? "bg-white/10" : "bg-white"} rounded-xl p-6 shadow-lg`}
              >
                <DollarSign className="w-8 h-8 text-blue-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Financial Planning</h3>
                <p className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"} mb-4`}>
                  Plan your financial future with life and investment insurance
                </p>
                <Button 
                  onClick={() => setActiveTab("financial")}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Financial Profile <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            </div>
          )}

          {/* Health Profile Tab */}
          {activeTab === "health" && (
            <div className={`${theme === "dark" ? "bg-white/10" : "bg-white"} rounded-xl p-8 shadow-lg`}>
              <div className="flex items-center mb-6">
                <Heart className="w-8 h-8 text-red-500 mr-3" />
                <h2 className="text-2xl font-bold">Health & Medical Background</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Age</label>
                  <input
                    type="number"
                    value={healthData.age || ""}
                    onChange={(e) => setHealthData({...healthData, age: Number(e.target.value)})}
                    className="w-full p-3 border rounded-lg"
                    placeholder="Enter your age"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Gender</label>
                  <select
                    value={healthData.gender}
                    onChange={(e) => setHealthData({...healthData, gender: e.target.value})}
                    className="w-full p-3 border rounded-lg"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Height (cm)</label>
                  <input
                    type="number"
                    value={healthData.height || ""}
                    onChange={(e) => setHealthData({...healthData, height: Number(e.target.value)})}
                    className="w-full p-3 border rounded-lg"
                    placeholder="Height in centimeters"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Weight (kg)</label>
                  <input
                    type="number"
                    value={healthData.weight || ""}
                    onChange={(e) => setHealthData({...healthData, weight: Number(e.target.value)})}
                    className="w-full p-3 border rounded-lg"
                    placeholder="Weight in kilograms"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Exercise Frequency</label>
                  <select
                    value={healthData.exercise}
                    onChange={(e) => setHealthData({...healthData, exercise: e.target.value})}
                    className="w-full p-3 border rounded-lg"
                  >
                    <option value="">Select frequency</option>
                    <option value="never">Never</option>
                    <option value="rarely">Rarely (1-2 times/month)</option>
                    <option value="sometimes">Sometimes (1-2 times/week)</option>
                    <option value="regularly">Regularly (3-4 times/week)</option>
                    <option value="daily">Daily</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Lifestyle Factors</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={healthData.smoking}
                        onChange={(e) => setHealthData({...healthData, smoking: e.target.checked})}
                        className="mr-2"
                      />
                      Current or former smoker
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={healthData.drinking}
                        onChange={(e) => setHealthData({...healthData, drinking: e.target.checked})}
                        className="mr-2"
                      />
                      Regular alcohol consumption
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium mb-2">Medical Conditions (Select all that apply)</label>
                <div className="grid md:grid-cols-3 gap-2">
                  {["Diabetes", "Hypertension", "Heart Disease", "Cancer", "Asthma", "Arthritis", "Depression", "Anxiety", "Other"].map((condition) => (
                    <label key={condition} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={healthData.medicalConditions.includes(condition)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setHealthData({...healthData, medicalConditions: [...healthData.medicalConditions, condition]});
                          } else {
                            setHealthData({...healthData, medicalConditions: healthData.medicalConditions.filter(c => c !== condition)});
                          }
                        }}
                        className="mr-2"
                      />
                      {condition}
                    </label>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex gap-4">
                <Button 
                  onClick={() => setActiveTab("property")}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Next: Property Details <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Property Details Tab */}
          {activeTab === "property" && (
            <div className={`${theme === "dark" ? "bg-white/10" : "bg-white"} rounded-xl p-8 shadow-lg`}>
              <div className="flex items-center mb-6">
                <Home className="w-8 h-8 text-green-500 mr-3" />
                <h2 className="text-2xl font-bold">Property Details</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Property Type</label>
                  <select
                    value={propertyData.propertyType}
                    onChange={(e) => setPropertyData({...propertyData, propertyType: e.target.value})}
                    className="w-full p-3 border rounded-lg"
                  >
                    <option value="">Select property type</option>
                    <option value="single-family">Single Family Home</option>
                    <option value="condo">Condominium</option>
                    <option value="townhouse">Townhouse</option>
                    <option value="apartment">Apartment</option>
                    <option value="mobile-home">Mobile Home</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Property Value ($)</label>
                  <input
                    type="number"
                    value={propertyData.propertyValue || ""}
                    onChange={(e) => setPropertyData({...propertyData, propertyValue: Number(e.target.value)})}
                    className="w-full p-3 border rounded-lg"
                    placeholder="Estimated property value"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Location</label>
                  <input
                    type="text"
                    value={propertyData.location}
                    onChange={(e) => setPropertyData({...propertyData, location: e.target.value})}
                    className="w-full p-3 border rounded-lg"
                    placeholder="City, State"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Year Built</label>
                  <input
                    type="number"
                    value={propertyData.yearBuilt || ""}
                    onChange={(e) => setPropertyData({...propertyData, yearBuilt: Number(e.target.value)})}
                    className="w-full p-3 border rounded-lg"
                    placeholder="Year property was built"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Security Features</label>
                  <div className="grid md:grid-cols-4 gap-2">
                    {["Security System", "Smoke Detectors", "Fire Extinguisher", "Deadbolt Locks", "Motion Lights", "Security Cameras", "Gated Community", "Neighborhood Watch"].map((feature) => (
                      <label key={feature} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={propertyData.securityFeatures.includes(feature)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setPropertyData({...propertyData, securityFeatures: [...propertyData.securityFeatures, feature]});
                            } else {
                              setPropertyData({...propertyData, securityFeatures: propertyData.securityFeatures.filter(f => f !== feature)});
                            }
                          }}
                          className="mr-2"
                        />
                        {feature}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={propertyData.previousClaims}
                      onChange={(e) => setPropertyData({...propertyData, previousClaims: e.target.checked})}
                      className="mr-2"
                    />
                    Previous insurance claims
                  </label>
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={propertyData.mortgage}
                      onChange={(e) => setPropertyData({...propertyData, mortgage: e.target.checked})}
                      className="mr-2"
                    />
                    Property has mortgage
                  </label>
                </div>
              </div>

              <div className="mt-8 flex gap-4">
                <Button 
                  onClick={() => setActiveTab("health")}
                  variant="outline"
                >
                  Previous
                </Button>
                <Button 
                  onClick={() => setActiveTab("financial")}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Next: Financial Profile <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Financial Status Tab */}
          {activeTab === "financial" && (
            <div className={`${theme === "dark" ? "bg-white/10" : "bg-white"} rounded-xl p-8 shadow-lg`}>
              <div className="flex items-center mb-6">
                <DollarSign className="w-8 h-8 text-blue-500 mr-3" />
                <h2 className="text-2xl font-bold">Financial Status</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Annual Income ($)</label>
                  <input
                    type="number"
                    value={financialData.annualIncome || ""}
                    onChange={(e) => setFinancialData({...financialData, annualIncome: Number(e.target.value)})}
                    className="w-full p-3 border rounded-lg"
                    placeholder="Your annual income"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Employment Type</label>
                  <select
                    value={financialData.employmentType}
                    onChange={(e) => setFinancialData({...financialData, employmentType: e.target.value})}
                    className="w-full p-3 border rounded-lg"
                  >
                    <option value="">Select employment type</option>
                    <option value="full-time">Full-time Employee</option>
                    <option value="part-time">Part-time Employee</option>
                    <option value="self-employed">Self-employed</option>
                    <option value="contract">Contract Worker</option>
                    <option value="retired">Retired</option>
                    <option value="unemployed">Unemployed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Number of Dependents</label>
                  <input
                    type="number"
                    value={financialData.dependents || ""}
                    onChange={(e) => setFinancialData({...financialData, dependents: Number(e.target.value)})}
                    className="w-full p-3 border rounded-lg"
                    placeholder="Number of dependents"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Monthly Expenses ($)</label>
                  <input
                    type="number"
                    value={financialData.monthlyExpenses || ""}
                    onChange={(e) => setFinancialData({...financialData, monthlyExpenses: Number(e.target.value)})}
                    className="w-full p-3 border rounded-lg"
                    placeholder="Total monthly expenses"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Current Savings ($)</label>
                  <input
                    type="number"
                    value={financialData.savings || ""}
                    onChange={(e) => setFinancialData({...financialData, savings: Number(e.target.value)})}
                    className="w-full p-3 border rounded-lg"
                    placeholder="Current savings amount"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Investment Risk Tolerance</label>
                  <select
                    value={financialData.investmentRisk}
                    onChange={(e) => setFinancialData({...financialData, investmentRisk: e.target.value})}
                    className="w-full p-3 border rounded-lg"
                  >
                    <option value="">Select risk tolerance</option>
                    <option value="conservative">Conservative</option>
                    <option value="moderate">Moderate</option>
                    <option value="aggressive">Aggressive</option>
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium mb-2">Existing Insurance (Select all that apply)</label>
                <div className="grid md:grid-cols-3 gap-2">
                  {["Health Insurance", "Life Insurance", "Auto Insurance", "Home Insurance", "Disability Insurance", "Travel Insurance"].map((insurance) => (
                    <label key={insurance} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={financialData.existingInsurance.includes(insurance)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFinancialData({...financialData, existingInsurance: [...financialData.existingInsurance, insurance]});
                          } else {
                            setFinancialData({...financialData, existingInsurance: financialData.existingInsurance.filter(i => i !== insurance)});
                          }
                        }}
                        className="mr-2"
                      />
                      {insurance}
                    </label>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex gap-4">
                <Button 
                  onClick={() => setActiveTab("property")}
                  variant="outline"
                >
                  Previous
                </Button>
                <Button 
                  onClick={calculateRecommendations}
                  disabled={isLoading}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {isLoading ? (
                    <>
                      <Loading />
                      Calculating...
                    </>
                  ) : (
                    <>
                      Get Insurance Recommendations <Shield className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Recommendations Tab */}
          {activeTab === "recommendations" && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Your Personalized Insurance Recommendations</h2>
                <p className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                  Based on your profile, here are our tailored insurance suggestions
                </p>
              </div>

              {recommendations.length === 0 ? (
                <div className={`${theme === "dark" ? "bg-white/10" : "bg-white"} rounded-xl p-8 shadow-lg text-center`}>
                  <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Complete Your Profile</h3>
                  <p className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"} mb-4`}>
                    Please complete all sections to receive personalized recommendations
                  </p>
                  <Button onClick={() => setActiveTab("health")} className="bg-blue-600 hover:bg-blue-700 text-white">
                    Start Assessment
                  </Button>
                </div>
              ) : (
                <div className="grid gap-6">
                  {recommendations.map((rec, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`${theme === "dark" ? "bg-white/10" : "bg-white"} rounded-xl p-6 shadow-lg`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center">
                          <rec.icon className="w-8 h-8 text-blue-600 mr-3" />
                          <div>
                            <h3 className="text-xl font-bold">{rec.type}</h3>
                            <div className="flex items-center mt-1">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                rec.priority === "Critical" ? "bg-red-100 text-red-800" :
                                rec.priority === "Required" ? "bg-orange-100 text-orange-800" :
                                "bg-green-100 text-green-800"
                              }`}>
                                {rec.priority}
                              </span>
                              <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                                rec.risk === "High" || rec.risk === "High Priority" ? "bg-red-100 text-red-800" :
                                rec.risk === "Medium" ? "bg-yellow-100 text-yellow-800" :
                                "bg-green-100 text-green-800"
                              }`}>
                                Risk: {rec.risk}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600">
                            ${rec.premium.toLocaleString()}/year
                          </div>
                          <div className="text-sm text-gray-500">
                            Coverage: ${rec.coverage.toLocaleString()}
                          </div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold mb-2">Coverage Features:</h4>
                          <ul className="space-y-1">
                            {rec.features.map((feature: string, idx: number) => (
                              <li key={idx} className="flex items-center text-sm">
                                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="flex items-end">
                          <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full">
                            Get Quote
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* Theme Toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleTheme}
          className="fixed bottom-6 right-6 w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center"
        >
          {theme === "light" ? "🌙" : "☀️"}
        </motion.button>
      </div>
    </div>
  );
}
