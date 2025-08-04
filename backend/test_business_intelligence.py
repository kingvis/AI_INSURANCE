#!/usr/bin/env python3
"""
Test Script for Business Intelligence System
Tests all major functionality of the AI-powered staff guidance system
"""

import json
import sys
from datetime import datetime
from business_intelligence import BusinessIntelligenceEngine

def test_customer_analysis():
    """Test customer data analysis and staff guidance generation"""
    
    print("🧪 Testing Business Intelligence System")
    print("=" * 50)
    
    # Initialize the business intelligence engine
    bi_engine = BusinessIntelligenceEngine()
    
    # Test Case 1: Family Builder Customer
    print("\n📋 Test Case 1: Family Builder Customer")
    family_customer_data = {
        "customer_id": "TEST_FAMILY_001",
        "health_data": {
            "name": "John Smith",
            "age": 32,
            "height": 175,
            "weight": 75,
            "gender": "male",
            "smoking": False,
            "drinking_frequency": "occasionally",
            "exercise_frequency": "moderate",
            "medical_conditions": ["hypertension"],
            "family_members": ["spouse", "child1", "child2"],
            "existing_insurance": []
        },
        "property_data": {
            "property_type": "single_family_home",
            "property_value": 450000,
            "year_built": 2010,
            "location": "suburban"
        },
        "financial_data": {
            "annual_income": 85000,
            "monthly_expenses": 4500,
            "debt_to_income_ratio": 0.28,
            "current_savings": 25000,
            "financial_goals": ["emergency_fund", "retirement_planning", "family_protection"],
            "credit_score": 720
        },
        "safety_data": {
            "hasFloodRisk": "low",
            "earthquakeRisk": "none",
            "security_measures": ["smoke_detectors", "security_system"]
        },
        "country": "US"
    }
    
    try:
        guidance = bi_engine.analyze_customer_data(family_customer_data)
        
        print(f"✅ Customer Segment: {guidance.customer_profile.segment.value}")
        print(f"✅ Affordability Level: {guidance.customer_profile.affordability_level.value}")
        print(f"✅ Risk Profile: {guidance.customer_profile.risk_profile.value}")
        print(f"✅ Monthly Budget: ${guidance.customer_profile.monthly_budget:.2f}")
        print(f"✅ Lifetime Value: ${guidance.customer_profile.lifetime_value_estimate:,.2f}")
        print(f"✅ Conversion Probability: {guidance.customer_profile.conversion_probability:.1%}")
        print(f"✅ Product Recommendations: {len(guidance.product_recommendations)}")
        
        # Test sales report generation
        sales_report = bi_engine.generate_sales_report(guidance)
        print(f"✅ Sales Report Generated - Total Annual Premium: ${sales_report['sales_opportunity']['total_annual_premium']:,.2f}")
        
    except Exception as e:
        print(f"❌ Error in Family Builder test: {e}")
        return False
    
    # Test Case 2: Young Professional Customer
    print("\n📋 Test Case 2: Young Professional Customer")
    young_professional_data = {
        "customer_id": "TEST_YOUNG_001",
        "health_data": {
            "name": "Sarah Johnson",
            "age": 26,
            "height": 165,
            "weight": 60,
            "gender": "female",
            "smoking": False,
            "drinking_frequency": "never",
            "exercise_frequency": "active",
            "medical_conditions": [],
            "family_members": [],
            "existing_insurance": []
        },
        "property_data": {
            "property_type": "apartment",
            "property_value": 0,  # Renting
            "year_built": 2020,
            "location": "urban"
        },
        "financial_data": {
            "annual_income": 45000,
            "monthly_expenses": 2800,
            "debt_to_income_ratio": 0.35,
            "current_savings": 8000,
            "financial_goals": ["emergency_fund", "career_growth"],
            "credit_score": 680
        },
        "safety_data": {
            "hasFloodRisk": "none",
            "earthquakeRisk": "low",
            "security_measures": ["smoke_detectors"]
        },
        "country": "US"
    }
    
    try:
        guidance = bi_engine.analyze_customer_data(young_professional_data)
        
        print(f"✅ Customer Segment: {guidance.customer_profile.segment.value}")
        print(f"✅ Affordability Level: {guidance.customer_profile.affordability_level.value}")
        print(f"✅ Risk Profile: {guidance.customer_profile.risk_profile.value}")
        print(f"✅ Monthly Budget: ${guidance.customer_profile.monthly_budget:.2f}")
        print(f"✅ Product Recommendations: {len(guidance.product_recommendations)}")
        
    except Exception as e:
        print(f"❌ Error in Young Professional test: {e}")
        return False
    
    # Test Case 3: High Net Worth Customer
    print("\n📋 Test Case 3: High Net Worth Customer")
    high_net_worth_data = {
        "customer_id": "TEST_HNW_001",
        "health_data": {
            "name": "Robert Wilson",
            "age": 48,
            "height": 180,
            "weight": 85,
            "gender": "male",
            "smoking": False,
            "drinking_frequency": "occasionally",
            "exercise_frequency": "moderate",
            "medical_conditions": [],
            "family_members": ["spouse", "child1", "child2", "child3"],
            "existing_insurance": ["basic_health"]
        },
        "property_data": {
            "property_type": "luxury_home",
            "property_value": 1200000,
            "year_built": 2015,
            "location": "suburban"
        },
        "financial_data": {
            "annual_income": 250000,
            "monthly_expenses": 12000,
            "debt_to_income_ratio": 0.15,
            "current_savings": 150000,
            "financial_goals": ["wealth_preservation", "estate_planning", "family_protection"],
            "credit_score": 800
        },
        "safety_data": {
            "hasFloodRisk": "none",
            "earthquakeRisk": "none",
            "security_measures": ["security_system", "smoke_detectors", "smart_home"]
        },
        "country": "US"
    }
    
    try:
        guidance = bi_engine.analyze_customer_data(high_net_worth_data)
        
        print(f"✅ Customer Segment: {guidance.customer_profile.segment.value}")
        print(f"✅ Affordability Level: {guidance.customer_profile.affordability_level.value}")
        print(f"✅ Risk Profile: {guidance.customer_profile.risk_profile.value}")
        print(f"✅ Monthly Budget: ${guidance.customer_profile.monthly_budget:.2f}")
        print(f"✅ Lifetime Value: ${guidance.customer_profile.lifetime_value_estimate:,.2f}")
        print(f"✅ Product Recommendations: {len(guidance.product_recommendations)}")
        
        # Test specific high-value recommendations
        total_premium = sum(rec.monthly_premium for rec in guidance.product_recommendations)
        print(f"✅ Total Monthly Premium: ${total_premium:.2f}")
        
    except Exception as e:
        print(f"❌ Error in High Net Worth test: {e}")
        return False
    
    print("\n🎯 Testing Business Intelligence Components")
    print("-" * 40)
    
    # Test product catalog
    print("✅ Product Catalog:", len(bi_engine.product_catalog))
    
    # Test pricing models
    print("✅ Pricing Models:", len(bi_engine.pricing_models))
    
    # Test market data
    print("✅ Market Data:", len(bi_engine.market_data))
    
    return True

