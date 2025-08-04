"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCurrency, useCurrencyConverter } from '@/contexts/CurrencyContext';
import { 
  Brain, Zap, TrendingUp, Shield, DollarSign, Target, 
  CheckCircle, AlertTriangle, Info, Download, ArrowRight,
  Sparkles, Activity, BarChart3, PieChart, LineChart,
  Bot, Cpu, Eye, Star, Award, Lightbulb
} from 'lucide-react';

interface AIAnalysisReportProps {
  isOpen: boolean;
  onClose: () => void;
  analysisData: any;
}

export function AIAnalysisReport({ isOpen, onClose, analysisData }: AIAnalysisReportProps) {
  // Currency context integration
  const { homeCurrency, formatHomeAmount, homeCountry, convertToComparison, refreshRates } = useCurrency();

  const [loadingStage, setLoadingStage] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [animateCards, setAnimateCards] = useState(false);

  const loadingStages = [
    { icon: Brain, text: "Analyzing your financial profile...", color: "text-blue-500" },
    { icon: Zap, text: "Processing health and property data...", color: "text-purple-500" },
    { icon: Activity, text: "Researching market trends...", color: "text-green-500" },
    { icon: BarChart3, text: "Calculating risk assessments...", color: "text-orange-500" },
    { icon: Target, text: "Generating personalized recommendations...", color: "text-pink-500" },
    { icon: Sparkles, text: "Finalizing your comprehensive report...", color: "text-indigo-500" }
  ];

  useEffect(() => {
    if (isOpen && analysisData) {
      // Refresh currency rates for accurate conversion
      refreshRates().then(() => {
        console.log('🔄 Currency rates refreshed for analysis report');
        console.log('💱 Current exchange rate:', homeCurrency?.symbol);
      });

      // Simulate AI processing stages
      const stageInterval = setInterval(() => {
        setLoadingStage(prev => {
          if (prev < loadingStages.length - 1) {
            return prev + 1;
          } else {
            clearInterval(stageInterval);
            setTimeout(() => {
              setShowResults(true);
              setTimeout(() => setAnimateCards(true), 300);
            }, 1000);
            return prev;
          }
        });
      }, 800);

      return () => clearInterval(stageInterval);
    }
  }, [isOpen, analysisData, homeCountry]);

  const handleDownloadReport = () => {
    try {
      const reportContent = localStorage.getItem('latest_detailed_report') || 'Report not available';
      const blob = new Blob([reportContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `financial_analysis_report_${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk?.toLowerCase()) {
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      case 'moderate': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk?.toLowerCase()) {
      case 'low': return CheckCircle;
      case 'moderate': return AlertTriangle;
      case 'high': return AlertTriangle;
      default: return Info;
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-gradient-to-br from-blue-900/95 via-purple-900/95 to-indigo-900/95 backdrop-blur-sm z-50 overflow-y-auto"
      >
        <div className="min-h-screen p-4">
          {/* Loading Stage */}
          {!showResults && (
            <div className="flex items-center justify-center min-h-screen">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 max-w-2xl mx-auto text-center border border-white/20"
              >
                {/* AI Brain Animation */}
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 180, 360],
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="mx-auto mb-8 w-24 h-24 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full flex items-center justify-center"
                                  >
                    <Bot className="w-12 h-12 text-white" />
                  </motion.div>

                {/* Loading Progress */}
                <div className="mb-8">
                  <motion.div
                    className="h-2 bg-white/20 rounded-full overflow-hidden mb-4"
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${((loadingStage + 1) / loadingStages.length) * 100}%` }}
                      transition={{ duration: 0.5 }}
                      className="h-full bg-gradient-to-r from-blue-400 to-purple-600"
                    />
                  </motion.div>
                  <p className="text-white/80 text-sm">
                    {Math.round(((loadingStage + 1) / loadingStages.length) * 100)}% Complete
                  </p>
                </div>

                {/* Current Stage */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={loadingStage}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                  >
                    <motion.div
                      animate={{ 
                        y: [0, -10, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ 
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-4 ${loadingStages[loadingStage]?.color || ''}`}
                    >
                      {(() => {
                        const currentStage = loadingStages[loadingStage];
                        if (!currentStage) return null;
                        const IconComponent = currentStage.icon;
                        return <IconComponent className="w-8 h-8" />;
                      })()}
                    </motion.div>
                    <h3 className="text-2xl font-bold text-white mb-2">AI Analysis in Progress</h3>
                    <p className="text-lg text-white/90 mb-4">
                      {loadingStages[loadingStage]?.text}
                    </p>
                    
                    {/* Floating particles effect */}
                    <div className="relative">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          animate={{
                            y: [0, -20, 0],
                            opacity: [0.3, 1, 0.3],
                            scale: [0.5, 1, 0.5]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.3,
                            ease: "easeInOut"
                          }}
                          className="absolute w-2 h-2 bg-blue-400 rounded-full"
                          style={{
                            left: `${20 + i * 15}%`,
                            top: `-${i * 5}px`
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </div>
          )}

          {/* Results Display */}
          {showResults && analysisData && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-7xl mx-auto"
            >
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center mb-8"
              >
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
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
                    className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center"
                  >
                    <Award className="w-10 h-10 text-white" />
                  </motion.div>
                  
                  <h1 className="text-4xl font-bold text-white mb-3">
                    🎯 AI Financial Analysis Complete!
                  </h1>
                  <p className="text-xl text-white/90 mb-4">
                    Your comprehensive financial roadmap is ready
                  </p>
                  
                  {/* Currency Debug Info */}
                  <div className="bg-white/10 rounded-lg p-2 mb-4 text-sm text-white/80">
                    Currency: {homeCurrency?.country} ({homeCurrency?.code}) {homeCurrency?.symbol}<br/>
                    Exchange Rate: {homeCurrency?.symbol}<br/>
                    Base USD: $1,200 annual, $100 monthly
                  </div>
                  
                  <div className="flex items-center justify-center gap-6 text-white/80">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-5 h-5" />
                      <span>AI Powered</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="w-5 h-5" />
                      <span>Personalized</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5" />
                      <span>Expert Level</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Risk Assessment Cards */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: animateCards ? 1 : 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
              >
                {[
                  { 
                    title: "Health Risk", 
                    value: analysisData.riskAssessment?.healthRisk || "N/A",
                    icon: Activity,
                    description: "Based on lifestyle and health factors"
                  },
                  { 
                    title: "Financial Risk", 
                    value: analysisData.riskAssessment?.financialRisk || "N/A",
                    icon: DollarSign,
                    description: "Emergency fund and income stability"
                  },
                  { 
                    title: "Property Risk", 
                    value: analysisData.riskAssessment?.propertyRisk || "N/A",
                    icon: Shield,
                    description: "Location and property characteristics"
                  },
                  { 
                    title: "Overall Risk", 
                    value: analysisData.riskAssessment?.overallRisk || "N/A",
                    icon: Target,
                    description: "Comprehensive risk evaluation"
                  }
                ].map((risk, index) => {
                  const RiskIcon = getRiskIcon(risk.value);
                  return (
                    <motion.div
                      key={risk.title}
                      initial={{ opacity: 0, y: 30, scale: 0.9 }}
                      animate={{ 
                        opacity: animateCards ? 1 : 0, 
                        y: animateCards ? 0 : 30,
                        scale: animateCards ? 1 : 0.9
                      }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                      className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <risk.icon className="w-8 h-8 text-blue-400" />
                        <RiskIcon className={`w-6 h-6 ${getRiskColor(risk.value).split(' ')[0]}`} />
                      </div>
                      
                      <h3 className="text-lg font-semibold text-white mb-2">{risk.title}</h3>
                      
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getRiskColor(risk.value)}`}>
                        {risk.value}
                      </div>
                      
                      <p className="text-white/70 text-sm mt-3">{risk.description}</p>
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* Key Recommendations */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: animateCards ? 1 : 0, y: animateCards ? 0 : 30 }}
                transition={{ delay: 1 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
              >
                {/* Insurance Recommendations */}
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Insurance Priorities</h3>
                      <p className="text-white/70">Protect what matters most</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: animateCards ? 1 : 0, x: animateCards ? 0 : -20 }}
                      transition={{ delay: 1.2 }}
                      className="flex items-start gap-3 p-4 bg-white/5 rounded-lg"
                    >
                      <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-white font-medium">Priority Coverage</p>
                        <p className="text-white/80 text-sm">
                          {analysisData.recommendations?.insurance?.priority || "Health and property insurance recommended"}
                        </p>
                      </div>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: animateCards ? 1 : 0, x: animateCards ? 0 : -20 }}
                      transition={{ delay: 1.3 }}
                      className="flex items-start gap-3 p-4 bg-white/5 rounded-lg"
                    >
                      <Lightbulb className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-white font-medium">Health Insurance</p>
                        <p className="text-white/80 text-sm">
                          {analysisData.recommendations?.insurance?.health || "Comprehensive coverage recommended"}
                        </p>
                      </div>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: animateCards ? 1 : 0, x: animateCards ? 0 : -20 }}
                      transition={{ delay: 1.4 }}
                      className="flex items-start gap-3 p-4 bg-white/5 rounded-lg"
                    >
                      <Target className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-white font-medium">Property Protection</p>
                        <p className="text-white/80 text-sm">
                          {analysisData.recommendations?.insurance?.property || "Full replacement cost coverage advised"}
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Financial Recommendations */}
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Financial Strategy</h3>
                      <p className="text-white/70">Build your wealth foundation</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: animateCards ? 1 : 0, x: animateCards ? 0 : 20 }}
                      transition={{ delay: 1.2 }}
                      className="flex items-start gap-3 p-4 bg-white/5 rounded-lg"
                    >
                      <DollarSign className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-white font-medium">Emergency Fund</p>
                        <p className="text-white/80 text-sm">
                          {analysisData.recommendations?.financial?.emergency || "Build 6 months of expenses"}
                        </p>
                      </div>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: animateCards ? 1 : 0, x: animateCards ? 0 : 20 }}
                      transition={{ delay: 1.3 }}
                      className="flex items-start gap-3 p-4 bg-white/5 rounded-lg"
                    >
                      <BarChart3 className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-white font-medium">Investment Strategy</p>
                        <p className="text-white/80 text-sm">
                          {analysisData.recommendations?.financial?.investments || "Diversified portfolio recommended"}
                        </p>
                      </div>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: animateCards ? 1 : 0, x: animateCards ? 0 : 20 }}
                      transition={{ delay: 1.4 }}
                      className="flex items-start gap-3 p-4 bg-white/5 rounded-lg"
                    >
                      <PieChart className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-white font-medium">Debt Management</p>
                        <p className="text-white/80 text-sm">
                          {analysisData.recommendations?.financial?.debt || "Prioritize high-interest debt"}
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              {/* Savings Potential */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: animateCards ? 1 : 0, y: animateCards ? 0 : 30 }}
                transition={{ delay: 1.5 }}
                className="bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-lg rounded-xl p-8 border border-green-300/30 mb-8"
              >
                <div className="text-center">
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
                    className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center"
                  >
                    <div className="text-2xl font-bold text-white">
                      {homeCurrency?.symbol || '₹'}
                    </div>
                  </motion.div>
                  
                  <h3 className="text-2xl font-bold text-white mb-4">💰 Potential Savings Identified</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-green-400">
                        {(() => {
                          // Base amount in USD, convert to current currency
                          const baseAmountUSD = analysisData?.costOptimization?.potentialSavings?.annual || 1200;
                          const convertedAmount = homeCurrency?.code === 'USD' 
                            ? baseAmountUSD 
                            : convertToComparison(baseAmountUSD);
                          console.log(`🔄 Annual: $${baseAmountUSD} USD → ${formatHomeAmount(convertedAmount)} (${homeCountry})`);
                          return formatHomeAmount(convertedAmount);
                        })()}
                      </p>
                      <p className="text-white/80">Annual Savings</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-blue-400">
                        {(() => {
                          // Base amount in USD, convert to current currency
                          const baseAmountUSD = analysisData?.costOptimization?.potentialSavings?.monthly || 100;
                          const convertedAmount = homeCurrency?.code === 'USD' 
                            ? baseAmountUSD 
                            : convertToComparison(baseAmountUSD);
                          console.log(`🔄 Monthly: $${baseAmountUSD} USD → ${formatHomeAmount(convertedAmount)} (${homeCountry})`);
                          return formatHomeAmount(convertedAmount);
                        })()}
                      </p>
                      <p className="text-white/80">Monthly Savings</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-purple-400">
                        {analysisData?.costOptimization?.potentialSavings?.percentage || "15-25%"}
                      </p>
                      <p className="text-white/80">Total Reduction</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: animateCards ? 1 : 0, y: animateCards ? 0 : 30 }}
                transition={{ delay: 1.8 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDownloadReport}
                  className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <Download className="w-5 h-5" />
                  Download Complete Report
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="flex items-center gap-3 px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-lg text-white font-semibold rounded-xl transition-all duration-300 border border-white/20 hover:border-white/40"
                >
                  Return to Dashboard
                </motion.button>
              </motion.div>

              {/* Footer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: animateCards ? 1 : 0 }}
                transition={{ delay: 2 }}
                className="text-center mt-12 text-white/60"
              >
                <p className="text-sm">
                  🤖 Report generated by AI Financial Analysis System • 
                  {new Date().toLocaleDateString()} • 
                  Personalized for your unique profile
                </p>
              </motion.div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
} 
