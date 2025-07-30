"""
FastAPI Server for AI Health Copilot
Provides REST API endpoints for health analysis and recommendations
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

from copilot import (
    HealthCopilot, 
    HealthMetrics, 
    HealthAssessment, 
    HealthRiskLevel,
    RecommendationType
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="AI Health Copilot API",
    description="Intelligent health assistant with BMI analysis, risk assessment, and personalized recommendations",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],  # Next.js frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Health Copilot
copilot = HealthCopilot()

# Pydantic models for API request/response
class HealthMetricsRequest(BaseModel):
    """Request model for health metrics input"""
    weight: float = Field(..., description="Weight in kilograms", gt=0, le=1000)
    height: float = Field(..., description="Height in centimeters", gt=0, le=300)
    age: int = Field(..., description="Age in years", gt=0, le=150)
    gender: str = Field(..., description="Gender (male/female/other)")
    activity_level: str = Field(
        default="moderate", 
        description="Activity level: sedentary, light, moderate, active, very_active"
    )
    medical_conditions: Optional[List[str]] = Field(
        default=[], 
        description="List of existing medical conditions"
    )

class HealthAssessmentResponse(BaseModel):
    """Response model for health assessment"""
    bmi: float
    bmi_category: str
    risk_level: str
    cardiovascular_risk: str
    recommendations: List[Dict[str, Any]]
    wellness_plan: Dict[str, Any]
    ai_insights: str
    timestamp: str
    success: bool = True

class ChatRequest(BaseModel):
    """Request model for AI chat"""
    message: str = Field(..., description="User message for AI assistant")
    context: Optional[Dict[str, Any]] = Field(default=None, description="Health assessment context")

class ChatResponse(BaseModel):
    """Response model for AI chat"""
    response: str
    timestamp: str
    success: bool = True

class ErrorResponse(BaseModel):
    """Error response model"""
    error: str
    message: str
    timestamp: str
    success: bool = False

# API Endpoints

@app.get("/", response_model=Dict[str, str])
async def root():
    """Root endpoint with API information"""
    return {
        "service": "AI Health Copilot API",
        "version": "1.0.0",
        "status": "active",
        "docs": "/docs",
        "health_check": "/health"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "service": "AI Health Copilot",
        "copilot_ready": True
    }

@app.post("/analyze", response_model=HealthAssessmentResponse)
async def analyze_health(metrics_request: HealthMetricsRequest):
    """
    Analyze health metrics and provide comprehensive assessment
    
    This endpoint:
    - Calculates BMI and categorizes it
    - Assesses cardiovascular risk factors
    - Generates personalized recommendations
    - Creates a structured wellness plan
    - Provides AI-powered insights
    """
    try:
        logger.info(f"Received health analysis request: {metrics_request.model_dump()}")
        
        # Convert request to internal HealthMetrics object
        metrics = HealthMetrics(
            weight=metrics_request.weight,
            height=metrics_request.height,
            age=metrics_request.age,
            gender=metrics_request.gender,
            activity_level=metrics_request.activity_level,
            medical_conditions=metrics_request.medical_conditions or []
        )
        
        # Perform health analysis
        assessment = copilot.analyze_health(metrics)
        
        # Convert assessment to response format
        response = HealthAssessmentResponse(
            bmi=assessment.bmi,
            bmi_category=assessment.bmi_category,
            risk_level=assessment.risk_level.value,
            cardiovascular_risk=assessment.cardiovascular_risk,
            recommendations=assessment.recommendations,
            wellness_plan=assessment.wellness_plan,
            ai_insights=assessment.ai_insights,
            timestamp=assessment.timestamp
        )
        
        logger.info(f"Health analysis completed successfully. BMI: {assessment.bmi}")
        return response
        
    except Exception as e:
        logger.error(f"Error in health analysis: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error during health analysis: {str(e)}"
        )

@app.post("/quick-bmi", response_model=Dict[str, Any])
async def quick_bmi_check(weight: float, height: float):
    """
    Quick BMI calculation and basic categorization
    """
    try:
        if weight <= 0 or height <= 0:
            raise HTTPException(status_code=400, detail="Weight and height must be positive values")
        
        # Calculate BMI
        height_m = height / 100
        bmi = round(weight / (height_m ** 2), 1)
        
        # Categorize BMI
        if bmi < 18.5:
            category = "Underweight"
            risk = "May indicate malnutrition or other health issues"
        elif 18.5 <= bmi < 25:
            category = "Normal weight"
            risk = "Low health risk related to weight"
        elif 25 <= bmi < 30:
            category = "Overweight"
            risk = "Increased risk of cardiovascular disease"
        else:
            category = "Obese"
            risk = "HIGH RISK: Significantly increased risk of cardiovascular disease, diabetes, and other health complications"
        
        return {
            "bmi": bmi,
            "category": category,
            "risk_assessment": risk,
            "recommendation": "Consider full health analysis for personalized recommendations" if bmi >= 25 else "Maintain healthy lifestyle",
            "timestamp": datetime.now().isoformat(),
            "success": True
        }
        
    except Exception as e:
        logger.error(f"Error in BMI calculation: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error calculating BMI: {str(e)}")

@app.get("/daily-tips/{risk_level}")
async def get_daily_tips(risk_level: str):
    """
    Get daily health tips based on risk level
    """
    try:
        # Create mock assessment for tip generation
        mock_assessment = type('obj', (object,), {
            'bmi': 30 if risk_level == "high" else 25 if risk_level == "moderate" else 22,
            'risk_level': HealthRiskLevel.HIGH if risk_level == "high" else HealthRiskLevel.MODERATE if risk_level == "moderate" else HealthRiskLevel.LOW
        })()
        
        tips = copilot.get_daily_tips(mock_assessment)
        
        return {
            "tips": tips,
            "risk_level": risk_level,
            "date": datetime.now().strftime("%Y-%m-%d"),
            "success": True
        }
        
    except Exception as e:
        logger.error(f"Error getting daily tips: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error retrieving daily tips: {str(e)}")

@app.post("/chat", response_model=ChatResponse)
async def chat_with_ai(chat_request: ChatRequest):
    """
    Chat with AI health assistant (placeholder for LangChain integration)
    """
    try:
        # TODO: Implement actual LangChain integration
        response_text = copilot.chat_with_ai(chat_request.message, chat_request.context)
        
        # For now, provide rule-based responses
        message_lower = chat_request.message.lower()
        
        if any(word in message_lower for word in ["bmi", "weight", "obesity"]):
            response_text = (
                "I can help you understand BMI and weight management! "
                "BMI over 30 indicates obesity and significantly increases cardiovascular risk. "
                "Would you like me to analyze your health metrics for personalized recommendations?"
            )
        elif any(word in message_lower for word in ["exercise", "workout", "fitness"]):
            response_text = (
                "Exercise is crucial for health! For obesity (BMI >30), start with low-impact activities "
                "like walking 10-15 minutes daily, then gradually increase. Always consult your doctor "
                "before starting a new exercise program."
            )
        elif any(word in message_lower for word in ["diet", "nutrition", "food"]):
            response_text = (
                "Nutrition is key to health management! Focus on whole foods, lean proteins, and vegetables. "
                "For weight loss, create a moderate caloric deficit of 300-750 calories per day. "
                "Consider consulting a registered dietitian for personalized meal planning."
            )
        elif any(word in message_lower for word in ["risk", "heart", "cardiovascular"]):
            response_text = (
                "Cardiovascular risk increases significantly with BMI >30. Key risk factors include "
                "obesity, sedentary lifestyle, age, and medical conditions. Regular monitoring and "
                "lifestyle interventions can help reduce risk."
            )
        else:
            response_text = (
                "I'm your AI health assistant! I can help with BMI analysis, cardiovascular risk assessment, "
                "and personalized health recommendations. What specific health topic would you like to discuss?"
            )
        
        return ChatResponse(
            response=response_text,
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        logger.error(f"Error in AI chat: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error in AI chat: {str(e)}")

@app.get("/recommendations/{bmi_category}")
async def get_recommendations_by_category(bmi_category: str):
    """
    Get specific recommendations based on BMI category
    """
    try:
        recommendations = []
        
        if bmi_category.lower() == "obese":
            recommendations = [
                {
                    "type": "medical",
                    "priority": "critical",
                    "title": "Immediate Medical Consultation",
                    "description": "Schedule consultation with healthcare provider for obesity management"
                },
                {
                    "type": "diet",
                    "priority": "high", 
                    "title": "Structured Weight Management Diet",
                    "description": "Implement medically supervised caloric deficit diet"
                },
                {
                    "type": "exercise",
                    "priority": "high",
                    "title": "Progressive Exercise Program", 
                    "description": "Start with low-impact activities and gradually increase intensity"
                }
            ]
        elif bmi_category.lower() == "overweight":
            recommendations = [
                {
                    "type": "diet",
                    "priority": "moderate",
                    "title": "Balanced Weight Loss Approach",
                    "description": "Moderate caloric restriction with balanced nutrition"
                },
                {
                    "type": "exercise",
                    "priority": "moderate",
                    "title": "Regular Physical Activity",
                    "description": "Establish consistent exercise routine"
                }
            ]
        elif bmi_category.lower() in ["normal", "underweight"]:
            recommendations = [
                {
                    "type": "lifestyle",
                    "priority": "low",
                    "title": "Maintain Healthy Habits",
                    "description": "Continue current healthy lifestyle patterns"
                }
            ]
        else:
            raise HTTPException(status_code=400, detail="Invalid BMI category")
        
        return {
            "bmi_category": bmi_category,
            "recommendations": recommendations,
            "count": len(recommendations),
            "timestamp": datetime.now().isoformat(),
            "success": True
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting recommendations: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error retrieving recommendations: {str(e)}")

@app.get("/wellness-plan/{risk_level}")
async def get_wellness_plan(risk_level: str, bmi: float = 25.0):
    """
    Get wellness plan based on risk level and BMI
    """
    try:
        # Create mock metrics for plan generation
        mock_metrics = HealthMetrics(
            weight=70.0,
            height=170.0,
            age=30,
            gender="other"
        )
        
        # Map risk level string to enum
        risk_enum = HealthRiskLevel.LOW
        if risk_level.lower() == "high":
            risk_enum = HealthRiskLevel.HIGH
        elif risk_level.lower() == "moderate":
            risk_enum = HealthRiskLevel.MODERATE
        
        plan = copilot.plan_generator.generate_plan(mock_metrics, bmi, risk_enum)
        
        return {
            "wellness_plan": plan,
            "risk_level": risk_level,
            "bmi": bmi,
            "timestamp": datetime.now().isoformat(),
            "success": True
        }
        
    except Exception as e:
        logger.error(f"Error generating wellness plan: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error generating wellness plan: {str(e)}")

# Background task for logging
async def log_analysis(metrics: Dict[str, Any], assessment: Dict[str, Any]):
    """Background task to log analysis for future ML training"""
    try:
        log_entry = {
            "timestamp": datetime.now().isoformat(),
            "input_metrics": metrics,
            "assessment_output": assessment
        }
        
        # In production, this would save to a database
        with open(f"logs/analysis_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json", "w") as f:
            json.dump(log_entry, f, indent=2)
            
    except Exception as e:
        logger.error(f"Error logging analysis: {str(e)}")

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """Custom HTTP exception handler"""
    return JSONResponse(
        status_code=exc.status_code,
        content=ErrorResponse(
            error=f"HTTP {exc.status_code}",
            message=str(exc.detail),
            timestamp=datetime.now().isoformat()
        ).model_dump()
    )

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    """General exception handler"""
    logger.error(f"Unhandled exception: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content=ErrorResponse(
            error="Internal Server Error",
            message="An unexpected error occurred",
            timestamp=datetime.now().isoformat()
        ).model_dump()
    )

if __name__ == "__main__":
    # Create logs directory
    import os
    os.makedirs("logs", exist_ok=True)
    
    # Run the server
    uvicorn.run(
        "api_server:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    ) 