def test_specific_scenarios():
    """Test specific business scenarios"""
    
    print("\n🎯 Testing Specific Business Scenarios")
    print("=" * 40)
    
    bi_engine = BusinessIntelligenceEngine()
    
    # Scenario 1: Budget-Conscious Customer
    print("\n📋 Scenario 1: Budget-Conscious Customer")
    budget_customer = {
        "customer_id": "TEST_BUDGET_001",
        "health_data": {
            "age": 28,
            "gender": "female",
            "smoking": False,
            "medical_conditions": [],
            "family_members": [],
            "existing_insurance": []
        },
        "financial_data": {
            "annual_income": 28000,
            "debt_to_income_ratio": 0.45,
            "current_savings": 2000,
            "financial_goals": ["emergency_fund"],
            "credit_score": 620
        },
        "property_data": {"property_value": 0},
        "safety_data": {"hasFloodRisk": "none", "earthquakeRisk": "none"},
        "country": "US"
    }
    
    guidance = bi_engine.analyze_customer_data(budget_customer)
    assert guidance.customer_profile.segment.value == "budget_conscious"
    assert guidance.customer_profile.affordability_level.value == "basic"
    print("✅ Correctly identified as budget-conscious with basic affordability")
    
    # Scenario 2: High-Risk Customer
    print("\n📋 Scenario 2: High-Risk Customer")
    high_risk_customer = {
        "customer_id": "TEST_RISK_001",
        "health_data": {
            "age": 55,
            "gender": "male",
            "smoking": True,
            "drinking_frequency": "heavy",
            "exercise_frequency": "never",
            "medical_conditions": ["diabetes", "heart_disease", "hypertension"],
            "family_members": ["spouse"],
            "existing_insurance": []
        },
        "financial_data": {
            "annual_income": 65000,
            "debt_to_income_ratio": 0.30,
            "current_savings": 15000,
            "financial_goals": ["health_coverage"],
            "credit_score": 700
        },
        "property_data": {"property_value": 300000},
        "safety_data": {"hasFloodRisk": "high", "earthquakeRisk": "moderate"},
        "country": "US"
    }
    
    guidance = bi_engine.analyze_customer_data(high_risk_customer)
    assert guidance.customer_profile.risk_profile.value == "high_risk"
    print("✅ Correctly identified as high-risk profile")
    
    # Check if premiums are adjusted for risk
    health_rec = next((r for r in guidance.product_recommendations if r.product_type == "health_insurance"), None)
    if health_rec:
        print(f"✅ Risk-adjusted premium: ${health_rec.monthly_premium:.2f}")
    
    return True

