"""
AI Health Copilot - Intelligent Health Assistant Backend
Built with Python, MCP, and LangChain integration hooks
"""

import json
import logging
from datetime import datetime
from typing import Dict, List, Optional, Tuple, Union
from dataclasses import dataclass, asdict
from enum import Enum

# Future LangChain imports (placeholder for later integration)
# from langchain.llms import OpenAI
# from langchain.chains import LLMChain
# from langchain.prompts import PromptTemplate
# from langchain.memory import ConversationBufferMemory

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class HealthRiskLevel(Enum):
    """Health risk assessment levels"""
    LOW = "low"
    MODERATE = "moderate"
    HIGH = "high"
    CRITICAL = "critical"

class RecommendationType(Enum):
    """Types of health recommendations"""
    DIET = "diet"
    EXERCISE = "exercise"
    MEDICAL = "medical"
    LIFESTYLE = "lifestyle"
    MENTAL_HEALTH = "mental_health"

@dataclass
class HealthMetrics:
    """User health metrics data structure"""
    weight: float  # in kg
    height: float  # in cm
    age: int
    gender: str
    activity_level: str = "moderate"  # sedentary, light, moderate, active, very_active
    medical_conditions: List[str] = None
    timestamp: str = None
    
    def __post_init__(self):
        if self.medical_conditions is None:
            self.medical_conditions = []
        if self.timestamp is None:
            self.timestamp = datetime.now().isoformat()

@dataclass
class HealthAssessment:
    """Health assessment results"""
    bmi: float
    bmi_category: str
    risk_level: HealthRiskLevel
    cardiovascular_risk: str
    recommendations: List[Dict]
    wellness_plan: Dict
    ai_insights: str
    timestamp: str

class BMICalculator:
    """BMI calculation and categorization"""
    
    @staticmethod
    def calculate_bmi(weight: float, height: float) -> float:
        """Calculate BMI from weight (kg) and height (cm)"""
        height_m = height / 100  # Convert cm to meters
        bmi = weight / (height_m ** 2)
        return round(bmi, 1)
    
    @staticmethod
    def categorize_bmi(bmi: float) -> str:
        """Categorize BMI according to WHO standards"""
        if bmi < 18.5:
            return "Underweight"
        elif 18.5 <= bmi < 25:
            return "Normal weight"
        elif 25 <= bmi < 30:
            return "Overweight"
        else:
            return "Obese"

class CardiovascularRiskAssessor:
    """Assess cardiovascular risk based on health metrics"""
    
    @staticmethod
    def assess_risk(metrics: HealthMetrics, bmi: float) -> Tuple[str, HealthRiskLevel]:
        """Assess cardiovascular risk level"""
        risk_factors = []
        
        # BMI-based risk
        if bmi >= 30:
            risk_factors.append("obesity")
        elif bmi >= 25:
            risk_factors.append("overweight")
        
        # Age-based risk
        age_risk = False
        if metrics.gender.lower() == "male" and metrics.age >= 45:
            age_risk = True
        elif metrics.gender.lower() == "female" and metrics.age >= 55:
            age_risk = True
        
        if age_risk:
            risk_factors.append("age")
        
        # Activity level risk
        if metrics.activity_level in ["sedentary", "light"]:
            risk_factors.append("low_activity")
        
        # Medical conditions
        high_risk_conditions = ["diabetes", "hypertension", "heart_disease", "high_cholesterol"]
        for condition in metrics.medical_conditions:
            if condition.lower() in high_risk_conditions:
                risk_factors.append(f"medical_{condition}")
        
        # Determine overall risk level
        if len(risk_factors) >= 3 or any("medical_" in rf for rf in risk_factors):
            risk_level = HealthRiskLevel.HIGH
        elif len(risk_factors) >= 2:
            risk_level = HealthRiskLevel.MODERATE
        elif len(risk_factors) == 1:
            risk_level = HealthRiskLevel.LOW
        else:
            risk_level = HealthRiskLevel.LOW
        
        # Generate risk description
        if bmi >= 30:
            risk_description = (
                f"HIGH CARDIOVASCULAR RISK: BMI of {bmi} indicates obesity, "
                f"significantly increasing risk of heart disease, stroke, and diabetes. "
                f"Additional risk factors: {', '.join(risk_factors)}"
            )
        else:
            risk_description = f"Risk factors identified: {', '.join(risk_factors) if risk_factors else 'None'}"
        
        return risk_description, risk_level

