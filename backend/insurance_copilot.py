"""
Insurance Recommendation Engine for WishInsured
Analyzes health, property, and financial data to provide personalized insurance recommendations
"""

import json
import logging
from datetime import datetime
from typing import Dict, List, Optional, Tuple, Union
from dataclasses import dataclass, asdict
from enum import Enum

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class InsuranceType(Enum):
    """Types of insurance products"""
    HEALTH = "health"
    LIFE = "life"
    PROPERTY = "property"
    AUTO = "auto"
    DISABILITY = "disability"
    TRAVEL = "travel"

class RiskLevel(Enum):
    """Risk assessment levels for insurance"""
    LOW = "low"
    MODERATE = "moderate"
    HIGH = "high"
    CRITICAL = "critical"

class Priority(Enum):
    """Insurance priority levels"""
    CRITICAL = "critical"
    REQUIRED = "required"
    RECOMMENDED = "recommended"
    OPTIONAL = "optional"

@dataclass
class HealthProfile:
    """User health profile for insurance assessment"""
    age: int
    gender: str
    height: float  # cm
    weight: float  # kg
    smoking: bool
    drinking: bool
    exercise_frequency: str
    medical_conditions: List[str]
    family_history: List[str]
    medications: List[str]
    bmi: float = 0.0
    
    def __post_init__(self):
        self.bmi = self.weight / ((self.height / 100) ** 2) if self.height > 0 else 0

@dataclass
class PropertyProfile:
    """User property profile for insurance assessment"""
    property_type: str
    property_value: float
    location: str
    year_built: int
    security_features: List[str]
    previous_claims: bool
    mortgage: bool
    square_footage: Optional[float] = None
    flood_zone: Optional[bool] = None

@dataclass
class FinancialProfile:
    """User financial profile for insurance assessment"""
    annual_income: float
    employment_type: str
    dependents: int
    existing_insurance: List[str]
    monthly_expenses: float
    savings: float
    investment_risk_tolerance: str
    debt_obligations: Optional[float] = None

@dataclass
class InsuranceRecommendation:
    """Insurance product recommendation"""
    insurance_type: InsuranceType
    product_name: str
    annual_premium: float
    coverage_amount: float
    deductible: float
    risk_level: RiskLevel
    priority: Priority
    features: List[str]
    exclusions: List[str]
    explanation: str
    savings_potential: Optional[float] = None

