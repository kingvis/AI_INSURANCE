"""
Configuration Management for AI Health Copilot Backend
Handles environment variables, API keys, and application settings
"""

import os
from typing import Optional, List
from pydantic import BaseSettings, Field
from pathlib import Path

class Settings(BaseSettings):
    """Application settings with environment variable support"""
    
    # Application Settings
    app_name: str = Field(default="AI Health Copilot", env="APP_NAME")
    app_version: str = Field(default="1.0.0", env="APP_VERSION")
    debug: bool = Field(default=False, env="DEBUG")
    environment: str = Field(default="development", env="ENVIRONMENT")
    
    # Server Configuration
    host: str = Field(default="0.0.0.0", env="HOST")
    port: int = Field(default=8000, env="PORT")
    workers: int = Field(default=1, env="WORKERS")
    
    # Database Configuration
    database_url: Optional[str] = Field(default=None, env="DATABASE_URL")
    redis_url: Optional[str] = Field(default="redis://localhost:6379", env="REDIS_URL")
    
    # Security Settings
    secret_key: str = Field(default="your-secret-key-change-in-production", env="SECRET_KEY")
    algorithm: str = Field(default="HS256", env="ALGORITHM")
    access_token_expire_minutes: int = Field(default=30, env="ACCESS_TOKEN_EXPIRE_MINUTES")
    
    # AI/LangChain Configuration
    openai_api_key: Optional[str] = Field(default=None, env="OPENAI_API_KEY")
    langchain_api_key: Optional[str] = Field(default=None, env="LANGCHAIN_API_KEY")
    langchain_project: Optional[str] = Field(default=None, env="LANGCHAIN_PROJECT")
    
    # Health Copilot Specific Settings
    enable_ai_insights: bool = Field(default=True, env="ENABLE_AI_INSIGHTS")
    max_chat_history: int = Field(default=50, env="MAX_CHAT_HISTORY")
    
    # API Rate Limiting
    rate_limit_requests: int = Field(default=100, env="RATE_LIMIT_REQUESTS")
    rate_limit_period: int = Field(default=60, env="RATE_LIMIT_PERIOD")  # seconds
    
    # Logging Configuration
    log_level: str = Field(default="INFO", env="LOG_LEVEL")
    log_file: Optional[str] = Field(default=None, env="LOG_FILE")
    
    # CORS Settings
    allowed_origins: List[str] = Field(
        default=["http://localhost:3000", "http://localhost:3001"],
        env="ALLOWED_ORIGINS"
    )
    
    # Health Thresholds (configurable business logic)
    bmi_obesity_threshold: float = Field(default=30.0, env="BMI_OBESITY_THRESHOLD")
    bmi_overweight_threshold: float = Field(default=25.0, env="BMI_OVERWEIGHT_THRESHOLD")
    high_risk_age_male: int = Field(default=45, env="HIGH_RISK_AGE_MALE")
    high_risk_age_female: int = Field(default=55, env="HIGH_RISK_AGE_FEMALE")
    
    # External API Configurations
    nutrition_api_key: Optional[str] = Field(default=None, env="NUTRITION_API_KEY")
    fitness_api_key: Optional[str] = Field(default=None, env="FITNESS_API_KEY")
    
    # Email Configuration (for notifications)
    smtp_server: Optional[str] = Field(default=None, env="SMTP_SERVER")
    smtp_port: int = Field(default=587, env="SMTP_PORT")
    smtp_username: Optional[str] = Field(default=None, env="SMTP_USERNAME")
    smtp_password: Optional[str] = Field(default=None, env="SMTP_PASSWORD")
    
    # File Storage
    upload_dir: str = Field(default="uploads", env="UPLOAD_DIR")
    max_file_size: int = Field(default=10485760, env="MAX_FILE_SIZE")  # 10MB
    
    # Monitoring and Analytics
    enable_analytics: bool = Field(default=True, env="ENABLE_ANALYTICS")
    prometheus_port: int = Field(default=9090, env="PROMETHEUS_PORT")
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False

class DatabaseConfig:
    """Database-specific configuration"""
    
    def __init__(self, settings: Settings):
        self.settings = settings
    
    @property
    def url(self) -> str:
        """Get database URL with fallback"""
        if self.settings.database_url:
            return self.settings.database_url
        
        # Default SQLite for development
        db_path = Path("data/health_copilot.db")
        db_path.parent.mkdir(exist_ok=True)
        return f"sqlite:///{db_path}"
    
    @property
    def echo(self) -> bool:
        """Enable SQL logging in debug mode"""
        return self.settings.debug