class WellnessPlanGenerator:
    """Generate personalized wellness plans"""
    
    @staticmethod
    def generate_plan(metrics: HealthMetrics, bmi: float, risk_level: HealthRiskLevel) -> Dict:
        """Generate comprehensive wellness plan"""
        plan = {
            "duration": "12 weeks",
            "goals": [],
            "phases": [],
            "monitoring": [],
            "emergency_contacts": []
        }
        
        # Set goals based on BMI and risk level
        if bmi >= 30:
            target_weight = metrics.weight * 0.9  # 10% weight loss
            plan["goals"] = [
                f"Lose {metrics.weight - target_weight:.1f} kg (10% body weight)",
                "Reduce cardiovascular risk factors",
                "Improve metabolic health",
                "Establish sustainable lifestyle habits"
            ]
        elif bmi >= 25:
            target_weight = metrics.weight * 0.95  # 5% weight loss
            plan["goals"] = [
                f"Lose {metrics.weight - target_weight:.1f} kg (5% body weight)",
                "Prevent progression to obesity",
                "Improve fitness level"
            ]
        else:
            plan["goals"] = [
                "Maintain current weight",
                "Improve overall fitness",
                "Prevent future health issues"
            ]
        
        # Generate phases
        plan["phases"] = WellnessPlanGenerator._generate_phases(bmi, risk_level)
        
        # Monitoring requirements
        plan["monitoring"] = WellnessPlanGenerator._generate_monitoring(risk_level)
        
        return plan
    
    @staticmethod
    def _generate_phases(bmi: float, risk_level: HealthRiskLevel) -> List[Dict]:
        """Generate plan phases"""
        phases = []
        
        if bmi >= 30 or risk_level == HealthRiskLevel.HIGH:
            phases = [
                {
                    "phase": 1,
                    "duration": "4 weeks",
                    "focus": "Foundation & Medical Clearance",
                    "activities": [
                        "Medical evaluation and clearance",
                        "Nutritionist consultation",
                        "Gentle exercise introduction (walking)",
                        "Food diary establishment"
                    ]
                },
                {
                    "phase": 2,
                    "duration": "4 weeks", 
                    "focus": "Progressive Improvement",
                    "activities": [
                        "Structured exercise program",
                        "Meal planning implementation",
                        "Weekly progress tracking",
                        "Stress management techniques"
                    ]
                },
                {
                    "phase": 3,
                    "duration": "4 weeks",
                    "focus": "Optimization & Maintenance",
                    "activities": [
                        "Advanced fitness routines",
                        "Long-term habit formation",
                        "Social support integration",
                        "Relapse prevention strategies"
                    ]
                }
            ]
        else:
            phases = [
                {
                    "phase": 1,
                    "duration": "6 weeks",
                    "focus": "Health Optimization",
                    "activities": [
                        "Fitness assessment",
                        "Nutrition optimization",
                        "Regular exercise routine"
                    ]
                },
                {
                    "phase": 2,
                    "duration": "6 weeks",
                    "focus": "Maintenance & Growth",
                    "activities": [
                        "Advanced fitness goals",
                        "Preventive health measures",
                        "Long-term planning"
                    ]
                }
            ]
        
        return phases
    
    @staticmethod
    def _generate_monitoring(risk_level: HealthRiskLevel) -> List[str]:
        """Generate monitoring requirements"""
        base_monitoring = [
            "Weekly weight check",
            "Daily activity tracking",
            "Weekly progress photos"
        ]
        
        if risk_level in [HealthRiskLevel.HIGH, HealthRiskLevel.CRITICAL]:
            base_monitoring.extend([
                "Blood pressure monitoring (weekly)",
                "Heart rate tracking during exercise",
                "Monthly medical check-ups",
                "Blood work (monthly for first 3 months)"
            ])
        elif risk_level == HealthRiskLevel.MODERATE:
            base_monitoring.extend([
                "Bi-weekly medical check-ins",
                "Blood work (quarterly)"
            ])
        
        return base_monitoring

