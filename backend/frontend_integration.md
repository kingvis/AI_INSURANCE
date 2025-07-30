# 🔗 Frontend Integration Guide

## Connecting Next.js Frontend with Python AI Backend

This guide shows how to integrate the AI Health Copilot Python backend with your Next.js frontend.

## 🚀 Quick Setup

### 1. Start the Backend Server

```bash
# In backend directory
cd backend
python start.py
```

Server runs on: `http://localhost:8000`

### 2. Frontend API Integration

Add this to your Next.js frontend:

```typescript
// lib/health-api.ts
const API_BASE_URL = 'http://localhost:8000';

export interface HealthMetrics {
  weight: number;
  height: number;
  age: number;
  gender: string;
  activity_level: string;
  medical_conditions: string[];
}

export interface HealthAssessment {
  bmi: number;
  bmi_category: string;
  risk_level: string;
  cardiovascular_risk: string;
  recommendations: Array<{
    type: string;
    priority: string;
    title: string;
    description: string;
  }>;
  wellness_plan: {
    duration: string;
    goals: string[];
    phases: Array<{
      phase: number;
      duration: string;
      focus: string;
      activities: string[];
    }>;
  };
  ai_insights: string;
  timestamp: string;
}

// Analyze health metrics
export async function analyzeHealth(metrics: HealthMetrics): Promise<HealthAssessment> {
  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(metrics),
  });
  
  if (!response.ok) {
    throw new Error('Health analysis failed');
  }
  
  return response.json();
}

// Quick BMI check
export async function quickBMI(weight: number, height: number) {
  const response = await fetch(`${API_BASE_URL}/quick-bmi`, {
    method: 'POST',
    params: { weight, height },
  });
  
  return response.json();
}

// Chat with AI assistant
export async function chatWithAI(message: string, context?: any) {
  const response = await fetch(`${API_BASE_URL}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message, context }),
  });
  
  return response.json();
}
```

### 3. React Component Example

```tsx
// components/HealthAnalyzer.tsx
'use client';

import { useState } from 'react';
import { analyzeHealth, HealthMetrics, HealthAssessment } from '@/lib/health-api';

