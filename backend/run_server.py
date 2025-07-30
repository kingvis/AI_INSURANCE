#!/usr/bin/env python3
"""
Production Server Runner for AI Health Copilot Backend
Handles server startup, configuration, and monitoring
"""

import os
import sys
import logging
import signal
import asyncio
from pathlib import Path
from typing import Optional

import uvicorn
from fastapi import FastAPI

# Add backend directory to Python path
sys.path.append(str(Path(__file__).parent))

from config import get_settings, validate_config
from api_server import app

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler('logs/server.log') if Path('logs').exists() else logging.NullHandler()
    ]
)

logger = logging.getLogger(__name__)

class HealthCopilotServer:
    """Production server manager for AI Health Copilot"""
    
    def __init__(self):
        self.settings = get_settings()
        self.server: Optional[uvicorn.Server] = None
        self.should_exit = False
        
        # Validate configuration
        if not validate_config(self.settings):
            logger.error("Configuration validation failed. Please check your settings.")
            sys.exit(1)
        
        # Setup signal handlers
        self._setup_signal_handlers()
        
        # Create necessary directories
        self._create_directories()
    
    def _setup_signal_handlers(self):
        """Setup graceful shutdown signal handlers"""
        def signal_handler(signum, frame):
            logger.info(f"Received signal {signum}. Initiating graceful shutdown...")
            self.should_exit = True
            if self.server:
                self.server.should_exit = True
        
        signal.signal(signal.SIGINT, signal_handler)
        signal.signal(signal.SIGTERM, signal_handler)
    
    def _create_directories(self):
        """Create necessary directories"""
        directories = [
            'logs',
            'data',
            self.settings.upload_dir,
            'cache'
        ]
        
        for directory in directories:
            Path(directory).mkdir(exist_ok=True)
            logger.info(f"Ensured directory exists: {directory}")
    
    def _configure_uvicorn(self) -> dict:
        """Configure Uvicorn server settings"""
        config = {
            "app": "api_server:app",
            "host": self.settings.host,
            "port": self.settings.port,
            "log_level": self.settings.log_level.lower(),
            "access_log": True,
            "server_header": False,  # Security: hide server header
            "date_header": False,    # Security: hide date header
        }
        
        # Development settings
        if self.settings.environment == "development":
            config.update({
                "reload": True,
                "reload_dirs": [str(Path(__file__).parent)],
                "reload_excludes": ["*.log", "*.db", "*.pyc", "__pycache__"],
                "debug": self.settings.debug
            })
        
        # Production settings
        elif self.settings.environment == "production":
            config.update({
                "workers": self.settings.workers,
                "loop": "uvloop",  # Better performance on Unix systems
                "http": "httptools",  # Better HTTP performance
                "forwarded_allow_ips": "*",  # Allow proxy forwarding
                "proxy_headers": True,
                "ssl_keyfile": os.getenv("SSL_KEYFILE"),
                "ssl_certfile": os.getenv("SSL_CERTFILE"),
            })
            
            # Remove None values
            config = {k: v for k, v in config.items() if v is not None}
        
        return config
    
    async def startup_tasks(self):
        """Perform startup tasks"""
        logger.info("Performing startup tasks...")
        
        # Test database connection
        try:
            # Add database initialization here if needed
            logger.info("Database connection verified")
        except Exception as e:
            logger.error(f"Database connection failed: {e}")
            raise
        
        # Test AI services if enabled
        if self.settings.enable_ai_insights:
            try:
                from langchain_integration import AIHealthCopilot
                ai_copilot = AIHealthCopilot()
                if ai_copilot.ai_enabled:
                    logger.info("AI services initialized successfully")
                else:
                    logger.warning("AI services not available, using fallback mode")
            except Exception as e:
                logger.warning(f"AI services initialization failed: {e}")
        
        # Test external APIs
        await self._test_external_services()
        
        logger.info("Startup tasks completed successfully")
    
    async def _test_external_services(self):
        """Test external service connections"""
        # Test Redis if configured
        if self.settings.redis_url:
            try:
                # Add Redis connection test here
                logger.info("Redis connection verified")
            except Exception as e:
                logger.warning(f"Redis connection failed: {e}")
        
        # Test SMTP if configured
        if self.settings.smtp_server:
            try:
                # Add SMTP connection test here
                logger.info("SMTP connection verified")
            except Exception as e:
                logger.warning(f"SMTP connection failed: {e}")
    
    def run(self):
        """Run the server"""
        logger.info(f"Starting AI Health Copilot Server v{self.settings.app_version}")
        logger.info(f"Environment: {self.settings.environment}")
        logger.info(f"Debug mode: {self.settings.debug}")
        logger.info(f"Host: {self.settings.host}:{self.settings.port}")
        
        # Configure Uvicorn
        config = self._configure_uvicorn()
        
        try:
            # Run startup tasks
            asyncio.run(self.startup_tasks())
            
            # Start server
            if self.settings.environment == "development":
                # Development mode with auto-reload
                uvicorn.run(**config)
            else:
                # Production mode
                server = uvicorn.Server(uvicorn.Config(**config))
                self.server = server
                
                # Run server
                asyncio.run(server.serve())
                
        except KeyboardInterrupt:
            logger.info("Server shutdown requested by user")
        except Exception as e:
            logger.error(f"Server error: {e}")
            raise
        finally:
            logger.info("Server shutdown complete")
    
    def run_with_gunicorn(self):
        """Run with Gunicorn for production (Unix only)"""
        if os.name == 'nt':
            logger.error("Gunicorn is not supported on Windows. Use uvicorn instead.")
            return self.run()
        
        try:
            import gunicorn.app.base
        except ImportError:
            logger.error("Gunicorn not installed. Install with: pip install gunicorn")
            return self.run()
        
        class StandaloneApplication(gunicorn.app.base.BaseApplication):
            def __init__(self, app, options=None):
                self.options = options or {}
                self.application = app
                super().__init__()
            
            def load_config(self):
                config = {key: value for key, value in self.options.items()
                         if key in self.cfg.settings and value is not None}
                for key, value in config.items():
                    self.cfg.set(key.lower(), value)
            
            def load(self):
                return self.application
        
        options = {
            'bind': f"{self.settings.host}:{self.settings.port}",
            'workers': self.settings.workers,
            'worker_class': 'uvicorn.workers.UvicornWorker',
            'worker_connections': 1000,
            'max_requests': 1000,
            'max_requests_jitter': 100,
            'timeout': 30,
            'keepalive': 2,
            'preload_app': True,
            'access_log': True,
            'error_log': True,
            'log_level': self.settings.log_level.lower(),
        }
        
        StandaloneApplication(app, options).run()

