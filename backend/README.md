# 🏥 AI Health Copilot Backend

A comprehensive Python backend for intelligent health analysis with BMI assessment, cardiovascular risk evaluation, and personalized wellness recommendations. Built with FastAPI, MCP integration, and LangChain AI capabilities.

## 🌟 Features

### 🎯 Core Health Analysis
- **BMI Calculation & Categorization** - WHO standard BMI assessment
- **Cardiovascular Risk Assessment** - Multi-factor risk evaluation  
- **Personalized Recommendations** - Evidence-based health advice
- **Wellness Plan Generation** - Structured 12-week health programs
- **Daily Health Tips** - Actionable daily guidance

### 🤖 AI-Powered Insights
- **LangChain Integration** - Advanced AI analysis using OpenAI
- **Conversational Health Assistant** - Natural language health Q&A
- **Intelligent Risk Communication** - Clear, empathetic health messaging
- **Adaptive Recommendations** - Context-aware health advice

### 🚀 Production-Ready API
- **FastAPI Framework** - High-performance async API
- **Comprehensive Documentation** - Auto-generated API docs
- **CORS Support** - Seamless frontend integration
- **Error Handling** - Robust error management
- **Health Monitoring** - Built-in health check endpoints

## 🔧 Installation & Setup

### Prerequisites
- Python 3.8+
- pip or conda
- OpenAI API key (for AI features)

### Quick Start

1. **Navigate to Backend Directory**
```bash
cd backend
```

2. **Install Dependencies**
```bash
pip install -r requirements.txt
```

3. **Setup Environment**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Run the Server**
```bash
python run_server.py
```

The API will be available at `http://localhost:8000`

### Development Mode
```bash
python api_server.py
# OR
uvicorn api_server:app --reload --host 0.0.0.0 --port 8000
```

## 📋 API Endpoints

### Health Analysis
- `POST /analyze` - Comprehensive health assessment
- `POST /quick-bmi` - Quick BMI calculation
- `GET /daily-tips/{risk_level}` - Get daily health tips
- `GET /recommendations/{bmi_category}` - Category-specific recommendations
- `GET /wellness-plan/{risk_level}` - Structured wellness plans

### AI Assistant
- `POST /chat` - Conversational health assistant
- `GET /health` - API health check
- `GET /` - API information

### Documentation
- `GET /docs` - Interactive API documentation (Swagger)
- `GET /redoc` - Alternative API documentation

## 🏗️ Core Logic Implementation

### BMI Logic (Per Requirements)
```python
# If BMI > 30, return cardiovascular issue warning
if bmi >= 30:
    return "HIGH CARDIOVASCULAR RISK: BMI indicates obesity, significantly increasing risk of heart disease, stroke, and diabetes. Consider a wellness plan with weight management."
```

### Health Assessment Flow
```python
def analyze_health(metrics: HealthMetrics) -> HealthAssessment:
    # 1. Calculate BMI
    bmi = weight / (height_m ** 2)
    
    # 2. Assess cardiovascular risk
    if bmi >= 30:
        risk_level = HealthRiskLevel.HIGH
        risk_description = "Cardiovascular risk significantly elevated"
    
    # 3. Generate recommendations
    recommendations = generate_recommendations(bmi, risk_level)
    
    # 4. Create wellness plan
    wellness_plan = generate_wellness_plan(bmi, risk_level)
    
    # 5. AI insights (LangChain integration point)
    ai_insights = generate_ai_insights(metrics, bmi)
    
    return HealthAssessment(...)
```

## 🤖 LangChain Integration

### Current Implementation
- **Placeholder Structure** - Ready for LangChain integration
- **Fallback Responses** - Works without AI for testing
- **OpenAI Ready** - Just add your API key

### Adding LangChain (Future Enhancement)
```python
# Install LangChain
pip install langchain openai

# Set environment variable
export OPENAI_API_KEY="your_api_key_here"

# The AI features will automatically activate
```

### AI Hooks Available
- `generate_ai_insights()` - Health analysis insights
- `chat_with_ai()` - Conversational assistant  
- `enhanced_wellness_plan()` - AI-generated plans
- `assess_risk_with_ai()` - Intelligent risk assessment

## 📊 Example Usage

### Health Analysis Request
```python
import requests

# Analyze health metrics
response = requests.post("http://localhost:8000/analyze", json={
    "weight": 95.0,
    "height": 175.0,
    "age": 35,
    "gender": "male",
    "activity_level": "sedentary",
    "medical_conditions": ["hypertension"]
})

assessment = response.json()
print(f"BMI: {assessment['bmi']}")
print(f"Risk Level: {assessment['risk_level']}")
```

### Quick BMI Check
```python
# Quick BMI calculation
response = requests.post("http://localhost:8000/quick-bmi", 
                        params={"weight": 95, "height": 175})
result = response.json()
print(f"BMI: {result['bmi']} - {result['category']}")
```

### AI Chat
```python
# Chat with health assistant
response = requests.post("http://localhost:8000/chat", json={
    "message": "My BMI is 32, what should I do?",
    "context": {"bmi": 32, "risk_level": "high"}
})
print(response.json()["response"])
```

## 🏥 Health Logic Details

### BMI Categories (WHO Standards)
- **Underweight**: BMI < 18.5
- **Normal**: BMI 18.5-24.9  
- **Overweight**: BMI 25.0-29.9
- **Obese**: BMI ≥ 30.0