export default function HealthAnalyzer() {
  const [metrics, setMetrics] = useState<HealthMetrics>({
    weight: 0,
    height: 0,
    age: 0,
    gender: '',
    activity_level: 'moderate',
    medical_conditions: []
  });
  
  const [assessment, setAssessment] = useState<HealthAssessment | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await analyzeHealth(metrics);
      setAssessment(result);
    } catch (error) {
      console.error('Health analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">AI Health Analysis</h1>
      
      {/* Health Metrics Form */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            placeholder="Weight (kg)"
            value={metrics.weight || ''}
            onChange={(e) => setMetrics(prev => ({ ...prev, weight: Number(e.target.value) }))}
            className="p-3 border rounded-lg"
            required
          />
          <input
            type="number"
            placeholder="Height (cm)"
            value={metrics.height || ''}
            onChange={(e) => setMetrics(prev => ({ ...prev, height: Number(e.target.value) }))}
            className="p-3 border rounded-lg"
            required
          />
          <input
            type="number"
            placeholder="Age"
            value={metrics.age || ''}
            onChange={(e) => setMetrics(prev => ({ ...prev, age: Number(e.target.value) }))}
            className="p-3 border rounded-lg"
            required
          />
          <select
            value={metrics.gender}
            onChange={(e) => setMetrics(prev => ({ ...prev, gender: e.target.value }))}
            className="p-3 border rounded-lg"
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <select
          value={metrics.activity_level}
          onChange={(e) => setMetrics(prev => ({ ...prev, activity_level: e.target.value }))}
          className="w-full p-3 border rounded-lg"
        >
          <option value="sedentary">Sedentary</option>
          <option value="light">Light Activity</option>
          <option value="moderate">Moderate Activity</option>
          <option value="active">Active</option>
          <option value="very_active">Very Active</option>
        </select>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Analyzing...' : 'Analyze Health'}
        </button>
      </form>

      {/* Results Display */}
      {assessment && (
        <div className="space-y-6">
          {/* BMI Results */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Health Assessment</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">BMI</p>
                <p className="text-3xl font-bold text-blue-600">{assessment.bmi}</p>
              </div>
              <div>
                <p className="text-gray-600">Category</p>
                <p className="text-xl font-semibold">{assessment.bmi_category}</p>
              </div>
            </div>
            
            {/* Risk Level Alert */}
            {assessment.risk_level === 'high' && (
              <div className="mt-4 p-4 bg-red-100 border border-red-400 rounded-lg">
                <h3 className="font-bold text-red-800">⚠️ High Risk Detected</h3>
                <p className="text-red-700">{assessment.cardiovascular_risk}</p>
              </div>
            )}
          </div>

          {/* AI Insights */}
          <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-2">🤖 AI Insights</h3>
            <p className="text-gray-800">{assessment.ai_insights}</p>
          </div>

          {/* Recommendations */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">📋 Recommendations</h3>
            <div className="space-y-4">
              {assessment.recommendations.map((rec, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-1 text-xs font-bold rounded ${
                      rec.priority === 'critical' ? 'bg-red-100 text-red-800' :
                      rec.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {rec.priority.toUpperCase()}
                    </span>
                    <span className="text-sm text-gray-500">{rec.type}</span>
                  </div>
                  <h4 className="font-semibold">{rec.title}</h4>
                  <p className="text-gray-600 text-sm">{rec.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Wellness Plan */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">🎯 Wellness Plan</h3>
            <p className="text-gray-600 mb-4">Duration: {assessment.wellness_plan.duration}</p>
            
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Goals:</h4>
              <ul className="list-disc list-inside space-y-1">
                {assessment.wellness_plan.goals.map((goal, index) => (
                  <li key={index} className="text-gray-700">{goal}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Plan Phases:</h4>
              <div className="space-y-3">
                {assessment.wellness_plan.phases.map((phase, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <h5 className="font-medium">Phase {phase.phase}: {phase.focus}</h5>
                      <span className="text-sm text-gray-500">{phase.duration}</span>
                    </div>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {phase.activities.map((activity, actIndex) => (
                        <li key={actIndex}>• {activity}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

### 4. AI Chat Component

```tsx
// components/HealthChat.tsx
'use client';

import { useState } from 'react';
import { chatWithAI } from '@/lib/health-api';

export default function HealthChat() {
  const [messages, setMessages] = useState<Array<{text: string, isUser: boolean}>>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { text: userMessage, isUser: true }]);
    setLoading(true);

    try {
      const response = await chatWithAI(userMessage);
      setMessages(prev => [...prev, { text: response.response, isUser: false }]);
    } catch (error) {
      setMessages(prev => [...prev, { text: 'Sorry, I encountered an error. Please try again.', isUser: false }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">🤖 AI Health Assistant</h2>
      
      <div className="bg-gray-50 rounded-lg p-4 h-96 overflow-y-auto mb-4">
        {messages.length === 0 && (
          <p className="text-gray-500 text-center">
            Ask me about BMI, cardiovascular health, exercise, or nutrition!
          </p>
        )}
        
        {messages.map((message, index) => (
          <div key={index} className={`mb-3 ${message.isUser ? 'text-right' : 'text-left'}`}>
            <div className={`inline-block p-3 rounded-lg max-w-xs ${
              message.isUser 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-800 shadow'
            }`}>
              {message.text}
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="text-left mb-3">
            <div className="inline-block p-3 rounded-lg bg-white shadow">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your health..."
          className="flex-1 p-3 border rounded-lg"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}
```

## 🔧 Backend Configuration

### Environment Setup

Create `backend/.env`:

```bash
# Basic Configuration
DEBUG=true
HOST=0.0.0.0
PORT=8000

# CORS for Frontend
ALLOWED_ORIGINS=["http://localhost:3000","http://localhost:3001"]

# AI Features (Optional)
OPENAI_API_KEY=your_openai_api_key_here
ENABLE_AI_INSIGHTS=true

# Health Thresholds
BMI_OBESITY_THRESHOLD=30.0
BMI_OVERWEIGHT_THRESHOLD=25.0
```

### API Endpoints Summary

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/analyze` | POST | Full health analysis |
| `/quick-bmi` | POST | Quick BMI calculation |
| `/chat` | POST | AI health assistant |
| `/daily-tips/{risk_level}` | GET | Daily health tips |
| `/recommendations/{bmi_category}` | GET | Category recommendations |
| `/wellness-plan/{risk_level}` | GET | Wellness plans |
| `/health` | GET | API health check |
| `/docs` | GET | API documentation |

## 🚀 Production Deployment

### Backend Deployment

```bash
# Install production dependencies
pip install -r requirements.txt

# Run production server
python run_server.py --env production --workers 4

# Or with Gunicorn (Unix)
gunicorn -w 4 -k uvicorn.workers.UvicornWorker api_server:app
```

### Environment Variables for Production

```bash
ENVIRONMENT=production
DEBUG=false
SECRET_KEY=your_secure_secret_key
DATABASE_URL=postgresql://user:pass@localhost/healthdb
REDIS_URL=redis://localhost:6379
OPENAI_API_KEY=your_openai_api_key
```

## 🔗 Integration Flow

```mermaid
graph TD
    A[Next.js Frontend] -->|HTTP Request| B[Python Backend]
    B -->|BMI > 30?| C{Health Logic}
    C -->|Yes| D[High Risk Alert]
    C -->|No| E[Normal Assessment]
    D --> F[Wellness Plan]
    E --> F
    F -->|AI Enabled?| G{LangChain}
    G -->|Yes| H[AI Insights]
    G -->|No| I[Rule-based Response]
    H --> J[JSON Response]
    I --> J
    J -->|HTTP Response| A
```

This integration provides a seamless connection between your professional Next.js frontend and the intelligent Python backend with AI capabilities! 