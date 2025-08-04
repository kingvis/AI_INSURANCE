# 🏦 AI Insurance & Wealth Comparison Platform

> **A comprehensive cross-country wealth and savings comparison platform with AI-powered insurance assessment**

[![Next.js](https://img.shields.io/badge/Next.js-15.4.5-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Python-green)](https://fastapi.tiangolo.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC)](https://tailwindcss.com/)

## 🌟 Features

### 💰 **Multi-Country Wealth Comparison**
- Compare savings and wealth opportunities across 6 countries: USA, India, UK, Canada, Australia, Germany
- Real-time currency conversion with live exchange rates
- Home country baseline comparison with purchasing power analysis
- Country-specific economic insights and recommendations

### 🏥 **AI-Powered Insurance Assessment**
- **3-Step Comprehensive Assessment**: Health Profile → Property Details → Financial Profile
- **Personalized AI Analysis**: Custom insurance recommendations based on user data
- **Country-Specific Pricing**: Localized insurance costs and coverage options
- **Smart Risk Assessment**: AI-driven risk evaluation and mitigation strategies
- **Retake Functionality**: Users can restart assessments anytime

### 📊 **Advanced Financial Tools**
- **Savings Calculator**: Project savings growth with country-specific interest rates
- **FIRE Goals Planning**: Financial Independence calculations tailored to each country
- **Investment Projections**: Risk-adjusted returns based on local markets
- **Currency-Aware Displays**: All amounts shown in user's home currency

### 🤖 **Staff Business Intelligence**
- **AI-Powered Customer Analysis**: Automated customer profiling and segmentation
- **Product Recommendations**: Smart suggestions based on customer data
- **Market Insights**: Country-specific market analysis and trends
- **Performance Metrics**: Customer lifetime value and risk assessments

## 🚀 Live Demo

🌐 **Frontend**: [http://localhost:3001](http://localhost:3001)
🔧 **Backend API**: [http://localhost:8001](http://localhost:8001)

## 🛠 Technology Stack

### **Frontend**
- **Next.js 15.4.5** - React framework with App Router
- **React 18** - Component-based UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **Lucide React** - Beautiful icon system

### **Backend**
- **FastAPI** - Modern Python web framework
- **Uvicorn** - ASGI server for Python
- **Pydantic** - Data validation and serialization
- **Python 3.13** - Latest Python runtime

### **Key Features**
- **Currency Context Management** - Global state for currency conversion
- **Offline SVG Flags** - Base64-encoded flags for reliable display
- **Auto-Save Functionality** - Progress preservation during assessments
- **Business Intelligence Engine** - AI-powered customer analysis
- **Responsive Design** - Mobile-first approach

## 📦 Installation & Setup

### **Prerequisites**
- Node.js 18+ and npm
- Python 3.11+
- Git

### **1. Clone the Repository**
```bash
git clone https://github.com/kingvis/AI_INS.git
cd AI_INS
```

### **2. Frontend Setup**
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```
The frontend will be available at `http://localhost:3000`

### **3. Backend Setup**
```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install fastapi uvicorn python-multipart

# Start the backend server
python insurance_api.py
```
The API will be available at `http://localhost:8001`

## 🎯 Usage Guide

### **For End Users**
1. **Select Your Home Country** - Choose your base country for currency calculations
2. **Explore Financial Tools** - Use savings calculator, FIRE goals, or insurance assessment
3. **Complete Assessments** - Follow the 3-step process for personalized recommendations
4. **Compare Countries** - See how your wealth translates across different countries
5. **View AI Reports** - Get comprehensive analysis and recommendations

### **For Staff/Administrators**
1. **Access Staff Dashboard** - Use the business intelligence tools
2. **Customer Analysis** - View AI-powered customer insights
3. **Generate Reports** - Create detailed customer profiles and recommendations
4. **Market Analysis** - Understand country-specific trends and opportunities

## 🌍 Supported Countries

| Country | Currency | Code |
|---------|----------|------|
| 🇺🇸 United States | USD ($) | US |
| 🇮🇳 India | INR (₹) | IN |
| 🇬🇧 United Kingdom | GBP (£) | UK |
| 🇨🇦 Canada | CAD (C$) | CA |
| 🇦🇺 Australia | AUD (A$) | AU |
| 🇩🇪 Germany | EUR (€) | DE |

## 🔧 Configuration

### **Environment Variables**
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8001
NEXT_PUBLIC_ENABLE_ANALYTICS=false
```

### **Currency Configuration**
Exchange rates and country data can be configured in:
- `src/lib/currency-service.ts` - Frontend currency logic
- `backend/global_finance_engine.py` - Backend financial calculations

## 📁 Project Structure

```
AI_INS/
├── src/
│   ├── app/                 # Next.js App Router pages
│   ├── components/          # React components
│   │   ├── advisor/         # Financial advisor components
│   │   ├── auth/            # Authentication components
│   │   ├── fire/            # FIRE goals components
│   │   ├── insurance/       # Insurance assessment
│   │   ├── savings/         # Savings calculator
│   │   └── ui/              # Reusable UI components
│   ├── contexts/            # React contexts
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility libraries
│   └── types/               # TypeScript type definitions
├── backend/
│   ├── insurance_api.py     # Main FastAPI application
│   ├── global_finance_engine.py # Financial calculations
│   ├── business_intelligence.py # AI customer analysis
│   └── requirements.txt     # Python dependencies
└── public/                  # Static assets
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- 📧 Email: support@ai-insurance.com
- 💬 Issues: [GitHub Issues](https://github.com/kingvis/AI_INS/issues)
- 📖 Documentation: [Wiki](https://github.com/kingvis/AI_INS/wiki)

---

**Built with ❤️ by the AI Insurance Team**

*Making financial planning accessible across borders* 🌍
