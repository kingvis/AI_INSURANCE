# 🏥 WishInsured - Complete Insurance Portal

## Project Overview
**WishInsured** is a comprehensive insurance company portal that transforms user health, property, and financial data into personalized insurance recommendations. Built with modern web technologies and advanced insurance logic.

## 🚀 Quick Start

### Frontend (Next.js)
```bash
npm install
npm run dev
# Access: http://localhost:3000
```

### Backend (Python)
```bash
cd backend
pip install -r requirements.txt
python start.py
# Access: http://localhost:8001
# API Docs: http://localhost:8001/docs
```

## 📁 Project Structure

```
WishInsured/
├── 🎨 FRONTEND (Next.js + React + TypeScript)
│   ├── src/app/page.tsx                    # Main insurance portal
│   ├── src/components/auth/                # Authentication components
│   ├── src/lib/insurance-api.ts           # Backend API integration
│   ├── src/hooks/useSupabase.ts           # Authentication hooks
│   └── tailwind.config.js                 # Insurance styling
│
├── 🔧 BACKEND (Python + FastAPI)
│   ├── backend/insurance_copilot.py       # Core recommendation engine
│   ├── backend/insurance_api.py           # FastAPI server endpoints
│   ├── backend/requirements.txt           # Python dependencies
│   ├── backend/run_server.py              # Production server
│   ├── backend/start.py                   # Development server
│   └── backend/README.md                  # Backend documentation
│
└── 📝 DOCUMENTATION
    ├── PROJECT_SUMMARY.md                 # This file
    └── frontend_integration.md            # Frontend-backend integration
```

## 💼 Insurance Features

### ✅ Health Assessment
- **BMI Calculation**: Automatic BMI calculation from height/weight
- **Cardiovascular Risk**: BMI > 30 triggers high-risk assessment
- **Medical Conditions**: Diabetes, hypertension, heart disease factors
- **Lifestyle Factors**: Smoking, drinking, exercise frequency
- **Family History**: Genetic predisposition considerations
- **Risk-Based Pricing**: Premiums adjusted based on health profile

### ✅ Property Evaluation
- **Property Type**: Single family, condo, townhouse, etc.
- **Security Assessment**: Alarm systems, deadbolts, cameras
- **Age Factor**: Building year affects risk calculation
- **Location Risk**: Geographic risk factors
- **Claims History**: Previous insurance claims impact
- **Mortgage Requirements**: Required vs. recommended coverage

### ✅ Financial Analysis
- **Income Assessment**: Annual income for coverage calculations
- **Dependent Analysis**: Family size affects life insurance needs
- **Savings Evaluation**: Current financial security assessment
- **Employment Stability**: Job type affects risk assessment
- **Existing Coverage**: Current insurance portfolio analysis
- **Investment Risk**: Risk tolerance for investment products

## 🎯 Core Insurance Logic

### BMI-Based Health Risk (As Requested)
```python
# Core logic: BMI > 30 returns cardiovascular issue
if bmi >= 30:
    return "HIGH CARDIOVASCULAR RISK: BMI indicates obesity, significantly increasing risk of heart disease, stroke, and diabetes. Consider a wellness plan with weight management."
```

### Risk Calculation Matrix
| Risk Factor | Low | Moderate | High | Critical |
|-------------|-----|----------|------|----------|
| BMI | <25 | 25-30 | 30-35 | >35 |
| Age | <35 | 35-50 | 50-65 | >65 |
| Smoking | No | Former | Current | Heavy |
| Medical Conditions | None | 1 | 2-3 | >3 |

### Premium Calculation
- **Base Premium**: Industry standard rates
- **Risk Multipliers**: Applied based on assessment
- **Discounts**: Security features, healthy lifestyle
- **Family Factors**: Dependents increase life insurance needs

## 🏗️ Technical Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS 4 with custom insurance theme
- **UI Components**: Custom components with Framer Motion
- **Authentication**: Supabase SSR integration
- **State Management**: React hooks and local storage