class HealthInsuranceCalculator:
    """Calculate health insurance recommendations"""
    
    @staticmethod
    def assess_health_risk(profile: HealthProfile) -> Tuple[RiskLevel, float]:
        """Assess health insurance risk and calculate premium"""
        risk_factors = 0
        base_premium = 2400  # Base annual premium
        
        # Age factor
        if profile.age > 65:
            risk_factors += 3
            base_premium *= 2.5
        elif profile.age > 50:
            risk_factors += 2
            base_premium *= 1.8
        elif profile.age > 35:
            risk_factors += 1
            base_premium *= 1.3
        
        # BMI factor
        if profile.bmi > 35:
            risk_factors += 3
            base_premium *= 2.0
        elif profile.bmi > 30:
            risk_factors += 2
            base_premium *= 1.5
        elif profile.bmi < 18.5:
            risk_factors += 1
            base_premium *= 1.2
        
        # Lifestyle factors
        if profile.smoking:
            risk_factors += 3
            base_premium *= 2.5
        
        if profile.drinking:
            risk_factors += 1
            base_premium *= 1.2
        
        if profile.exercise_frequency in ["never", "rarely"]:
            risk_factors += 1
            base_premium *= 1.1
        
        # Medical conditions
        high_risk_conditions = ["diabetes", "heart disease", "cancer", "stroke"]
        moderate_risk_conditions = ["hypertension", "asthma", "arthritis"]
        
        for condition in profile.medical_conditions:
            if condition.lower() in high_risk_conditions:
                risk_factors += 3
                base_premium *= 1.8
            elif condition.lower() in moderate_risk_conditions:
                risk_factors += 1
                base_premium *= 1.3
        
        # Family history
        if profile.family_history:
            risk_factors += len(profile.family_history) * 0.5
            base_premium *= (1 + len(profile.family_history) * 0.1)
        
        # Determine risk level
        if risk_factors >= 6:
            risk_level = RiskLevel.CRITICAL
        elif risk_factors >= 4:
            risk_level = RiskLevel.HIGH
        elif risk_factors >= 2:
            risk_level = RiskLevel.MODERATE
        else:
            risk_level = RiskLevel.LOW
        
        return risk_level, base_premium

    @staticmethod
    def generate_health_recommendation(
        health_profile: HealthProfile, 
        financial_profile: FinancialProfile
    ) -> InsuranceRecommendation:
        """Generate health insurance recommendation"""
        
        risk_level, annual_premium = HealthInsuranceCalculator.assess_health_risk(health_profile)
        
        # Adjust premium based on income
        if financial_profile.annual_income < 30000:
            annual_premium *= 0.7  # Subsidized rates
        elif financial_profile.annual_income > 100000:
            annual_premium *= 1.2  # Premium plans
        
        coverage_amount = annual_premium * 25  # 25x premium coverage
        deductible = min(annual_premium * 0.5, 5000)
        
        # Determine priority
        if "health insurance" not in [ins.lower() for ins in financial_profile.existing_insurance]:
            if risk_level in [RiskLevel.HIGH, RiskLevel.CRITICAL]:
                priority = Priority.CRITICAL
            else:
                priority = Priority.REQUIRED
        else:
            priority = Priority.RECOMMENDED
        
        features = [
            "Comprehensive medical coverage",
            "Prescription medication coverage",
            "Emergency hospitalization",
            "Preventive care services",
            "Mental health coverage"
        ]
        
        if risk_level == RiskLevel.LOW:
            features.extend([
                "Wellness program discounts",
                "Telemedicine consultations"
            ])
        else:
            features.extend([
                "Specialist consultation coverage",
                "Chronic condition management",
                "Rehabilitation services"
            ])
        
        exclusions = [
            "Cosmetic procedures",
            "Experimental treatments"
        ]
        
        if health_profile.smoking:
            exclusions.append("Smoking cessation programs (after 12 months)")
        
        explanation = f"Based on your health profile (BMI: {health_profile.bmi:.1f}, Age: {health_profile.age}), "
        
        if risk_level == RiskLevel.CRITICAL:
            explanation += "you are in a high-risk category requiring comprehensive coverage with immediate effect."
        elif risk_level == RiskLevel.HIGH:
            explanation += "you have elevated health risks that necessitate robust insurance protection."
        elif risk_level == RiskLevel.MODERATE:
            explanation += "you have moderate health risks with standard coverage recommended."
        else:
            explanation += "you are in excellent health and qualify for our best rates."
        
        return InsuranceRecommendation(
            insurance_type=InsuranceType.HEALTH,
            product_name="WishHealth Comprehensive Plan",
            annual_premium=annual_premium,
            coverage_amount=coverage_amount,
            deductible=deductible,
            risk_level=risk_level,
            priority=priority,
            features=features,
            exclusions=exclusions,
            explanation=explanation
        )

