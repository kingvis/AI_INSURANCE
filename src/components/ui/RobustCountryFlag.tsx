"use client";

import { useState, useEffect } from 'react';

interface RobustCountryFlagProps {
  countryCode: string;
  countryName?: string;
  size?: number;
  className?: string;
}

export function RobustCountryFlag({ 
  countryCode, 
  countryName, 
  size = 40, 
  className = '' 
}: RobustCountryFlagProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Multiple flag sources with fallbacks
  const flagSources = [
    `https://flagcdn.com/w${size}/${countryCode.toLowerCase() === 'uk' ? 'gb' : countryCode.toLowerCase()}.png`,
    `https://flagpedia.net/data/flags/w${size}/${countryCode.toLowerCase() === 'uk' ? 'gb' : countryCode.toLowerCase()}.png`,
    `https://www.countryflags.io/${countryCode.toLowerCase() === 'uk' ? 'gb' : countryCode.toLowerCase()}/flat/${size}.png`
  ];
  
  // Emoji fallbacks with improved rendering
  const countryEmojis: Record<string, string> = {
    'US': '🇺🇸',
    'IN': '🇮🇳', 
    'UK': '🇬🇧',
    'GB': '🇬🇧',
    'CA': '🇨🇦',
    'AU': '🇦🇺',
    'DE': '🇩🇪'
  };
  
  const [currentSource, setCurrentSource] = useState(0);
  
  useEffect(() => {
    setImageError(false);
    setImageLoaded(false);
    setCurrentSource(0);
  }, [countryCode]);
  
  const handleImageError = () => {
    if (currentSource < flagSources.length - 1) {
      setCurrentSource(prev => prev + 1);
      setImageError(false);
    } else {
      setImageError(true);
    }
  };
  
  if (imageError) {
    // Final fallback: high-quality emoji with proper CSS
    return (
      <div 
        className={`inline-flex items-center justify-center bg-blue-50 rounded border-2 border-blue-200 ${className}`}
        style={{ 
          width: `${size}px`, 
          height: `${size * 0.75}px`,
          fontSize: `${size * 0.6}px`,
          fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", "Android Emoji", "Twemoji Mozilla", sans-serif',
          fontFeatureSettings: '"liga" 1, "kern" 1',
          textRendering: 'optimizeLegibility',
          WebkitFontSmoothing: 'antialiased'
        }}
        title={countryName || countryCode}
      >
        <span style={{ 
          display: 'block',
          lineHeight: '1',
          textAlign: 'center'
        }}>
          {countryEmojis[countryCode.toUpperCase()] || '🏳️'}
        </span>
      </div>
    );
  }
  
  return (
    <div className={`inline-block ${className}`} style={{ width: `${size}px`, height: `${size * 0.75}px` }}>
      <img
        src={flagSources[currentSource]}
        alt={`${countryName || countryCode} flag`}
        width={size}
        height={size * 0.75}
        className="rounded border object-cover shadow-sm"
        style={{ 
          width: `${size}px`,
          height: `${size * 0.75}px`,
          objectFit: 'cover'
        }}
        onLoad={() => {
          console.log(`✅ Flag loaded: ${countryCode} from source ${currentSource + 1}`);
          setImageLoaded(true);
        }}
        onError={handleImageError}
      />
      {!imageLoaded && !imageError && (
        <div className="animate-pulse bg-gray-200 rounded" style={{ width: `${size}px`, height: `${size * 0.75}px` }} />
      )}
    </div>
  );
} 