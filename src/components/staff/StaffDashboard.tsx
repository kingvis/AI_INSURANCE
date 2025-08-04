'use client';

import React, { useState, useEffect } from 'react';
import { User, DollarSign, TrendingUp, AlertCircle, CheckCircle, Clock, Users, Target, MessageSquare, Phone, Mail, Calendar, Star, ShieldCheck } from 'lucide-react';

interface CustomerProfile {
  customer_id: string;
  segment: string;
  affordability_level: string;
  risk_profile: string;
  monthly_budget: number;
  lifetime_value_estimate: number;
  conversion_probability: number;
  key_motivators: string[];
  pain_points: string[];
  recommended_approach: string;
}

interface ProductRecommendation {
  product_type: string;
  product_name: string;
  monthly_premium: number;
  coverage_amount: number;
  priority: string;
  confidence_score: number;
  business_rationale: string[];
  upsell_opportunities: string[];
  competitive_advantages: string[];
}

interface StaffGuidance {
  customer_profile: CustomerProfile;
  product_recommendations: ProductRecommendation[];
  conversation_starters: string[];
  objection_handling: Record<string, string>;
  next_best_actions: string[];
  follow_up_timeline: Record<string, string>;
  sales_report: {
    customer_summary: any;
    sales_opportunity: {
      total_monthly_premium: number;
      total_annual_premium: number;
      total_coverage_amount: number;
      estimated_annual_commission: number;
      number_of_products: number;
    };
    recommendations: any[];
    success_factors: any;
  };
}