def test_conversation_guidance():
    """Test conversation and sales guidance generation"""
    
    print("\n💬 Testing Conversation Guidance")
    print("=" * 30)
    
    bi_engine = BusinessIntelligenceEngine()
    
    sample_data = {
        "customer_id": "TEST_CONV_001",
        "health_data": {
            "age": 35,
            "family_members": ["spouse", "child1"],
            "medical_conditions": [],
            "existing_insurance": []
        },
        "financial_data": {
            "annual_income": 70000,
            "financial_goals": ["family_protection", "emergency_fund"],
            "credit_score": 720
        },
        "property_data": {"property_value": 350000},
        "safety_data": {"hasFloodRisk": "none", "earthquakeRisk": "none"},
        "country": "US"
    }
    
    guidance = bi_engine.analyze_customer_data(sample_data)
    
    # Test conversation components
    print(f"✅ Conversation Starters: {len(guidance.conversation_starters)}")
    print(f"✅ Objection Handling: {len(guidance.objection_handling)}")
    print(f"✅ Next Best Actions: {len(guidance.next_best_actions)}")
    print(f"✅ Follow-up Timeline: {len(guidance.follow_up_timeline)}")
    
    # Test specific conversation elements
    assert len(guidance.conversation_starters) >= 3
    assert "Too expensive" in guidance.objection_handling
    assert "Don't need insurance" in guidance.objection_handling
    assert len(guidance.next_best_actions) >= 3
    
    print("✅ All conversation guidance components generated successfully")
    
    return True

