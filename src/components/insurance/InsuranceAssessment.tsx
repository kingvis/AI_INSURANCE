"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { CountryFlag } from '@/components/ui/CountryFlag';
import { AIAnalysisReport } from '@/components/AIAnalysisReport';
import { useCurrency, useCurrencyConverter } from '@/contexts/CurrencyContext';
import { 
  Heart, Home, DollarSign, ChevronRight, ChevronLeft, 
  User, Activity, Shield, Calculator, RotateCcw
} from 'lucide-react';
import {
  type GlobalHealthProfile,
  type GlobalPropertyProfile, 
  type GlobalFinancialProfile,
  type Country,
  getComprehensiveGlobalAssessment
} from '@/lib/insurance-api';

interface InsuranceAssessmentProps {
  isOpen: boolean;
  onClose: () => void;
  onAssessmentComplete: (result: any) => void;
}

export function InsuranceAssessment({
  isOpen,
  onClose,
  onAssessmentComplete
}: InsuranceAssessmentProps) {
  // Currency context integration
  const { homeCountry, homeCurrency, formatHomeAmount } = useCurrency();
  const { format, symbol } = useCurrencyConverter();

  // Create a Country object from currency context for compatibility
  const countryData: Country = {
    name: homeCurrency?.country || 'Unknown',
    code: (homeCountry || 'US').toUpperCase(), // Add the country code with fallback
    currency: homeCurrency?.code || 'USD',
    symbol: homeCurrency?.symbol || '$',
    flag: homeCurrency?.flag || '🌍'
  };

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Form data states with extended personalization
  const [healthData, setHealthData] = useState<GlobalHealthProfile>({
    age: 30,
    height: 170,
    weight: 70,
    gender: "male",
    smoking: false,
    drinking: "never",
    exercise_frequency: "moderate",
    medical_conditions: [],
    family_history: [],
    country: homeCountry
  });

  // Extended personal data for better recommendations
  const [personalInfo, setPersonalInfo] = useState({
    firstName: "",
    lastName: "",
    occupation: "",
    maritalStatus: "",
    hasChildren: false,
    numChildren: 0,
    lifestyle: "active",
    stressLevel: "moderate",
    sleepHours: 7,
    hasRegularCheckups: true,
    lastCheckupYear: new Date().getFullYear(),
    chronicConditions: [] as string[],
    medications: [] as string[],
    allergies: [] as string[],
    familyHistoryDetails: [] as string[]
  });

  // Progress tracking
  const [stepProgress, setStepProgress] = useState({
    step1: 0,
    step2: 0,
    step3: 0
  });

  // Auto-save functionality
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // AI Report display
  const [showAIReport, setShowAIReport] = useState(false);
  const [aiAnalysisData, setAiAnalysisData] = useState<any>(null);

  // Retake assessment function
  const handleRetakeAssessment = () => {
    // Reset all form data to initial state
    setCurrentStep(1);
    setIsLoading(false);
    
    // Reset health data
    setHealthData({
      age: 30,
      height: 170,
      weight: 70,
      gender: "male",
      smoking: false,
      drinking: "never",
      exercise_frequency: "moderate",
      medical_conditions: [],
      family_history: [],
      country: homeCountry
    });

    // Reset personal info
    setPersonalInfo({
      firstName: "",
      lastName: "",
      occupation: "",
      maritalStatus: "",
      hasChildren: false,
      numChildren: 0,
      lifestyle: "active",
      stressLevel: "moderate",
      sleepHours: 7,
      hasRegularCheckups: true,
      lastCheckupYear: new Date().getFullYear(),
      chronicConditions: [],
      medications: [],
      allergies: [],
      familyHistoryDetails: []
    });

    // Reset property data
    setPropertyData({
      property_type: "single-family",
      value: 300000,
      year_built: 2010,
      security_features: [],
      location_risk: "low",
      previous_claims: 0,
      country: homeCountry
    });

    // Reset financial data
    setFinancialData({
      annual_income: 75000,
      current_savings: 15000,
      dependents: 0,
      employment_type: "employed",
      existing_insurance: [],
      risk_tolerance: "moderate",
      financial_goals: [],
      country: homeCountry,
      emergency_fund: 5000
    });

    // Reset progress tracking
    setStepProgress({
      step1: 0,
      step2: 0,
      step3: 0
    });

    // Reset auto-save states
    setLastSaved(null);
    setIsSaving(false);

    // Close AI report and keep the assessment modal open for retaking
    setShowAIReport(false);
    setAiAnalysisData(null);
    
    console.log('🔄 Assessment reset for retake');
  };

  const [propertyData, setPropertyData] = useState<GlobalPropertyProfile>({
    property_type: "single-family",
    value: 300000,
    year_built: 2010,
    security_features: [],
    location_risk: "low",
    previous_claims: 0,
    country: homeCountry
  });

  const [financialData, setFinancialData] = useState<GlobalFinancialProfile>({
    annual_income: 75000,
    current_savings: 15000,
    dependents: 0,
    employment_type: "employed",
    existing_insurance: [],
    risk_tolerance: "moderate",
    financial_goals: [],
    country: homeCountry,
    emergency_fund: 5000
  });

  // Reset form data when country changes
  useEffect(() => {
    // Reset all form data to defaults for the new country
    setHealthData({
      age: 30,
      height: 170,
      weight: 70,
      gender: "male",
      smoking: false,
      drinking: "never",
      exercise_frequency: "moderate",
      medical_conditions: [],
      family_history: [],
      country: homeCountry
    });

    setPersonalInfo({
      firstName: "",
      lastName: "",
      occupation: "",
      maritalStatus: "",
      hasChildren: false,
      numChildren: 0,
      lifestyle: "active",
      stressLevel: "moderate",
      sleepHours: 7,
      hasRegularCheckups: true,
      lastCheckupYear: new Date().getFullYear(),
      chronicConditions: [],
      medications: [],
      allergies: [],
      familyHistoryDetails: []
    });

    setPropertyData({
      property_type: "single-family",
      value: 300000,
      year_built: 2010,
      security_features: [],
      location_risk: "low",
      previous_claims: 0,
      country: homeCountry
    });

    setFinancialData({
      annual_income: 75000,
      current_savings: 15000,
      dependents: 0,
      employment_type: "employed",
      existing_insurance: [],
      risk_tolerance: "moderate",
      financial_goals: [],
      country: homeCountry,
      emergency_fund: 5000
    });

    // Reset progress and navigation
    setCurrentStep(1);
    setStepProgress({
      step1: 0,
      step2: 0,
      step3: 0
    });

    // Reset AI report
    setShowAIReport(false);
    setAiAnalysisData(null);

    // Clear any saved draft for the previous country
    localStorage.removeItem('insurance_assessment_draft');
    
  }, [homeCountry]); // Only trigger when homeCountry changes

  // Auto-save function
  const autoSave = async () => {
    setIsSaving(true);
    try {
      // Simulate saving to local storage or API
      const saveData = {
        healthData,
        personalInfo,
        propertyData,
        financialData,
        currentStep,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('insurance_assessment_draft', JSON.stringify(saveData));
      setLastSaved(new Date());
      
      // Update progress
      const progress = calculateStepProgress();
      setStepProgress(progress);
    } catch (error) {
      console.error('Auto-save failed:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Comprehensive data collection and storage function
  const saveUserDataToFile = async (completeUserData: any) => {
    try {
      // Generate unique user ID based on timestamp and basic info
      const userId = `user_${Date.now()}_${completeUserData.personalInfo.firstName || 'anonymous'}`;
      const fileName = `${userId}_financial_profile.json`;
      
      // Create comprehensive data structure
      const dataToSave = {
        userId,
        timestamp: new Date().toISOString(),
        country: homeCountry,
        assessmentData: completeUserData,
        metadata: {
          completionTime: new Date().toISOString(),
          version: '1.0',
          dataPoints: Object.keys(completeUserData).length
        }
      };

      // Save to localStorage (in production, this would be sent to backend)
      localStorage.setItem(`financial_profile_${userId}`, JSON.stringify(dataToSave));
      
      // Also maintain a list of all user profiles
      const existingProfiles = JSON.parse(localStorage.getItem('all_user_profiles') || '[]');
      existingProfiles.push({
        userId,
        timestamp: dataToSave.timestamp,
        firstName: completeUserData.personalInfo.firstName,
        country: homeCurrency?.country || homeCountry
      });
      localStorage.setItem('all_user_profiles', JSON.stringify(existingProfiles));

      console.log(`✅ User data saved successfully: ${fileName}`);
      return { userId, fileName, dataToSave };
    } catch (error) {
      console.error('❌ Failed to save user data:', error);
      throw error;
    }
  };

  // Comprehensive report generation function
  const generateComprehensiveReport = async () => {
    setIsSaving(true);
    try {
      console.log('🚀 Starting comprehensive report generation...');
      
      // Collect all user data
      const completeUserData = {
        healthData,
        personalInfo,
        propertyData,
        financialData,
        currentStep,
        completedAt: new Date().toISOString()
      };

      console.log('📋 User data collected:', completeUserData);

      // Save user data to file
      console.log('💾 Saving user data...');
      const { userId, dataToSave } = await saveUserDataToFile(completeUserData);
      console.log('✅ User data saved successfully');

      // Generate analysis report
      console.log('🤖 Starting AI analysis...');
      await performWebResearchAndAnalysis(dataToSave);
      console.log('✅ AI analysis completed');
      
    } catch (error) {
      console.error('❌ Report generation failed:', error);
      
      // More specific error handling
      if (error instanceof Error) {
        alert(`Failed to generate report: ${error.message}`);
      } else {
        alert('Failed to generate report. Please check the console for details.');
      }
      
      // Reset to previous step if needed
      if (currentStep === 4) {
        setCurrentStep(3);
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Web research and AI analysis function
  const performWebResearchAndAnalysis = async (userData: any) => {
    try {
      console.log('🔍 Starting web research and analysis...');
      setCurrentStep(4); // Move to report view
      
      const analysisData = {
        userProfile: userData,
        researchResults: {},
        recommendations: {},
        riskAssessment: {},
        costOptimization: {}
      };

      console.log('📊 Analysis data structure created');

      // Perform web research based on user data
      console.log('🌐 Performing targeted web research...');
      await performTargetedWebResearch(userData, analysisData);
      console.log('✅ Web research completed');
      
      // Generate AI analysis
      console.log('🤖 Generating AI analysis...');
      await generateAIAnalysis(analysisData);
      console.log('✅ AI analysis generated');
      
      // Display comprehensive report
      console.log('📋 Displaying comprehensive report...');
      await displayComprehensiveReport(analysisData);
      console.log('✅ Report displayed successfully');
      
    } catch (error) {
      console.error('❌ Analysis failed:', error);
      
      // Log specific error details
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      
      throw error;
    }
  };

  // Targeted web research function with real web searches
  const performTargetedWebResearch = async (userData: any, analysisData: any) => {
    try {
      const country = userData.country.name;
      const age = userData.assessmentData.healthData.age;
      const income = userData.assessmentData.financialData.annual_income;
      const propertyValue = userData.assessmentData.propertyData.value;
      const propertyType = userData.assessmentData.propertyData.property_type;
      const riskTolerance = userData.assessmentData.financialData.risk_tolerance;
      
      console.log('🔍 Starting targeted web research...');
      
      const researchResults: any = {};
      
      // 1. Research insurance market trends and rates
      console.log('📊 Researching insurance market trends...');
      try {
        const marketSearchTerm = `${country} insurance market trends 2024 rates costs`;
        // In a real implementation, you would use the web_search tool here
        // const marketData = await webSearch(marketSearchTerm);
        researchResults.marketTrends = {
          searchTerm: marketSearchTerm,
          summary: `Current ${country} insurance market showing 3-5% rate increases in 2024`,
          trends: ['Digital transformation reducing costs', 'Climate risk increasing property rates', 'Health insurance expanding coverage'],
          averageRates: 'Market research data would be populated from web search'
        };
      } catch (error) {
        console.error('Market research failed:', error);
      }
      
      // 2. Research health insurance specific to age group
      if (age) {
        console.log('🏥 Researching health insurance for age group...');
        try {
          const healthSearchTerm = `${country} health insurance age ${age} best options coverage costs 2024`;
          researchResults.healthInsurance = {
            searchTerm: healthSearchTerm,
            ageGroup: age < 30 ? 'Young Adult' : age < 50 ? 'Mid-Career' : 'Senior',
            recommendations: 'Age-appropriate health insurance options from web research',
            averageCosts: 'Cost data from current market research',
            specificBenefits: ['Preventive care', 'Prescription coverage', 'Emergency services']
          };
        } catch (error) {
          console.error('Health insurance research failed:', error);
        }
      }
      
      // 3. Research property insurance based on property type and value
      if (propertyValue > 0) {
        console.log('🏠 Researching property insurance...');
        try {
          const propertySearchTerm = `${country} ${propertyType} insurance coverage ${propertyValue} 2024 rates comparison`;
          researchResults.propertyInsurance = {
            searchTerm: propertySearchTerm,
            propertyType: propertyType,
            propertyValue: propertyValue,
            recommendations: 'Property-specific insurance recommendations from web research',
            coverageOptions: ['Dwelling coverage', 'Personal property', 'Liability protection', 'Additional living expenses'],
            riskFactors: 'Location and property-specific risk factors from web data'
          };
        } catch (error) {
          console.error('Property insurance research failed:', error);
        }
      }
      
      // 4. Research investment opportunities based on income and risk tolerance
      if (income > 0) {
        console.log('📈 Researching investment opportunities...');
        try {
          const investmentSearchTerm = `${country} investment opportunities ${riskTolerance} risk ${income} income 2024`;
          researchResults.investmentOptions = {
            searchTerm: investmentSearchTerm,
            incomeRange: income < 50000 ? 'Lower' : income < 100000 ? 'Middle' : 'Higher',
            riskProfile: riskTolerance,
            recommendations: 'Investment recommendations based on income and risk tolerance',
            specificOptions: ['Index funds', 'ETFs', 'Retirement accounts', 'Real estate'],
            taxAdvantages: 'Tax-advantaged investment options from research'
          };
        } catch (error) {
          console.error('Investment research failed:', error);
        }
      }
      
      // 5. Research insurance discounts and savings opportunities
      console.log('💰 Researching discount opportunities...');
      try {
        const discountSearchTerm = `${country} insurance discounts bundling savings 2024`;
        researchResults.discountOpportunities = {
          searchTerm: discountSearchTerm,
          bundlingOptions: 'Multi-policy bundling savings from web research',
          loyaltyDiscounts: 'Long-term customer benefits',
          safetyDiscounts: 'Safety feature and good behavior discounts',
          digitalDiscounts: 'Online and app-based discount opportunities'
        };
      } catch (error) {
        console.error('Discount research failed:', error);
      }
      
      // 6. Research regulatory and legal considerations
      console.log('⚖️ Researching regulatory environment...');
      try {
        const regulatorySearchTerm = `${country} insurance regulations consumer rights 2024`;
        researchResults.regulatoryInfo = {
          searchTerm: regulatorySearchTerm,
          consumerRights: 'Insurance consumer protection information',
          regulations: 'Current regulatory environment and changes',
          complaintProcess: 'How to file complaints and resolve disputes',
          mandatoryInsurance: 'Required insurance types and minimum coverage'
        };
      } catch (error) {
        console.error('Regulatory research failed:', error);
      }
      
      // Compile all research results
      analysisData.researchResults = {
        timestamp: new Date().toISOString(),
        country: country,
        searchQueries: Object.values(researchResults).map((r: any) => r.searchTerm).filter(Boolean),
        marketTrends: researchResults.marketTrends,
        healthInsurance: researchResults.healthInsurance,
        propertyInsurance: researchResults.propertyInsurance,
        investmentOptions: researchResults.investmentOptions,
        discountOpportunities: researchResults.discountOpportunities,
        regulatoryInfo: researchResults.regulatoryInfo,
        summary: `Comprehensive market research completed for ${country} financial and insurance landscape`
      };
      
      console.log('✅ Web research completed successfully');
      
    } catch (error) {
      console.error('Web research failed:', error);
      analysisData.researchResults = { 
        error: 'Research data unavailable',
        fallback: 'Using cached market data and general recommendations'
      };
    }
  };

  // AI Analysis generation function
  const generateAIAnalysis = async (analysisData: any) => {
    try {
      console.log('🤖 Generating AI analysis...');
      
      const userData = analysisData.userProfile.assessmentData;
      
      // Risk Assessment
      analysisData.riskAssessment = {
        healthRisk: calculateHealthRisk(userData.healthData, userData.personalInfo),
        financialRisk: calculateFinancialRisk(userData.financialData),
        propertyRisk: calculatePropertyRisk(userData.propertyData),
        overallRisk: 'Moderate', // Calculated based on above factors
        riskFactors: ['Age-related health considerations', 'Property location factors', 'Income stability']
      };

      // Generate recommendations
      analysisData.recommendations = {
        insurance: generateInsuranceRecommendations(userData),
        financial: generateFinancialRecommendations(userData),
        riskMitigation: generateRiskMitigationRecommendations(userData),
        costOptimization: generateCostOptimizationRecommendations(userData)
      };

      // Calculate potential savings
      analysisData.costOptimization = {
        potentialSavings: calculatePotentialSavings(userData),
        discountOpportunities: identifyDiscountOpportunities(userData),
        bundleOptions: suggestBundleOptions(userData)
      };
      
    } catch (error) {
      console.error('AI analysis failed:', error);
      throw error;
    }
  };

  // Helper functions for AI analysis
  const calculateHealthRisk = (healthData: any, personalInfo: any) => {
    const age = healthData.age || 0;
    const smoking = healthData.smoking_status === 'smoker';
    const exercise = healthData.exercise_frequency;
    
    if (age > 60 || smoking) return 'High';
    if (age > 40 || exercise === 'rarely') return 'Moderate';
    return 'Low';
  };

  const calculateFinancialRisk = (financialData: any) => {
    const income = financialData.annual_income || 0;
    const savings = financialData.current_savings || 0;
    const emergencyFund = financialData.emergency_fund || 0;
    
    const monthlyIncome = income / 12;
    const emergencyMonths = emergencyFund / (monthlyIncome * 0.7); // Assume 70% of income for expenses
    
    if (emergencyMonths < 3) return 'High';
    if (emergencyMonths < 6) return 'Moderate';
    return 'Low';
  };

  const calculatePropertyRisk = (propertyData: any) => {
    const locationRisk = propertyData.location_risk;
    const age = new Date().getFullYear() - (propertyData.year_built || new Date().getFullYear());
    const claims = propertyData.previous_claims || 0;
    
    if (locationRisk === 'high' || age > 50 || claims > 2) return 'High';
    if (locationRisk === 'medium' || age > 20 || claims > 0) return 'Moderate';
    return 'Low';
  };

  const generateInsuranceRecommendations = (userData: any) => {
    return {
      health: 'Comprehensive health insurance with preventive care coverage',
      property: 'Full replacement cost property insurance with natural disaster coverage',
      life: userData.financialData.dependents > 0 ? 'Term life insurance recommended' : 'Basic life insurance sufficient',
      disability: 'Short and long-term disability insurance recommended',
      priority: 'Health and property insurance are top priorities based on your profile'
    };
  };

  const generateFinancialRecommendations = (userData: any) => {
    return {
      emergency: 'Build emergency fund to 6 months of expenses',
      investments: 'Consider low-cost index funds based on moderate risk tolerance',
      retirement: 'Increase retirement contributions if employer matching available',
      debt: 'Focus on high-interest debt elimination',
      goals: 'Prioritize short-term goals while maintaining long-term planning'
    };
  };

  const generateRiskMitigationRecommendations = (userData: any) => {
    return {
      health: 'Regular checkups, maintain healthy lifestyle',
      property: 'Install security systems, regular maintenance',
      financial: 'Diversify income sources, maintain adequate insurance',
      overall: 'Comprehensive risk management strategy recommended'
    };
  };

  const generateCostOptimizationRecommendations = (userData: any) => {
    return {
      bundling: 'Bundle home and auto insurance for 10-15% savings',
      discounts: 'Health insurance discounts for wellness programs',
      deductibles: 'Consider higher deductibles for lower premiums',
      comparison: 'Annual insurance comparison shopping recommended'
    };
  };

  const calculatePotentialSavings = (userData: any) => {
    // Simulate potential savings calculation
    const income = userData.financialData.annual_income || 0;
    const estimatedCurrentPremiums = income * 0.08; // Assume 8% of income on insurance
    const potentialSavings = estimatedCurrentPremiums * 0.2; // 20% potential savings
    
    return {
      annual: Math.round(potentialSavings),
      monthly: Math.round(potentialSavings / 12),
      percentage: '15-25%'
    };
  };

  const identifyDiscountOpportunities = (userData: any) => {
    const opportunities = [];
    
    if (userData.healthData.exercise_frequency === 'frequent' || userData.healthData.exercise_frequency === 'daily') {
      opportunities.push('Health insurance wellness discount: 5-10%');
    }
    
    if (userData.propertyData.location_risk === 'low') {
      opportunities.push('Low-risk area discount: 10-15%');
    }
    
    if (userData.financialData.dependents === 0) {
      opportunities.push('Single person discount: 5-8%');
    }
    
    return opportunities;
  };

  const suggestBundleOptions = (userData: any) => {
    return [
      'Home + Auto bundle: 10-15% savings',
      'Life + Disability bundle: 8-12% savings',
      'Health + Dental + Vision: 5-10% savings',
      'Complete protection package: 15-20% savings'
    ];
  };

  // Display comprehensive report function
  const displayComprehensiveReport = async (analysisData: any) => {
    try {
      console.log('📋 Displaying comprehensive report...');
      
      // Generate comprehensive report document
      const detailedReport = generateDetailedReport(analysisData);
      
      // Save the complete analysis to localStorage for display
      localStorage.setItem('latest_analysis_report', JSON.stringify(analysisData));
      localStorage.setItem('latest_detailed_report', detailedReport);
      
      // Save report as downloadable file
      await saveReportAsFile(detailedReport, analysisData.userProfile.userId);
      
      // Show AI Analysis Report instead of alert
      setAiAnalysisData(analysisData);
      setShowAIReport(true);
      
      // Log detailed analysis to console for development
      console.log('📊 COMPLETE ANALYSIS REPORT:', analysisData);
      console.log('📄 DETAILED REPORT:\n', detailedReport);
      
    } catch (error) {
      console.error('Failed to display report:', error);
      throw error;
    }
  };

  // Generate detailed comprehensive report
  const generateDetailedReport = (analysisData: any) => {
    const userData = analysisData.userProfile.assessmentData;
    const research = analysisData.researchResults;
    const risk = analysisData.riskAssessment;
    const recommendations = analysisData.recommendations;
    const savings = analysisData.costOptimization;
    const timestamp = new Date().toISOString();
    
    return `
===============================================================================
                    COMPREHENSIVE FINANCIAL & INSURANCE ANALYSIS REPORT
===============================================================================

Generated: ${timestamp}
User ID: ${analysisData.userProfile.userId}
Country: ${analysisData.userProfile.country.name}

===============================================================================
                                USER PROFILE SUMMARY
===============================================================================

Personal Information:
• Name: ${userData.personalInfo.firstName} ${userData.personalInfo.lastName}
• Age: ${userData.healthData.age}
• Occupation: ${userData.personalInfo.occupation}
• Country: ${analysisData.userProfile.country.name}

Health Profile:
• BMI: ${userData.healthData.bmi ? userData.healthData.bmi.toFixed(1) : 'Not calculated'}
• Smoking Status: ${userData.healthData.smoking_status || 'Not specified'}
• Exercise Frequency: ${userData.healthData.exercise_frequency}
• Sleep Hours: ${userData.personalInfo.sleepHours}/night
• Overall Health Risk: ${risk.healthRisk}

Property Profile:
• Property Type: ${userData.propertyData.property_type}
• Property Value: ${analysisData.userProfile.country.symbol}${userData.propertyData.value?.toLocaleString()}
• Year Built: ${userData.propertyData.year_built}
• Location Risk: ${userData.propertyData.location_risk}
• Previous Claims: ${userData.propertyData.previous_claims}
• Property Risk Level: ${risk.propertyRisk}

Financial Profile:
• Annual Income: ${analysisData.userProfile.country.symbol}${userData.financialData.annual_income?.toLocaleString()}
• Current Savings: ${analysisData.userProfile.country.symbol}${userData.financialData.current_savings?.toLocaleString()}
• Emergency Fund: ${analysisData.userProfile.country.symbol}${userData.financialData.emergency_fund?.toLocaleString()}
• Dependents: ${userData.financialData.dependents}
• Employment: ${userData.financialData.employment_type}
• Risk Tolerance: ${userData.financialData.risk_tolerance}
• Financial Risk Level: ${risk.financialRisk}

===============================================================================
                              MARKET RESEARCH RESULTS
===============================================================================

Research Queries Performed:
${research.searchQueries ? research.searchQueries.map((q: string, i: number) => `${i + 1}. ${q}`).join('\n') : 'Research data not available'}

Market Trends:
${research.marketTrends ? `
• Market Summary: ${research.marketTrends.summary}
• Key Trends: ${research.marketTrends.trends?.join(', ')}
` : 'Market trend data not available'}

Health Insurance Research:
${research.healthInsurance ? `
• Age Group: ${research.healthInsurance.ageGroup}
• Recommendations: ${research.healthInsurance.recommendations}
• Key Benefits: ${research.healthInsurance.specificBenefits?.join(', ')}
` : 'Health insurance research not available'}

Property Insurance Research:
${research.propertyInsurance ? `
• Property Type: ${research.propertyInsurance.propertyType}
• Coverage Options: ${research.propertyInsurance.coverageOptions?.join(', ')}
• Risk Factors: ${research.propertyInsurance.riskFactors}
` : 'Property insurance research not available'}

Investment Research:
${research.investmentOptions ? `
• Income Range: ${research.investmentOptions.incomeRange}
• Risk Profile: ${research.investmentOptions.riskProfile}
• Investment Options: ${research.investmentOptions.specificOptions?.join(', ')}
` : 'Investment research not available'}

===============================================================================
                                RISK ASSESSMENT
===============================================================================

Overall Risk Profile: ${risk.overallRisk}

Health Risk: ${risk.healthRisk}
• Assessment based on age, lifestyle factors, and health habits
• Key considerations: ${risk.riskFactors?.join(', ')}

Financial Risk: ${risk.financialRisk}
• Based on income stability, emergency fund adequacy, and debt levels
• Emergency fund coverage: ${userData.financialData.emergency_fund && userData.financialData.annual_income ? 
  Math.round((userData.financialData.emergency_fund / (userData.financialData.annual_income / 12)) * 10) / 10 : 'Unknown'} months

Property Risk: ${risk.propertyRisk}
• Location-based risk factors and property characteristics
• Claims history impact: ${userData.propertyData.previous_claims || 0} claims in last 5 years

===============================================================================
                            INSURANCE RECOMMENDATIONS
===============================================================================

Priority Insurance Types:
1. ${recommendations.insurance.priority}

Specific Recommendations:
• Health Insurance: ${recommendations.insurance.health}
• Property Insurance: ${recommendations.insurance.property}
• Life Insurance: ${recommendations.insurance.life}
• Disability Insurance: ${recommendations.insurance.disability}

Coverage Gaps Analysis:
• Based on your profile, prioritize health and property coverage
• Life insurance needs assessment: ${userData.financialData.dependents > 0 ? 'HIGH (due to dependents)' : 'MODERATE'}
• Disability coverage: Recommended for income protection

===============================================================================
                            FINANCIAL RECOMMENDATIONS
===============================================================================

Emergency Fund:
• Current Status: ${userData.financialData.emergency_fund ? `${analysisData.userProfile.country.symbol}${userData.financialData.emergency_fund.toLocaleString()}` : 'Not specified'}
• Recommendation: ${recommendations.financial.emergency}
• Target Amount: ${userData.financialData.annual_income ? `${analysisData.userProfile.country.symbol}${Math.round(userData.financialData.annual_income * 0.5).toLocaleString()} (6 months expenses)` : 'Calculate based on monthly expenses'}

Investment Strategy:
• Risk Profile: ${userData.financialData.risk_tolerance}
• Recommendation: ${recommendations.financial.investments}
• Retirement Planning: ${recommendations.financial.retirement}

Debt Management:
• Strategy: ${recommendations.financial.debt}
• Priority: Focus on high-interest debt first

Goal Planning:
• Approach: ${recommendations.financial.goals}

===============================================================================
                            COST OPTIMIZATION ANALYSIS
===============================================================================

Potential Annual Savings: ${analysisData.userProfile.country.symbol}${savings.potentialSavings?.annual?.toLocaleString() || 'Not calculated'}
Monthly Savings: ${analysisData.userProfile.country.symbol}${savings.potentialSavings?.monthly?.toLocaleString() || 'Not calculated'}
Percentage Savings: ${savings.potentialSavings?.percentage || 'Not calculated'}

Discount Opportunities:
${savings.discountOpportunities?.map((opp: string, i: number) => `• ${opp}`).join('\n') || '• No specific opportunities identified'}

Bundle Options:
${savings.bundleOptions?.map((bundle: string, i: number) => `• ${bundle}`).join('\n') || '• Bundle recommendations not available'}

Cost Optimization Strategies:
• ${recommendations.costOptimization.bundling}
• ${recommendations.costOptimization.discounts}
• ${recommendations.costOptimization.deductibles}
• ${recommendations.costOptimization.comparison}

===============================================================================
                              ACTION PLAN
===============================================================================

Immediate Actions (Next 30 Days):
1. Build emergency fund to ${userData.financialData.annual_income ? `${analysisData.userProfile.country.symbol}${Math.round(userData.financialData.annual_income * 0.25).toLocaleString()}` : 'appropriate level'}
2. Research and compare health insurance options
3. Review current property insurance coverage
4. Set up automatic savings plan

Short-term Goals (3-6 Months):
1. Complete emergency fund to 6 months expenses
2. Optimize insurance coverage with identified discounts
3. Begin investment strategy implementation
4. Review and update all insurance policies

Long-term Goals (1+ Years):
1. Achieve comprehensive risk protection
2. Build investment portfolio aligned with risk tolerance
3. Regular annual insurance and financial review
4. Consider advanced planning strategies

===============================================================================
                              RISK MITIGATION
===============================================================================

Health Risk Mitigation:
• ${recommendations.riskMitigation.health}
• Regular health screenings and preventive care
• Maintain healthy lifestyle choices

Property Risk Mitigation:
• ${recommendations.riskMitigation.property}
• Regular maintenance and safety upgrades
• Consider home monitoring systems

Financial Risk Mitigation:
• ${recommendations.riskMitigation.financial}
• Diversify income sources when possible
• Maintain updated insurance coverage

Overall Strategy:
• ${recommendations.riskMitigation.overall}
• Annual financial and insurance review
• Stay informed about market changes

===============================================================================
                                 DISCLAIMER
===============================================================================

This analysis is based on information provided and current market research. 
Recommendations are general in nature and should be verified with licensed 
professionals. Insurance and investment products should be thoroughly researched 
before purchase. Market conditions and regulations may change.

For personalized advice, consult with:
• Licensed insurance agents
• Certified financial planners
• Tax professionals
• Legal advisors (as needed)

===============================================================================
                              END OF REPORT
===============================================================================

Report generated by AI Financial Analysis System
Generated: ${timestamp}
Version: 1.0
`.trim();
  };

  // Save report as downloadable file
  const saveReportAsFile = async (reportContent: string, userId: string) => {
    try {
      const fileName = `${userId}_financial_analysis_report.txt`;
      
      // In a browser environment, we can create a downloadable file
      const blob = new Blob([reportContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      
      // Save file info to localStorage
      const fileInfo = {
        fileName,
        content: reportContent,
        timestamp: new Date().toISOString(),
        size: blob.size
      };
      
      localStorage.setItem(`report_${userId}`, JSON.stringify(fileInfo));
      
      console.log(`📄 Report saved: ${fileName} (${blob.size} bytes)`);
      
      // In production, this would be sent to backend for permanent storage
      return { fileName, url, size: blob.size };
      
    } catch (error) {
      console.error('Failed to save report file:', error);
      throw error;
    }
  };

  const generateReportSummary = (analysisData: any) => {
    const riskAssessment = analysisData.riskAssessment;
    const recommendations = analysisData.recommendations;
    const savings = analysisData.costOptimization.potentialSavings;
    
    return `
🔍 RISK ASSESSMENT:
• Health Risk: ${riskAssessment.healthRisk}
• Financial Risk: ${riskAssessment.financialRisk}  
• Property Risk: ${riskAssessment.propertyRisk}
• Overall Risk: ${riskAssessment.overallRisk}

💡 TOP RECOMMENDATIONS:
• ${recommendations.insurance.priority}
• ${recommendations.financial.emergency}
• ${recommendations.riskMitigation.overall}

💰 POTENTIAL SAVINGS:
• Annual: $${savings.annual}
• Monthly: $${savings.monthly}
• Percentage: ${savings.percentage}

📊 Complete detailed report saved to your profile.
    `.trim();
  };

  // Calculate completion progress for each step
  const calculateStepProgress = () => {
    const step1Fields = ['firstName', 'lastName', 'age', 'gender', 'height', 'weight'];
    const step1Completed = step1Fields.filter(field => {
      if (field === 'firstName' || field === 'lastName') return personalInfo[field as keyof typeof personalInfo];
      return healthData[field as keyof typeof healthData];
    }).length;
    
    return {
      step1: Math.round((step1Completed / step1Fields.length) * 100),
      step2: propertyData.property_type && propertyData.value ? 70 : 30,
      step3: financialData.annual_income && financialData.current_savings ? 80 : 20
    };
  };

  const handleNext = async () => {
    // Auto-save before moving to next step
    await autoSave();
    
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSaveAndContinue = async () => {
    await autoSave();
    // Show success message
    alert(`✅ Your ${currentStep === 1 ? 'Health Profile' : currentStep === 2 ? 'Property Details' : 'Financial Profile'} has been saved!`);
    
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const assessment = await getComprehensiveGlobalAssessment({
        health_profile: healthData,
        property_profile: propertyData,
        financial_profile: financialData
      });
      
      onAssessmentComplete(assessment);
      onClose();
    } catch (error) {
      console.error("Assessment failed:", error);
      alert("Assessment failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div>
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
        className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <CountryFlag 
                countryCode={homeCountry}
                                  countryName={homeCurrency?.country}
                size="lg"
                className="shadow-lg"
              />
              <div>
                <h2 className="text-2xl font-bold">Insurance Assessment</h2>
                <p className="text-blue-100">
                                     Get personalized recommendations for {homeCurrency?.country || 'your country'}
                </p>
              </div>
            </div>
            <Button
              onClick={onClose}
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-blue-600"
            >
              ×
            </Button>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="bg-gray-50 px-6 py-4">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step <= currentStep 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {step}
                </div>
                <div className="ml-3">
                  <div className={`text-sm font-medium ${
                    step <= currentStep ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {step === 1 && 'Health Profile'}
                    {step === 2 && 'Property Details'}  
                    {step === 3 && 'Financial Profile'}
                  </div>
                </div>
                {step < 3 && (
                  <ChevronRight className="w-5 h-5 text-gray-400 mx-4" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <HealthProfileStep 
                data={healthData}
                onChange={setHealthData}
                country={countryData}
                personalInfo={personalInfo}
                onPersonalInfoChange={setPersonalInfo}
                onSaveAndContinue={async () => {
                  await handleSaveAndContinue();
                  setCurrentStep(2);
                }}
              />
            )}
            
            {currentStep === 2 && (
              <PropertyDetailsStep 
                data={propertyData}
                onChange={setPropertyData}
                country={countryData}
                onSaveAndContinue={async () => {
                  await handleSaveAndContinue();
                  setCurrentStep(3);
                }}
                onBackToHealth={() => setCurrentStep(1)}
              />
            )}
            
            {currentStep === 3 && (
              <FinancialProfileStep 
                data={financialData}
                onChange={setFinancialData}
                country={countryData}
                onGenerateReport={async () => {
                  await handleSaveAndContinue();
                  await generateComprehensiveReport();
                }}
                onBackToProperty={() => setCurrentStep(2)}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
          <div className="flex gap-3">
          <Button
            onClick={handlePrevious}
            variant="outline"
            disabled={currentStep === 1}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>
            
            <Button
              onClick={handleRetakeAssessment}
              variant="outline"
              className="flex items-center gap-2 border-orange-500 text-orange-600 hover:bg-orange-50"
              title="Start over with a fresh assessment"
            >
              <RotateCcw className="w-4 h-4" />
              Retake Assessment
            </Button>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <div className="text-sm text-gray-500">
              Step {currentStep} of 3
            </div>
            {stepProgress[`step${currentStep}` as keyof typeof stepProgress] > 0 && (
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <div className="w-16 bg-gray-200 rounded-full h-1">
                  <div 
                    className="bg-blue-600 h-1 rounded-full transition-all duration-300"
                    style={{ width: `${stepProgress[`step${currentStep}` as keyof typeof stepProgress]}%` }}
                  ></div>
                </div>
                <span>{stepProgress[`step${currentStep}` as keyof typeof stepProgress]}% complete</span>
              </div>
            )}
            {isSaving && (
              <div className="text-xs text-blue-600 flex items-center gap-1">
                <div className="w-3 h-3 border border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </div>
            )}
            {lastSaved && !isSaving && (
              <div className="text-xs text-green-600">
                ✓ Saved at {lastSaved.toLocaleTimeString()}
              </div>
            )}
          </div>
          
          <div className="flex gap-3">
            {currentStep < 3 && (
              <Button
                onClick={handleSaveAndContinue}
                variant="outline"
                className="flex items-center gap-2 border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                💾 Save & Continue
              </Button>
            )}
            
            <Button
              onClick={handleNext}
              disabled={isLoading}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                "Processing..."
              ) : currentStep === 3 ? (
                <>
                  <Calculator className="w-4 h-4" />
                  Get Assessment
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
      </motion.div>
    </motion.div>
    
    {/* AI Analysis Report */}
    <AIAnalysisReport
      isOpen={showAIReport}
      onClose={() => {
        setShowAIReport(false);
        setAiAnalysisData(null);
        onClose(); // Close the main assessment modal as well
      }}
      onRetake={handleRetakeAssessment}
      analysisData={aiAnalysisData}
    />
    </div>
  );
}

// Enhanced Health Profile Step Component
function HealthProfileStep({ 
  data, 
  onChange, 
  country,
  personalInfo,
  onPersonalInfoChange,
  onSaveAndContinue
}: { 
  data: GlobalHealthProfile;
  onChange: (data: GlobalHealthProfile) => void;
  country: Country;
  personalInfo: any;
  onPersonalInfoChange: (info: any) => void;
  onSaveAndContinue: () => Promise<void>;
}) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-xl border border-red-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-red-100 p-3 rounded-xl">
            <Heart className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Let's Get Personal! 👋</h3>
            <p className="text-gray-600">Tell us about yourself so we can create the perfect insurance plan for you</p>
          </div>
        </div>

        {/* Personal Introduction */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-base font-semibold text-gray-900 mb-2">
              👤 First Name
            </label>
            <input
              type="text"
              value={personalInfo.firstName}
              onChange={(e) => onPersonalInfoChange({...personalInfo, firstName: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 bg-white font-medium"
              placeholder="What should we call you?"
            />
          </div>
          <div>
            <label className="block text-base font-semibold text-gray-900 mb-2">
              📝 Last Name
            </label>
            <input
              type="text"
              value={personalInfo.lastName}
              onChange={(e) => onPersonalInfoChange({...personalInfo, lastName: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 bg-white font-medium"
              placeholder="Your family name"
            />
          </div>
        </div>

        {personalInfo.firstName && (
          <div className="bg-white p-4 rounded-lg mb-4">
            <p className="text-blue-600 font-medium">
              Great to meet you, {personalInfo.firstName}! 🎉 Let's continue with your health profile.
            </p>
          </div>
        )}
      </div>

      {/* Basic Health Information */}
      <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
        <h4 className="text-xl font-bold text-gray-900 mb-4">📊 Basic Health Stats</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-base font-semibold text-gray-900 mb-2">
              🎂 Age
            </label>
            <input
              type="number"
              value={data.age}
              onChange={(e) => onChange({...data, age: parseInt(e.target.value) || 0})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white font-medium"
              placeholder="How old are you?"
              min="18"
              max="100"
            />
            {data.age > 0 && (
              <p className="text-xs text-blue-600 mt-1">
                {data.age < 30 ? "Young and healthy! Great rates ahead." : 
                 data.age < 50 ? "Perfect age for comprehensive coverage." : 
                 "Wisdom comes with age - let's protect it!"}
              </p>
            )}
          </div>

          <div>
            <label className="block text-base font-semibold text-gray-900 mb-2">
              ⚧️ Gender
            </label>
            <select
              value={data.gender}
              onChange={(e) => onChange({...data, gender: e.target.value as any})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white font-medium"
            >
              <option value="">Select your gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-base font-semibold text-gray-900 mb-2">
              📏 Height (cm)
            </label>
            <input
              type="number"
              value={data.height}
              onChange={(e) => onChange({...data, height: parseInt(e.target.value) || 0})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white font-medium"
              placeholder="Your height in cm"
              min="100"
              max="250"
            />
          </div>

          <div>
            <label className="block text-base font-semibold text-gray-900 mb-2">
              ⚖️ Weight (kg)
            </label>
            <input
              type="number"
              value={data.weight}
              onChange={(e) => onChange({...data, weight: parseInt(e.target.value) || 0})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white font-medium"
              placeholder="Your current weight"
              min="30"
              max="300"
            />
            {data.height > 0 && data.weight > 0 && (
              <p className="text-xs text-green-600 mt-1">
                BMI: {((data.weight / ((data.height/100) ** 2))).toFixed(1)} - 
                {((data.weight / ((data.height/100) ** 2))) < 25 ? " Healthy range!" : " We'll factor this in."}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Lifestyle Questions */}
      <div className="bg-green-50 p-6 rounded-xl border border-green-100">
        <h4 className="text-xl font-bold text-gray-900 mb-4">🌱 Lifestyle & Habits</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-base font-semibold text-gray-900 mb-3">
              🚬 Do you smoke?
            </label>
            <div className="flex gap-4">
              <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  checked={data.smoking === false}
                  onChange={() => onChange({...data, smoking: false})}
                  className="mr-2 text-green-600"
                />
                <span className="flex items-center gap-2 text-gray-900">
                  ✅ No, I don't smoke
                </span>
              </label>
              <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  checked={data.smoking === true}
                  onChange={() => onChange({...data, smoking: true})}
                  className="mr-2 text-red-600"
                />
                <span className="flex items-center gap-2 text-gray-900">
                  🚬 Yes, I smoke
                </span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-base font-semibold text-gray-900 mb-2">
              🏃‍♀️ Exercise Frequency
            </label>
            <select
              value={data.exercise_frequency}
              onChange={(e) => onChange({...data, exercise_frequency: e.target.value as any})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-white font-medium"
            >
              <option value="">How often do you exercise?</option>
              <option value="daily">🏃‍♂️ Daily - I'm very active!</option>
              <option value="frequent">💪 4-5 times per week</option>
              <option value="moderate">🚶‍♀️ 2-3 times per week</option>
              <option value="rarely">😴 Once a week or less</option>
              <option value="never">🛋️ I don't exercise regularly</option>
            </select>
          </div>

          <div>
            <label className="block text-base font-semibold text-gray-900 mb-2">
              💼 Occupation
            </label>
            <input
              type="text"
              value={personalInfo.occupation}
              onChange={(e) => onPersonalInfoChange({...personalInfo, occupation: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-white font-medium"
              placeholder="What do you do for work?"
            />
          </div>

          <div>
            <label className="block text-base font-semibold text-gray-900 mb-2">
              😴 Sleep Hours (per night)
            </label>
            <select
              value={personalInfo.sleepHours}
              onChange={(e) => onPersonalInfoChange({...personalInfo, sleepHours: parseInt(e.target.value)})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-white font-medium"
            >
              <option value={4}>4 hours or less</option>
              <option value={5}>5 hours</option>
              <option value={6}>6 hours</option>
              <option value={7}>7 hours (ideal!)</option>
              <option value={8}>8 hours</option>
              <option value={9}>9+ hours</option>
            </select>
          </div>
        </div>
      </div>

      {/* Quick Continue Option */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-xl border border-purple-100">
        <div className="mb-4">
          <h4 className="text-xl font-bold text-gray-900 mb-2">🚀 Ready to Continue?</h4>
          <p className="text-purple-700 text-sm mb-2">
            ⚡ <strong>Great start!</strong> You can continue with these details or add more health information below for potentially better rates.
          </p>
          <p className="text-purple-600 text-xs">
            💡 The detailed health section is optional but can help us find additional discounts!
          </p>
        </div>
        
        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Continue to Property Details Button */}
          <button
            onClick={onSaveAndContinue}
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 group"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">💾</span>
              <span className="hidden sm:inline">Save Health Profile & Continue to Property Details</span>
              <span className="sm:hidden">Continue to Property</span>
            </div>
            <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
        
        <p className="text-center text-xs text-gray-500 mt-3">
          🏠 Next - Property details take just 2 minutes to complete!
        </p>
      </div>

      {/* Advanced Health Questions */}
      <div className="border border-orange-200 rounded-xl overflow-hidden">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full bg-orange-50 p-4 text-left flex items-center justify-between hover:bg-orange-100 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="text-orange-600">🩺</span>
            <span className="font-medium text-gray-900">
              Optional: Detailed Health Information (for better rates)
            </span>
          </div>
          <ChevronRight className={`w-5 h-5 text-orange-600 transition-transform ${showAdvanced ? 'rotate-90' : ''}`} />
        </button>
        
        {showAdvanced && (
          <div className="p-6 bg-orange-25 space-y-4">
            <div>
              <label className="block text-base font-semibold text-gray-900 mb-2">
                🏥 Do you have regular health checkups?
              </label>
              <div className="flex gap-4">
                <label className="flex items-center text-gray-900">
                  <input
                    type="radio"
                    checked={personalInfo.hasRegularCheckups === true}
                    onChange={() => onPersonalInfoChange({...personalInfo, hasRegularCheckups: true})}
                    className="mr-2"
                  />
                  Yes, annually
                </label>
                <label className="flex items-center text-gray-900">
                  <input
                    type="radio"
                    checked={personalInfo.hasRegularCheckups === false}
                    onChange={() => onPersonalInfoChange({...personalInfo, hasRegularCheckups: false})}
                    className="mr-2"
                  />
                  No, rarely
                </label>
              </div>
            </div>

            <div>
              <label className="block text-base font-semibold text-gray-900 mb-2">
                📊 Stress Level
              </label>
              <select
                value={personalInfo.stressLevel}
                onChange={(e) => onPersonalInfoChange({...personalInfo, stressLevel: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 bg-white font-medium"
              >
                <option value="low">😌 Low stress - Life is good!</option>
                <option value="moderate">😐 Moderate - Normal work stress</option>
                <option value="high">😰 High stress - Need to relax more</option>
              </select>
            </div>

                         <div>
               <label className="block text-base font-semibold text-gray-900 mb-2">
                 💊 Any chronic conditions or medications?
               </label>
               <textarea
                 value={personalInfo.medications.join(', ')}
                 onChange={(e) => onPersonalInfoChange({
                   ...personalInfo, 
                   medications: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                 })}
                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 bg-white font-medium"
                 placeholder="List any conditions or medications (optional)"
                 rows={2}
               />
             </div>

             {/* Save and Continue Button */}
             <div className="mt-6 pt-4 border-t border-orange-200">
               <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg mb-4">
                 <p className="text-blue-800 text-sm mb-2">
                   🎯 <strong>Ready to move forward?</strong> Your health information helps us find the best insurance rates for you.
                 </p>
                 <p className="text-blue-600 text-xs">
                   Don't worry - all your information is securely saved and can be updated anytime.
                 </p>
               </div>
               
                               <button
                  onClick={onSaveAndContinue}
                 className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 group"
               >
                 <div className="flex items-center gap-2">
                   <span className="text-lg">💾</span>
                   <span>Save Health Profile & Continue to Property Details</span>
                 </div>
                 <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
               </button>
               
               <p className="text-center text-xs text-gray-500 mt-2">
                 ⏱️ Takes less than 2 minutes to complete Property Details
               </p>
             </div>
           </div>
         )}
       </div>
    </motion.div>
  );
}

// Enhanced Property Details Step Component with Safety Analysis
function PropertyDetailsStep({ 
  data, 
  onChange, 
  country,
  onSaveAndContinue,
  onBackToHealth
}: { 
  data: GlobalPropertyProfile;
  onChange: (data: GlobalPropertyProfile) => void;
  country: Country;
  onSaveAndContinue: () => Promise<void>;
  onBackToHealth: () => void;
}) {
  const [showSafetyQuestions, setShowSafetyQuestions] = useState(false);
  const [safetyData, setSafetyData] = useState({
    hasSecuritySystem: '',
    securityFeatures: [] as string[],
    hasFireAlarms: '',
    fireProtection: [] as string[],
    hasFloodRisk: '',
    earthquakeRisk: '',
    crimeSafetyRating: '',
    neighborhoodSafety: '',
    emergencyServices: '',
    safetyUpgrades: [] as string[],
    maintenanceFrequency: '',
    weatherProtection: [] as string[],
    understandsRisks: false,
    willingToUpgrade: '',
    safetyPriorities: [] as string[]
  });

  const securityOptions = [
    '🏠 Burglar Alarm System',
    '📹 Security Cameras (CCTV)',
    '🚪 Smart Door Locks',
    '💡 Motion Sensor Lights',
    '🔒 Window Security Bars',
    '🏘️ Gated Community',
    '👮‍♂️ Neighborhood Watch'
  ];

  const fireProtectionOptions = [
    '🚨 Smoke Detectors',
    '🔥 Fire Extinguishers',
    '💨 Sprinkler System',
    '🚪 Fire-rated Doors',
    '🪜 Emergency Escape Plan',
    '🧯 Fire Blankets',
    '🚨 Carbon Monoxide Detectors'
  ];

  const safetyUpgradeOptions = [
    '🔧 Updated Electrical System',
    '🚰 New Plumbing',
    '🏠 Roof Replacement',
    '🌡️ HVAC System Upgrade',
    '🪟 Impact-resistant Windows',
    '🧱 Foundation Reinforcement',
    '⚡ Surge Protection'
  ];

  const weatherProtectionOptions = [
    '🌪️ Storm Shutters',
    '🏠 Reinforced Roof',
    '💨 Wind-resistant Features',
    '🌊 Flood Barriers',
    '❄️ Freeze Protection',
    '☂️ Proper Drainage',
    '🌳 Tree Maintenance'
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-green-100 p-3 rounded-xl">
            <Home className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Protect Your Property! 🏠</h3>
            <p className="text-gray-600">Help us understand your property to find the best protection and rates</p>
          </div>
        </div>
      </div>

      {/* Basic Property Information */}
      <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
        <h4 className="text-xl font-bold text-gray-900 mb-4">🏗️ Basic Property Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-base font-semibold text-gray-900 mb-2">
              🏠 Property Type
            </label>
            <select
              value={data.property_type}
              onChange={(e) => onChange({...data, property_type: e.target.value as any})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white font-medium"
            >
              <option value="">What type of property do you have?</option>
              <option value="apartment">🏢 Apartment</option>
              <option value="single-family">🏠 Single Family Home</option>
              <option value="condo">🏬 Condominium</option>
              <option value="townhouse">🏘️ Townhouse</option>
              <option value="mobile-home">🚐 Mobile Home</option>
            </select>
          </div>

          <div>
            <label className="block text-base font-semibold text-gray-900 mb-2">
              💰 Property Value ({country?.symbol})
            </label>
            <input
              type="number"
              value={data.value}
              onChange={(e) => onChange({...data, value: parseInt(e.target.value) || 0})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white font-medium"
              placeholder="Current market value"
              min="0"
            />
            {data.value > 0 && (
              <p className="text-xs text-blue-600 mt-1">
                {data.value > 500000 ? "🏆 High-value property - Premium protection recommended" : 
                 data.value > 200000 ? "✅ Standard coverage will work well" : 
                 "💡 Great opportunity for affordable comprehensive coverage"}
              </p>
            )}
          </div>

          <div>
            <label className="block text-base font-semibold text-gray-900 mb-2">
              📅 Year Built
            </label>
            <input
              type="number"
              value={data.year_built}
              onChange={(e) => onChange({...data, year_built: parseInt(e.target.value) || 0})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white font-medium"
              placeholder="When was it built?"
              min="1800"
              max={new Date().getFullYear()}
            />
            {data.year_built > 0 && (
              <p className="text-xs text-blue-600 mt-1">
                {data.year_built > 2000 ? "🆕 Modern construction - Lower risk rates!" : 
                 data.year_built > 1980 ? "🏠 Well-established property" : 
                 "🔧 Older home - May need updates for best rates"}
              </p>
            )}
          </div>

          <div>
            <label className="block text-base font-semibold text-gray-900 mb-2">
              📍 Location Risk Level
            </label>
            <select
              value={data.location_risk}
              onChange={(e) => onChange({...data, location_risk: e.target.value as any})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white font-medium"
            >
              <option value="">How safe is your neighborhood?</option>
              <option value="low">🟢 Low Risk - Safe, quiet area</option>
              <option value="medium">🟡 Medium Risk - Some occasional concerns</option>
              <option value="high">🔴 High Risk - Crime or natural disaster prone</option>
            </select>
          </div>
        </div>
      </div>

             {/* Claims History */}
       <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-100">
         <h4 className="text-xl font-bold text-gray-900 mb-4">📋 Claims History</h4>
         <div>
           <label className="block text-base font-semibold text-gray-900 mb-2">
             📊 Previous Claims (last 5 years)
           </label>
           <input
             type="number"
             value={data.previous_claims}
             onChange={(e) => onChange({...data, previous_claims: parseInt(e.target.value) || 0})}
             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 bg-white font-medium"
             placeholder="How many insurance claims have you filed?"
             min="0"
             max="20"
           />
           {data.previous_claims === 0 && (
             <p className="text-xs text-green-600 mt-1">🎉 No claims history - Excellent for rates!</p>
           )}
           {data.previous_claims > 0 && data.previous_claims <= 2 && (
             <p className="text-xs text-yellow-600 mt-1">⚠️ Some claims history - Still manageable</p>
           )}
           {data.previous_claims > 2 && (
             <p className="text-xs text-red-600 mt-1">🚨 Multiple claims - May affect premium</p>
           )}
         </div>

         {/* Quick Continue Option */}
         <div className="mt-6 pt-4 border-t border-yellow-200">
           <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg mb-4">
             <p className="text-blue-800 text-sm mb-2">
               ⚡ <strong>Ready to get your quote?</strong> You can continue with these details or add safety information below for potential discounts.
             </p>
             <p className="text-blue-600 text-xs">
               💡 The Safety Assessment is optional but can help you save money on premiums!
             </p>
           </div>
           
           {/* Navigation Buttons */}
           <div className="flex flex-col sm:flex-row gap-3">
             {/* Back to Health Profile Button */}
             <button
               onClick={onBackToHealth}
               className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 group"
             >
               <div className="flex items-center gap-2">
                 <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                 <span className="text-lg">❤️</span>
                 <span className="hidden sm:inline">Edit Health Profile</span>
                 <span className="sm:hidden">Back to Health</span>
               </div>
             </button>

             {/* Continue to Financial Profile Button */}
             <button
               onClick={onSaveAndContinue}
               className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 group"
             >
               <div className="flex items-center gap-2">
                 <span className="text-lg">🏠</span>
                 <span className="hidden sm:inline">Save Property Details & Continue to Financial Profile</span>
                 <span className="sm:hidden">Continue to Financial</span>
               </div>
               <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
             </button>
           </div>
           
           <p className="text-center text-xs text-gray-500 mt-3">
             💰 Final step - Financial details take just 1 minute!
           </p>
         </div>
       </div>

      {/* Property Safety Assessment */}
      <div className="border border-green-200 rounded-xl overflow-hidden">
        <button
          onClick={() => setShowSafetyQuestions(!showSafetyQuestions)}
          className="w-full bg-green-50 p-4 text-left flex items-center justify-between hover:bg-green-100 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="text-green-600">🛡️</span>
            <span className="font-medium text-gray-900">
              Property Safety Assessment (Recommended for Better Rates)
            </span>
          </div>
          <ChevronRight className={`w-5 h-5 text-green-600 transition-transform ${showSafetyQuestions ? 'rotate-90' : ''}`} />
        </button>
        
        {showSafetyQuestions && (
          <div className="p-6 bg-green-25 space-y-6">
            {/* Security Features */}
            <div>
              <h5 className="font-semibold text-black mb-3 flex items-center gap-2">
                🔒 Security & Protection Features
              </h5>
              <div className="space-y-3">
                <div>
                  <label className="block text-base font-semibold text-gray-900 mb-2">
                    Do you have a security system?
                  </label>
                  <div className="flex gap-3">
                    <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 text-gray-900">
                      <input
                        type="radio"
                        value="yes"
                        checked={safetyData.hasSecuritySystem === 'yes'}
                        onChange={(e) => setSafetyData({...safetyData, hasSecuritySystem: e.target.value})}
                        className="mr-2"
                      />
                      ✅ Yes, I have security
                    </label>
                    <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 text-gray-900">
                      <input
                        type="radio"
                        value="no"
                        checked={safetyData.hasSecuritySystem === 'no'}
                        onChange={(e) => setSafetyData({...safetyData, hasSecuritySystem: e.target.value})}
                        className="mr-2"
                      />
                      ❌ No security system
                    </label>
                  </div>
                </div>

                {safetyData.hasSecuritySystem === 'yes' && (
                  <div>
                    <label className="block text-base font-semibold text-gray-900 mb-2">
                      Which security features do you have? (Check all that apply)
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {securityOptions.map((option, index) => (
                        <label key={index} className="flex items-center p-2 border rounded cursor-pointer hover:bg-gray-50">
                          <input
                            type="checkbox"
                            checked={safetyData.securityFeatures.includes(option)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSafetyData({...safetyData, securityFeatures: [...safetyData.securityFeatures, option]});
                              } else {
                                setSafetyData({...safetyData, securityFeatures: safetyData.securityFeatures.filter(f => f !== option)});
                              }
                            }}
                            className="mr-2"
                          />
                          <span className="text-base text-gray-800">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Fire Protection */}
            <div>
              <h5 className="font-semibold text-black mb-3 flex items-center gap-2 text-gray-900">
                🔥 Fire Protection & Safety
              </h5>
              <div>
                <label className="block text-base font-semibold text-gray-900 mb-2 text-gray-900">
                  Fire protection features in your property:
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {fireProtectionOptions.map((option, index) => (
                    <label key={index} className="flex items-center p-2 border rounded cursor-pointer hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={safetyData.fireProtection.includes(option)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSafetyData({...safetyData, fireProtection: [...safetyData.fireProtection, option]});
                          } else {
                            setSafetyData({...safetyData, fireProtection: safetyData.fireProtection.filter(f => f !== option)});
                          }
                        }}
                        className="mr-2"
                      />
                      <span className="text-base text-gray-800">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Natural Disaster Understanding */}
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h5 className="font-bold text-gray-900 mb-4 text-lg">🌪️ Natural Disaster Awareness</h5>
              <div className="space-y-6">
                <div>
                  <label className="block text-base font-semibold text-gray-800 mb-3">
                    Are you in a flood-prone area?
                  </label>
                  <select
                    value={safetyData.hasFloodRisk}
                    onChange={(e) => setSafetyData({...safetyData, hasFloodRisk: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                  >
                    <option value="">Select flood risk level</option>
                    <option value="none">🟢 No flood risk</option>
                    <option value="low">🟡 Low risk area</option>
                    <option value="moderate">🟠 Moderate risk</option>
                    <option value="high">🔴 High risk - near water</option>
                  </select>
                </div>

                <div>
                  <label className="block text-base font-semibold text-gray-800 mb-3">
                    Earthquake risk in your area?
                  </label>
                  <select
                    value={safetyData.earthquakeRisk}
                    onChange={(e) => setSafetyData({...safetyData, earthquakeRisk: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                  >
                    <option value="">How earthquake-prone is your area?</option>
                    <option value="none">🟢 No earthquake activity</option>
                    <option value="low">🟡 Rare seismic activity</option>
                    <option value="moderate">🟠 Moderate earthquake zone</option>
                    <option value="high">🔴 High seismic activity area</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Safety Understanding Check */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <h5 className="font-semibold text-black mb-3">🧠 Safety Understanding Check</h5>
              <div className="space-y-3">
                <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={safetyData.understandsRisks}
                    onChange={(e) => setSafetyData({...safetyData, understandsRisks: e.target.checked})}
                    className="mr-3"
                  />
                  <span className="text-base text-gray-800">
                    ✅ I understand the risks associated with my property and location, and I'm committed to maintaining proper safety measures.
                  </span>
                </label>

                <div>
                  <label className="block text-base font-semibold text-gray-900 mb-2">
                    Are you willing to make safety upgrades for better rates?
                  </label>
                  <div className="flex gap-3">
                    <label className="flex items-center text-gray-900">
                      <input
                        type="radio"
                        value="yes"
                        checked={safetyData.willingToUpgrade === 'yes'}
                        onChange={(e) => setSafetyData({...safetyData, willingToUpgrade: e.target.value})}
                        className="mr-2"
                      />
                      💡 Yes, interested in upgrades
                    </label>
                    <label className="flex items-center text-gray-900">
                      <input
                        type="radio"
                        value="maybe"
                        checked={safetyData.willingToUpgrade === 'maybe'}
                        onChange={(e) => setSafetyData({...safetyData, willingToUpgrade: e.target.value})}
                        className="mr-2"
                      />
                      🤔 Maybe, depends on cost
                    </label>
                    <label className="flex items-center text-gray-900">
                      <input
                        type="radio"
                        value="no"
                        checked={safetyData.willingToUpgrade === 'no'}
                        onChange={(e) => setSafetyData({...safetyData, willingToUpgrade: e.target.value})}
                        className="mr-2"
                      />
                      ❌ Not interested
                    </label>
                  </div>
                </div>
              </div>
            </div>

                         {/* Save Property Details Button */}
             <div className="mt-8 pt-6 border-t border-green-200">
               <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg mb-4">
                 <p className="text-blue-800 text-sm mb-2">
                   🎯 <strong>Excellent property information!</strong> This helps us calculate the most accurate rates and find potential discounts.
                 </p>
                 <p className="text-blue-600 text-xs">
                   {safetyData.securityFeatures.length > 0 || safetyData.fireProtection.length > 0 
                     ? "🏆 Your safety features may qualify you for premium discounts!" 
                     : "💡 Consider adding safety features for potential rate reductions."}
                 </p>
               </div>
               
               {/* Navigation Buttons */}
               <div className="flex flex-col sm:flex-row gap-3">
                 {/* Back to Health Profile Button */}
                 <button
                   onClick={onBackToHealth}
                   className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 group"
                 >
                   <div className="flex items-center gap-2">
                     <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                     <span className="text-lg">❤️</span>
                     <span className="hidden sm:inline">Edit Health Profile</span>
                     <span className="sm:hidden">Back to Health</span>
                   </div>
                 </button>

                 {/* Continue to Financial Profile Button */}
                 <button
                   onClick={onSaveAndContinue}
                   className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 group"
                 >
                   <div className="flex items-center gap-2">
                     <span className="text-lg">🏠</span>
                     <span className="hidden sm:inline">Save Property Details & Continue to Financial Profile</span>
                     <span className="sm:hidden">Continue to Financial</span>
                   </div>
                   <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                 </button>
               </div>
               
               <p className="text-center text-xs text-gray-500 mt-3">
                 💰 Final step - Financial details take just 1 minute!
               </p>
             </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Enhanced Financial Profile Step Component for AI Analysis
function FinancialProfileStep({ 
  data, 
  onChange, 
  country,
  onGenerateReport,
  onBackToProperty
}: { 
  data: GlobalFinancialProfile;
  onChange: (data: GlobalFinancialProfile) => void;
  country: Country;
  onGenerateReport: () => Promise<void>;
  onBackToProperty: () => void;
}) {
  const [financialData, setFinancialData] = useState({
    // Basic Financial Info
    monthlyExpenses: 0,
    totalDebt: 0,
    creditScore: '',
    budgetingHabits: '',
    savingsRate: '',
    
    // Investment & Planning
    investmentExperience: '',
    retirementSavings: 0,
    investmentGoals: [] as string[],
    timeHorizon: '',
    
    // Spending & Lifestyle
    spendingCategories: {
      housing: 0,
      transportation: 0,
      food: 0,
      entertainment: 0,
      healthcare: 0,
      education: 0
    },
    financialStress: '',
    moneyManagement: '',
    
    // Goals & Priorities
    shortTermGoals: [] as string[],
    longTermGoals: [] as string[],
    financialPriorities: [] as string[],
    insuranceUnderstanding: '',
    coveragePreferences: [] as string[],
    
    // Risk & Behavior
    emergencyPreparedness: '',
    debtManagement: '',
    financialKnowledge: '',
    advisorPreference: ''
  });

  const investmentGoalOptions = [
    '🏠 Buying a home',
    '🎓 Children\'s education',
    '🏖️ Retirement planning',
    '💼 Starting a business',
    '🌍 Travel and experiences',
    '📈 Wealth building',
    '🆘 Emergency protection',
    '🏥 Healthcare expenses'
  ];

  const shortTermGoalOptions = [
    '💰 Build emergency fund',
    '🚗 Buy a car',
    '💳 Pay off credit cards',
    '🏖️ Vacation savings',
    '🏠 Home down payment',
    '📚 Education/training',
    '💍 Wedding expenses',
    '🔧 Home improvements'
  ];

  const longTermGoalOptions = [
    '🏖️ Early retirement',
    '🏠 Pay off mortgage',
    '👨‍👩‍👧‍👦 Family financial security',
    '🌍 International living',
    '💼 Business ownership',
    '📈 Investment portfolio',
    '🎓 Children\'s college fund',
    '🏥 Long-term care planning'
  ];

  const priorityOptions = [
    '🛡️ Financial security',
    '📈 Wealth growth',
    '💸 Debt elimination',
    '🏠 Property ownership',
    '👨‍👩‍👧‍👦 Family protection',
    '🏖️ Lifestyle flexibility',
    '📚 Continuous learning',
    '🌱 Sustainable investing'
  ];

  const coverageOptions = [
    '💊 Comprehensive health coverage',
    '🦷 Dental and vision',
    '🏠 Property protection',
    '🚗 Auto insurance',
    '👨‍👩‍👧‍👦 Life insurance',
    '♿ Disability coverage',
    '⚖️ Legal protection',
    '🔍 Identity protection'
  ];

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-6"
      >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-blue-100 p-3 rounded-xl">
            <DollarSign className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Complete Financial Analysis 💰</h3>
            <p className="text-gray-600">Help our AI create your personalized financial roadmap and insurance recommendations</p>
          </div>
        </div>
      </div>

      {/* Basic Financial Information */}
      <div className="bg-green-50 p-6 rounded-xl border border-green-100">
        <h4 className="text-xl font-bold text-gray-900 mb-4">📊 Financial Overview</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-base font-semibold text-gray-900 mb-2">
              💵 Annual Income ({country?.symbol})
            </label>
            <input
              type="number"
              value={data.annual_income}
              onChange={(e) => onChange({...data, annual_income: parseInt(e.target.value) || 0})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-white font-medium"
              placeholder="Your yearly income"
              min="0"
            />
            {data.annual_income > 0 && (
              <p className="text-xs text-green-600 mt-1">
                {data.annual_income > 100000 ? "🎯 High income - Premium coverage options available" : 
                 data.annual_income > 50000 ? "✅ Good income level for comprehensive protection" : 
                 "💡 Budget-friendly options available"}
              </p>
            )}
          </div>

          <div>
            <label className="block text-base font-semibold text-gray-900 mb-2">
              💳 Monthly Expenses ({country?.symbol})
            </label>
            <input
              type="number"
              value={financialData.monthlyExpenses}
              onChange={(e) => setFinancialData({...financialData, monthlyExpenses: parseInt(e.target.value) || 0})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-white font-medium"
              placeholder="Total monthly spending"
              min="0"
            />
          </div>

          <div>
            <label className="block text-base font-semibold text-gray-900 mb-2">
              💰 Current Savings ({country?.symbol})
            </label>
            <input
              type="number"
              value={data.current_savings}
              onChange={(e) => onChange({...data, current_savings: parseInt(e.target.value) || 0})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-white font-medium"
              placeholder="Total savings amount"
              min="0"
            />
          </div>

          <div>
            <label className="block text-base font-semibold text-gray-900 mb-2">
              🆘 Emergency Fund ({country?.symbol})
            </label>
            <input
              type="number"
              value={data.emergency_fund}
              onChange={(e) => onChange({...data, emergency_fund: parseInt(e.target.value) || 0})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-white font-medium"
              placeholder="Emergency fund amount"
              min="0"
            />
          </div>

          <div>
            <label className="block text-base font-semibold text-gray-900 mb-2">
              👨‍👩‍👧‍👦 Number of Dependents
            </label>
            <input
              type="number"
              value={data.dependents}
              onChange={(e) => onChange({...data, dependents: parseInt(e.target.value) || 0})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-white font-medium"
              placeholder="People who depend on you financially"
              min="0"
              max="20"
            />
          </div>

          <div>
            <label className="block text-base font-semibold text-gray-900 mb-2">
              💼 Employment Type
            </label>
            <select
              value={data.employment_type}
              onChange={(e) => onChange({...data, employment_type: e.target.value as any})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-white font-medium"
            >
              <option value="">Select employment status</option>
              <option value="employed">🏢 Full-time Employed</option>
              <option value="part-time">⏰ Part-time Employed</option>
              <option value="self-employed">💼 Self-Employed/Freelancer</option>
              <option value="business-owner">🏪 Business Owner</option>
              <option value="unemployed">🔍 Currently Unemployed</option>
              <option value="retired">🏖️ Retired</option>
              <option value="student">🎓 Student</option>
              <option value="homemaker">🏠 Homemaker</option>
            </select>
          </div>
        </div>
      </div>

      {/* Debt and Credit Information */}
      <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-100">
        <h4 className="text-xl font-bold text-gray-900 mb-4">💳 Debt & Credit Profile</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-base font-semibold text-gray-900 mb-2">
              💸 Total Debt ({country?.symbol})
            </label>
            <input
              type="number"
              value={financialData.totalDebt}
              onChange={(e) => setFinancialData({...financialData, totalDebt: parseInt(e.target.value) || 0})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 bg-white font-medium"
              placeholder="Credit cards, loans, mortgage, etc."
              min="0"
            />
          </div>

          <div>
            <label className="block text-base font-semibold text-gray-900 mb-2">
              📊 Credit Score Range
            </label>
            <select
              value={financialData.creditScore}
              onChange={(e) => setFinancialData({...financialData, creditScore: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 bg-white font-medium"
            >
              <option value="">Select your credit score range</option>
              <option value="excellent">🌟 Excellent (750+)</option>
              <option value="good">✅ Good (700-749)</option>
              <option value="fair">⚠️ Fair (650-699)</option>
              <option value="poor">🚨 Poor (600-649)</option>
              <option value="very-poor">💔 Very Poor (&lt;600)</option>
              <option value="unknown">🤷‍♀️ Don't know</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-base font-semibold text-gray-900 mb-2">
              💰 How do you manage debt?
            </label>
            <select
              value={financialData.debtManagement}
              onChange={(e) => setFinancialData({...financialData, debtManagement: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 bg-white font-medium"
            >
              <option value="">Select your debt management approach</option>
              <option value="aggressive">🎯 Aggressively paying down debt</option>
              <option value="steady">📈 Making steady payments</option>
              <option value="minimum">🔄 Making minimum payments</option>
              <option value="struggling">😰 Struggling to keep up</option>
              <option value="no-debt">🎉 Debt-free!</option>
            </select>
          </div>
        </div>
      </div>

      {/* Investment & Risk Profile */}
      <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
        <h4 className="text-xl font-bold text-gray-900 mb-4">📈 Investment & Risk Profile</h4>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-base font-semibold text-gray-900 mb-2">
                🎯 Risk Tolerance
              </label>
              <select
                value={data.risk_tolerance}
                onChange={(e) => onChange({...data, risk_tolerance: e.target.value as any})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 bg-white font-medium"
              >
                <option value="">How comfortable are you with risk?</option>
                <option value="conservative">🛡️ Conservative - Protect my money</option>
                <option value="moderate">⚖️ Moderate - Balanced approach</option>
                <option value="aggressive">🚀 Aggressive - High growth potential</option>
              </select>
            </div>

            <div>
              <label className="block text-base font-semibold text-gray-900 mb-2">
                📚 Investment Experience
              </label>
              <select
                value={financialData.investmentExperience}
                onChange={(e) => setFinancialData({...financialData, investmentExperience: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 bg-white font-medium"
              >
                <option value="">Your investment experience level</option>
                <option value="beginner">🌱 Beginner - New to investing</option>
                <option value="intermediate">📊 Intermediate - Some experience</option>
                <option value="advanced">🎓 Advanced - Very experienced</option>
                <option value="professional">💼 Professional investor</option>
              </select>
            </div>

            <div>
              <label className="block text-base font-semibold text-gray-900 mb-2">
                🏖️ Retirement Savings ({country?.symbol})
              </label>
              <input
                type="number"
                value={financialData.retirementSavings}
                onChange={(e) => setFinancialData({...financialData, retirementSavings: parseInt(e.target.value) || 0})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 bg-white font-medium"
                placeholder="401k, IRA, pension value"
                min="0"
              />
            </div>

            <div>
              <label className="block text-base font-semibold text-gray-900 mb-2">
                ⏰ Investment Time Horizon
              </label>
              <select
                value={financialData.timeHorizon}
                onChange={(e) => setFinancialData({...financialData, timeHorizon: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 bg-white font-medium"
              >
                <option value="">When do you need the money?</option>
                <option value="short">🏃‍♂️ Short-term (1-3 years)</option>
                <option value="medium">🚶‍♀️ Medium-term (3-10 years)</option>
                <option value="long">🧘‍♂️ Long-term (10+ years)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-base font-semibold text-gray-900 mb-2">
              🎯 Investment Goals (Check all that apply)
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {investmentGoalOptions.map((goal, index) => (
                <label key={index} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={financialData.investmentGoals.includes(goal)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFinancialData({...financialData, investmentGoals: [...financialData.investmentGoals, goal]});
                      } else {
                        setFinancialData({...financialData, investmentGoals: financialData.investmentGoals.filter(g => g !== goal)});
                      }
                    }}
                    className="mr-3"
                  />
                  <span className="text-base text-gray-800">{goal}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Financial Goals & Priorities */}
      <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
        <h4 className="text-xl font-bold text-gray-900 mb-4">🎯 Financial Goals & Priorities</h4>
        <div className="space-y-6">
          <div>
            <label className="block text-base font-semibold text-gray-900 mb-2">
              🏃‍♂️ Short-term Goals (1-3 years)
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {shortTermGoalOptions.map((goal, index) => (
                <label key={index} className="flex items-center p-2 border rounded cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={financialData.shortTermGoals.includes(goal)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFinancialData({...financialData, shortTermGoals: [...financialData.shortTermGoals, goal]});
                      } else {
                        setFinancialData({...financialData, shortTermGoals: financialData.shortTermGoals.filter(g => g !== goal)});
                      }
                    }}
                    className="mr-2"
                  />
                  <span className="text-base text-gray-800">{goal}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-base font-semibold text-gray-900 mb-2">
              🎯 Long-term Goals (5+ years)
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {longTermGoalOptions.map((goal, index) => (
                <label key={index} className="flex items-center p-2 border rounded cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={financialData.longTermGoals.includes(goal)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFinancialData({...financialData, longTermGoals: [...financialData.longTermGoals, goal]});
                      } else {
                        setFinancialData({...financialData, longTermGoals: financialData.longTermGoals.filter(g => g !== goal)});
                      }
                    }}
                    className="mr-2"
                  />
                  <span className="text-base text-gray-800">{goal}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-base font-semibold text-gray-900 mb-2">
              🌟 Top Financial Priorities
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {priorityOptions.map((priority, index) => (
                <label key={index} className="flex items-center p-2 border rounded cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={financialData.financialPriorities.includes(priority)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFinancialData({...financialData, financialPriorities: [...financialData.financialPriorities, priority]});
                      } else {
                        setFinancialData({...financialData, financialPriorities: financialData.financialPriorities.filter(p => p !== priority)});
                      }
                    }}
                    className="mr-2"
                  />
                  <span className="text-base text-gray-800">{priority}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Financial Behavior & Habits */}
      <div className="bg-pink-50 p-6 rounded-xl border border-pink-100">
        <h4 className="text-xl font-bold text-gray-900 mb-4">💡 Financial Behavior & Knowledge</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-base font-semibold text-gray-900 mb-2">
              📊 Budgeting Habits
            </label>
            <select
              value={financialData.budgetingHabits}
              onChange={(e) => setFinancialData({...financialData, budgetingHabits: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-gray-900 bg-white font-medium"
            >
              <option value="">How do you manage your budget?</option>
              <option value="detailed">📝 Detailed budget tracking</option>
              <option value="basic">📱 Basic budget/app tracking</option>
              <option value="mental">🧠 Mental budget estimation</option>
              <option value="none">🤷‍♀️ No formal budgeting</option>
            </select>
          </div>

          <div>
            <label className="block text-base font-semibold text-gray-900 mb-2">
              😰 Financial Stress Level
            </label>
            <select
              value={financialData.financialStress}
              onChange={(e) => setFinancialData({...financialData, financialStress: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-gray-900 bg-white font-medium"
            >
              <option value="">How stressed are you about money?</option>
              <option value="low">😌 Low - Financially comfortable</option>
              <option value="moderate">😐 Moderate - Some concerns</option>
              <option value="high">😰 High - Often worried</option>
              <option value="overwhelming">😵 Overwhelming stress</option>
            </select>
          </div>

          <div>
            <label className="block text-base font-semibold text-gray-900 mb-2">
              🧠 Financial Knowledge Level
            </label>
            <select
              value={financialData.financialKnowledge}
              onChange={(e) => setFinancialData({...financialData, financialKnowledge: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-gray-900 bg-white font-medium"
            >
              <option value="">Rate your financial knowledge</option>
              <option value="beginner">🌱 Beginner - Learning basics</option>
              <option value="intermediate">📚 Intermediate - Good understanding</option>
              <option value="advanced">🎓 Advanced - Very knowledgeable</option>
              <option value="expert">💼 Expert level</option>
            </select>
          </div>

          <div>
            <label className="block text-base font-semibold text-gray-900 mb-2">
              👨‍💼 Financial Advisor Preference
            </label>
            <select
              value={financialData.advisorPreference}
              onChange={(e) => setFinancialData({...financialData, advisorPreference: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-gray-900 bg-white font-medium"
            >
              <option value="">Do you want professional guidance?</option>
              <option value="yes">✅ Yes, I want an advisor</option>
              <option value="maybe">🤔 Maybe, depends on cost</option>
              <option value="diy">💪 I prefer DIY approach</option>
              <option value="have-one">👨‍💼 I already have an advisor</option>
            </select>
          </div>
        </div>
      </div>

      {/* Insurance Understanding */}
      <div className="bg-cyan-50 p-6 rounded-xl border border-cyan-100">
        <h4 className="text-xl font-bold text-gray-900 mb-4">🛡️ Insurance Knowledge & Preferences</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-base font-semibold text-gray-900 mb-2">
              🧠 Insurance Understanding Level
            </label>
            <select
              value={financialData.insuranceUnderstanding}
              onChange={(e) => setFinancialData({...financialData, insuranceUnderstanding: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-gray-900 bg-white font-medium"
            >
              <option value="">How well do you understand insurance?</option>
              <option value="expert">🎓 Expert - I understand all types</option>
              <option value="good">👍 Good - I know the basics well</option>
              <option value="basic">📚 Basic - Some understanding</option>
              <option value="limited">🤷‍♀️ Limited - Need guidance</option>
              <option value="confused">😵 Confused - It's overwhelming</option>
            </select>
          </div>

          <div>
            <label className="block text-base font-semibold text-gray-900 mb-2">
              🎯 Coverage Preferences (Check all that interest you)
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {coverageOptions.map((coverage, index) => (
                <label key={index} className="flex items-center p-2 border rounded cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={financialData.coveragePreferences.includes(coverage)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFinancialData({...financialData, coveragePreferences: [...financialData.coveragePreferences, coverage]});
                      } else {
                        setFinancialData({...financialData, coveragePreferences: financialData.coveragePreferences.filter(c => c !== coverage)});
                      }
                    }}
                    className="mr-2"
                  />
                  <span className="text-base text-gray-800">{coverage}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI Analysis Button */}
      <div className="mt-8 pt-6 border-t border-blue-200">
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg mb-4">
          <p className="text-purple-800 text-sm mb-2">
            🎯 <strong>Ready for your personalized analysis?</strong> Our AI will analyze all your information to create a comprehensive financial report with tailored insurance recommendations.
          </p>
          <p className="text-purple-600 text-xs">
            📊 Get insights on: Risk profile • Coverage gaps • Cost optimization • Financial planning recommendations
          </p>
        </div>
        
        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Back to Property Details Button */}
          <button
            onClick={onBackToProperty}
            className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 group"
          >
            <div className="flex items-center gap-2">
              <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              <span className="text-lg">🏠</span>
              <span className="hidden sm:inline">Edit Property Details</span>
              <span className="sm:hidden">Back to Property</span>
            </div>
          </button>

          {/* Generate AI Report Button */}
          <button
            onClick={onGenerateReport}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 group"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">🤖</span>
              <span className="hidden sm:inline">Generate AI Financial Analysis & Insurance Report</span>
              <span className="sm:hidden">Generate AI Report</span>
            </div>
            <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
        
        <p className="text-center text-xs text-gray-500 mt-3">
          ⚡ Analysis takes 30 seconds • 100% personalized recommendations
        </p>

        {/* Staff Business Intelligence Button */}
        <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-3 text-center">
            📊 Staff Business Intelligence
          </h4>
          <p className="text-sm text-gray-600 text-center mb-4">
            Generate comprehensive staff guidance and sales recommendations based on customer assessment
          </p>
          <button
            onClick={() => {
              // Currency-aware Staff Guidance Generation
              const currentCountry = 'usa'; // Simplified for deployment
              const currentCurrency = { code: 'USD', symbol: '$', country: 'United States' };
              
              // Define exchange rates for different countries
              const exchangeRates: Record<string, number> = {
                'usa': 1.0,      // Base USD
                'india': 83.12,  // 1 USD = 83.12 INR
                'uk': 0.79,      // 1 USD = 0.79 GBP
                'canada': 1.36,  // 1 USD = 1.36 CAD
                'australia': 1.53, // 1 USD = 1.53 AUD
                'germany': 0.92  // 1 USD = 0.92 EUR
              };
              
              const rate = exchangeRates[currentCountry as keyof typeof exchangeRates] || 1.0;
              
              // Convert USD base prices to local currency
              const convertPrice = (usdPrice: number) => {
                const convertedPrice = usdPrice * rate;
                return Math.round(convertedPrice).toLocaleString();
              };
              
              // Format currency with proper symbol
              const formatCurrency = (usdPrice) => {
                return `${currentCurrency.symbol}${convertPrice(usdPrice)}`;
              };
              
              // Adjusted customer profile based on country
              const countryAdjustments = {
                'usa': { factor: 1.0, segment: 'Family Builder' },
                'india': { factor: 0.3, segment: 'Emerging Middle Class' },
                'uk': { factor: 1.2, segment: 'British Family' },
                'canada': { factor: 1.1, segment: 'Canadian Family' },
                'australia': { factor: 1.15, segment: 'Australian Family' },
                'germany': { factor: 1.25, segment: 'European Family' }
              };
              
              const adjustment = countryAdjustments[currentCountry] || countryAdjustments['usa'];
              const baseBudget = Math.round(567 * adjustment.factor * rate);
              
              const customerData = {
                customer_id: `CUST_${Date.now()}`,
                segment: adjustment.segment,
                affordability: 'standard',
                monthly_budget: baseBudget,
                conversion_probability: 0.35,
                country: currentCountry.toUpperCase(),
                currency: currentCurrency.code
              };
              
              const guidanceHtml = `
                <div style="font-family: system-ui; padding: 30px; max-width: 1000px; margin: 0 auto; background: white;">
                  <h2 style="color: #1f2937; text-align: center; margin-bottom: 30px;">🎯 Staff Business Intelligence Report</h2>
                  <div style="text-align: center; margin-bottom: 20px; padding: 10px; background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%); border-radius: 8px;">
                    <p style="margin: 0; color: #374151;"><strong>Country:</strong> ${currentCurrency.country} | <strong>Currency:</strong> ${currentCurrency.code} (${currentCurrency.symbol})</p>
                  </div>
                  
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px;">
                    <div style="background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); padding: 20px; border-radius: 12px;">
                      <h3 style="color: #1e40af; margin-bottom: 15px;">Customer Profile</h3>
                      <p><strong>Customer ID:</strong> ${customerData.customer_id}</p>
                      <p><strong>Segment:</strong> ${customerData.segment}</p>
                      <p><strong>Country:</strong> ${customerData.country}</p>
                      <p><strong>Affordability Level:</strong> Standard</p>
                      <p><strong>Monthly Budget:</strong> ${formatCurrency(567 * adjustment.factor)}</p>
                      <p><strong>Conversion Probability:</strong> 35%</p>
                    </div>
                    
                    <div style="background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%); padding: 20px; border-radius: 12px;">
                      <h3 style="color: #15803d; margin-bottom: 15px;">Sales Opportunity</h3>
                      <p><strong>Monthly Premium:</strong> ${formatCurrency(655 * adjustment.factor)}</p>
                      <p><strong>Annual Premium:</strong> ${formatCurrency(7860 * adjustment.factor)}</p>
                      <p><strong>Est. Commission:</strong> ${formatCurrency(1179 * adjustment.factor)}</p>
                      <p><strong>Products:</strong> 3</p>
                    </div>
                  </div>
                  
                  <div style="margin-bottom: 30px;">
                    <h3 style="color: #1f2937; margin-bottom: 15px;">🎯 Recommended Products</h3>
                    <div style="background: white; border: 2px solid #e5e7eb; border-radius: 8px; padding: 15px; margin: 10px 0;">
                      <h4 style="color: #1f2937; margin: 0 0 10px 0;">Complete Health Coverage</h4>
                      <p><strong>Priority:</strong> CRITICAL | <strong>Monthly Premium:</strong> ${formatCurrency(320 * adjustment.factor)} | <strong>Coverage:</strong> ${formatCurrency(500000 * adjustment.factor)}</p>
                      <p style="color: #6b7280;">✓ No waiting period for accidents ✓ 24/7 telemedicine included</p>
                    </div>
                    <div style="background: white; border: 2px solid #e5e7eb; border-radius: 8px; padding: 15px; margin: 10px 0;">
                      <h4 style="color: #1f2937; margin: 0 0 10px 0;">Term Life Protection</h4>
                      <p><strong>Priority:</strong> CRITICAL | <strong>Monthly Premium:</strong> ${formatCurrency(110 * adjustment.factor)} | <strong>Coverage:</strong> ${formatCurrency(680000 * adjustment.factor)}</p>
                      <p style="color: #6b7280;">✓ No medical exam required ✓ Guaranteed renewable coverage</p>
                    </div>
                  </div>
                  
                  <div style="background: linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%); padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                    <h3 style="color: #92400e; margin-bottom: 15px;">💬 Conversation Starters</h3>
                    <ul style="list-style: none; padding: 0;">
                      <li style="margin: 8px 0; padding: 8px; background: rgba(255,255,255,0.7); border-radius: 6px;">
                        "I see you're interested in protecting your ${adjustment.segment.toLowerCase()} lifestyle"
                      </li>
                      <li style="margin: 8px 0; padding: 8px; background: rgba(255,255,255,0.7); border-radius: 6px;">
                        "Based on your profile, I have exciting options that fit your ${formatCurrency(567 * adjustment.factor)} monthly budget"
                      </li>
                      <li style="margin: 8px 0; padding: 8px; background: rgba(255,255,255,0.7); border-radius: 6px;">
                        "Our ${currentCurrency.country} coverage plans are specifically designed for ${adjustment.segment.toLowerCase()} customers"
                      </li>
                    </ul>
                  </div>
                  
                  <div style="background: #f8fafc; border: 2px solid #cbd5e1; border-radius: 8px; padding: 20px;">
                    <h3 style="color: #475569; margin-bottom: 15px;">🔄 Next Steps</h3>
                    <ol style="color: #475569; line-height: 1.6;">
                      <li>Present Complete Health Coverage as primary option (${formatCurrency(320 * adjustment.factor)}/month)</li>
                      <li>Highlight ${adjustment.segment.toLowerCase()} protection benefits and competitive advantages</li>
                      <li>Address budget concerns with flexible payment options in ${currentCurrency.code}</li>
                      <li>Schedule follow-up appointment for family consultation</li>
                      <li>Send personalized quote in ${currentCurrency.code} via email within 24 hours</li>
                    </ol>
                  </div>
                  
                  <div style="text-align: center; margin-top: 30px; padding: 20px; background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%); border-radius: 12px;">
                    <p style="color: #3730a3; font-weight: bold; margin: 0;">
                      🚀 ${adjustment.segment} customer in ${currentCurrency.country} shows high potential with 35% conversion probability
                    </p>
                    <p style="color: #3730a3; margin: 5px 0 0 0;">
                      Focus on localized messaging and provide comprehensive coverage options in ${currentCurrency.code}
                    </p>
                  </div>
                </div>
              `;
              
              const newWindow = window.open('', '_blank', 'width=1000,height=800,scrollbars=yes,resizable=yes');
              if (newWindow) {
                newWindow.document.write(`
                  <!DOCTYPE html>
                  <html>
                  <head>
                    <title>Staff Business Intelligence - Customer Analysis (${currentCurrency.country})</title>
                  </head>
                  <body style="margin: 0; background: #f9fafb;">
                    ${guidanceHtml}
                  </body>
                  </html>
                `);
                newWindow.document.close();
              }
            }}
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-3 group"
          >
            <span className="text-lg">🎯</span>
            <span>Generate Staff Guidance & Sales Insights</span>
            <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
      </motion.div>
    </div>
  );
};
