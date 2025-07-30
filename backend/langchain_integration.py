"""
LangChain Integration for AI Health Copilot
Provides advanced AI capabilities using LangChain and OpenAI
"""

import os
import logging
from typing import Dict, List, Optional, Any
from datetime import datetime

try:
    from langchain.llms import OpenAI
    from langchain.chat_models import ChatOpenAI
    from langchain.chains import LLMChain, ConversationChain
    from langchain.prompts import PromptTemplate, ChatPromptTemplate
    from langchain.memory import ConversationBufferMemory, ConversationSummaryMemory
    from langchain.schema import BaseMessage, HumanMessage, AIMessage, SystemMessage
    from langchain.callbacks.base import BaseCallbackHandler
    LANGCHAIN_AVAILABLE = True
except ImportError:
    LANGCHAIN_AVAILABLE = False
    print("LangChain not installed. AI features will use fallback responses.")

from config import get_langchain_config, get_settings
from copilot import HealthMetrics, HealthAssessment, HealthRiskLevel

# Configure logging
logger = logging.getLogger(__name__)

class HealthCopilotCallbackHandler(BaseCallbackHandler):
    """Custom callback handler for health-specific logging"""
    
    def on_llm_start(self, serialized: Dict[str, Any], prompts: List[str], **kwargs) -> None:
        logger.info(f"LLM started with {len(prompts)} prompts")
    
    def on_llm_end(self, response, **kwargs) -> None:
        logger.info("LLM completed successfully")
    
    def on_llm_error(self, error: Exception, **kwargs) -> None:
        logger.error(f"LLM error: {str(error)}")