class RecommendationEngine:
    """Generate intelligent health recommendations"""
    
    @staticmethod
    def generate_recommendations(metrics: HealthMetrics, bmi: float, risk_level: HealthRiskLevel) -> List[Dict]:
        """Generate personalized recommendations"""
        recommendations = []
        
        # BMI-specific recommendations
        if bmi >= 30:
            recommendations.extend([
                {
                    "type": RecommendationType.MEDICAL.value,
                    "priority": "critical",
                    "title": "Immediate Medical Consultation",
                    "description": "Schedule consultation with healthcare provider for obesity management",
                    "action_items": [
                        "Book appointment with primary care physician",
                        "Request comprehensive metabolic panel",
                        "Discuss weight management medications if appropriate",
                        "Consider referral to endocrinologist or bariatric specialist"
                    ]
                },
                {
                    "type": RecommendationType.DIET.value,
                    "priority": "high",
                    "title": "Structured Weight Management Diet",
                    "description": "Implement medically supervised caloric deficit diet",
                    "action_items": [
                        "Reduce daily calories by 500-750 (consult nutritionist)",
                        "Focus on whole foods, lean proteins, vegetables",
                        "Eliminate processed foods and sugary beverages",
                        "Consider meal replacement shakes (under supervision)",
                        "Track all food intake with app or diary"
                    ]
                },
                {
                    "type": RecommendationType.EXERCISE.value,
                    "priority": "high",
                    "title": "Progressive Exercise Program",
                    "description": "Start with low-impact activities and gradually increase intensity",
                    "action_items": [
                        "Begin with 10-15 minutes daily walking",
                        "Add strength training 2x/week (bodyweight exercises)",
                        "Incorporate swimming or water aerobics if available",
                        "Gradually increase to 150+ minutes moderate activity/week",
                        "Work with certified trainer familiar with obesity"
                    ]
                }
            ])
        
        elif bmi >= 25:
            recommendations.extend([
                {
                    "type": RecommendationType.DIET.value,
                    "priority": "moderate",
                    "title": "Balanced Weight Loss Approach",
                    "description": "Moderate caloric restriction with balanced nutrition",
                    "action_items": [
                        "Reduce daily calories by 300-500",
                        "Increase protein intake to 1.2g per kg body weight",
                        "Fill half your plate with vegetables at each meal",
                        "Limit refined carbohydrates and added sugars"
                    ]
                },
                {
                    "type": RecommendationType.EXERCISE.value,
                    "priority": "moderate",
                    "title": "Regular Physical Activity",
                    "description": "Establish consistent exercise routine",
                    "action_items": [
                        "Aim for 150 minutes moderate aerobic activity/week",
                        "Add strength training 2-3 times per week",
                        "Include flexibility and balance exercises",
                        "Find activities you enjoy for long-term adherence"
                    ]
                }
            ])
        
        # Age-specific recommendations
        if metrics.age >= 50:
            recommendations.append({
                "type": RecommendationType.MEDICAL.value,
                "priority": "moderate",
                "title": "Age-Appropriate Health Screening",
                "description": "Regular health screenings for age-related conditions",
                "action_items": [
                    "Annual comprehensive physical exam",
                    "Cardiovascular screening (EKG, stress test if indicated)",
                    "Cancer screenings (colonoscopy, mammography, etc.)",
                    "Bone density screening",
                    "Vision and hearing checks"
                ]
            })
        
        # Activity level recommendations
        if metrics.activity_level == "sedentary":
            recommendations.append({
                "type": RecommendationType.LIFESTYLE.value,
                "priority": "high",
                "title": "Combat Sedentary Lifestyle",
                "description": "Increase daily movement and reduce sitting time",
                "action_items": [
                    "Take 2-minute walking breaks every hour",
                    "Use standing desk or treadmill desk if possible",
                    "Park farther away or take stairs when available",
                    "Set hourly movement reminders on phone/watch",
                    "Consider desk exercises and stretching routines"
                ]
            })
        
        # Mental health recommendations
        if risk_level in [HealthRiskLevel.HIGH, HealthRiskLevel.CRITICAL]:
            recommendations.append({
                "type": RecommendationType.MENTAL_HEALTH.value,
                "priority": "high",
                "title": "Stress Management & Mental Health",
                "description": "Address psychological aspects of health and weight management",
                "action_items": [
                    "Consider counseling or therapy for emotional eating",
                    "Practice stress reduction techniques (meditation, yoga)",
                    "Ensure adequate sleep (7-9 hours nightly)",
                    "Build strong social support network",
                    "Consider support groups for weight management"
                ]
            })
        
        return recommendations

