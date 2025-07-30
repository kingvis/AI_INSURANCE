# Enhanced Insurance API with Global Finance Features
# FastAPI server with multi-country support, financial advice, and savings calculations

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Dict, List, Optional
import uvicorn
from datetime import datetime

# Import our enhanced engines
from insurance_copilot import HealthInsuranceCopilot
from global_finance_engine import GlobalFinanceEngine

app = FastAPI(
    title="WishInsured Global Finance API",
    description="Comprehensive insurance and financial planning API with multi-country support",
    version="2.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize engines
health_copilot = HealthInsuranceCopilot()
finance_engine = GlobalFinanceEngine()

# Enhanced Pydantic models
class GlobalHealthProfile(BaseModel):
    age: int = Field(..., ge=18, le=100)
    height: float = Field(..., gt=0)
    weight: float = Field(..., gt=0)
    gender: str = Field(..., pattern="^(male|female|other)$")
    smoking: bool = False
    drinking: str = Field("never", pattern="^(never|occasionally|regularly|heavy)$")
    exercise_frequency: str = Field("moderate", pattern="^(never|light|moderate|active|very_active)$")
    medical_conditions: List[str] = []
    family_history: List[str] = []
    country: str = Field(..., pattern="^(US|IN|UK|CA|AU|DE)$")

class GlobalPropertyProfile(BaseModel):
    property_type: str
    value: float = Field(..., gt=0)
    year_built: int
    security_features: List[str] = []
    location_risk: str = Field("low", pattern="^(low|medium|high)$")
    previous_claims: int = Field(0, ge=0)
    country: str = Field(..., pattern="^(US|IN|UK|CA|AU|DE)$")

class GlobalFinancialProfile(BaseModel):
    annual_income: float = Field(..., gt=0)
    current_savings: float = Field(0, ge=0)
    dependents: int = Field(0, ge=0)
    employment_type: str = Field("employed", pattern="^(employed|self_employed|unemployed|retired)$")
    existing_insurance: List[str] = []
    risk_tolerance: str = Field("moderate", pattern="^(conservative|moderate|aggressive)$")
    financial_goals: List[str] = []
    country: str = Field(..., pattern="^(US|IN|UK|CA|AU|DE)$")
    emergency_fund: float = Field(0, ge=0)

class SavingsCalculationRequest(BaseModel):
    monthly_amount: float = Field(..., gt=0)
    years: int = Field(..., ge=1, le=50)
    country: str = Field(..., pattern="^(US|IN|UK|CA|AU|DE)$")
    risk_level: str = Field("moderate", pattern="^(conservative|moderate|aggressive)$")

class ComprehensiveGlobalAssessment(BaseModel):
    health_profile: GlobalHealthProfile
    property_profile: Optional[GlobalPropertyProfile] = None
    financial_profile: GlobalFinancialProfile

# API Endpoints

@app.get("/health")
async def health_check():
    """API health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.get("/countries")
async def get_supported_countries():
    """Get list of supported countries with their details"""
    countries = {
        "US": {"name": "United States", "currency": "USD", "symbol": "$"},
        "IN": {"name": "India", "currency": "INR", "symbol": "₹"},
        "UK": {"name": "United Kingdom", "currency": "GBP", "symbol": "£"},
        "CA": {"name": "Canada", "currency": "CAD", "symbol": "C$"},
        "AU": {"name": "Australia", "currency": "AUD", "symbol": "A$"},
        "DE": {"name": "Germany", "currency": "EUR", "symbol": "€"}
    }
    return {"countries": countries}

@app.post("/assess-global-comprehensive")
async def assess_global_comprehensive(assessment: ComprehensiveGlobalAssessment):
    """Comprehensive global insurance and financial assessment"""
    try:
        country = assessment.financial_profile.country
        
        # Health assessment with BMI logic
        health_data = assessment.health_profile.dict()
        bmi = health_copilot.calculate_bmi(health_data["height"], health_data["weight"])
        health_risks = health_copilot.assess_health_risks(health_data)
        
        # Generate insurance recommendations with country-specific pricing
        recommendations = []
        
        # Health Insurance
        base_health_premium = health_copilot.calculate_base_premium(health_data, "health")
        health_premium = finance_engine.calculate_country_premium(
            base_health_premium, country, "health"
        )
        
        recommendations.append({
            "type": "Health Insurance",
            "priority": "Critical",
            "premium": health_premium,
            "coverage": f"Comprehensive medical coverage with {health_premium['symbol']}{health_premium['amount']*10:,.0f} annual limit",
            "features": ["Hospitalization", "Outpatient care", "Prescription drugs", "Preventive care"],
            "reasoning": f"BMI: {bmi['value']:.1f} ({bmi['category']}) - {health_risks['recommendations'][0] if health_risks['recommendations'] else 'Standard health coverage recommended'}"
        })
        
        # Property Insurance (if provided)
        if assessment.property_profile:
            property_data = assessment.property_profile.dict()
            base_property_premium = property_data["value"] * 0.005  # 0.5% of value
            property_premium = finance_engine.calculate_country_premium(
                base_property_premium, country, "property"
            )
            
            recommendations.append({
                "type": "Property Insurance",
                "priority": "Required",
                "premium": property_premium,
                "coverage": f"Property value up to {property_premium['symbol']}{property_data['value']:,.0f}",
                "features": ["Fire & theft", "Natural disasters", "Personal liability", "Contents coverage"],
                "reasoning": f"Property built in {property_data['year_built']}, security features: {len(property_data['security_features'])}"
            })
        
        # Life Insurance
        financial_data = assessment.financial_profile.dict()
        life_coverage_needed = financial_data["annual_income"] * 10  # 10x annual income
        base_life_premium = life_coverage_needed * 0.001  # 0.1% of coverage
        life_premium = finance_engine.calculate_country_premium(
            base_life_premium, country, "life"
        )
        
        recommendations.append({
            "type": "Life Insurance",
            "priority": "Required" if financial_data["dependents"] > 0 else "Recommended",
            "premium": life_premium,
            "coverage": f"Life coverage: {life_premium['symbol']}{life_coverage_needed:,.0f}",
            "features": ["Term life insurance", "Beneficiary protection", "Tax-free benefits"],
            "reasoning": f"Income replacement for {financial_data['dependents']} dependents" if financial_data["dependents"] > 0 else "Future planning and debt coverage"
        })
        
        # Generate financial advice
        financial_advice = finance_engine.generate_financial_advice(financial_data, country)
        
        # Get country-specific policies
        country_policies = finance_engine.get_country_specific_policies(country)
        
        # Generate motivational content
        user_age = assessment.health_profile.age
        savings_rate = financial_advice["monthly_analysis"]["savings_rate"]
        motivational_content = finance_engine.get_motivational_content(user_age, savings_rate, country)
        
        return {
            "bmi_assessment": bmi,
            "health_risks": health_risks,
            "insurance_recommendations": recommendations,
            "financial_advice": financial_advice,
            "country_policies": country_policies,
            "motivational_content": motivational_content,
            "assessment_summary": {
                "total_monthly_premiums": sum(rec["premium"]["monthly"] for rec in recommendations),
                "currency": recommendations[0]["premium"]["currency"],
                "symbol": recommendations[0]["premium"]["symbol"],
                "country": country,
                "assessment_date": datetime.now().isoformat()
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Assessment failed: {str(e)}")

@app.post("/calculate-savings-projection")
async def calculate_savings_projection(request: SavingsCalculationRequest):
    """Calculate savings and investment projections"""
    try:
        projections = finance_engine.calculate_savings_projections(
            request.monthly_amount,
            request.years,
            request.country,
            request.risk_level
        )
        
        return {
            "projections": projections,
            "request_details": request.dict(),
            "calculation_date": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Calculation failed: {str(e)}")

@app.get("/financial-advice/{country}")
async def get_financial_advice(
    country: str,
    annual_income: float = Query(..., gt=0),
    age: int = Query(..., ge=18, le=100),
    dependents: int = Query(0, ge=0),
    current_savings: float = Query(0, ge=0),
         risk_tolerance: str = Query("moderate", pattern="^(conservative|moderate|aggressive)$")
):
    """Get country-specific financial advice"""
    try:
        user_profile = {
            "annual_income": annual_income,
            "age": age,
            "dependents": dependents,
            "current_savings": current_savings,
            "risk_tolerance": risk_tolerance
        }
        
        advice = finance_engine.generate_financial_advice(user_profile, country)
        
        return {
            "financial_advice": advice,
            "user_profile": user_profile,
            "country": country
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Advice generation failed: {str(e)}")

@app.get("/country-policies/{country}")
async def get_country_policies(country: str):
    """Get country-specific insurance policies and financial products"""
    try:
        policies = finance_engine.get_country_specific_policies(country)
        
        return {
            "country": country,
            "policies": policies
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Policy retrieval failed: {str(e)}")

@app.get("/motivational-content/{country}")
async def get_motivational_content(
    country: str,
    age: int = Query(..., ge=18, le=100),
    savings_rate: float = Query(..., ge=0, le=100)
):
    """Get motivational content for financial independence"""
    try:
        content = finance_engine.get_motivational_content(age, savings_rate, country)
        
        return {
            "motivational_content": content,
            "user_details": {"age": age, "savings_rate": savings_rate, "country": country}
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Content generation failed: {str(e)}")

@app.post("/calculate-bmi-global")
async def calculate_bmi_global(
    height: float = Query(..., gt=0),
    weight: float = Query(..., gt=0),
         country: str = Query(..., pattern="^(US|IN|UK|CA|AU|DE)$")
 ):
     """Calculate BMI with country-specific health recommendations"""
    try:
        bmi_data = health_copilot.calculate_bmi(height, weight)
        
        # Add country-specific context
        country_data = finance_engine.countries_data[country]
        
        result = {
            "bmi": bmi_data,
            "country_context": {
                "country": country,
                "currency": country_data["currency"],
                "symbol": country_data["symbol"],
                "healthcare_system": country_data["healthcare_system"]
            }
        }
        
        # Add cardiovascular risk warning for BMI > 30
        if bmi_data["value"] >= 30:
            result["cardiovascular_warning"] = {
                "risk_level": "HIGH",
                "message": "BMI > 30 indicates obesity, significantly increasing risk of cardiovascular disease, diabetes, and other health complications.",
                "recommendations": [
                    "Consult with a healthcare provider immediately",
                    "Consider a structured weight management program",
                    "Increase physical activity gradually",
                    "Adopt a balanced, calorie-controlled diet",
                    "Monitor blood pressure and blood sugar regularly"
                ],
                "insurance_impact": f"Higher health insurance premiums likely in {country}"
            }
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"BMI calculation failed: {str(e)}")

@app.get("/exchange-rates")
async def get_exchange_rates():
    """Get current exchange rates for supported currencies"""
    return {"exchange_rates": finance_engine.exchange_rates}

@app.get("/investment-returns/{country}")
async def get_investment_returns(country: str):
    """Get expected investment returns by country and risk level"""
    try:
        returns = finance_engine.investment_returns[country]
        country_data = finance_engine.countries_data[country]
        
        return {
            "country": country,
            "currency": country_data["currency"],
            "symbol": country_data["symbol"],
            "expected_returns": returns,
            "investment_options": country_data["investment_options"],
            "tax_advantages": country_data["tax_advantages"]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Returns data retrieval failed: {str(e)}")

# Legacy endpoints for backward compatibility
@app.post("/calculate-bmi")
async def calculate_bmi_legacy(height: float = Query(..., gt=0), weight: float = Query(..., gt=0)):
    """Legacy BMI calculation endpoint"""
    return health_copilot.calculate_bmi(height, weight)

@app.get("/insurance-types")
async def get_insurance_types():
    """Get available insurance types"""
    return {
        "types": [
            {"id": "health", "name": "Health Insurance", "description": "Medical coverage and healthcare costs"},
            {"id": "property", "name": "Property Insurance", "description": "Home and property protection"},
            {"id": "life", "name": "Life Insurance", "description": "Life coverage and beneficiary protection"},
            {"id": "auto", "name": "Auto Insurance", "description": "Vehicle coverage and liability"}
        ]
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001) 