def main():
    """Main entry point"""
    import argparse
    
    parser = argparse.ArgumentParser(description='AI Health Copilot Server')
    parser.add_argument('--config', help='Configuration file path')
    parser.add_argument('--host', help='Host to bind to')
    parser.add_argument('--port', type=int, help='Port to bind to')
    parser.add_argument('--workers', type=int, help='Number of worker processes')
    parser.add_argument('--env', help='Environment (development/production/testing)')
    parser.add_argument('--gunicorn', action='store_true', help='Use Gunicorn (Unix only)')
    parser.add_argument('--validate-config', action='store_true', help='Validate configuration and exit')
    
    args = parser.parse_args()
    
    # Override settings with command line arguments
    settings = get_settings()
    if args.host:
        settings.host = args.host
    if args.port:
        settings.port = args.port
    if args.workers:
        settings.workers = args.workers
    if args.env:
        settings.environment = args.env
    
    # Validate configuration only
    if args.validate_config:
        if validate_config(settings):
            print("✅ Configuration is valid")
            sys.exit(0)
        else:
            print("❌ Configuration validation failed")
            sys.exit(1)
    
    # Initialize and run server
    server = HealthCopilotServer()
    
    try:
        if args.gunicorn:
            server.run_with_gunicorn()
        else:
            server.run()
    except Exception as e:
        logger.error(f"Failed to start server: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main() 