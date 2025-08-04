#!/usr/bin/env python3
"""
Simple FastAPI server for WishInsured calculations
"""

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Dict, List, Optional
import uvicorn
from datetime import datetime
import math

app = FastAPI(
    title="WishInsured Simple API",
    description="Simple calculations API for WishInsured",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Enhanced countries data with cultural, economic, and currency details
COUNTRIES = {
    "US": {
        "name": "United States", "currency": "USD", "symbol": "$", "flag": "🇺🇸",
        "economic_stability": "high", "inflation_rate": 3.2,
        "interest_rates": {"savings": 4.5, "investment": 7.0, "conservative": 4.0},
        "cultural_context": {
            "financial_priorities": ["retirement", "homeownership", "emergency_fund"],
            "investment_preference": "moderate_aggressive", "typical_savings_rate": 13.0,
            "retirement_age": 67, "social_security": True
        },
        "tax_advantages": ["401k", "IRA", "Roth IRA", "HSA"],
        "living_costs": {"housing_percentage": 28, "essential_expenses": 65, "discretionary": 35},
        "motivational_culture": {
            "success_metrics": ["net_worth", "passive_income", "early_retirement"],
            "financial_heroes": ["Warren Buffett", "Dave Ramsey", "Suze Orman"],
            "common_goals": ["FIRE movement", "debt freedom", "building wealth"]
        }
    },
    "IN": {
        "name": "India", "currency": "INR", "symbol": "₹", "flag": "🇮🇳",
        "economic_stability": "moderate_high", "inflation_rate": 5.8,
        "interest_rates": {"savings": 6.0, "investment": 12.0, "conservative": 7.0},
        "cultural_context": {
            "financial_priorities": ["family_security", "property", "education", "gold"],
            "investment_preference": "conservative_moderate", "typical_savings_rate": 30.0,
            "retirement_age": 60, "social_security": False
        },
        "tax_advantages": ["PPF", "ELSS", "EPF", "NSC", "Tax Saver FD"],
        "living_costs": {"housing_percentage": 35, "essential_expenses": 70, "discretionary": 30},
        "motivational_culture": {
            "success_metrics": ["property_ownership", "family_wealth", "gold_accumulation"],
            "financial_heroes": ["Rakesh Jhunjhunwala", "Radhakishan Damani"],
            "common_goals": ["house_purchase", "children_education", "retirement_corpus"]
        }
    },
    "UK": {
        "name": "United Kingdom", "currency": "GBP", "symbol": "£", "flag": "🇬🇧",
        "economic_stability": "high", "inflation_rate": 4.1,
        "interest_rates": {"savings": 4.0, "investment": 6.5, "conservative": 3.5},
        "cultural_context": {
            "financial_priorities": ["pension", "property", "ISA_savings"],
            "investment_preference": "moderate", "typical_savings_rate": 8.5,
            "retirement_age": 66, "social_security": True
        },
        "tax_advantages": ["ISA", "Pension", "SIPP", "LISA"],
        "living_costs": {"housing_percentage": 40, "essential_expenses": 75, "discretionary": 25},
        "motivational_culture": {
            "success_metrics": ["pension_pot", "property_ladder", "ISA_maximization"],
            "financial_heroes": ["Tim Hale", "Monevator"],
            "common_goals": ["mortgage_free", "pension_planning", "financial_independence"]
        }
    },
    "CA": {
        "name": "Canada", "currency": "CAD", "symbol": "C$", "flag": "🇨🇦",
        "economic_stability": "high", "inflation_rate": 3.5,
        "interest_rates": {"savings": 4.2, "investment": 6.8, "conservative": 3.8},
        "cultural_context": {
            "financial_priorities": ["RRSP", "TFSA", "real_estate"],
            "investment_preference": "moderate", "typical_savings_rate": 11.0,
            "retirement_age": 65, "social_security": True
        },
        "tax_advantages": ["RRSP", "TFSA", "RESP"],
        "living_costs": {"housing_percentage": 32, "essential_expenses": 68, "discretionary": 32},
        "motivational_culture": {
            "success_metrics": ["RRSP_room", "TFSA_growth", "property_equity"],
            "financial_heroes": ["David Chilton", "Preet Banerjee"],
            "common_goals": ["retirement_security", "home_ownership", "tax_optimization"]
        }
    },
    "AU": {
        "name": "Australia", "currency": "AUD", "symbol": "A$", "flag": "🇦🇺",
        "economic_stability": "high", "inflation_rate": 4.3,
        "interest_rates": {"savings": 4.8, "investment": 7.2, "conservative": 4.0},
        "cultural_context": {
            "financial_priorities": ["superannuation", "property", "shares"],
            "investment_preference": "moderate_aggressive", "typical_savings_rate": 9.5,
            "retirement_age": 67, "social_security": True
        },
        "tax_advantages": ["Superannuation", "FHSS", "CGT_discount"],
        "living_costs": {"housing_percentage": 25, "essential_expenses": 65, "discretionary": 35},
        "motivational_culture": {
            "success_metrics": ["super_balance", "property_portfolio", "share_investments"],
            "financial_heroes": ["Scott Pape", "Peter Thornhill"],
            "common_goals": ["super_optimization", "property_investment", "early_retirement"]
        }
    },
    "DE": {
        "name": "Germany", "currency": "EUR", "symbol": "€", "flag": "🇩🇪",
        "economic_stability": "high", "inflation_rate": 3.8,
        "interest_rates": {"savings": 3.0, "investment": 5.5, "conservative": 2.5},
        "cultural_context": {
            "financial_priorities": ["security", "insurance", "conservative_growth"],
            "investment_preference": "conservative", "typical_savings_rate": 17.0,
            "retirement_age": 67, "social_security": True
        },
        "tax_advantages": ["Riester", "Rürup", "ETF_Sparplan"],
        "living_costs": {"housing_percentage": 30, "essential_expenses": 70, "discretionary": 30},
        "motivational_culture": {
            "success_metrics": ["security_first", "long_term_stability", "insurance_coverage"],
            "financial_heroes": ["Gerd Kommer", "Finanzwesir"],
            "common_goals": ["financial_security", "insurance_optimization", "steady_growth"]
        }
    }
}

# Exchange rates (simplified)
EXCHANGE_RATES = {
    "USD": 1.0,
    "INR": 83.0,
    "GBP": 0.79,
    "CAD": 1.35,
    "AUD": 1.52,
    "EUR": 0.92
}

# Country-specific investment returns by risk level
def get_country_investment_returns(country):
    country_data = COUNTRIES.get(country, COUNTRIES["US"])
    base_rates = country_data["interest_rates"]
    
    return {
        "conservative": base_rates["conservative"] / 100,
        "moderate": base_rates["investment"] / 100,
        "aggressive": (base_rates["investment"] + 3) / 100  # Higher risk premium
    }

def get_country_specific_tips(country, country_info, savings_rate_target):
    """Generate culturally relevant financial tips based on country context"""
    cultural_context = country_info["cultural_context"]
    tips = [
        "Start investing early to benefit from compound interest",
        f"Aim to save {savings_rate_target * 100:.1f}% of your income (typical for {country_info['name']} is {cultural_context['typical_savings_rate']}%)"
    ]
    
    # Country-specific tips
    if country == "US":
        tips.extend([
            "Maximize your 401(k) employer match - it's free money!",
            "Consider Roth IRA for tax-free retirement income",
            "Build your credit score for better loan rates",
            "Focus on index funds for long-term growth"
        ])
    elif country == "IN":
        tips.extend([
            "Start with PPF for tax-free long-term savings",
            "Consider ELSS mutual funds for tax savings under 80C",
            "Diversify beyond FDs - try equity mutual funds",
            "Plan for children's education early with dedicated funds"
        ])
    elif country == "UK":
        tips.extend([
            "Use your £20,000 ISA allowance every year",
            "Contribute to workplace pension for employer match",
            "Consider LISA for first-time home buyers",
            "Focus on global diversified index funds"
        ])
    elif country == "CA":
        tips.extend([
            "Maximize RRSP contributions for tax deductions",
            "Use TFSA for tax-free growth",
            "Consider dollar-cost averaging with ETFs",
            "Plan for healthcare costs in retirement"
        ])
    elif country == "AU":
        tips.extend([
            "Maximize superannuation contributions",
            "Use salary sacrificing to boost super",
            "Consider ETFs on ASX for diversification",
            "Take advantage of franking credits"
        ])
    elif country == "DE":
        tips.extend([
            "Consider ETF-Sparpläne for steady investing",
            "Use Riester-Rente for retirement planning",
            "Focus on security and steady growth",
            "Consider real estate as inflation hedge"
        ])
    
    tips.append("Review and adjust your financial plan annually")
    return tips

class SavingsRequest(BaseModel):
    monthly_amount: float = Field(..., gt=0)
    years: int = Field(..., ge=1, le=50)
    country: str = Field(..., pattern="^(US|IN|UK|CA|AU|DE)$")
    risk_level: str = Field("moderate", pattern="^(conservative|moderate|aggressive)$")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.get("/countries")
async def get_supported_countries():
    """Get supported countries"""
    return {"countries": COUNTRIES}

@app.post("/calculate-savings-projection")
async def calculate_savings_projection(request: SavingsRequest):
    """Calculate savings projection with compound interest"""
    try:
        country_info = COUNTRIES[request.country]
        country_returns = get_country_investment_returns(request.country)
        annual_return = country_returns[request.risk_level]
        monthly_return = annual_return / 12
        
        # Calculate compound growth
        months = request.years * 12
        
        # Future value of ordinary annuity formula
        if monthly_return > 0:
            future_value = request.monthly_amount * (((1 + monthly_return) ** months - 1) / monthly_return)
        else:
            future_value = request.monthly_amount * months
        
        total_contributed = request.monthly_amount * months
        total_interest = future_value - total_contributed
        
        # Calculate milestones
        milestones = []
        for year in [5, 10, 15, 20, 25, 30]:
            if year <= request.years:
                year_months = year * 12
                if monthly_return > 0:
                    year_value = request.monthly_amount * (((1 + monthly_return) ** year_months - 1) / monthly_return)
                else:
                    year_value = request.monthly_amount * year_months
                
                milestones.append({
                    "year": year,
                    "value": round(year_value, 2),
                    "contributed": round(request.monthly_amount * year_months, 2)
                })
        
        # Financial independence calculation (assuming 4% withdrawal rule)
        fi_target = future_value * 0.04 / 12  # Monthly income from 4% rule
        
        projections = {
            "total_value": round(future_value, 2),
            "total_contributed": round(total_contributed, 2),
            "total_interest": round(total_interest, 2),
            "monthly_income_at_retirement": round(fi_target, 2),
            "roi_percentage": round((total_interest / total_contributed) * 100, 2) if total_contributed > 0 else 0,
            "country": request.country,
            "currency": country_info["currency"],
            "currency_symbol": country_info["symbol"],
            "annual_return_rate": annual_return * 100,
            "milestones": milestones,
            "years": request.years,
            "risk_level": request.risk_level
        }
        
        return {
            "projections": projections,
            "request_details": {
                "monthly_amount": request.monthly_amount,
                "years": request.years,
                "country": request.country,
                "risk_level": request.risk_level
            },
            "calculation_date": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Calculation error: {str(e)}")

@app.get("/financial-advice/{country}")
async def get_financial_advice(
    country: str,
    annual_income: float = Query(..., gt=0),
    age: int = Query(..., ge=18, le=100),
    dependents: int = Query(0, ge=0),
    current_savings: float = Query(0, ge=0),
    risk_tolerance: str = Query("moderate", pattern="^(conservative|moderate|aggressive)$")
):
    """Get personalized financial advice"""
    try:
        country_info = COUNTRIES.get(country)
        if not country_info:
            raise HTTPException(status_code=400, detail="Unsupported country")
        
        # Country-specific calculations
        monthly_income = annual_income / 12
        cultural_context = country_info["cultural_context"]
        living_costs = country_info["living_costs"]
        
        # Emergency fund based on country's economic stability
        emergency_months = 6 if country_info["economic_stability"] == "high" else 9
        emergency_fund_target = monthly_income * emergency_months
        
        # Savings rate based on country's typical rate
        country_savings_rate = cultural_context["typical_savings_rate"] / 100
        savings_rate_target = max(0.15, min(0.30, country_savings_rate))  # Between 15-30%
        recommended_monthly_savings = monthly_income * savings_rate_target
        
        # Retirement calculation based on country's retirement age
        years_to_retirement = cultural_context["retirement_age"] - age
        retirement_multiplier = 25 if cultural_context["social_security"] else 30  # Higher if no social security
        retirement_target = annual_income * retirement_multiplier
        
        advice = {
            "country": country,
            "currency_symbol": country_info["symbol"],
            "recommendations": {
                "emergency_fund_target": round(emergency_fund_target, 2),
                "monthly_savings_target": round(recommended_monthly_savings, 2),
                "retirement_target": round(retirement_target, 2),
                "years_to_retirement": years_to_retirement
            },
            "current_status": {
                "savings_rate": round((current_savings / annual_income) * 100, 2) if annual_income > 0 else 0,
                "emergency_fund_coverage": round((current_savings / monthly_income), 1) if monthly_income > 0 else 0
            },
            "tips": get_country_specific_tips(country, country_info, savings_rate_target),
            "cultural_priorities": cultural_context["financial_priorities"],
            "recommended_tax_advantages": country_info["tax_advantages"],
            "investment_preference": cultural_context["investment_preference"],
            "economic_context": {
                "inflation_rate": country_info["inflation_rate"],
                "economic_stability": country_info["economic_stability"],
                "typical_savings_rate": cultural_context["typical_savings_rate"]
            },
            "motivational_context": country_info["motivational_culture"]
        }
        
        return {
            "financial_advice": advice,
            "user_profile": {
                "annual_income": annual_income,
                "age": age,
                "dependents": dependents,
                "current_savings": current_savings,
                "risk_tolerance": risk_tolerance
            },
            "country": country
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Advice generation error: {str(e)}")

@app.get("/exchange-rates")
async def get_exchange_rates():
    """Get current exchange rates"""
    return {"exchange_rates": EXCHANGE_RATES}

if __name__ == "__main__":
    print("🚀 Starting WishInsured Simple API Server...")
    print("📡 Server will be available at: http://localhost:8004")
    print("📚 API Documentation: http://localhost:8004/docs")
    uvicorn.run(app, host="0.0.0.0", port=8004) 