class HealthCopilot:
    """Main AI Health Copilot class"""
    
    def __init__(self):
        self.bmi_calculator = BMICalculator()
        self.risk_assessor = CardiovascularRiskAssessor()
        self.plan_generator = WellnessPlanGenerator()
        self.recommendation_engine = RecommendationEngine()
        # Placeholder for future LangChain integration
        self.ai_chain = None
        
    def analyze_health(self, metrics: HealthMetrics) -> HealthAssessment:
        """Comprehensive health analysis"""
        logger.info(f"Analyzing health metrics for user: {metrics.timestamp}")
        
        # Calculate BMI
        bmi = self.bmi_calculator.calculate_bmi(metrics.weight, metrics.height)
        bmi_category = self.bmi_calculator.categorize_bmi(bmi)
        
        # Assess cardiovascular risk
        cardio_risk, risk_level = self.risk_assessor.assess_risk(metrics, bmi)
        
        # Generate recommendations
        recommendations = self.recommendation_engine.generate_recommendations(
            metrics, bmi, risk_level
        )
        
        # Generate wellness plan
        wellness_plan = self.plan_generator.generate_plan(metrics, bmi, risk_level)
        
        # Generate AI insights (placeholder for LangChain integration)
        ai_insights = self._generate_ai_insights(metrics, bmi, risk_level)
        
        # Create assessment
        assessment = HealthAssessment(
            bmi=bmi,
            bmi_category=bmi_category,
            risk_level=risk_level,
            cardiovascular_risk=cardio_risk,
            recommendations=recommendations,
            wellness_plan=wellness_plan,
            ai_insights=ai_insights,
            timestamp=datetime.now().isoformat()
        )
        
        logger.info(f"Health analysis completed. BMI: {bmi}, Risk: {risk_level.value}")
        return assessment
    
    def _generate_ai_insights(self, metrics: HealthMetrics, bmi: float, risk_level: HealthRiskLevel) -> str:
        """Generate AI-powered insights (placeholder for LangChain integration)"""
        # TODO: Integrate with LangChain for more sophisticated AI insights
        # This is where we'll add OpenAI/LangChain integration later
        
        insights = []
        
        if bmi >= 30:
            insights.append(
                "🚨 CRITICAL: Your BMI indicates obesity, which significantly increases "
                "cardiovascular disease risk. Immediate lifestyle intervention is essential."
            )
            insights.append(
                "💡 AI Recommendation: Consider a comprehensive approach combining medical "
                "supervision, structured nutrition, and progressive exercise."
            )
        elif bmi >= 25:
            insights.append(
                "⚠️ ATTENTION: Your BMI is in the overweight range. Early intervention "
                "can prevent progression to obesity and associated health risks."
            )
        
        if metrics.activity_level == "sedentary":
            insights.append(
                "🏃‍♂️ INSIGHT: Sedentary lifestyle compounds health risks. Even small "
                "increases in daily activity can provide significant benefits."
            )
        
        if risk_level == HealthRiskLevel.HIGH:
            insights.append(
                "⚕️ MEDICAL: High cardiovascular risk detected. Regular medical monitoring "
                "and possibly medication may be necessary alongside lifestyle changes."
            )
        
        return " | ".join(insights) if insights else "Your health metrics look good! Continue maintaining healthy habits."
    
    def get_daily_tips(self, assessment: HealthAssessment) -> List[str]:
        """Get daily actionable tips based on assessment"""
        tips = []
        
        if assessment.bmi >= 30:
            tips.extend([
                "Start your day with a protein-rich breakfast to control appetite",
                "Take a 10-minute walk after each meal to improve metabolism",
                "Drink water before meals to increase satiety",
                "Track everything you eat today - awareness is the first step"
            ])
        elif assessment.bmi >= 25:
            tips.extend([
                "Replace one sugary drink with water today",
                "Take the stairs instead of elevator when possible",
                "Include a vegetable with every meal",
                "Practice portion control by using smaller plates"
            ])
        else:
            tips.extend([
                "Maintain your healthy habits with consistent meal timing",
                "Try a new physical activity to keep exercise interesting",
                "Focus on getting quality sleep tonight",
                "Practice gratitude for your health achievements"
            ])
        
        return tips
    
    # Future LangChain integration methods (placeholders)
    def _init_langchain(self, api_key: str):
        """Initialize LangChain components (future implementation)"""
        # TODO: Implement LangChain initialization
        # self.llm = OpenAI(api_key=api_key)
        # self.memory = ConversationBufferMemory()
        # self.ai_chain = LLMChain(llm=self.llm, prompt=self._create_health_prompt())
        pass
    
    def _create_health_prompt(self):
        """Create LangChain prompt template for health analysis"""
        # TODO: Implement sophisticated health analysis prompt
        pass
    
    def chat_with_ai(self, message: str, context: HealthAssessment = None) -> str:
        """Chat interface for AI health assistant (future implementation)"""
        # TODO: Implement conversational AI using LangChain
        return "AI chat functionality will be implemented with LangChain integration."