### Backend
- **Framework**: FastAPI with async support
- **Language**: Python 3.8+ with type hints
- **Validation**: Pydantic models for data validation
- **Server**: Uvicorn ASGI server
- **Documentation**: Automatic OpenAPI/Swagger docs
- **Architecture**: Modular design with separate engines

### Integration
- **API Communication**: RESTful JSON APIs
- **CORS**: Configured for local development
- **Error Handling**: Comprehensive error responses
- **Type Safety**: End-to-end TypeScript/Python typing

## 🔌 API Endpoints

### Health Assessment
- `POST /assess-comprehensive` - Complete insurance assessment
- `POST /quick-bmi` - Quick BMI calculation
- `POST /calculate-bmi` - Detailed BMI with risk factors

### Insurance Products
- `GET /insurance-types` - Available insurance products
- `POST /quick-quote` - Quick insurance quotes
- `GET /risk-factors` - Risk factor explanations

### Utilities
- `GET /health` - API health check
- `GET /docs` - Interactive API documentation

## 🎨 User Experience

### Authentication Flow
1. **WishInsured Landing** - Professional insurance branding
2. **Sign Up/Sign In** - Supabase authentication
3. **Welcome Dashboard** - Personalized user greeting

### Assessment Workflow
1. **Health Profile** - Medical background and BMI
2. **Property Details** - Property value and security
3. **Financial Status** - Income and family situation
4. **Recommendations** - Personalized insurance plans

### Insurance Recommendations
- **Priority Levels**: Critical, Required, Recommended, Optional
- **Risk Assessment**: Color-coded risk indicators
- **Premium Calculations**: Annual and monthly pricing
- **Coverage Details**: Features and exclusions
- **Explanation**: Clear reasoning for each recommendation

## 🚀 Deployment

### Development
```bash
# Frontend
npm run dev         # http://localhost:3000

# Backend  
cd backend
python start.py     # http://localhost:8001
```

### Production
```bash
# Frontend
npm run build && npm start

# Backend
cd backend
python run_server.py
```

## 📊 Insurance Products

### Health Insurance
- **Comprehensive medical coverage**
- **BMI-based risk assessment**
- **Medical condition factors**
- **Prescription coverage**
- **Preventive care included**

### Property Insurance
- **Home/condo protection**
- **Security system discounts**
- **Natural disaster coverage**
- **Personal liability**
- **Mortgage requirement compliance**

### Life Insurance
- **Income replacement**
- **Family protection**
- **Debt coverage**
- **Tax-free benefits**
- **Dependent-based calculations**

## 🎯 Key Achievements

✅ **BMI > 30 Logic**: Implemented exact cardiovascular risk assessment as requested  
✅ **Comprehensive Assessment**: Multi-step health, property, and financial evaluation  
✅ **Professional UI**: Insurance industry-standard design and branding  
✅ **Risk-Based Pricing**: Sophisticated premium calculation algorithms  
✅ **Type Safety**: Full TypeScript and Python type coverage  
✅ **API Documentation**: Complete interactive documentation  
✅ **Production Ready**: Scalable architecture and error handling  

## 🔮 Future Enhancements

- **AI Integration**: LangChain hooks already implemented
- **Advanced Analytics**: User behavior and risk modeling
- **Mobile App**: React Native version
- **Payment Integration**: Stripe/PayPal for premium payments
- **Document Upload**: Medical records and property documents
- **Chat Support**: Real-time customer service

## 📝 Notes

- **Environment Setup**: Requires Node.js 18+ and Python 3.8+
- **Database**: Supabase for authentication (configure .env.local)
- **Development**: Use `npm run dev` and `python start.py` for local development
- **API Testing**: Use http://localhost:8001/docs for interactive testing

---

**WishInsured** - Your personalized insurance advisor 🏥💼

*Built with ❤️ using modern web technologies* 