def generate_sample_report():
    """Generate a sample staff guidance report"""
    
    print("\n📊 Generating Sample Staff Report")
    print("=" * 30)
    
    bi_engine = BusinessIntelligenceEngine()
    
    sample_data = {
        "customer_id": "SAMPLE_REPORT_001",
        "health_data": {
            "name": "Example Customer",
            "age": 40,
            "family_members": ["spouse", "child1", "child2"],
            "medical_conditions": ["allergies"],
            "existing_insurance": []
        },
        "financial_data": {
            "annual_income": 95000,
            "debt_to_income_ratio": 0.25,
            "financial_goals": ["family_protection", "retirement_planning"],
            "credit_score": 750
        },
        "property_data": {
            "property_value": 500000,
            "property_type": "single_family_home"
        },
        "safety_data": {"hasFloodRisk": "low", "earthquakeRisk": "none"},
        "country": "US"
    }
    
    guidance = bi_engine.analyze_customer_data(sample_data)
    sales_report = bi_engine.generate_sales_report(guidance)
    
    print("\n📋 SAMPLE STAFF GUIDANCE REPORT")
    print("=" * 50)
    
    print(f"\n👤 CUSTOMER PROFILE")
    print(f"Customer ID: {guidance.customer_profile.customer_id}")
    print(f"Segment: {guidance.customer_profile.segment.value.replace('_', ' ').title()}")
    print(f"Risk Profile: {guidance.customer_profile.risk_profile.value.replace('_', ' ').title()}")
    print(f"Affordability: {guidance.customer_profile.affordability_level.value.title()}")
    print(f"Monthly Budget: ${guidance.customer_profile.monthly_budget:.2f}")
    print(f"Lifetime Value: ${guidance.customer_profile.lifetime_value_estimate:,.2f}")
    print(f"Conversion Probability: {guidance.customer_profile.conversion_probability:.1%}")
    
    print(f"\n💰 SALES OPPORTUNITY")
    opportunity = sales_report['sales_opportunity']
    print(f"Monthly Premium: ${opportunity['total_monthly_premium']:.2f}")
    print(f"Annual Premium: ${opportunity['total_annual_premium']:,.2f}")
    print(f"Estimated Commission: ${opportunity['estimated_annual_commission']:,.2f}")
    print(f"Number of Products: {opportunity['number_of_products']}")
    
    print(f"\n🎯 PRODUCT RECOMMENDATIONS")
    for i, rec in enumerate(guidance.product_recommendations, 1):
        print(f"{i}. {rec.product_name}")
        print(f"   Priority: {rec.priority.upper()} | Confidence: {rec.confidence_score:.1%}")
        print(f"   Premium: ${rec.monthly_premium:.2f}/month | Coverage: ${rec.coverage_amount:,.2f}")
    
    print(f"\n💡 KEY MOTIVATORS")
    for motivator in guidance.customer_profile.key_motivators:
        print(f"• {motivator}")
    
    print(f"\n⚠️ PAIN POINTS")
    for pain in guidance.customer_profile.pain_points:
        print(f"• {pain}")
    
    print(f"\n💬 CONVERSATION STARTERS")
    for starter in guidance.conversation_starters:
        print(f"• \"{starter}\"")
    
    print(f"\n🔄 NEXT BEST ACTIONS")
    for action in guidance.next_best_actions:
        print(f"• {action}")
    
    print(f"\n📞 RECOMMENDED APPROACH")
    print(f"{guidance.customer_profile.recommended_approach}")
    
    return True

def main():
    """Run all tests"""
    
    print("🚀 Starting Business Intelligence System Tests")
    print("=" * 60)
    
    tests_passed = 0
    total_tests = 4
    
    try:
        if test_customer_analysis():
            tests_passed += 1
            print("✅ Customer Analysis Test: PASSED")
        else:
            print("❌ Customer Analysis Test: FAILED")
    except Exception as e:
        print(f"❌ Customer Analysis Test: FAILED - {e}")
    
    try:
        if test_specific_scenarios():
            tests_passed += 1
            print("✅ Specific Scenarios Test: PASSED")
        else:
            print("❌ Specific Scenarios Test: FAILED")
    except Exception as e:
        print(f"❌ Specific Scenarios Test: FAILED - {e}")
    
    try:
        if test_conversation_guidance():
            tests_passed += 1
            print("✅ Conversation Guidance Test: PASSED")
        else:
            print("❌ Conversation Guidance Test: FAILED")
    except Exception as e:
        print(f"❌ Conversation Guidance Test: FAILED - {e}")
    
    try:
        if generate_sample_report():
            tests_passed += 1
            print("✅ Sample Report Generation: PASSED")
        else:
            print("❌ Sample Report Generation: FAILED")
    except Exception as e:
        print(f"❌ Sample Report Generation: FAILED - {e}")
    
    print("\n" + "=" * 60)
    print(f"🏁 TEST SUMMARY: {tests_passed}/{total_tests} tests passed")
    
    if tests_passed == total_tests:
        print("🎉 All tests passed! Business Intelligence System is working correctly.")
        return 0
    else:
        print("⚠️  Some tests failed. Please check the errors above.")
        return 1

if __name__ == "__main__":
    exit(main()) 