# Example usage and testing
def example_usage():
    """Example usage of the Health Copilot system"""
    print("🏥 AI Health Copilot - Example Usage\n")
    
    # Create sample health metrics
    user_metrics = HealthMetrics(
        weight=95.0,  # kg
        height=175.0,  # cm
        age=35,
        gender="male",
        activity_level="sedentary",
        medical_conditions=["hypertension"]
    )
    
    # Initialize copilot
    copilot = HealthCopilot()
    
    # Perform health analysis
    assessment = copilot.analyze_health(user_metrics)
    
    # Display results
    print(f"📊 Health Assessment Results:")
    print(f"BMI: {assessment.bmi} ({assessment.bmi_category})")
    print(f"Risk Level: {assessment.risk_level.value.upper()}")
    print(f"Cardiovascular Risk: {assessment.cardiovascular_risk}")
    print(f"\n🤖 AI Insights: {assessment.ai_insights}")
    
    print(f"\n📋 Recommendations ({len(assessment.recommendations)}):")
    for i, rec in enumerate(assessment.recommendations, 1):
        print(f"{i}. [{rec['priority'].upper()}] {rec['title']}")
        print(f"   {rec['description']}")
    
    print(f"\n🎯 Wellness Plan Goals:")
    for goal in assessment.wellness_plan['goals']:
        print(f"• {goal}")
    
    print(f"\n💡 Daily Tips:")
    tips = copilot.get_daily_tips(assessment)
    for tip in tips:
        print(f"• {tip}")
    
    return assessment

if __name__ == "__main__":
    # Run example
    assessment = example_usage()
    
    # Save results to JSON for API integration
    with open("health_assessment_example.json", "w") as f:
        # Convert dataclass to dict for JSON serialization
        assessment_dict = asdict(assessment)
        # Convert enum to string
        assessment_dict['risk_level'] = assessment.risk_level.value
        json.dump(assessment_dict, f, indent=2)
    
    print(f"\n✅ Assessment saved to health_assessment_example.json")
    print(f"🚀 Ready for API integration and LangChain enhancement!") 