class PropertyInsuranceCalculator:
    """Calculate property insurance recommendations"""
    
    @staticmethod
    def assess_property_risk(profile: PropertyProfile) -> Tuple[RiskLevel, float]:
        """Assess property insurance risk and calculate premium"""
        risk_factors = 0
        premium_rate = 0.003  # Base rate (0.3% of property value)
        
        # Property age factor
        if profile.year_built < 1950:
            risk_factors += 3
            premium_rate += 0.004
        elif profile.year_built < 1980:
            risk_factors += 2
            premium_rate += 0.002
        elif profile.year_built < 2000:
            risk_factors += 1
            premium_rate += 0.001
        
        # Previous claims
        if profile.previous_claims:
            risk_factors += 2
            premium_rate += 0.002
        
        # Security features (reduce risk)
        security_score = len(profile.security_features)
        if security_score >= 4:
            premium_rate -= 0.001
            risk_factors -= 1
        elif security_score >= 2:
            premium_rate -= 0.0005
        
        # Property type factor
        if profile.property_type in ["mobile-home", "manufactured"]:
            risk_factors += 2
            premium_rate += 0.003
        elif profile.property_type == "condo":
            risk_factors -= 1
            premium_rate -= 0.001
        
        # Location risk (simplified)
        high_risk_areas = ["florida", "california", "texas", "louisiana"]
        if any(area in profile.location.lower() for area in high_risk_areas):
            risk_factors += 2
            premium_rate += 0.002
        
        # Ensure minimum premium rate
        premium_rate = max(premium_rate, 0.002)
        annual_premium = profile.property_value * premium_rate
        
        # Determine risk level
        if risk_factors >= 5:
            risk_level = RiskLevel.HIGH
        elif risk_factors >= 3:
            risk_level = RiskLevel.MODERATE
        elif risk_factors <= 0:
            risk_level = RiskLevel.LOW
        else:
            risk_level = RiskLevel.MODERATE
        
        return risk_level, annual_premium

    @staticmethod
    def generate_property_recommendation(
        property_profile: PropertyProfile,
        financial_profile: FinancialProfile
    ) -> Optional[InsuranceRecommendation]:
        """Generate property insurance recommendation"""
        
        if property_profile.property_value <= 0:
            return None
        
        risk_level, annual_premium = PropertyInsuranceCalculator.assess_property_risk(property_profile)
        
        coverage_amount = property_profile.property_value
        deductible = min(annual_premium * 2, 10000)
        
        # Determine priority
        if property_profile.mortgage:
            priority = Priority.REQUIRED
        elif "property insurance" not in [ins.lower() for ins in financial_profile.existing_insurance]:
            priority = Priority.CRITICAL
        else:
            priority = Priority.RECOMMENDED
        
        features = [
            "Dwelling coverage",
            "Personal property protection",
            "Personal liability coverage",
            "Additional living expenses",
            "Medical payments coverage"
        ]
        
        if property_profile.property_type == "condo":
            features.extend([
                "HO-6 condo specific coverage",
                "Loss assessment coverage"
            ])
        else:
            features.extend([
                "Other structures coverage",
                "Detached garage protection"
            ])
        
        if len(property_profile.security_features) >= 3:
            features.append("Security system discount applied")
        
        exclusions = [
            "Flood damage (separate policy required)",
            "Earthquake damage (separate policy required)",
            "Normal wear and tear",
            "Neglect or poor maintenance"
        ]
        
        explanation = f"For your {property_profile.property_type} valued at ${property_profile.property_value:,.0f}, "
        
        if risk_level == RiskLevel.HIGH:
            explanation += "we recommend comprehensive coverage due to elevated risk factors including property age and location."
        elif risk_level == RiskLevel.MODERATE:
            explanation += "standard homeowner's insurance provides adequate protection for your property profile."
        else:
            explanation += "you qualify for preferred rates due to low-risk factors and excellent property features."
        
        return InsuranceRecommendation(
            insurance_type=InsuranceType.PROPERTY,
            product_name="WishHome Property Protection",
            annual_premium=annual_premium,
            coverage_amount=coverage_amount,
            deductible=deductible,
            risk_level=risk_level,
            priority=priority,
            features=features,
            exclusions=exclusions,
            explanation=explanation
        )

