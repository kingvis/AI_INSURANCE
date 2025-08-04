"""
Business Intelligence Engine for WishInsured
Analyzes customer data to provide actionable insights for sales and customer service staff
"""

import json
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple, Union
from dataclasses import dataclass, asdict
from enum import Enum
import statistics

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class CustomerSegment(Enum):
    """Customer segmentation for targeted products"""
    YOUNG_PROFESSIONAL = "young_professional"
    FAMILY_BUILDER = "family_builder"
    ESTABLISHED_FAMILY = "established_family"
    PRE_RETIREE = "pre_retiree"
    RETIREE = "retiree"
    HIGH_NET_WORTH = "high_net_worth"
    BUDGET_CONSCIOUS = "budget_conscious"

class AffordabilityLevel(Enum):
    """Customer affordability levels"""
    BASIC = "basic"
    STANDARD = "standard"
    PREMIUM = "premium"
    LUXURY = "luxury"

class RiskProfile(Enum):
    """Customer risk profiles"""
    CONSERVATIVE = "conservative"
    MODERATE = "moderate"
    AGGRESSIVE = "aggressive"
    HIGH_RISK = "high_risk"

@dataclass
class ProductRecommendation:
    """Individual product recommendation with business rationale"""
    product_type: str
    product_name: str
    monthly_premium: float
    coverage_amount: float
    priority: str
    confidence_score: float
    business_rationale: List[str]
    upsell_opportunities: List[str]
    competitive_advantages: List[str]

@dataclass
class CustomerProfile:
    """Comprehensive customer profile for staff guidance"""
    customer_id: str
    segment: CustomerSegment
    affordability_level: AffordabilityLevel
    risk_profile: RiskProfile
    monthly_budget: float
    lifetime_value_estimate: float
    conversion_probability: float
    key_motivators: List[str]
    pain_points: List[str]
    recommended_approach: str

@dataclass
class StaffGuidance:
    """Complete staff guidance package"""
    customer_profile: CustomerProfile
    product_recommendations: List[ProductRecommendation]
    conversation_starters: List[str]
    objection_handling: Dict[str, str]
    next_best_actions: List[str]
    follow_up_timeline: Dict[str, str]

