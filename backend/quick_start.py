#!/usr/bin/env python3
"""
Quick Start Backend Server for AI Insurance Platform
"""

import uvicorn
import sys
from pathlib import Path

# Add current directory to Python path
sys.path.append(str(Path(__file__).parent))

def main():
    """Start the backend server"""
    print("🏥 Starting AI Insurance Backend Server...")
    print("📡 Server will be available at: http://localhost:8001")
    print("📚 API Documentation: http://localhost:8001/docs")
    print("\n" + "="*50)
    
    try:
        # Try to import the main app
        try:
            from insurance_api import app
            server_module = "insurance_api:app"
        except ImportError:
            # Fallback to simple_server
            from simple_server import app
            server_module = "simple_server:app"
        
        # Run the server
        uvicorn.run(
            server_module,
            host="0.0.0.0",
            port=8001,
            reload=True,
            log_level="info"
        )
        
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        print("💡 Make sure you have installed requirements: pip install -r requirements.txt")
        sys.exit(1)

if __name__ == "__main__":
    main() 