class LifeInsuranceCalculator:
    """Calculate life insurance recommendations"""
    
    @staticmethod
    def calculate_life_insurance_need(
        health_profile: HealthProfile,
        financial_profile: FinancialProfile
    ) -> Tuple[float, float]:
        """Calculate life insurance coverage need and premium"""
        
        # Base coverage calculation
        income_replacement = financial_profile.annual_income * 10
        debt_coverage = getattr(financial_profile, 'debt_obligations', 0) or 0
        dependent_support = financial_profile.dependents * 100000
        final_expenses = 25000
        
        coverage_need = income_replacement + debt_coverage + dependent_support + final_expenses
        
        # Adjust based on existing savings
        coverage_need = max(coverage_need - financial_profile.savings, 100000)
        
        # Calculate premium (per $1000 of coverage annually)
        base_rate = 1.0  # $1 per $1000 for healthy 30-year-old
        
        # Age factor
        age_multiplier = 1 + ((health_profile.age - 30) * 0.05)
        base_rate *= max(age_multiplier, 0.5)
        
        # Health factors
        if health_profile.smoking:
            base_rate *= 3.0
        
        if health_profile.bmi > 35:
            base_rate *= 2.0
        elif health_profile.bmi > 30:
            base_rate *= 1.5
        
        # Medical conditions
        high_risk_conditions = ["diabetes", "heart disease", "cancer"]
        for condition in health_profile.medical_conditions:
            if condition.lower() in high_risk_conditions:
                base_rate *= 2.5
                break
        
        annual_premium = (coverage_need / 1000) * base_rate
        
        return coverage_need, annual_premium

    @staticmethod
    def generate_life_recommendation(
        health_profile: HealthProfile,
        financial_profile: FinancialProfile
    ) -> InsuranceRecommendation:
        """Generate life insurance recommendation"""
        
        coverage_need, annual_premium = LifeInsuranceCalculator.calculate_life_insurance_need(
            health_profile, financial_profile
        )
        
        # Determine priority
        if financial_profile.dependents > 0:
            priority = Priority.CRITICAL
        elif financial_profile.annual_income > 50000:
            priority = Priority.REQUIRED
        else:
            priority = Priority.RECOMMENDED
        
        # Determine risk level
        if health_profile.age > 60 or health_profile.smoking or health_profile.medical_conditions:
            risk_level = RiskLevel.HIGH
        elif health_profile.age > 45 or health_profile.bmi > 30:
            risk_level = RiskLevel.MODERATE
        else:
            risk_level = RiskLevel.LOW
        
        features = [
            "Tax-free death benefit",
            "Flexible premium payments",
            "Accelerated death benefit rider",
            "Waiver of premium rider"
        ]
        
        if financial_profile.dependents > 0:
            features.extend([
                "Child education fund provision",
                "Family income protection",
                "Mortgage protection coverage"
            ])
        
        if coverage_need > 500000:
            features.append("No medical exam up to $500k")
        else:
            features.append("Simplified underwriting process")
        
        exclusions = [
            "Suicide within first 2 years",
            "Death during commission of a felony",
            "War or acts of war",
            "Aviation accidents (unless passenger)"
        ]
        
        explanation = f"Based on your income of ${financial_profile.annual_income:,.0f} and {financial_profile.dependents} dependents, "
        
        if priority == Priority.CRITICAL:
            explanation += "life insurance is essential to protect your family's financial security."
        else:
            explanation += "life insurance provides important financial protection and peace of mind."
        
        return InsuranceRecommendation(
            insurance_type=InsuranceType.LIFE,
            product_name="WishLife Protection Plan",
            annual_premium=annual_premium,
            coverage_amount=coverage_need,
            deductible=0,  # Life insurance doesn't have deductibles
            risk_level=risk_level,
            priority=priority,
            features=features,
            exclusions=exclusions,
            explanation=explanation
        )