class LangChainConfig:
    """LangChain-specific configuration"""
    
    def __init__(self, settings: Settings):
        self.settings = settings
    
    @property
    def is_enabled(self) -> bool:
        """Check if LangChain is properly configured"""
        return (
            self.settings.openai_api_key is not None and
            self.settings.enable_ai_insights
        )
    
    @property
    def model_name(self) -> str:
        """Default model for health analysis"""
        return "gpt-3.5-turbo"
    
    @property
    def temperature(self) -> float:
        """Model temperature for consistent health advice"""
        return 0.1  # Low temperature for consistent medical advice
    
    @property
    def max_tokens(self) -> int:
        """Maximum tokens for response"""
        return 1000

class HealthConfig:
    """Health calculation and assessment configuration"""
    
    def __init__(self, settings: Settings):
        self.settings = settings
    
    @property
    def bmi_categories(self) -> dict:
        """BMI category thresholds"""
        return {
            "underweight": 18.5,
            "normal": 25.0,
            "overweight": self.settings.bmi_overweight_threshold,
            "obese": self.settings.bmi_obesity_threshold
        }
    
    @property
    def risk_factors(self) -> dict:
        """Risk factor definitions"""
        return {
            "age_male": self.settings.high_risk_age_male,
            "age_female": self.settings.high_risk_age_female,
            "sedentary_activities": ["sedentary", "light"],
            "high_risk_conditions": [
                "diabetes", "hypertension", "heart_disease", 
                "high_cholesterol", "stroke", "obesity"
            ]
        }

class SecurityConfig:
    """Security and authentication configuration"""
    
    def __init__(self, settings: Settings):
        self.settings = settings
    
    @property
    def password_context(self) -> dict:
        """Password hashing configuration"""
        return {
            "schemes": ["bcrypt"],
            "deprecated": "auto"
        }
    
    @property
    def cors_config(self) -> dict:
        """CORS configuration"""
        return {
            "allow_origins": self.settings.allowed_origins,
            "allow_credentials": True,
            "allow_methods": ["*"],
            "allow_headers": ["*"]
        }

def get_settings() -> Settings:
    """Get application settings (cached)"""
    return Settings()

def get_database_config(settings: Settings = None) -> DatabaseConfig:
    """Get database configuration"""
    if settings is None:
        settings = get_settings()
    return DatabaseConfig(settings)

def get_langchain_config(settings: Settings = None) -> LangChainConfig:
    """Get LangChain configuration"""
    if settings is None:
        settings = get_settings()
    return LangChainConfig(settings)

def get_health_config(settings: Settings = None) -> HealthConfig:
    """Get health calculation configuration"""
    if settings is None:
        settings = get_settings()
    return HealthConfig(settings)

def get_security_config(settings: Settings = None) -> SecurityConfig:
    """Get security configuration"""
    if settings is None:
        settings = get_settings()
    return SecurityConfig(settings)

# Environment-specific configurations
class DevelopmentConfig(Settings):
    """Development environment configuration"""
    debug: bool = True
    log_level: str = "DEBUG"
    environment: str = "development"

class ProductionConfig(Settings):
    """Production environment configuration"""
    debug: bool = False
    log_level: str = "INFO"
    environment: str = "production"
    workers: int = 4

class TestingConfig(Settings):
    """Testing environment configuration"""
    debug: bool = True
    log_level: str = "DEBUG"
    environment: str = "testing"
    database_url: str = "sqlite:///test.db"

def get_config_by_environment(env: str = None) -> Settings:
    """Get configuration based on environment"""
    if env is None:
        env = os.getenv("ENVIRONMENT", "development")
    
    config_map = {
        "development": DevelopmentConfig,
        "production": ProductionConfig,
        "testing": TestingConfig
    }
    
    config_class = config_map.get(env, DevelopmentConfig)
    return config_class()

# Validation functions
def validate_config(settings: Settings) -> bool:
    """Validate critical configuration settings"""
    issues = []
    
    # Check required settings for production
    if settings.environment == "production":
        if settings.secret_key == "your-secret-key-change-in-production":
            issues.append("SECRET_KEY must be changed in production")
        
        if not settings.database_url:
            issues.append("DATABASE_URL is required in production")
    
    # Check AI configuration if enabled
    if settings.enable_ai_insights and not settings.openai_api_key:
        issues.append("OPENAI_API_KEY is required when AI insights are enabled")
    
    # Check health thresholds
    if settings.bmi_obesity_threshold <= settings.bmi_overweight_threshold:
        issues.append("BMI obesity threshold must be higher than overweight threshold")
    
    if issues:
        print("Configuration Issues Found:")
        for issue in issues:
            print(f"  - {issue}")
        return False
    
    return True

# Export main settings instance
settings = get_settings()

# Validate configuration on import
if not validate_config(settings):
    print("Warning: Configuration validation failed. Please check your settings.") 