class HealthAnalysisChain:
    """LangChain-powered health analysis"""
    
    def __init__(self, api_key: str = None):
        if not LANGCHAIN_AVAILABLE:
            raise ImportError("LangChain is not installed. Please install it to use AI features.")
        
        self.config = get_langchain_config(get_settings())
        self.api_key = api_key or os.getenv("OPENAI_API_KEY")
        
        if not self.api_key:
            raise ValueError("OpenAI API key is required for LangChain integration")
        
        self._initialize_llm()
        self._initialize_prompts()
        self._initialize_chains()
        self._initialize_memory()
    
    def _initialize_llm(self):
        """Initialize the language model"""
        self.llm = ChatOpenAI(
            model_name=self.config.model_name,
            temperature=self.config.temperature,
            max_tokens=self.config.max_tokens,
            openai_api_key=self.api_key,
            callbacks=[HealthCopilotCallbackHandler()]
        )
    
    def _initialize_prompts(self):
        """Initialize health-specific prompt templates"""
        
        # Health Analysis Prompt
        self.health_analysis_prompt = ChatPromptTemplate.from_messages([
            SystemMessage(content="""You are an expert AI health consultant specializing in cardiovascular risk assessment and wellness planning. Your role is to:

1. Analyze health metrics with medical accuracy
2. Provide evidence-based recommendations
3. Explain complex health concepts in simple terms
4. Emphasize the importance of professional medical consultation
5. Be empathetic but direct about health risks

Always include:
- Clear explanations of health risks
- Actionable recommendations
- When to seek medical attention
- Encouragement for positive lifestyle changes

Remember: You provide educational information, not medical diagnosis or treatment."""),
            
            HumanMessage(content="""Please analyze these health metrics and provide comprehensive insights:

Patient Information:
- Age: {age} years
- Gender: {gender}
- Weight: {weight} kg
- Height: {height} cm
- BMI: {bmi}
- BMI Category: {bmi_category}
- Activity Level: {activity_level}
- Medical Conditions: {medical_conditions}
- Cardiovascular Risk Level: {risk_level}

Current Assessment:
{cardiovascular_risk}

Please provide:
1. Detailed health risk analysis
2. Specific lifestyle recommendations
3. Warning signs to watch for
4. Timeline for improvement
5. When to seek medical attention""")
        ])
        
        # Wellness Plan Prompt
        self.wellness_plan_prompt = ChatPromptTemplate.from_messages([
            SystemMessage(content="""You are a certified wellness coach creating personalized health improvement plans. Focus on:

1. Realistic, achievable goals
2. Progressive improvement strategies
3. Sustainable lifestyle changes
4. Motivation and behavioral psychology
5. Safety considerations

Create practical, step-by-step plans that people can actually follow."""),
            
            HumanMessage(content="""Create a detailed wellness plan for:

BMI: {bmi} ({bmi_category})
Risk Level: {risk_level}
Age: {age}, Gender: {gender}
Activity Level: {activity_level}

Include:
1. Weekly goals for the next 12 weeks
2. Specific diet recommendations
3. Exercise progression plan
4. Habit formation strategies
5. Monitoring and tracking methods""")
        ])
        
        # Chat Assistant Prompt
        self.chat_prompt = ChatPromptTemplate.from_messages([
            SystemMessage(content="""You are a friendly, knowledgeable AI health assistant. You help users understand their health metrics, provide encouragement, and offer practical advice.

Guidelines:
- Be supportive and encouraging
- Provide clear, actionable advice
- Always recommend consulting healthcare professionals for serious concerns
- Use simple language to explain complex health concepts
- Ask clarifying questions when needed
- Remember previous conversation context"""),
            
            HumanMessage(content="{user_message}")
        ])
        
        # Risk Assessment Prompt
        self.risk_assessment_prompt = ChatPromptTemplate.from_messages([
            SystemMessage(content="""You are a cardiovascular risk assessment specialist. Analyze health data to identify risk factors and provide clear risk communication.

Focus on:
1. Evidence-based risk factors
2. Clear risk communication
3. Preventive measures
4. Urgency indicators
5. Professional consultation recommendations"""),
            
            HumanMessage(content="""Assess cardiovascular risk for:

BMI: {bmi}
Age: {age}
Gender: {gender}
Activity: {activity_level}
Conditions: {medical_conditions}

Provide:
1. Primary risk factors
2. Risk level (Low/Moderate/High/Critical)
3. Immediate concerns
4. Prevention strategies
5. Medical consultation timeline""")
        ])
    
    def _initialize_chains(self):
        """Initialize LangChain chains"""
        self.health_analysis_chain = LLMChain(
            llm=self.llm,
            prompt=self.health_analysis_prompt,
            verbose=self.config.settings.debug
        )
        
        self.wellness_plan_chain = LLMChain(
            llm=self.llm,
            prompt=self.wellness_plan_prompt,
            verbose=self.config.settings.debug
        )
        
        self.chat_chain = LLMChain(
            llm=self.llm,
            prompt=self.chat_prompt,
            verbose=self.config.settings.debug
        )
        
        self.risk_assessment_chain = LLMChain(
            llm=self.llm,
            prompt=self.risk_assessment_prompt,
            verbose=self.config.settings.debug
        )
    
    def _initialize_memory(self):
        """Initialize conversation memory"""
        self.memory = ConversationBufferMemory(
            memory_key="chat_history",
            return_messages=True,
            max_token_limit=2000
        )
        
        # Add memory to chat chain
        self.conversation_chain = ConversationChain(
            llm=self.llm,
            memory=self.memory,
            verbose=self.config.settings.debug
        )

    async def analyze_health_with_ai(self, metrics: HealthMetrics, assessment: HealthAssessment) -> str:
        """Generate AI-powered health analysis"""
        try:
            response = await self.health_analysis_chain.arun(
                age=metrics.age,
                gender=metrics.gender,
                weight=metrics.weight,
                height=metrics.height,
                bmi=assessment.bmi,
                bmi_category=assessment.bmi_category,
                activity_level=metrics.activity_level,
                medical_conditions=", ".join(metrics.medical_conditions) if metrics.medical_conditions else "None",
                risk_level=assessment.risk_level.value,
                cardiovascular_risk=assessment.cardiovascular_risk
            )
            
            logger.info("AI health analysis completed successfully")
            return response
            
        except Exception as e:
            logger.error(f"Error in AI health analysis: {str(e)}")
            return self._fallback_health_analysis(metrics, assessment)
    
    async def generate_ai_wellness_plan(self, metrics: HealthMetrics, assessment: HealthAssessment) -> str:
        """Generate AI-powered wellness plan"""
        try:
            response = await self.wellness_plan_chain.arun(
                bmi=assessment.bmi,
                bmi_category=assessment.bmi_category,
                risk_level=assessment.risk_level.value,
                age=metrics.age,
                gender=metrics.gender,
                activity_level=metrics.activity_level
            )
            
            logger.info("AI wellness plan generated successfully")
            return response
            
        except Exception as e:
            logger.error(f"Error in AI wellness plan generation: {str(e)}")
            return self._fallback_wellness_plan(assessment)
    
    async def chat_with_ai(self, message: str, context: Dict[str, Any] = None) -> str:
        """Handle conversational AI chat"""
        try:
            # Add context to the message if provided
            if context:
                enhanced_message = f"Context: {context}\n\nUser Question: {message}"
            else:
                enhanced_message = message
            
            response = await self.conversation_chain.apredict(input=enhanced_message)
            
            logger.info("AI chat response generated successfully")
            return response
            
        except Exception as e:
            logger.error(f"Error in AI chat: {str(e)}")
            return self._fallback_chat_response(message)
    
    async def assess_risk_with_ai(self, metrics: HealthMetrics, bmi: float) -> str:
        """Generate AI-powered risk assessment"""
        try:
            response = await self.risk_assessment_chain.arun(
                bmi=bmi,
                age=metrics.age,
                gender=metrics.gender,
                activity_level=metrics.activity_level,
                medical_conditions=", ".join(metrics.medical_conditions) if metrics.medical_conditions else "None"
            )
            
            logger.info("AI risk assessment completed successfully")
            return response
            
        except Exception as e:
            logger.error(f"Error in AI risk assessment: {str(e)}")
            return self._fallback_risk_assessment(metrics, bmi)
    
    def _fallback_health_analysis(self, metrics: HealthMetrics, assessment: HealthAssessment) -> str:
        """Fallback health analysis when AI is unavailable"""
        if assessment.bmi >= 30:
            return (
                f"⚠️ IMPORTANT: With a BMI of {assessment.bmi}, you are in the obesity range, "
                f"which significantly increases your risk of cardiovascular disease, diabetes, and other health issues. "
                f"I strongly recommend consulting with a healthcare provider to develop a comprehensive weight management plan. "
                f"Focus on gradual, sustainable changes in diet and exercise."
            )
        elif assessment.bmi >= 25:
            return (
                f"🔔 NOTICE: Your BMI of {assessment.bmi} is in the overweight range. "
                f"This is a good time to focus on healthy lifestyle changes to prevent further weight gain "
                f"and reduce health risks. Consider increasing physical activity and making dietary improvements."
            )
        else:
            return (
                f"✅ GOOD NEWS: Your BMI of {assessment.bmi} is in a healthy range. "
                f"Continue maintaining your current healthy habits and regular physical activity."
            )
    
    def _fallback_wellness_plan(self, assessment: HealthAssessment) -> str:
        """Fallback wellness plan when AI is unavailable"""
        if assessment.bmi >= 30:
            return (
                "12-Week Wellness Plan:\n"
                "Weeks 1-4: Medical consultation, gentle walking, food diary\n"
                "Weeks 5-8: Structured exercise, meal planning, stress management\n"
                "Weeks 9-12: Advanced routines, habit formation, maintenance planning"
            )
        else:
            return (
                "8-Week Wellness Plan:\n"
                "Weeks 1-4: Fitness assessment, nutrition optimization, routine establishment\n"
                "Weeks 5-8: Advanced goals, preventive measures, long-term planning"
            )
    
    def _fallback_chat_response(self, message: str) -> str:
        """Fallback chat response when AI is unavailable"""
        message_lower = message.lower()
        
        if any(word in message_lower for word in ["bmi", "weight", "obesity"]):
            return (
                "I can help you understand BMI and weight management! "
                "BMI over 30 indicates obesity and increases health risks. "
                "Would you like me to analyze your health metrics?"
            )
        elif any(word in message_lower for word in ["exercise", "workout"]):
            return (
                "Exercise is crucial for health! Start with 150 minutes of moderate activity per week. "
                "For those with obesity, begin gently with walking and gradually increase intensity."
            )
        elif any(word in message_lower for word in ["diet", "nutrition"]):
            return (
                "Good nutrition focuses on whole foods, lean proteins, and vegetables. "
                "Create a moderate caloric deficit for weight loss, but consult a nutritionist for personalized advice."
            )
        else:
            return (
                "I'm here to help with your health questions! I can analyze BMI, assess cardiovascular risk, "
                "and provide personalized recommendations. What would you like to know?"
            )
    
    def _fallback_risk_assessment(self, metrics: HealthMetrics, bmi: float) -> str:
        """Fallback risk assessment when AI is unavailable"""
        risk_factors = []
        
        if bmi >= 30:
            risk_factors.append("obesity (BMI ≥30)")
        elif bmi >= 25:
            risk_factors.append("overweight (BMI 25-29.9)")
        
        if metrics.age >= 45 and metrics.gender.lower() == "male":
            risk_factors.append("age (male ≥45)")
        elif metrics.age >= 55 and metrics.gender.lower() == "female":
            risk_factors.append("age (female ≥55)")
        
        if metrics.activity_level in ["sedentary", "light"]:
            risk_factors.append("low physical activity")
        
        if risk_factors:
            return f"Identified risk factors: {', '.join(risk_factors)}. Consider lifestyle modifications and medical consultation."
        else:
            return "Low cardiovascular risk based on current metrics. Maintain healthy lifestyle habits."