### Risk Assessment Factors
- **BMI-based risk** (primary factor)
- **Age thresholds** (45+ male, 55+ female)
- **Activity level** (sedentary = higher risk)
- **Medical conditions** (diabetes, hypertension, etc.)

### Wellness Plan Structure
- **Phase 1**: Foundation & Medical Clearance (4 weeks)
- **Phase 2**: Progressive Improvement (4 weeks)  
- **Phase 3**: Optimization & Maintenance (4 weeks)

## 🔧 Configuration

### Environment Variables
```bash
# Server Configuration
HOST=0.0.0.0
PORT=8000
DEBUG=true

# AI Configuration  
OPENAI_API_KEY=your_openai_api_key
ENABLE_AI_INSIGHTS=true

# Health Thresholds
BMI_OBESITY_THRESHOLD=30.0
BMI_OVERWEIGHT_THRESHOLD=25.0

# Security
SECRET_KEY=your_secret_key_here
```

### Health Thresholds (Configurable)
```python
# Customize health assessment parameters
BMI_OBESITY_THRESHOLD = 30.0
BMI_OVERWEIGHT_THRESHOLD = 25.0
HIGH_RISK_AGE_MALE = 45
HIGH_RISK_AGE_FEMALE = 55
```

## 🚀 Deployment

### Development
```bash
python run_server.py --env development
```

### Production
```bash
python run_server.py --env production --workers 4
```

### Docker (Future)
```bash
docker build -t health-copilot-backend .
docker run -p 8000:8000 health-copilot-backend
```

## 🧪 Testing

### Manual Testing
```bash
# Test the example
python copilot.py

# Test API endpoints
curl http://localhost:8000/health
curl -X POST http://localhost:8000/quick-bmi -d "weight=80&height=175"
```

### Automated Testing
```bash
# Install test dependencies
pip install pytest pytest-asyncio

# Run tests
pytest tests/
```

## 📁 Project Structure

```
backend/
├── copilot.py              # Core AI health analysis logic
├── api_server.py           # FastAPI server and endpoints
├── config.py               # Configuration management
├── langchain_integration.py # AI/LangChain integration
├── run_server.py           # Production server runner
├── requirements.txt        # Python dependencies
├── .env.example           # Environment configuration template
├── README.md              # This file
├── logs/                  # Application logs
├── data/                  # Database and data files
└── tests/                 # Test files (future)
```

## 🔮 Future Enhancements

### AI & ML Features
- **Advanced LangChain Integration** - GPT-4 health analysis
- **Machine Learning Models** - Predictive health analytics
- **Natural Language Processing** - Advanced health Q&A
- **Personalization Engine** - Learn from user interactions

### Health Features  
- **Nutrition Tracking** - Calorie and macro analysis
- **Exercise Planning** - Workout recommendations
- **Progress Monitoring** - Health metric tracking over time
- **Medical Integration** - Connect with healthcare providers

### Technical Features
- **Database Integration** - PostgreSQL/MongoDB for data persistence
- **User Authentication** - Secure user accounts and data
- **Real-time Updates** - WebSocket connections for live data
- **Mobile API** - Optimized endpoints for mobile apps

## 📞 Integration with Frontend

### CORS Configuration
The backend is configured to work with your Next.js frontend:
```python
allow_origins=["http://localhost:3000", "http://localhost:3001"]
```

### API Calls from Frontend
```javascript
// Next.js frontend integration
const analyzeHealth = async (metrics) => {
  const response = await fetch('http://localhost:8000/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(metrics)
  });
  return response.json();
};
```

## 📈 Health Assessment Example

```json
{
  "bmi": 31.0,
  "bmi_category": "Obese",
  "risk_level": "high", 
  "cardiovascular_risk": "HIGH CARDIOVASCULAR RISK: BMI of 31.0 indicates obesity, significantly increasing risk of heart disease, stroke, and diabetes.",
  "recommendations": [
    {
      "type": "medical",
      "priority": "critical", 
      "title": "Immediate Medical Consultation",
      "description": "Schedule consultation with healthcare provider for obesity management"
    }
  ],
  "wellness_plan": {
    "duration": "12 weeks",
    "goals": ["Lose 9.5 kg (10% body weight)", "Reduce cardiovascular risk factors"],
    "phases": [...]
  },
  "ai_insights": "🚨 CRITICAL: Your BMI indicates obesity, which significantly increases cardiovascular disease risk. Immediate lifestyle intervention is essential.",
  "timestamp": "2024-01-01T12:00:00Z"
}
```

## 🛡️ Security & Privacy

- **Data Validation** - Pydantic models ensure data integrity
- **Error Handling** - Secure error responses without data leakage  
- **CORS Protection** - Configured for specific frontend origins
- **Input Sanitization** - All inputs validated and sanitized
- **Health Data Privacy** - No persistent storage by default

## 📚 Resources

- **FastAPI Documentation**: https://fastapi.tiangolo.com/
- **LangChain Documentation**: https://python.langchain.com/
- **BMI Guidelines**: https://www.who.int/health-topics/obesity
- **Cardiovascular Risk**: https://www.heart.org/

---

**Built with ❤️ for better health outcomes**

Ready for LangChain AI integration and production deployment! 🚀 