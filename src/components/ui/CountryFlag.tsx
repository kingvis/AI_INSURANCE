"use client";

import { useState } from 'react';
import { getCountryFlag } from '@/lib/insurance-api';

interface CountryFlagProps {
  countryCode: string;
  countryName?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeMap = {
  sm: { width: 16, height: 12 },
  md: { width: 20, height: 15 },
  lg: { width: 32, height: 24 },
  xl: { width: 40, height: 30 }
};

export function CountryFlag({ 
  countryCode, 
  countryName, 
  size = 'md', 
  className = '' 
}: CountryFlagProps) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const { width, height } = sizeMap[size];
  const flagUrl = getCountryFlag(countryCode);
  
  if (error) {
    // Fallback emoji if image fails to load with specific country flags
    const countryEmojis: Record<string, string> = {
      'US': '🇺🇸',
      'IN': '🇮🇳', 
      'UK': '🇬🇧',
      'CA': '🇨🇦',
      'AU': '🇦🇺',
      'DE': '🇩🇪'
    };
    
    return (
      <span 
        className={`inline-flex items-center justify-center bg-gray-100 rounded ${className}`}
        style={{ 
          width: `${width}px`, 
          height: `${height}px`,
          fontSize: `${Math.min(width * 0.7, height * 0.7)}px`,
          fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", "EmojiOne Color", "Android Emoji", sans-serif'
        }}
        title={countryName || countryCode}
      >
        {countryEmojis[countryCode] || '🏳️'}
      </span>
    );
  }

  return (
    <img
      src={flagUrl}
      alt={`${countryName || countryCode} flag`}
      width={width}
      height={height}
      className={`rounded border object-cover ${loading ? 'animate-pulse bg-gray-200' : ''} ${className}`}
      style={{ 
        filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))',
        minWidth: `${width}px`,
        minHeight: `${height}px`
      }}
      onLoad={() => {
        console.log(`✅ Flag loaded successfully for ${countryCode}: ${flagUrl}`);
        setLoading(false);
      }}
      onError={(e) => {
        console.error(`❌ Flag failed to load for ${countryCode}: ${flagUrl}`, e);
        setError(true);
        setLoading(false);
      }}
    />
  );
} 