class InsuranceRecommendationEngine:
    """Main engine for generating insurance recommendations"""
    
    def __init__(self):
        self.health_calculator = HealthInsuranceCalculator()
        self.property_calculator = PropertyInsuranceCalculator()
        self.life_calculator = LifeInsuranceCalculator()
    
    def generate_comprehensive_recommendations(
        self,
        health_profile: HealthProfile,
        property_profile: PropertyProfile,
        financial_profile: FinancialProfile
    ) -> List[InsuranceRecommendation]:
        """Generate comprehensive insurance recommendations"""
        
        recommendations = []
        
        # Health Insurance
        health_rec = self.health_calculator.generate_health_recommendation(
            health_profile, financial_profile
        )
        recommendations.append(health_rec)
        
        # Property Insurance
        property_rec = self.property_calculator.generate_property_recommendation(
            property_profile, financial_profile
        )
        if property_rec:
            recommendations.append(property_rec)
        
        # Life Insurance
        life_rec = self.life_calculator.generate_life_recommendation(
            health_profile, financial_profile
        )
        recommendations.append(life_rec)
        
        # Sort by priority
        priority_order = {
            Priority.CRITICAL: 0,
            Priority.REQUIRED: 1,
            Priority.RECOMMENDED: 2,
            Priority.OPTIONAL: 3
        }
        
        recommendations.sort(key=lambda x: priority_order[x.priority])
        
        return recommendations
    
    def calculate_total_premium(self, recommendations: List[InsuranceRecommendation]) -> Dict:
        """Calculate total premium and coverage summary"""
        
        total_annual_premium = sum(rec.annual_premium for rec in recommendations)
        total_coverage = sum(rec.coverage_amount for rec in recommendations)
        
        critical_recs = [rec for rec in recommendations if rec.priority == Priority.CRITICAL]
        required_recs = [rec for rec in recommendations if rec.priority == Priority.REQUIRED]
        
        return {
            "total_annual_premium": total_annual_premium,
            "total_coverage": total_coverage,
            "monthly_premium": total_annual_premium / 12,
            "critical_recommendations": len(critical_recs),
            "required_recommendations": len(required_recs),
            "critical_premium": sum(rec.annual_premium for rec in critical_recs),
            "required_premium": sum(rec.annual_premium for rec in required_recs)
        }

# Example usage function
def example_insurance_assessment():
    """Example insurance assessment"""
    
    # Sample profiles
    health_profile = HealthProfile(
        age=35,
        gender="male",
        height=175,
        weight=85,
        smoking=False,
        drinking=True,
        exercise_frequency="sometimes",
        medical_conditions=["hypertension"],
        family_history=["diabetes"],
        medications=["lisinopril"]
    )
    
    property_profile = PropertyProfile(
        property_type="single-family",
        property_value=350000,
        location="Austin, TX",
        year_built=2005,
        security_features=["security system", "smoke detectors", "deadbolt locks"],
        previous_claims=False,
        mortgage=True
    )
    
    financial_profile = FinancialProfile(
        annual_income=75000,
        employment_type="full-time",
        dependents=2,
        existing_insurance=["auto insurance"],
        monthly_expenses=4500,
        savings=25000,
        investment_risk_tolerance="moderate"
    )
    
    # Generate recommendations
    engine = InsuranceRecommendationEngine()
    recommendations = engine.generate_comprehensive_recommendations(
        health_profile, property_profile, financial_profile
    )
    
    # Calculate summary
    summary = engine.calculate_total_premium(recommendations)
    
    print("=== WISHINSURED INSURANCE RECOMMENDATIONS ===\n")
    
    for i, rec in enumerate(recommendations, 1):
        print(f"{i}. {rec.product_name} ({rec.insurance_type.value.title()})")
        print(f"   Priority: {rec.priority.value.title()}")
        print(f"   Annual Premium: ${rec.annual_premium:,.2f}")
        print(f"   Coverage: ${rec.coverage_amount:,.0f}")
        if rec.deductible > 0:
            print(f"   Deductible: ${rec.deductible:,.0f}")
        print(f"   Risk Level: {rec.risk_level.value.title()}")
        print(f"   Explanation: {rec.explanation}")
        print()
    
    print("=== SUMMARY ===")
    print(f"Total Annual Premium: ${summary['total_annual_premium']:,.2f}")
    print(f"Monthly Premium: ${summary['monthly_premium']:,.2f}")
    print(f"Total Coverage: ${summary['total_coverage']:,.0f}")
    print(f"Critical Recommendations: {summary['critical_recommendations']}")
    print(f"Required Recommendations: {summary['required_recommendations']}")

if __name__ == "__main__":
    example_insurance_assessment() 