const StaffDashboard: React.FC = () => {
  const [customerData, setCustomerData] = useState<any>(null);
  const [staffGuidance, setStaffGuidance] = useState<StaffGuidance | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState('');

  // Mock customer data for demonstration
  const mockCustomers = [
    {
      id: 'CUST_001',
      name: 'John Smith',
      age: 32,
      segment: 'Family Builder',
      status: 'Assessment Complete'
    },
    {
      id: 'CUST_002', 
      name: 'Sarah Johnson',
      age: 45,
      segment: 'Established Family',
      status: 'Follow-up Required'
    },
    {
      id: 'CUST_003',
      name: 'Mike Davis',
      age: 28,
      segment: 'Young Professional',
      status: 'New Lead'
    }
  ];

  const analyzeCustomer = async (customerId: string) => {
    setLoading(true);
    setError('');
    
    try {
      // Mock customer data based on what the frontend insurance assessment would collect
      const mockCustomerData = {
        customer_id: customerId,
        health_data: {
          name: 'John Smith',
          age: 32,
          height: 175,
          weight: 75,
          gender: 'male',
          smoking: false,
          drinking_frequency: 'occasionally',
          exercise_frequency: 'moderate',
          medical_conditions: ['hypertension'],
          family_members: ['spouse', 'child1'],
          existing_insurance: []
        },
        property_data: {
          property_type: 'single_family_home',
          property_value: 450000,
          year_built: 2010,
          location: 'suburban'
        },
        financial_data: {
          annual_income: 85000,
          monthly_expenses: 4500,
          debt_to_income_ratio: 0.28,
          current_savings: 25000,
          financial_goals: ['emergency_fund', 'retirement_planning', 'family_protection'],
          credit_score: 720
        },
        safety_data: {
          hasFloodRisk: 'low',
          earthquakeRisk: 'none',
          security_measures: ['smoke_detectors', 'security_system']
        },
        country: 'US'
      };

      // For demonstration, use mock data instead of real API call
      // const response = await fetch('http://localhost:8001/api/v2/staff-guidance', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(mockCustomerData)
      // });

      // Mock staff guidance response
      const mockStaffGuidance: StaffGuidance = {
        customer_profile: {
          customer_id: customerId,
          segment: 'family_builder',
          affordability_level: 'standard',
          risk_profile: 'moderate',
          monthly_budget: 567,
          lifetime_value_estimate: 113400,
          conversion_probability: 0.35,
          key_motivators: [
            'Family protection and security',
            'Long-term financial planning',
            'Emergency preparedness'
          ],
          pain_points: [
            'Budget constraints and affordability',
            'Uncertainty about insurance value and claims process'
          ],
          recommended_approach: 'Emphasize family protection, comprehensive coverage, and value for money. Build trust with transparent, straightforward products.'
        },
        product_recommendations: [
          {
            product_type: 'health_insurance',
            product_name: 'Complete Health Coverage',
            monthly_premium: 320,
            coverage_amount: 500000,
            priority: 'critical',
            confidence_score: 0.9,
            business_rationale: [
              'Customer segment (family_builder) shows high need for health protection',
              'Affordability level (standard) matches standard tier pricing',
              'Pre-existing conditions indicate immediate coverage need'
            ],
            upsell_opportunities: [
              'International coverage extension',
              'Alternative medicine coverage'
            ],
            competitive_advantages: [
              'No waiting period for accidents',
              '24/7 telemedicine included',
              'Network of 50,000+ healthcare providers'
            ]
          },
          {
            product_type: 'life_insurance',
            product_name: 'Term Life Protection',
            monthly_premium: 110,
            coverage_amount: 680000,
            priority: 'critical',
            confidence_score: 0.85,
            business_rationale: [
              'Family protection need identified (2 dependents)',
              'Recommended coverage: $680,000 (8x annual income)',
              'Product type (term) aligns with age (32) and financial profile'
            ],
            upsell_opportunities: [
              'Conversion option to whole life',
              'Accidental death benefit rider'
            ],
            competitive_advantages: [
              'No medical exam for qualified applicants',
              'Accelerated death benefit included',
              'Guaranteed renewable coverage'
            ]
          },
          {
            product_type: 'property_insurance',
            product_name: 'Complete Property Protection',
            monthly_premium: 225,
            coverage_amount: 800000,
            priority: 'required',
            confidence_score: 0.8,
            business_rationale: [
              'Property value ($450,000) requires adequate protection',
              'Property type (single_family_home) matches comprehensive coverage level',
              'Natural disaster risks identified in assessment require comprehensive coverage'
            ],
            upsell_opportunities: [
              'Personal property replacement cost coverage',
              'Additional living expenses coverage',
              'Identity theft protection'
            ],
            competitive_advantages: [
              'Actual cash value to replacement cost upgrade available',
              '24/7 claims hotline with rapid response',
              'Preferred contractor network for repairs'
            ]
          }
        ],
        conversation_starters: [
          "I see you're interested in protecting your family builder lifestyle",
          "Based on your profile, I have some exciting options that fit your $567 monthly budget",
          "Your family protection and long-term financial planning goals align perfectly with our protection plans"
        ],
        objection_handling: {
          "Too expensive": "I understand budget is important. We have flexible payment options and our Complete Health Coverage starts at just $320",
          "Don't need insurance": "Many family builder customers initially felt the same way. However, considering your family protection, protection becomes essential",
          "Need to think about it": "Absolutely! This is an important decision. Based on your moderate risk profile, I'd recommend we schedule a follow-up within the week to address any questions",
          "Have existing coverage": "That's great that you're already thinking about protection! Let me show you how our enhanced coverage could fill any gaps and potentially save you money through our multi-policy discounts"
        },
        next_best_actions: [
          "Present the Complete Health Coverage as the primary option",
          "Highlight the No waiting period for accidents",
          "Offer to calculate exact premium with additional details",
          "Schedule follow-up appointment for family consultation"
        ],
        follow_up_timeline: {
          "Immediate": "Send personalized quote via email",
          "24 hours": "Follow-up call to address questions",
          "3 days": "Special offer deadline reminder",
          "1 week": "Alternative product options if needed",
          "2 weeks": "Check-in and needs reassessment"
        },
        sales_report: {
          customer_summary: {
            segment: 'family_builder',
            affordability: 'standard',
            risk_profile: 'moderate',
            lifetime_value: 113400,
            conversion_probability: 0.35
          },
          sales_opportunity: {
            total_monthly_premium: 655,
            total_annual_premium: 7860,
            total_coverage_amount: 1980000,
            estimated_annual_commission: 1179,
            number_of_products: 3
          },
          recommendations: [],
          success_factors: {}
        }
      };

      setStaffGuidance(mockStaffGuidance);
      setCustomerData(mockCustomerData);
      
    } catch (err: any) {
      setError(`Failed to analyze customer: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'required': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'recommended': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSegmentIcon = (segment: string) => {
    switch (segment) {
      case 'family_builder': return <Users className="w-5 h-5" />;
      case 'young_professional': return <User className="w-5 h-5" />;
      case 'established_family': return <Target className="w-5 h-5" />;
      default: return <User className="w-5 h-5" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Staff Dashboard</h1>
          <p className="text-gray-600">AI-powered customer insights and sales guidance</p>
        </div>

        {/* Customer Selection */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Customer for Analysis</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {mockCustomers.map((customer) => (
              <div
                key={customer.id}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedCustomer === customer.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedCustomer(customer.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{customer.name}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    customer.status === 'Assessment Complete' ? 'bg-green-100 text-green-800' :
                    customer.status === 'Follow-up Required' ? 'bg-orange-100 text-orange-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {customer.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600">Age: {customer.age} | {customer.segment}</p>
                <p className="text-xs text-gray-500 mt-1">ID: {customer.id}</p>
              </div>
            ))}
          </div>
          
          <button
            onClick={() => selectedCustomer && analyzeCustomer(selectedCustomer)}
            disabled={!selectedCustomer || loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Analyzing...
              </>
            ) : (
              <>
                <TrendingUp className="w-4 h-4" />
                Analyze Customer
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {staffGuidance && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Customer Profile Section */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Profile Overview */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  {getSegmentIcon(staffGuidance.customer_profile.segment)}
                  <h2 className="text-xl font-semibold text-gray-900">Customer Profile</h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Customer ID</p>
                    <p className="font-medium text-gray-900">{staffGuidance.customer_profile.customer_id}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Segment</p>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {staffGuidance.customer_profile.segment.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Risk Profile</p>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      staffGuidance.customer_profile.risk_profile === 'high_risk' ? 'bg-red-100 text-red-800' :
                      staffGuidance.customer_profile.risk_profile === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {staffGuidance.customer_profile.risk_profile.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600">Affordability Level</p>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                      {staffGuidance.customer_profile.affordability_level.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Financial Metrics */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Metrics</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Monthly Budget</span>
                    <span className="font-semibold text-green-600">
                      {formatCurrency(staffGuidance.customer_profile.monthly_budget)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Lifetime Value</span>
                    <span className="font-semibold text-blue-600">
                      {formatCurrency(staffGuidance.customer_profile.lifetime_value_estimate)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Conversion Probability</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-2 bg-green-500 rounded-full" 
                          style={{ width: `${staffGuidance.customer_profile.conversion_probability * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">
                        {formatPercentage(staffGuidance.customer_profile.conversion_probability)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Insights */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Motivators</h4>
                    <div className="space-y-2">
                      {staffGuidance.customer_profile.key_motivators.map((motivator, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{motivator}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Pain Points</h4>
                    <div className="space-y-2">
                      {staffGuidance.customer_profile.pain_points.map((pain, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-orange-500 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{pain}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Recommendations & Guidance */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Sales Opportunity Summary */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Sales Opportunity</h2>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(staffGuidance.sales_report.sales_opportunity.total_monthly_premium)}
                    </div>
                    <div className="text-sm text-gray-600">Monthly Premium</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {formatCurrency(staffGuidance.sales_report.sales_opportunity.total_annual_premium)}
                    </div>
                    <div className="text-sm text-gray-600">Annual Premium</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {formatCurrency(staffGuidance.sales_report.sales_opportunity.estimated_annual_commission)}
                    </div>
                    <div className="text-sm text-gray-600">Est. Commission</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {staffGuidance.sales_report.sales_opportunity.number_of_products}
                    </div>
                    <div className="text-sm text-gray-600">Products</div>
                  </div>
                </div>
              </div>

              {/* Product Recommendations */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Product Recommendations</h2>
                
                <div className="space-y-6">
                  {staffGuidance.product_recommendations.map((product, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <ShieldCheck className="w-6 h-6 text-blue-600" />
                          <div>
                            <h3 className="font-semibold text-gray-900">{product.product_name}</h3>
                            <p className="text-sm text-gray-600">{product.product_type.replace('_', ' ')}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(product.priority)}`}>
                            {product.priority.toUpperCase()}
                          </span>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm font-medium">{(product.confidence_score * 100).toFixed(0)}%</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Monthly Premium</p>
                          <p className="font-semibold text-green-600">{formatCurrency(product.monthly_premium)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Coverage Amount</p>
                          <p className="font-semibold text-blue-600">{formatCurrency(product.coverage_amount)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Confidence Score</p>
                          <p className="font-semibold text-gray-900">{formatPercentage(product.confidence_score)}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Business Rationale</h4>
                          <ul className="text-sm text-gray-700 space-y-1">
                            {product.business_rationale.slice(0, 2).map((reason, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <div className="w-1 h-1 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                {reason}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Upsell Opportunities</h4>
                          <ul className="text-sm text-gray-700 space-y-1">
                            {product.upsell_opportunities.slice(0, 2).map((upsell, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <div className="w-1 h-1 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                {upsell}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Competitive Advantages</h4>
                          <ul className="text-sm text-gray-700 space-y-1">
                            {product.competitive_advantages.slice(0, 2).map((advantage, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <div className="w-1 h-1 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                                {advantage}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Conversation Guide */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Conversation Starters */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Conversation Starters</h3>
                  </div>
                  
                  <div className="space-y-3">
                    {staffGuidance.conversation_starters.map((starter, index) => (
                      <div key={index} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm text-blue-800">"{starter}"</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Next Best Actions */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Target className="w-5 h-5 text-green-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Next Best Actions</h3>
                  </div>
                  
                  <div className="space-y-3">
                    {staffGuidance.next_best_actions.map((action, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <p className="text-sm text-gray-700">{action}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Objection Handling */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Objection Handling Guide</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(staffGuidance.objection_handling).map(([objection, response], index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-red-600 mb-2">"{objection}"</h4>
                      <p className="text-sm text-gray-700">💡 {response}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Follow-up Timeline */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Follow-up Timeline</h3>
                </div>
                
                <div className="space-y-3">
                  {Object.entries(staffGuidance.follow_up_timeline).map(([timing, action], index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-20 text-sm font-medium text-purple-600">{timing}</div>
                      <div className="flex-1 p-3 bg-purple-50 rounded-lg border border-purple-200">
                        <p className="text-sm text-purple-800">{action}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Approach */}
              <div className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-lg border border-orange-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Recommended Approach Strategy</h3>
                <p className="text-gray-700">{staffGuidance.customer_profile.recommended_approach}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffDashboard; 