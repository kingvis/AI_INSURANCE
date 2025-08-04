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
    // Fallback emoji if image fails to load
    return (
      <span 
        className={`inline-flex items-center justify-center text-xs bg-gray-100 rounded ${className}`}
        style={{ width: `${width}px`, height: `${height}px` }}
        title={countryName || countryCode}
      >
        🏳️
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
      onLoad={() => setLoading(false)}
      onError={() => {
        setError(true);
        setLoading(false);
      }}
    />
  );
} 