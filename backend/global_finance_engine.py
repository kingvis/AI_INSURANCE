# Global Finance Engine for WishInsured
# Multi-country financial advice and insurance calculations

import json
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
import math

class GlobalFinanceEngine:
    """
    Comprehensive financial engine providing:
    - Country-specific insurance premiums
    - Financial advice and planning
    - Savings and investment projections
    - Motivational financial independence content
    """
    
    def __init__(self):
        self.countries_data = self._load_countries_data()
        self.exchange_rates = self._load_exchange_rates()
        self.investment_returns = self._load_investment_data()
        
    def _load_countries_data(self) -> Dict:
        """Load country-specific insurance and financial data"""
        return {
            "US": {
                "currency": "USD",
                "symbol": "$",
                "tax_rate": 0.25,
                "avg_salary": 75000,
                "cost_of_living_index": 100,
                "healthcare_system": "private",
                "retirement_age": 65,
                "insurance_multipliers": {
                    "health": 1.0,
                    "property": 1.0,
                    "life": 1.0,
                    "auto": 1.0
                },
                "investment_options": ["401k", "IRA", "Stocks", "Bonds", "Real Estate"],
                "tax_advantages": ["401k matching", "IRA deductions", "HSA benefits"]
            },
            "IN": {
                "currency": "INR",
                "symbol": "₹",
                "tax_rate": 0.20,
                "avg_salary": 800000,
                "cost_of_living_index": 25,
                "healthcare_system": "mixed",
                "retirement_age": 60,
                "insurance_multipliers": {
                    "health": 0.15,
                    "property": 0.20,
                    "life": 0.12,
                    "auto": 0.18
                },
                "investment_options": ["EPF", "PPF", "ELSS", "NSC", "Fixed Deposits"],
                "tax_advantages": ["80C deductions", "PPF tax-free", "ELSS benefits"]
            },
            "UK": {
                "currency": "GBP",
                "symbol": "£",
                "tax_rate": 0.20,
                "avg_salary": 35000,
                "cost_of_living_index": 85,
                "healthcare_system": "public",
                "retirement_age": 66,
                "insurance_multipliers": {
                    "health": 0.30,
                    "property": 0.80,
                    "life": 0.85,
                    "auto": 0.90
                },
                "investment_options": ["ISA", "Pension", "Stocks", "Premium Bonds"],
                "tax_advantages": ["ISA allowance", "Pension relief", "CGT exemption"]
            },
            "CA": {
                "currency": "CAD",
                "symbol": "C$",
                "tax_rate": 0.26,
                "avg_salary": 65000,
                "cost_of_living_index": 90,
                "healthcare_system": "public",
                "retirement_age": 65,
                "insurance_multipliers": {
                    "health": 0.25,
                    "property": 0.75,
                    "life": 0.80,
                    "auto": 0.85
                },
                "investment_options": ["RRSP", "TFSA", "Stocks", "GIC"],
                "tax_advantages": ["RRSP deduction", "TFSA tax-free", "Capital gains"]
            },
            "AU": {
                "currency": "AUD",
                "symbol": "A$",
                "tax_rate": 0.32,
                "avg_salary": 85000,
                "cost_of_living_index": 95,
                "healthcare_system": "public",
                "retirement_age": 67,
                "insurance_multipliers": {
                    "health": 0.40,
                    "property": 0.85,
                    "life": 0.90,
                    "auto": 0.95
                },
                "investment_options": ["Superannuation", "Shares", "Property", "Term Deposits"],
                "tax_advantages": ["Super contributions", "Franking credits", "CGT discount"]
            },
            "DE": {
                "currency": "EUR",
                "symbol": "€",
                "tax_rate": 0.42,
                "avg_salary": 55000,
                "cost_of_living_index": 75,
                "healthcare_system": "public",
                "retirement_age": 67,
                "insurance_multipliers": {
                    "health": 0.20,
                    "property": 0.70,
                    "life": 0.75,
                    "auto": 0.80
                },
                "investment_options": ["Riester", "ETFs", "Bausparvertrag", "Bonds"],
                "tax_advantages": ["Riester subsidy", "Bausparvertrag bonus", "ETF savings"]
            }
        }
    
    def _load_exchange_rates(self) -> Dict:
        """Load current exchange rates (simplified - in production use real API)"""
        return {
            "USD": 1.0,
            "INR": 83.15,
            "GBP": 0.79,
            "CAD": 1.35,
            "AUD": 1.52,
            "EUR": 0.92
        }
    
    def _load_investment_data(self) -> Dict:
        """Load investment return data by country and type"""
        return {
            "US": {"conservative": 0.04, "moderate": 0.07, "aggressive": 0.10},
            "IN": {"conservative": 0.06, "moderate": 0.12, "aggressive": 0.15},
            "UK": {"conservative": 0.03, "moderate": 0.06, "aggressive": 0.08},
            "CA": {"conservative": 0.035, "moderate": 0.065, "aggressive": 0.09},
            "AU": {"conservative": 0.04, "moderate": 0.07, "aggressive": 0.095},
            "DE": {"conservative": 0.025, "moderate": 0.05, "aggressive": 0.075}
        }
    
    def calculate_country_premium(self, base_premium_usd: float, country_code: str, 
                                insurance_type: str) -> Dict:
        """Calculate premium in local currency with country-specific adjustments"""
        if country_code not in self.countries_data:
            country_code = "US"
            
        country = self.countries_data[country_code]
        multiplier = country["insurance_multipliers"].get(insurance_type, 1.0)
        
        # Adjust for country-specific factors
        adjusted_premium_usd = base_premium_usd * multiplier
        
        # Convert to local currency
        exchange_rate = self.exchange_rates[country["currency"]]
        local_premium = adjusted_premium_usd * exchange_rate
        
        return {
            "amount": round(local_premium, 2),
            "currency": country["currency"],
            "symbol": country["symbol"],
            "usd_equivalent": round(adjusted_premium_usd, 2),
            "monthly": round(local_premium / 12, 2),
            "quarterly": round(local_premium / 4, 2)
        }
    
    def generate_financial_advice(self, user_profile: Dict, country_code: str) -> Dict:
        """Generate comprehensive financial advice based on user profile and country"""
        country = self.countries_data.get(country_code, self.countries_data["US"])
        
        # Calculate key financial metrics
        monthly_income = user_profile.get("annual_income", 50000) / 12
        monthly_expenses = monthly_income * 0.7  # Assume 70% for living expenses
        disposable_income = monthly_income - monthly_expenses
        
        # Emergency fund recommendation
        emergency_fund_needed = monthly_expenses * 6
        
        # Insurance budget (8-12% of income)
        insurance_budget = monthly_income * 0.10
        
        # Investment recommendations
        investment_capacity = disposable_income * 0.70  # 70% of disposable for investments
        
        advice = {
            "country_context": {
                "retirement_age": country["retirement_age"],
                "tax_rate": country["tax_rate"],
                "avg_salary": country["avg_salary"],
                "currency": country["currency"],
                "symbol": country["symbol"]
            },
            "monthly_analysis": {
                "income": round(monthly_income, 2),
                "estimated_expenses": round(monthly_expenses, 2),
                "disposable_income": round(disposable_income, 2),
                "savings_rate": round((disposable_income / monthly_income) * 100, 1)
            },
            "emergency_fund": {
                "target_amount": round(emergency_fund_needed, 2),
                "months_to_build": math.ceil(emergency_fund_needed / (disposable_income * 0.3)),
                "priority": "HIGH" if user_profile.get("emergency_fund", 0) < emergency_fund_needed * 0.5 else "MEDIUM"
            },
            "insurance_recommendations": {
                "monthly_budget": round(insurance_budget, 2),
                "percentage_of_income": "10%",
                "priority_order": ["Health", "Life", "Disability", "Property"]
            },
            "investment_strategy": {
                "monthly_capacity": round(investment_capacity, 2),
                "recommended_allocation": self._get_investment_allocation(user_profile),
                "tax_advantages": country["tax_advantages"],
                "investment_options": country["investment_options"]
            },
            "financial_independence": self._calculate_financial_independence(
                user_profile, country_code, monthly_income, investment_capacity
            )
        }
        
        return advice
    
    def _get_investment_allocation(self, user_profile: Dict) -> Dict:
        """Get recommended investment allocation based on age and risk tolerance"""
        age = user_profile.get("age", 30)
        risk_tolerance = user_profile.get("risk_tolerance", "moderate")
        
        if age < 30:
            if risk_tolerance == "aggressive":
                return {"stocks": 80, "bonds": 15, "cash": 5}
            elif risk_tolerance == "conservative":
                return {"stocks": 60, "bonds": 30, "cash": 10}
            else:
                return {"stocks": 70, "bonds": 25, "cash": 5}
        elif age < 45:
            if risk_tolerance == "aggressive":
                return {"stocks": 70, "bonds": 25, "cash": 5}
            elif risk_tolerance == "conservative":
                return {"stocks": 50, "bonds": 40, "cash": 10}
            else:
                return {"stocks": 60, "bonds": 35, "cash": 5}
        else:
            if risk_tolerance == "aggressive":
                return {"stocks": 60, "bonds": 35, "cash": 5}
            elif risk_tolerance == "conservative":
                return {"stocks": 40, "bonds": 50, "cash": 10}
            else:
                return {"stocks": 50, "bonds": 45, "cash": 5}
    
    def _calculate_financial_independence(self, user_profile: Dict, country_code: str, 
                                        monthly_income: float, investment_capacity: float) -> Dict:
        """Calculate financial independence projections"""
        age = user_profile.get("age", 30)
        country = self.countries_data[country_code]
        retirement_age = country["retirement_age"]
        years_to_retirement = retirement_age - age
        
        # Assume moderate returns
        annual_return = self.investment_returns[country_code]["moderate"]
        
        # Calculate FIRE number (25x annual expenses)
        annual_expenses = monthly_income * 12 * 0.7
        fire_number = annual_expenses * 25
        
        # Calculate projections
        current_savings = user_profile.get("current_savings", 0)
        monthly_investment = investment_capacity
        
        # Future value calculation
        months = years_to_retirement * 12
        monthly_return = annual_return / 12
        
        if monthly_return > 0:
            future_value = current_savings * ((1 + annual_return) ** years_to_retirement)
            future_value += monthly_investment * (((1 + monthly_return) ** months - 1) / monthly_return)
        else:
            future_value = current_savings + (monthly_investment * months)
        
        # Calculate FIRE timeline
        fire_years = self._calculate_fire_timeline(fire_number, current_savings, 
                                                 monthly_investment * 12, annual_return)
        
        return {
            "fire_number": round(fire_number, 2),
            "current_savings": current_savings,
            "projected_retirement_fund": round(future_value, 2),
            "monthly_investment_needed": round(monthly_investment, 2),
            "years_to_retirement": years_to_retirement,
            "fire_timeline_years": fire_years,
            "financial_independence_age": age + fire_years if fire_years else None,
            "monthly_passive_income_at_retirement": round(future_value * annual_return / 12, 2),
            "motivational_message": self._get_motivational_message(fire_years, age)
        }
    
    def _calculate_fire_timeline(self, target: float, current: float, 
                               annual_investment: float, annual_return: float) -> Optional[int]:
        """Calculate years to reach FIRE number"""
        if annual_investment <= 0:
            return None
            
        # Using compound interest formula to solve for time
        if annual_return > 0:
            try:
                years = math.log((target * annual_return + annual_investment) / 
                               (current * annual_return + annual_investment)) / math.log(1 + annual_return)
                return max(1, int(years))
            except:
                return None
        else:
            years = (target - current) / annual_investment
            return max(1, int(years)) if years > 0 else None
    
    def _get_motivational_message(self, fire_years: Optional[int], current_age: int) -> str:
        """Get motivational message based on FIRE timeline"""
        if not fire_years:
            return "Start investing today! Every dollar invested is a step towards financial freedom."
        
        fire_age = current_age + fire_years
        
        if fire_age < 40:
            return f"🎉 Amazing! You could achieve financial independence by age {fire_age}! Stay consistent with your investments."
        elif fire_age < 50:
            return f"💪 Great progress! Financial independence by age {fire_age} is achievable with disciplined saving."
        elif fire_age < 60:
            return f"🎯 You're on track for financial independence by {fire_age}. Consider increasing your savings rate!"
        else:
            return "🌟 It's never too late! Small consistent investments compound over time. Start today!"
    
    def calculate_savings_projections(self, monthly_amount: float, years: int, 
                                    country_code: str, risk_level: str = "moderate") -> Dict:
        """Calculate savings projections with different scenarios"""
        annual_return = self.investment_returns[country_code][risk_level]
        country = self.countries_data[country_code]
        
        # Simple savings (no investment)
        simple_total = monthly_amount * 12 * years
        
        # Investment projections
        months = years * 12
        monthly_return = annual_return / 12
        
        if monthly_return > 0:
            investment_total = monthly_amount * (((1 + monthly_return) ** months - 1) / monthly_return)
        else:
            investment_total = simple_total
        
        # Tax impact
        tax_on_gains = (investment_total - simple_total) * country["tax_rate"]
        after_tax_total = investment_total - tax_on_gains
        
        return {
            "simple_savings": {
                "total": round(simple_total, 2),
                "monthly": monthly_amount,
                "currency": country["currency"],
                "symbol": country["symbol"]
            },
            "investment_growth": {
                "total": round(investment_total, 2),
                "gains": round(investment_total - simple_total, 2),
                "return_rate": f"{annual_return*100:.1f}%",
                "after_tax": round(after_tax_total, 2)
            },
            "comparison": {
                "additional_wealth": round(investment_total - simple_total, 2),
                "wealth_multiplier": round(investment_total / simple_total, 2),
                "monthly_passive_income": round((investment_total * annual_return) / 12, 2)
            },
            "milestones": self._calculate_milestones(monthly_amount, annual_return, country)
        }
    
    def _calculate_milestones(self, monthly_amount: float, annual_return: float, 
                            country: Dict) -> List[Dict]:
        """Calculate wealth milestones timeline"""
        milestones = [10000, 50000, 100000, 250000, 500000, 1000000]
        results = []
        
        monthly_return = annual_return / 12
        
        for milestone in milestones:
            if monthly_return > 0:
                months = math.log(1 + (milestone * monthly_return / monthly_amount)) / math.log(1 + monthly_return)
                years = months / 12
            else:
                years = milestone / (monthly_amount * 12)
            
            if years <= 50:  # Only show realistic milestones
                results.append({
                    "amount": milestone,
                    "years": round(years, 1),
                    "currency": country["currency"],
                    "symbol": country["symbol"],
                    "monthly_income": round(milestone * annual_return / 12, 2)
                })
        
        return results
    
    def get_country_specific_policies(self, country_code: str) -> Dict:
        """Get country-specific insurance policies and financial products"""
        country = self.countries_data.get(country_code, self.countries_data["US"])
        
        policies = {
            "US": {
                "health_insurance": [
                    {"name": "ACA Marketplace Plans", "description": "Government marketplace health plans"},
                    {"name": "Employer-Sponsored", "description": "Health insurance through employer"},
                    {"name": "Medicare", "description": "Federal health insurance for 65+ or disabled"},
                    {"name": "Medicaid", "description": "Health coverage for low-income individuals"}
                ],
                "life_insurance": [
                    {"name": "Term Life", "description": "Temporary coverage for specific period"},
                    {"name": "Whole Life", "description": "Permanent coverage with cash value"},
                    {"name": "Universal Life", "description": "Flexible permanent life insurance"}
                ],
                "retirement": [
                    {"name": "401(k)", "description": "Employer-sponsored retirement plan"},
                    {"name": "Traditional IRA", "description": "Tax-deductible individual retirement account"},
                    {"name": "Roth IRA", "description": "After-tax contributions, tax-free growth"}
                ]
            },
            "IN": {
                "health_insurance": [
                    {"name": "Ayushman Bharat", "description": "Government health insurance scheme"},
                    {"name": "Employer Group Insurance", "description": "Company-provided health coverage"},
                    {"name": "Individual Health Plans", "description": "Personal health insurance policies"},
                    {"name": "Family Floater Plans", "description": "Single policy covering entire family"}
                ],
                "life_insurance": [
                    {"name": "Term Insurance", "description": "Pure life cover at low premium"},
                    {"name": "Endowment Plans", "description": "Life cover plus savings component"},
                    {"name": "ULIPs", "description": "Unit Linked Insurance Plans with investment"}
                ],
                "retirement": [
                    {"name": "EPF", "description": "Employee Provident Fund"},
                    {"name": "PPF", "description": "Public Provident Fund (15-year lock-in)"},
                    {"name": "NPS", "description": "National Pension System"}
                ]
            },
            "UK": {
                "health_insurance": [
                    {"name": "NHS", "description": "National Health Service (free healthcare)"},
                    {"name": "Private Health Insurance", "description": "Additional private healthcare coverage"},
                    {"name": "EHIC/GHIC", "description": "European/Global Health Insurance Card"}
                ],
                "life_insurance": [
                    {"name": "Term Assurance", "description": "Fixed-term life cover"},
                    {"name": "Whole of Life", "description": "Lifetime coverage with investment"},
                    {"name": "Family Income Benefit", "description": "Regular income for beneficiaries"}
                ],
                "retirement": [
                    {"name": "State Pension", "description": "Government retirement pension"},
                    {"name": "Workplace Pension", "description": "Auto-enrollment employer pension"},
                    {"name": "SIPP", "description": "Self-Invested Personal Pension"}
                ]
            }
        }
        
        return policies.get(country_code, policies["US"])
    
    def get_motivational_content(self, user_age: int, savings_rate: float, country_code: str) -> Dict:
        """Generate motivational content for financial independence"""
        country = self.countries_data[country_code]
        
        # Calculate potential wealth at retirement
        years_to_retirement = country["retirement_age"] - user_age
        monthly_income = country["avg_salary"] / 12
        potential_monthly_savings = monthly_income * (savings_rate / 100)
        
        annual_return = self.investment_returns[country_code]["moderate"]
        
        if annual_return > 0 and years_to_retirement > 0:
            future_value = potential_monthly_savings * 12 * (((1 + annual_return) ** years_to_retirement - 1) / annual_return)
        else:
            future_value = potential_monthly_savings * 12 * years_to_retirement
        
        return {
            "wealth_potential": {
                "retirement_fund": round(future_value, 2),
                "monthly_passive_income": round(future_value * annual_return / 12, 2),
                "currency": country["currency"],
                "symbol": country["symbol"]
            },
            "success_stories": [
                {
                    "scenario": "The Early Starter",
                    "description": f"Starting at 25 with {country['symbol']}500/month could build {country['symbol']}{round(500 * 12 * (((1 + annual_return) ** 40 - 1) / annual_return), 0):,.0f} by 65!",
                    "lesson": "Time is your greatest asset in building wealth"
                },
                {
                    "scenario": "The Consistent Saver",
                    "description": f"Saving just 20% of income consistently could make you financially independent in 25-30 years",
                    "lesson": "Consistency beats timing in wealth building"
                },
                {
                    "scenario": "The Smart Investor",
                    "description": f"Using tax-advantaged accounts could save thousands in taxes annually",
                    "lesson": "Smart tax planning accelerates wealth building"
                }
            ],
            "daily_motivation": [
                "Every dollar saved today is a vote for your future freedom",
                "Financial independence isn't about being rich, it's about having choices",
                "Small actions repeated daily lead to extraordinary results",
                "Invest in assets that work while you sleep",
                "Your future self will thank you for every sacrifice you make today"
            ],
            "action_steps": [
                f"Set up automatic savings of {country['symbol']}{round(potential_monthly_savings, 0)} monthly",
                f"Maximize your {country['tax_advantages'][0]} contributions",
                "Build a 6-month emergency fund first",
                "Learn about low-cost index fund investing",
                "Review and optimize your expenses monthly"
            ]
        } 