class BusinessIntelligenceEngine:
    """AI-powered business intelligence for insurance sales and service"""
    
    def __init__(self):
        self.product_catalog = self._initialize_product_catalog()
        self.pricing_models = self._initialize_pricing_models()
        self.market_data = self._initialize_market_data()
    
    def _initialize_product_catalog(self) -> Dict:
        """Initialize comprehensive product catalog with business metrics"""
        return {
            "health_insurance": {
                "basic": {
                    "name": "Essential Health Protection",
                    "base_premium": 150,
                    "coverage": 100000,
                    "commission": 0.12,
                    "target_segment": ["young_professional", "budget_conscious"]
                },
                "standard": {
                    "name": "Complete Health Coverage",
                    "base_premium": 300,
                    "coverage": 500000,
                    "commission": 0.15,
                    "target_segment": ["family_builder", "established_family"]
                },
                "premium": {
                    "name": "Elite Health Protection",
                    "base_premium": 600,
                    "coverage": 1000000,
                    "commission": 0.18,
                    "target_segment": ["high_net_worth", "pre_retiree"]
                }
            },
            "life_insurance": {
                "term": {
                    "name": "Term Life Protection",
                    "base_premium": 100,
                    "coverage": 500000,
                    "commission": 0.20,
                    "target_segment": ["young_professional", "family_builder"]
                },
                "whole": {
                    "name": "Whole Life Investment",
                    "base_premium": 500,
                    "coverage": 1000000,
                    "commission": 0.25,
                    "target_segment": ["established_family", "high_net_worth"]
                }
            },
            "property_insurance": {
                "basic": {
                    "name": "Essential Property Cover",
                    "base_premium": 80,
                    "coverage": 200000,
                    "commission": 0.10,
                    "target_segment": ["young_professional", "budget_conscious"]
                },
                "comprehensive": {
                    "name": "Complete Property Protection",
                    "base_premium": 200,
                    "coverage": 800000,
                    "commission": 0.15,
                    "target_segment": ["family_builder", "established_family"]
                }
            },
            "auto_insurance": {
                "liability": {
                    "name": "Basic Auto Coverage",
                    "base_premium": 120,
                    "coverage": 100000,
                    "commission": 0.08,
                    "target_segment": ["young_professional", "budget_conscious"]
                },
                "comprehensive": {
                    "name": "Full Auto Protection",
                    "base_premium": 250,
                    "coverage": 500000,
                    "commission": 0.12,
                    "target_segment": ["family_builder", "established_family"]
                }
            }
        }
    
    def _initialize_pricing_models(self) -> Dict:
        """Initialize dynamic pricing models based on risk factors"""
        return {
            "age_multipliers": {
                (18, 25): 1.2,
                (26, 35): 1.0,
                (36, 45): 1.1,
                (46, 55): 1.3,
                (56, 65): 1.6,
                (66, 100): 2.0
            },
            "health_multipliers": {
                "excellent": 0.9,
                "good": 1.0,
                "fair": 1.2,
                "poor": 1.5
            },
            "income_affordability": {
                "budget_conscious": 0.05,  # 5% of income
                "standard": 0.08,          # 8% of income
                "premium": 0.12,           # 12% of income
                "luxury": 0.20             # 20% of income
            }
        }
    
    def _initialize_market_data(self) -> Dict:
        """Initialize market intelligence data"""
        return {
            "conversion_rates": {
                "young_professional": 0.25,
                "family_builder": 0.35,
                "established_family": 0.45,
                "pre_retiree": 0.40,
                "retiree": 0.30,
                "high_net_worth": 0.60,
                "budget_conscious": 0.20
            },
            "lifetime_value_multipliers": {
                "young_professional": 15,
                "family_builder": 20,
                "established_family": 25,
                "pre_retiree": 18,
                "retiree": 12,
                "high_net_worth": 35,
                "budget_conscious": 10
            }
        }
    
    def analyze_customer_data(self, customer_data: Dict) -> StaffGuidance:
        """
        Analyze comprehensive customer data and generate staff guidance
        
        Args:
            customer_data: Complete customer information from frontend forms
            
        Returns:
            StaffGuidance: Complete guidance package for staff
        """
        try:
            # Extract and process customer information
            profile = self._create_customer_profile(customer_data)
            recommendations = self._generate_product_recommendations(customer_data, profile)
            guidance = self._create_staff_guidance(profile, recommendations, customer_data)
            
            logger.info(f"Generated staff guidance for customer segment: {profile.segment.value}")
            return guidance
            
        except Exception as e:
            logger.error(f"Error analyzing customer data: {e}")
            raise
    
    def _create_customer_profile(self, data: Dict) -> CustomerProfile:
        """Create comprehensive customer profile with business insights"""
        
        # Extract basic information
        age = int(data.get('health_data', {}).get('age', 30))
        income = float(data.get('financial_data', {}).get('annual_income', 50000))
        country = data.get('country', 'US')
        
        # Determine customer segment
        segment = self._determine_customer_segment(age, income, data)
        
        # Calculate affordability level
        affordability = self._calculate_affordability_level(income, data)
        
        # Assess risk profile
        risk_profile = self._assess_risk_profile(data)
        
        # Calculate financial metrics
        monthly_budget = self._calculate_monthly_budget(income, affordability)
        lifetime_value = self._estimate_lifetime_value(segment, monthly_budget)
        conversion_prob = self._calculate_conversion_probability(segment, data)
        
        # Identify motivators and pain points
        motivators = self._identify_key_motivators(data)
        pain_points = self._identify_pain_points(data)
        
        # Recommend approach strategy
        approach = self._recommend_approach_strategy(segment, risk_profile, data)
        
        return CustomerProfile(
            customer_id=data.get('customer_id', f"CUST_{datetime.now().strftime('%Y%m%d_%H%M%S')}"),
            segment=segment,
            affordability_level=affordability,
            risk_profile=risk_profile,
            monthly_budget=monthly_budget,
            lifetime_value_estimate=lifetime_value,
            conversion_probability=conversion_prob,
            key_motivators=motivators,
            pain_points=pain_points,
            recommended_approach=approach
        )
    
    def _determine_customer_segment(self, age: int, income: float, data: Dict) -> CustomerSegment:
        """Determine customer segment based on demographics and behavior"""
        
        has_dependents = len(data.get('health_data', {}).get('family_members', [])) > 0
        property_value = float(data.get('property_data', {}).get('property_value', 0))
        
        if income >= 200000 or property_value >= 1000000:
            return CustomerSegment.HIGH_NET_WORTH
        elif age <= 30:
            return CustomerSegment.YOUNG_PROFESSIONAL
        elif age <= 45 and has_dependents:
            return CustomerSegment.FAMILY_BUILDER
        elif age <= 55:
            return CustomerSegment.ESTABLISHED_FAMILY
        elif age <= 65:
            return CustomerSegment.PRE_RETIREE
        elif age > 65:
            return CustomerSegment.RETIREE
        else:
            return CustomerSegment.BUDGET_CONSCIOUS
    
    def _calculate_affordability_level(self, income: float, data: Dict) -> AffordabilityLevel:
        """Calculate customer affordability level"""
        
        debt_ratio = float(data.get('financial_data', {}).get('debt_to_income_ratio', 0.3))
        existing_insurance = len(data.get('health_data', {}).get('existing_insurance', []))
        
        if income >= 150000 and debt_ratio < 0.2:
            return AffordabilityLevel.LUXURY
        elif income >= 80000 and debt_ratio < 0.3:
            return AffordabilityLevel.PREMIUM
        elif income >= 40000 and debt_ratio < 0.4:
            return AffordabilityLevel.STANDARD
        else:
            return AffordabilityLevel.BASIC
    
    def _assess_risk_profile(self, data: Dict) -> RiskProfile:
        """Assess customer risk profile for appropriate product matching"""
        
        health_conditions = data.get('health_data', {}).get('medical_conditions', [])
        lifestyle_score = self._calculate_lifestyle_risk_score(data)
        property_risks = self._assess_property_risks(data)
        
        total_risk_score = len(health_conditions) * 2 + lifestyle_score + property_risks
        
        if total_risk_score >= 15:
            return RiskProfile.HIGH_RISK
        elif total_risk_score >= 10:
            return RiskProfile.AGGRESSIVE
        elif total_risk_score >= 5:
            return RiskProfile.MODERATE
        else:
            return RiskProfile.CONSERVATIVE
    
    def _calculate_lifestyle_risk_score(self, data: Dict) -> int:
        """Calculate lifestyle risk score"""
        score = 0
        health_data = data.get('health_data', {})
        
        if health_data.get('smoking', False):
            score += 5
        
        drinking = health_data.get('drinking_frequency', 'never')
        if drinking in ['regularly', 'heavy']:
            score += 3
        elif drinking == 'occasionally':
            score += 1
        
        exercise = health_data.get('exercise_frequency', 'moderate')
        if exercise == 'never':
            score += 3
        elif exercise == 'light':
            score += 1
        
        return score
    
    def _assess_property_risks(self, data: Dict) -> int:
        """Assess property-related risks"""
        score = 0
        safety_data = data.get('safety_data', {})
        
        flood_risk = safety_data.get('hasFloodRisk', 'none')
        if flood_risk == 'high':
            score += 4
        elif flood_risk == 'moderate':
            score += 2
        elif flood_risk == 'low':
            score += 1
        
        earthquake_risk = safety_data.get('earthquakeRisk', 'none')
        if earthquake_risk == 'high':
            score += 4
        elif earthquake_risk == 'moderate':
            score += 2
        elif earthquake_risk == 'low':
            score += 1
        
        return score
    
    def _calculate_monthly_budget(self, income: float, affordability: AffordabilityLevel) -> float:
        """Calculate realistic monthly insurance budget"""
        monthly_income = income / 12
        affordability_rate = self.pricing_models["income_affordability"][affordability.value]
        return monthly_income * affordability_rate
    
    def _estimate_lifetime_value(self, segment: CustomerSegment, monthly_budget: float) -> float:
        """Estimate customer lifetime value"""
        multiplier = self.market_data["lifetime_value_multipliers"][segment.value]
        return monthly_budget * 12 * multiplier
    
    def _calculate_conversion_probability(self, segment: CustomerSegment, data: Dict) -> float:
        """Calculate probability of conversion based on segment and engagement"""
        base_rate = self.market_data["conversion_rates"][segment.value]
        
        # Adjust based on engagement indicators
        engagement_score = 0
        if data.get('health_data', {}).get('name'):
            engagement_score += 0.1
        if len(data.get('financial_data', {}).get('financial_goals', [])) > 3:
            engagement_score += 0.1
        if data.get('property_data', {}).get('property_value', 0) > 0:
            engagement_score += 0.1
        
        return min(1.0, base_rate + engagement_score)
    
    def _identify_key_motivators(self, data: Dict) -> List[str]:
        """Identify customer's key motivators for purchasing insurance"""
        motivators = []
        
        # Family protection motivators
        family_members = data.get('health_data', {}).get('family_members', [])
        if family_members:
            motivators.append("Family protection and security")
        
        # Financial security motivators
        financial_goals = data.get('financial_data', {}).get('financial_goals', [])
        if 'retirement_planning' in financial_goals:
            motivators.append("Long-term financial planning")
        if 'emergency_fund' in financial_goals:
            motivators.append("Emergency preparedness")
        
        # Health motivators
        health_conditions = data.get('health_data', {}).get('medical_conditions', [])
        if health_conditions:
            motivators.append("Managing existing health conditions")
        
        # Property motivators
        property_value = data.get('property_data', {}).get('property_value', 0)
        if property_value > 0:
            motivators.append("Asset protection")
        
        # Default motivators if none identified
        if not motivators:
            motivators = ["Peace of mind", "Financial security"]
        
        return motivators
    
    def _identify_pain_points(self, data: Dict) -> List[str]:
        """Identify customer's potential pain points and concerns"""
        pain_points = []
        
        # Budget concerns
        affordability = self._calculate_affordability_level(
            float(data.get('financial_data', {}).get('annual_income', 50000)), 
            data
        )
        if affordability == AffordabilityLevel.BASIC:
            pain_points.append("Budget constraints and affordability")
        
        # Complexity concerns
        age = int(data.get('health_data', {}).get('age', 30))
        if age >= 60:
            pain_points.append("Complex insurance terms and conditions")
        
        # Trust and credibility
        existing_insurance = data.get('health_data', {}).get('existing_insurance', [])
        if not existing_insurance:
            pain_points.append("Uncertainty about insurance value and claims process")
        
        # Health-related concerns
        health_conditions = data.get('health_data', {}).get('medical_conditions', [])
        if health_conditions:
            pain_points.append("Pre-existing condition coverage concerns")
        
        return pain_points
    
    def _recommend_approach_strategy(self, segment: CustomerSegment, risk_profile: RiskProfile, data: Dict) -> str:
        """Recommend the best approach strategy for this customer"""
        
        strategies = {
            CustomerSegment.YOUNG_PROFESSIONAL: "Focus on affordability, future planning, and digital convenience",
            CustomerSegment.FAMILY_BUILDER: "Emphasize family protection, comprehensive coverage, and value for money",
            CustomerSegment.ESTABLISHED_FAMILY: "Highlight premium benefits, lifestyle protection, and wealth preservation",
            CustomerSegment.PRE_RETIREE: "Stress security, healthcare coverage, and retirement protection",
            CustomerSegment.RETIREE: "Focus on healthcare, simple terms, and legacy planning",
            CustomerSegment.HIGH_NET_WORTH: "Present exclusive benefits, personalized service, and comprehensive coverage",
            CustomerSegment.BUDGET_CONSCIOUS: "Emphasize essential coverage, competitive pricing, and clear value proposition"
        }
        
        base_strategy = strategies.get(segment, "Personalized approach based on individual needs")
        
        # Add risk-specific considerations
        if risk_profile == RiskProfile.HIGH_RISK:
            base_strategy += ". Address risk factors with specialized coverage options."
        elif risk_profile == RiskProfile.CONSERVATIVE:
            base_strategy += ". Build trust with transparent, straightforward products."
        
        return base_strategy
    
    def _generate_product_recommendations(self, data: Dict, profile: CustomerProfile) -> List[ProductRecommendation]:
        """Generate prioritized product recommendations with business rationale"""
        recommendations = []
        
        # Health Insurance Recommendations
        health_rec = self._recommend_health_insurance(data, profile)
        if health_rec:
            recommendations.append(health_rec)
        
        # Life Insurance Recommendations
        life_rec = self._recommend_life_insurance(data, profile)
        if life_rec:
            recommendations.append(life_rec)
        
        # Property Insurance Recommendations
        property_rec = self._recommend_property_insurance(data, profile)
        if property_rec:
            recommendations.append(property_rec)
        
        # Auto Insurance Recommendations
        auto_rec = self._recommend_auto_insurance(data, profile)
        if auto_rec:
            recommendations.append(auto_rec)
        
        # Sort by priority and confidence
        recommendations.sort(key=lambda x: (
            {"critical": 4, "required": 3, "recommended": 2, "optional": 1}[x.priority],
            x.confidence_score
        ), reverse=True)
        
        return recommendations
    
    def _recommend_health_insurance(self, data: Dict, profile: CustomerProfile) -> Optional[ProductRecommendation]:
        """Generate health insurance recommendation"""
        
        existing_health = data.get('health_data', {}).get('existing_insurance', [])
        has_health_insurance = any('health' in ins.lower() for ins in existing_health)
        
        if has_health_insurance:
            return None  # Skip if already has health insurance
        
        # Determine product tier based on affordability and needs
        affordability = profile.affordability_level
        health_conditions = data.get('health_data', {}).get('medical_conditions', [])
        
        if affordability in [AffordabilityLevel.LUXURY, AffordabilityLevel.PREMIUM] or health_conditions:
            product_tier = "premium"
        elif affordability == AffordabilityLevel.STANDARD:
            product_tier = "standard"
        else:
            product_tier = "basic"
        
        product = self.product_catalog["health_insurance"][product_tier]
        
        # Calculate adjusted premium
        age = int(data.get('health_data', {}).get('age', 30))
        premium = self._calculate_adjusted_premium(product["base_premium"], age, data)
        
        # Build business rationale
        rationale = [
            f"Customer segment ({profile.segment.value}) shows high need for health protection",
            f"Affordability level ({affordability.value}) matches {product_tier} tier pricing",
            f"Monthly premium (${premium:.0f}) fits within budget (${profile.monthly_budget:.0f})"
        ]
        
        if health_conditions:
            rationale.append("Pre-existing conditions indicate immediate coverage need")
        
        # Identify upsell opportunities
        upsells = []
        if product_tier == "basic":
            upsells.append("Dental and vision add-on coverage")
            upsells.append("Wellness program enrollment")
        elif product_tier == "standard":
            upsells.append("International coverage extension")
            upsells.append("Alternative medicine coverage")
        
        # Competitive advantages
        advantages = [
            "No waiting period for accidents",
            "24/7 telemedicine included",
            "Network of 50,000+ healthcare providers"
        ]
        
        priority = "critical" if health_conditions or profile.segment in [CustomerSegment.FAMILY_BUILDER, CustomerSegment.ESTABLISHED_FAMILY] else "required"
        confidence = 0.9 if premium <= profile.monthly_budget * 0.6 else 0.7
        
        return ProductRecommendation(
            product_type="health_insurance",
            product_name=product["name"],
            monthly_premium=premium,
            coverage_amount=product["coverage"],
            priority=priority,
            confidence_score=confidence,
            business_rationale=rationale,
            upsell_opportunities=upsells,
            competitive_advantages=advantages
        )
    
    def _recommend_life_insurance(self, data: Dict, profile: CustomerProfile) -> Optional[ProductRecommendation]:
        """Generate life insurance recommendation"""
        
        age = int(data.get('health_data', {}).get('age', 30))
        family_members = data.get('health_data', {}).get('family_members', [])
        annual_income = float(data.get('financial_data', {}).get('annual_income', 50000))
        
        # Determine if life insurance is needed
        if age > 70 or not family_members:
            return None
        
        # Choose product type based on profile
        if profile.affordability_level in [AffordabilityLevel.LUXURY, AffordabilityLevel.PREMIUM] and age < 50:
            product_type = "whole"
        else:
            product_type = "term"
        
        product = self.product_catalog["life_insurance"][product_type]
        premium = self._calculate_adjusted_premium(product["base_premium"], age, data)
        
        # Calculate appropriate coverage (5-10x annual income)
        coverage_multiplier = 8 if family_members else 5
        recommended_coverage = annual_income * coverage_multiplier
        
        rationale = [
            f"Family protection need identified ({len(family_members)} dependents)",
            f"Recommended coverage: ${recommended_coverage:,.0f} ({coverage_multiplier}x annual income)",
            f"Product type ({product_type}) aligns with age ({age}) and financial profile"
        ]
        
        upsells = []
        if product_type == "term":
            upsells.append("Conversion option to whole life")
            upsells.append("Accidental death benefit rider")
        else:
            upsells.append("Long-term care rider")
            upsells.append("Disability waiver of premium")
        
        advantages = [
            "No medical exam for qualified applicants",
            "Accelerated death benefit included",
            "Guaranteed renewable coverage"
        ]
        
        priority = "critical" if len(family_members) > 1 else "required"
        confidence = 0.85 if premium <= profile.monthly_budget * 0.4 else 0.65
        
        return ProductRecommendation(
            product_type="life_insurance",
            product_name=product["name"],
            monthly_premium=premium,
            coverage_amount=recommended_coverage,
            priority=priority,
            confidence_score=confidence,
            business_rationale=rationale,
            upsell_opportunities=upsells,
            competitive_advantages=advantages
        )
    
    def _recommend_property_insurance(self, data: Dict, profile: CustomerProfile) -> Optional[ProductRecommendation]:
        """Generate property insurance recommendation"""
        
        property_value = float(data.get('property_data', {}).get('property_value', 0))
        property_type = data.get('property_data', {}).get('property_type', '')
        
        if property_value == 0 or not property_type:
            return None
        
        # Choose coverage level based on property value and affordability
        if property_value >= 500000 or profile.affordability_level in [AffordabilityLevel.LUXURY, AffordabilityLevel.PREMIUM]:
            product_tier = "comprehensive"
        else:
            product_tier = "basic"
        
        product = self.product_catalog["property_insurance"][product_tier]
        
        # Calculate premium based on property value
        premium = max(product["base_premium"], property_value * 0.001)  # Minimum base premium or 0.1% of property value
        
        rationale = [
            f"Property value (${property_value:,.0f}) requires adequate protection",
            f"Property type ({property_type}) matches {product_tier} coverage level",
            f"Natural disaster risks identified in assessment require comprehensive coverage"
        ]
        
        # Check for specific risks
        safety_data = data.get('safety_data', {})
        if safety_data.get('hasFloodRisk', 'none') != 'none':
            rationale.append("Flood risk identified - flood coverage essential")
        if safety_data.get('earthquakeRisk', 'none') != 'none':
            rationale.append("Earthquake risk identified - seismic coverage recommended")
        
        upsells = [
            "Personal property replacement cost coverage",
            "Additional living expenses coverage",
            "Identity theft protection"
        ]
        
        advantages = [
            "Actual cash value to replacement cost upgrade available",
            "24/7 claims hotline with rapid response",
            "Preferred contractor network for repairs"
        ]
        
        priority = "required" if property_value >= 200000 else "recommended"
        confidence = 0.8 if premium <= profile.monthly_budget * 0.3 else 0.6
        
        return ProductRecommendation(
            product_type="property_insurance",
            product_name=product["name"],
            monthly_premium=premium,
            coverage_amount=product["coverage"],
            priority=priority,
            confidence_score=confidence,
            business_rationale=rationale,
            upsell_opportunities=upsells,
            competitive_advantages=advantages
        )
    
    def _recommend_auto_insurance(self, data: Dict, profile: CustomerProfile) -> Optional[ProductRecommendation]:
        """Generate auto insurance recommendation"""
        
        # Check if customer likely has vehicles (inferred from data)
        age = int(data.get('health_data', {}).get('age', 30))
        if age < 16:
            return None
        
        # Assume vehicle ownership for working adults
        if profile.segment in [CustomerSegment.YOUNG_PROFESSIONAL, CustomerSegment.FAMILY_BUILDER, 
                             CustomerSegment.ESTABLISHED_FAMILY, CustomerSegment.HIGH_NET_WORTH]:
            
            if profile.affordability_level in [AffordabilityLevel.LUXURY, AffordabilityLevel.PREMIUM]:
                product_tier = "comprehensive"
            else:
                product_tier = "liability"
            
            product = self.product_catalog["auto_insurance"][product_tier]
            premium = self._calculate_adjusted_premium(product["base_premium"], age, data)
            
            rationale = [
                f"Customer profile ({profile.segment.value}) indicates vehicle ownership likelihood",
                f"Coverage level ({product_tier}) matches affordability and needs",
                f"Age group ({age}) requires appropriate liability protection"
            ]
            
            upsells = []
            if product_tier == "liability":
                upsells.append("Comprehensive and collision coverage")
                upsells.append("Rental car coverage")
            else:
                upsells.append("Gap coverage for financed vehicles")
                upsells.append("Roadside assistance premium")
            
            advantages = [
                "Multi-policy discount available",
                "Safe driver rewards program",
                "Mobile app for claims and policy management"
            ]
            
            priority = "required"
            confidence = 0.7  # Lower confidence since we're inferring vehicle ownership
            
            return ProductRecommendation(
                product_type="auto_insurance",
                product_name=product["name"],
                monthly_premium=premium,
                coverage_amount=product["coverage"],
                priority=priority,
                confidence_score=confidence,
                business_rationale=rationale,
                upsell_opportunities=upsells,
                competitive_advantages=advantages
            )
        
        return None
    
    def _calculate_adjusted_premium(self, base_premium: float, age: int, data: Dict) -> float:
        """Calculate risk-adjusted premium"""
        
        # Age adjustment
        age_multiplier = 1.0
        for age_range, multiplier in self.pricing_models["age_multipliers"].items():
            if age_range[0] <= age <= age_range[1]:
                age_multiplier = multiplier
                break
        
        # Health adjustment
        health_conditions = data.get('health_data', {}).get('medical_conditions', [])
        health_multiplier = 1.0 + (len(health_conditions) * 0.1)
        
        # Lifestyle adjustment
        lifestyle_score = self._calculate_lifestyle_risk_score(data)
        lifestyle_multiplier = 1.0 + (lifestyle_score * 0.05)
        
        adjusted_premium = base_premium * age_multiplier * health_multiplier * lifestyle_multiplier
        return round(adjusted_premium, 2)
    
    def _create_staff_guidance(self, profile: CustomerProfile, recommendations: List[ProductRecommendation], data: Dict) -> StaffGuidance:
        """Create comprehensive staff guidance package"""
        
        # Generate conversation starters
        conversation_starters = [
            f"I see you're interested in protecting your {profile.segment.value.replace('_', ' ')} lifestyle",
            f"Based on your profile, I have some exciting options that fit your ${profile.monthly_budget:.0f} monthly budget",
            f"Your {', '.join(profile.key_motivators[:2])} goals align perfectly with our protection plans"
        ]
        
        # Generate objection handling responses
        objection_handling = {
            "Too expensive": f"I understand budget is important. We have flexible payment options and our {recommendations[0].product_name if recommendations else 'basic plan'} starts at just ${recommendations[0].monthly_premium if recommendations else 'a low monthly rate'}",
            "Don't need insurance": f"Many {profile.segment.value.replace('_', ' ')} customers initially felt the same way. However, considering your {', '.join(profile.key_motivators[:1])}, protection becomes essential",
            "Need to think about it": f"Absolutely! This is an important decision. Based on your {profile.risk_profile.value} risk profile, I'd recommend we schedule a follow-up within the week to address any questions",
            "Have existing coverage": "That's great that you're already thinking about protection! Let me show you how our enhanced coverage could fill any gaps and potentially save you money through our multi-policy discounts"
        }
        
        # Generate next best actions
        next_best_actions = [
            f"Present the {recommendations[0].product_name if recommendations else 'recommended plan'} as the primary option",
            f"Highlight the {recommendations[0].competitive_advantages[0] if recommendations and recommendations[0].competitive_advantages else 'key benefits'}",
            "Offer to calculate exact premium with additional details",
            "Schedule follow-up appointment for family consultation" if profile.segment in [CustomerSegment.FAMILY_BUILDER, CustomerSegment.ESTABLISHED_FAMILY] else "Provide digital enrollment options"
        ]
        
        # Generate follow-up timeline
        follow_up_timeline = {
            "Immediate": "Send personalized quote via email",
            "24 hours": "Follow-up call to address questions",
            "3 days": "Special offer deadline reminder",
            "1 week": "Alternative product options if needed",
            "2 weeks": "Check-in and needs reassessment"
        }
        
        return StaffGuidance(
            customer_profile=profile,
            product_recommendations=recommendations,
            conversation_starters=conversation_starters,
            objection_handling=objection_handling,
            next_best_actions=next_best_actions,
            follow_up_timeline=follow_up_timeline
        )
    
    def generate_sales_report(self, guidance: StaffGuidance) -> Dict:
        """Generate comprehensive sales report for management"""
        
        total_premium = sum(rec.monthly_premium for rec in guidance.product_recommendations)
        total_coverage = sum(rec.coverage_amount for rec in guidance.product_recommendations)
        
        # Calculate potential commission
        total_commission = 0
        for rec in guidance.product_recommendations:
            product_category = rec.product_type.split('_')[0]
            if product_category in ["health", "life", "property", "auto"]:
                for tier, product_info in self.product_catalog.get(rec.product_type, {}).items():
                    if product_info["name"] == rec.product_name:
                        commission_rate = product_info.get("commission", 0.1)
                        total_commission += rec.monthly_premium * 12 * commission_rate
                        break
        
        return {
            "customer_summary": {
                "segment": guidance.customer_profile.segment.value,
                "affordability": guidance.customer_profile.affordability_level.value,
                "risk_profile": guidance.customer_profile.risk_profile.value,
                "lifetime_value": guidance.customer_profile.lifetime_value_estimate,
                "conversion_probability": guidance.customer_profile.conversion_probability
            },
            "sales_opportunity": {
                "total_monthly_premium": total_premium,
                "total_annual_premium": total_premium * 12,
                "total_coverage_amount": total_coverage,
                "estimated_annual_commission": total_commission,
                "number_of_products": len(guidance.product_recommendations)
            },
            "recommendations": [
                {
                    "product": rec.product_name,
                    "priority": rec.priority,
                    "confidence": rec.confidence_score,
                    "monthly_premium": rec.monthly_premium,
                    "coverage": rec.coverage_amount
                }
                for rec in guidance.product_recommendations
            ],
            "success_factors": {
                "key_motivators": guidance.customer_profile.key_motivators,
                "approach_strategy": guidance.customer_profile.recommended_approach,
                "primary_concerns": guidance.customer_profile.pain_points
            }
        } 