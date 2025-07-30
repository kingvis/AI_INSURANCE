"""
FastAPI Server for WishInsured Insurance Recommendations
Provides REST API endpoints for insurance assessment and recommendations
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uvicorn
import json
from datetime import datetime
import logging

from insurance_copilot import (
    InsuranceRecommendationEngine,
    HealthProfile,
    PropertyProfile,
    FinancialProfile,
    InsuranceRecommendation,
    InsuranceType,
    RiskLevel,
    Priority
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="WishInsured Insurance API",
    description="Personalized insurance recommendations based on health, property, and financial profiles",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Insurance Engine
insurance_engine = InsuranceRecommendationEngine()

# Pydantic models for API request/response
class HealthProfileRequest(BaseModel):
    """Request model for health profile"""
    age: int = Field(..., description="Age in years", gt=0, le=120)
    gender: str = Field(..., description="Gender (male/female/other)")
    height: float = Field(..., description="Height in centimeters", gt=0, le=250)
    weight: float = Field(..., description="Weight in kilograms", gt=0, le=500)
    smoking: bool = Field(default=False, description="Current or former smoker")
    drinking: bool = Field(default=False, description="Regular alcohol consumption")
    exercise_frequency: str = Field(
        default="sometimes", 
        description="Exercise frequency: never, rarely, sometimes, regularly, daily"
    )
    medical_conditions: List[str] = Field(default=[], description="List of medical conditions")
    family_history: List[str] = Field(default=[], description="Family medical history")
    medications: List[str] = Field(default=[], description="Current medications")

class PropertyProfileRequest(BaseModel):
    """Request model for property profile"""
    property_type: str = Field(..., description="Type of property")
    property_value: float = Field(..., description="Property value in USD", gt=0)
    location: str = Field(..., description="Property location (city, state)")
    year_built: int = Field(..., description="Year property was built", gt=1800)
    security_features: List[str] = Field(default=[], description="Security features")
    previous_claims: bool = Field(default=False, description="Previous insurance claims")
    mortgage: bool = Field(default=False, description="Property has mortgage")

class FinancialProfileRequest(BaseModel):
    """Request model for financial profile"""
    annual_income: float = Field(..., description="Annual income in USD", gt=0)
    employment_type: str = Field(..., description="Type of employment")
    dependents: int = Field(..., description="Number of dependents", ge=0)
    existing_insurance: List[str] = Field(default=[], description="Existing insurance policies")
    monthly_expenses: float = Field(..., description="Monthly expenses in USD", gt=0)
    savings: float = Field(..., description="Current savings in USD", ge=0)
    investment_risk_tolerance: str = Field(..., description="Risk tolerance: conservative, moderate, aggressive")

class ComprehensiveAssessmentRequest(BaseModel):
    """Request model for comprehensive insurance assessment"""
    health_profile: HealthProfileRequest
    property_profile: Optional[PropertyProfileRequest] = None
    financial_profile: FinancialProfileRequest

class InsuranceRecommendationResponse(BaseModel):
    """Response model for insurance recommendation"""
    insurance_type: str
    product_name: str
    annual_premium: float
    monthly_premium: float
    coverage_amount: float
    deductible: float
    risk_level: str
    priority: str
    features: List[str]
    exclusions: List[str]
    explanation: str

class AssessmentSummaryResponse(BaseModel):
    """Response model for assessment summary"""
    total_annual_premium: float
    total_monthly_premium: float
    total_coverage: float
    critical_recommendations: int
    required_recommendations: int
    recommendations: List[InsuranceRecommendationResponse]
    assessment_date: str
    user_profile_summary: Dict[str, Any]

class QuickQuoteRequest(BaseModel):
    """Request model for quick insurance quote"""
    insurance_type: str = Field(..., description="Type of insurance: health, property, life")
    age: Optional[int] = None
    property_value: Optional[float] = None
    annual_income: Optional[float] = None
    health_conditions: Optional[List[str]] = []

# API Endpoints

@app.get("/", response_model=Dict[str, str])
async def root():
    """Root endpoint with API information"""
    return {
        "service": "WishInsured Insurance API",
        "version": "1.0.0",
        "status": "active",
        "docs": "/docs",
        "health_check": "/health",
        "company": "WishInsured - Your Personalized Insurance Advisor"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "service": "WishInsured Insurance Engine",
        "engine_ready": True
    }

@app.post("/assess-comprehensive", response_model=AssessmentSummaryResponse)
async def assess_comprehensive(request: ComprehensiveAssessmentRequest):
    """
    Comprehensive insurance assessment based on all user profiles
    
    This endpoint:
    - Analyzes health, property, and financial profiles
    - Generates personalized insurance recommendations
    - Calculates risk levels and premiums
    - Provides priority-based recommendations
    """
    try:
        logger.info("Received comprehensive insurance assessment request")
        
        # Convert request to internal profile objects
        health_profile = HealthProfile(
            age=request.health_profile.age,
            gender=request.health_profile.gender,
            height=request.health_profile.height,
            weight=request.health_profile.weight,
            smoking=request.health_profile.smoking,
            drinking=request.health_profile.drinking,
            exercise_frequency=request.health_profile.exercise_frequency,
            medical_conditions=request.health_profile.medical_conditions,
            family_history=request.health_profile.family_history,
            medications=request.health_profile.medications
        )
        
        financial_profile = FinancialProfile(
            annual_income=request.financial_profile.annual_income,
            employment_type=request.financial_profile.employment_type,
            dependents=request.financial_profile.dependents,
            existing_insurance=request.financial_profile.existing_insurance,
            monthly_expenses=request.financial_profile.monthly_expenses,
            savings=request.financial_profile.savings,
            investment_risk_tolerance=request.financial_profile.investment_risk_tolerance
        )
        
        # Handle optional property profile
        if request.property_profile:
            property_profile = PropertyProfile(
                property_type=request.property_profile.property_type,
                property_value=request.property_profile.property_value,
                location=request.property_profile.location,
                year_built=request.property_profile.year_built,
                security_features=request.property_profile.security_features,
                previous_claims=request.property_profile.previous_claims,
                mortgage=request.property_profile.mortgage
            )
        else:
            # Create empty property profile
            property_profile = PropertyProfile(
                property_type="",
                property_value=0,
                location="",
                year_built=2000,
                security_features=[],
                previous_claims=False,
                mortgage=False
            )
        
        # Generate recommendations
        recommendations = insurance_engine.generate_comprehensive_recommendations(
            health_profile, property_profile, financial_profile
        )
        
        # Calculate summary
        summary = insurance_engine.calculate_total_premium(recommendations)
        
        # Convert to response format
        recommendation_responses = []
        for rec in recommendations:
            recommendation_responses.append(InsuranceRecommendationResponse(
                insurance_type=rec.insurance_type.value,
                product_name=rec.product_name,
                annual_premium=rec.annual_premium,
                monthly_premium=rec.annual_premium / 12,
                coverage_amount=rec.coverage_amount,
                deductible=rec.deductible,
                risk_level=rec.risk_level.value,
                priority=rec.priority.value,
                features=rec.features,
                exclusions=rec.exclusions,
                explanation=rec.explanation
            ))
        
        # Create user profile summary
        user_summary = {
            "age": health_profile.age,
            "bmi": round(health_profile.bmi, 1),
            "bmi_category": "Obese" if health_profile.bmi >= 30 else "Overweight" if health_profile.bmi >= 25 else "Normal",
            "dependents": financial_profile.dependents,
            "annual_income": financial_profile.annual_income,
            "property_value": property_profile.property_value if property_profile.property_value > 0 else None,
            "risk_factors": {
                "smoking": health_profile.smoking,
                "medical_conditions": len(health_profile.medical_conditions),
                "high_bmi": health_profile.bmi >= 30
            }
        }
        
        response = AssessmentSummaryResponse(
            total_annual_premium=summary['total_annual_premium'],
            total_monthly_premium=summary['monthly_premium'],
            total_coverage=summary['total_coverage'],
            critical_recommendations=summary['critical_recommendations'],
            required_recommendations=summary['required_recommendations'],
            recommendations=recommendation_responses,
            assessment_date=datetime.now().isoformat(),
            user_profile_summary=user_summary
        )
        
        logger.info(f"Assessment completed. Total premium: ${summary['total_annual_premium']:,.2f}")
        return response
        
    except Exception as e:
        logger.error(f"Error in comprehensive assessment: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error during assessment: {str(e)}"
        )

@app.post("/quick-quote", response_model=Dict[str, Any])
async def quick_quote(request: QuickQuoteRequest):
    """
    Quick insurance quote for specific insurance type
    """
    try:
        logger.info(f"Quick quote request for {request.insurance_type}")
        
        if request.insurance_type.lower() == "health":
            if not request.age:
                raise HTTPException(status_code=400, detail="Age required for health insurance quote")
            
            # Create minimal health profile
            health_profile = HealthProfile(
                age=request.age,
                gender="other",
                height=170,
                weight=70,
                smoking=False,
                drinking=False,
                exercise_frequency="sometimes",
                medical_conditions=request.health_conditions or [],
                family_history=[],
                medications=[]
            )
            
            financial_profile = FinancialProfile(
                annual_income=50000,
                employment_type="full-time",
                dependents=0,
                existing_insurance=[],
                monthly_expenses=3000,
                savings=10000,
                investment_risk_tolerance="moderate"
            )
            
            recommendation = insurance_engine.health_calculator.generate_health_recommendation(
                health_profile, financial_profile
            )
            
            return {
                "insurance_type": "health",
                "estimated_annual_premium": recommendation.annual_premium,
                "estimated_monthly_premium": recommendation.annual_premium / 12,
                "coverage_amount": recommendation.coverage_amount,
                "risk_level": recommendation.risk_level.value,
                "note": "Quote based on basic profile. Complete assessment for accurate pricing."
            }
        
        elif request.insurance_type.lower() == "property":
            if not request.property_value:
                raise HTTPException(status_code=400, detail="Property value required for property insurance quote")
            
            property_profile = PropertyProfile(
                property_type="single-family",
                property_value=request.property_value,
                location="General Location",
                year_built=2000,
                security_features=[],
                previous_claims=False,
                mortgage=True
            )
            
            financial_profile = FinancialProfile(
                annual_income=50000,
                employment_type="full-time",
                dependents=0,
                existing_insurance=[],
                monthly_expenses=3000,
                savings=10000,
                investment_risk_tolerance="moderate"
            )
            
            recommendation = insurance_engine.property_calculator.generate_property_recommendation(
                property_profile, financial_profile
            )
            
            if recommendation:
                return {
                    "insurance_type": "property",
                    "estimated_annual_premium": recommendation.annual_premium,
                    "estimated_monthly_premium": recommendation.annual_premium / 12,
                    "coverage_amount": recommendation.coverage_amount,
                    "risk_level": recommendation.risk_level.value,
                    "note": "Quote based on basic profile. Complete assessment for accurate pricing."
                }
            else:
                raise HTTPException(status_code=400, detail="Unable to generate property quote")
        
        elif request.insurance_type.lower() == "life":
            if not request.annual_income:
                raise HTTPException(status_code=400, detail="Annual income required for life insurance quote")
            
            health_profile = HealthProfile(
                age=request.age or 35,
                gender="other",
                height=170,
                weight=70,
                smoking=False,
                drinking=False,
                exercise_frequency="sometimes",
                medical_conditions=request.health_conditions or [],
                family_history=[],
                medications=[]
            )
            
            financial_profile = FinancialProfile(
                annual_income=request.annual_income,
                employment_type="full-time",
                dependents=0,
                existing_insurance=[],
                monthly_expenses=request.annual_income * 0.6 / 12,
                savings=request.annual_income * 0.1,
                investment_risk_tolerance="moderate"
            )
            
            recommendation = insurance_engine.life_calculator.generate_life_recommendation(
                health_profile, financial_profile
            )
            
            return {
                "insurance_type": "life",
                "estimated_annual_premium": recommendation.annual_premium,
                "estimated_monthly_premium": recommendation.annual_premium / 12,
                "coverage_amount": recommendation.coverage_amount,
                "risk_level": recommendation.risk_level.value,
                "note": "Quote based on basic profile. Complete assessment for accurate pricing."
            }
        
        else:
            raise HTTPException(status_code=400, detail="Invalid insurance type. Use: health, property, or life")
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in quick quote: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error generating quote: {str(e)}")

@app.get("/insurance-types")
async def get_insurance_types():
    """Get available insurance types and their descriptions"""
    return {
        "insurance_types": [
            {
                "type": "health",
                "name": "Health Insurance",
                "description": "Comprehensive medical coverage including hospitalization, medications, and preventive care"
            },
            {
                "type": "life",
                "name": "Life Insurance",
                "description": "Financial protection for your family in case of unexpected death"
            },
            {
                "type": "property",
                "name": "Property Insurance",
                "description": "Protection for your home and belongings against damage, theft, and natural disasters"
            },
            {
                "type": "auto",
                "name": "Auto Insurance",
                "description": "Vehicle protection including liability, collision, and comprehensive coverage"
            },
            {
                "type": "disability",
                "name": "Disability Insurance",
                "description": "Income protection if you become unable to work due to illness or injury"
            }
        ],
        "coming_soon": ["travel", "business", "cyber", "umbrella"]
    }

@app.get("/risk-factors")
async def get_risk_factors():
    """Get information about risk factors that affect insurance premiums"""
    return {
        "health_risk_factors": [
            {"factor": "Age", "impact": "Higher age increases premiums"},
            {"factor": "BMI", "impact": "BMI over 30 significantly increases health insurance costs"},
            {"factor": "Smoking", "impact": "Can increase premiums by 200-300%"},
            {"factor": "Medical conditions", "impact": "Chronic conditions increase risk assessment"},
            {"factor": "Family history", "impact": "Genetic predispositions affect long-term risk"}
        ],
        "property_risk_factors": [
            {"factor": "Property age", "impact": "Older properties (pre-1980) have higher premiums"},
            {"factor": "Location", "impact": "High-risk areas (coastal, earthquake zones) cost more"},
            {"factor": "Security features", "impact": "Security systems can reduce premiums"},
            {"factor": "Previous claims", "impact": "Claims history affects future rates"},
            {"factor": "Construction type", "impact": "Fire-resistant materials reduce costs"}
        ],
        "financial_risk_factors": [
            {"factor": "Income stability", "impact": "Stable employment reduces risk"},
            {"factor": "Debt-to-income ratio", "impact": "High debt increases life insurance needs"},
            {"factor": "Dependents", "impact": "More dependents increase coverage requirements"},
            {"factor": "Existing coverage", "impact": "Current insurance affects new policy needs"}
        ]
    }

@app.post("/calculate-bmi")
async def calculate_bmi(height: float, weight: float):
    """Calculate BMI and health risk category"""
    try:
        if height <= 0 or weight <= 0:
            raise HTTPException(status_code=400, detail="Height and weight must be positive values")
        
        bmi = weight / ((height / 100) ** 2)
        
        if bmi < 18.5:
            category = "Underweight"
            health_risk = "May indicate malnutrition or other health issues"
            insurance_impact = "May require additional health screening"
        elif 18.5 <= bmi < 25:
            category = "Normal weight"
            health_risk = "Low health risk"
            insurance_impact = "Qualifies for standard rates"
        elif 25 <= bmi < 30:
            category = "Overweight"
            health_risk = "Increased risk of cardiovascular disease"
            insurance_impact = "May result in slightly higher premiums"
        else:
            category = "Obese"
            health_risk = "HIGH RISK: Significantly increased risk of diabetes, heart disease, and other complications"
            insurance_impact = "Will significantly increase health and life insurance premiums"
        
        return {
            "bmi": round(bmi, 1),
            "category": category,
            "health_risk": health_risk,
            "insurance_impact": insurance_impact,
            "recommendation": "Complete full health assessment for personalized insurance recommendations",
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error calculating BMI: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error calculating BMI: {str(e)}")

# Background task for logging assessments
async def log_assessment(user_data: Dict[str, Any], recommendations: List[Dict[str, Any]]):
    """Background task to log assessments for analytics"""
    try:
        log_entry = {
            "timestamp": datetime.now().isoformat(),
            "user_profile": user_data,
            "recommendations": recommendations,
            "service": "WishInsured"
        }
        
        # In production, this would save to a database
        with open(f"logs/insurance_assessment_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json", "w") as f:
            json.dump(log_entry, f, indent=2)
            
    except Exception as e:
        logger.error(f"Error logging assessment: {str(e)}")

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """Custom HTTP exception handler"""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": f"HTTP {exc.status_code}",
            "message": str(exc.detail),
            "timestamp": datetime.now().isoformat(),
            "service": "WishInsured Insurance API"
        }
    )

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    """General exception handler"""
    logger.error(f"Unhandled exception: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal Server Error",
            "message": "An unexpected error occurred",
            "timestamp": datetime.now().isoformat(),
            "service": "WishInsured Insurance API"
        }
    )

if __name__ == "__main__":
    # Create logs directory
    import os
    os.makedirs("logs", exist_ok=True)
    
    # Run the server
    uvicorn.run(
        "insurance_api:app",
        host="0.0.0.0",
        port=8001,  # Different port from health copilot
        reload=True,
        log_level="info"
    ) 