class AIHealthCopilot:
    """Enhanced Health Copilot with AI integration"""
    
    def __init__(self, api_key: str = None):
        self.ai_enabled = LANGCHAIN_AVAILABLE and (api_key or os.getenv("OPENAI_API_KEY"))
        
        if self.ai_enabled:
            try:
                self.ai_chain = HealthAnalysisChain(api_key)
                logger.info("AI Health Copilot initialized successfully")
            except Exception as e:
                logger.warning(f"AI initialization failed, using fallback: {str(e)}")
                self.ai_enabled = False
                self.ai_chain = None
        else:
            logger.info("AI Health Copilot running in fallback mode")
            self.ai_chain = None
    
    async def enhanced_health_analysis(self, metrics: HealthMetrics, assessment: HealthAssessment) -> str:
        """Get enhanced AI health analysis"""
        if self.ai_enabled and self.ai_chain:
            return await self.ai_chain.analyze_health_with_ai(metrics, assessment)
        else:
            return self.ai_chain._fallback_health_analysis(metrics, assessment) if self.ai_chain else "AI analysis unavailable"
    
    async def enhanced_wellness_plan(self, metrics: HealthMetrics, assessment: HealthAssessment) -> str:
        """Get enhanced AI wellness plan"""
        if self.ai_enabled and self.ai_chain:
            return await self.ai_chain.generate_ai_wellness_plan(metrics, assessment)
        else:
            return self.ai_chain._fallback_wellness_plan(assessment) if self.ai_chain else "AI wellness plan unavailable"
    
    async def enhanced_chat(self, message: str, context: Dict[str, Any] = None) -> str:
        """Enhanced AI chat with health context"""
        if self.ai_enabled and self.ai_chain:
            return await self.ai_chain.chat_with_ai(message, context)
        else:
            return self.ai_chain._fallback_chat_response(message) if self.ai_chain else "AI chat unavailable"

# Example usage
async def example_ai_usage():
    """Example of AI integration usage"""
    if not LANGCHAIN_AVAILABLE:
        print("LangChain not available. Install with: pip install langchain openai")
        return
    
    # Initialize AI copilot
    ai_copilot = AIHealthCopilot()
    
    # Example health metrics
    from copilot import HealthMetrics, HealthCopilot
    
    metrics = HealthMetrics(
        weight=85.0,
        height=175.0,
        age=35,
        gender="male",
        activity_level="sedentary"
    )
    
    # Get standard assessment
    standard_copilot = HealthCopilot()
    assessment = standard_copilot.analyze_health(metrics)
    
    # Get AI-enhanced analysis
    ai_analysis = await ai_copilot.enhanced_health_analysis(metrics, assessment)
    print("AI Health Analysis:")
    print(ai_analysis)
    
    # Get AI chat response
    chat_response = await ai_copilot.enhanced_chat("What should I do about my BMI?")
    print("\nAI Chat Response:")
    print(chat_response)

if __name__ == "__main__":
    import asyncio
    asyncio.run(example_ai_usage()) 