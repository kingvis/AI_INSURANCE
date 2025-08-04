"use client";

import { motion } from 'framer-motion';
import { DollarSign, Banknote, Coins, CreditCard, Wallet } from 'lucide-react';
import { useCurrency } from '@/contexts/CurrencyContext';

interface CashElement {
  id: number;
  Icon: React.ComponentType<any>;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  duration: number;
  delay: number;
}

export function FlyingCashBackground() {
  const { homeCurrency } = useCurrency();
  
  // Create array of different money-related icons
  const moneyIcons = [DollarSign, Banknote, Coins, CreditCard, Wallet];
  
  // Generate random cash elements
  const cashElements: CashElement[] = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    Icon: moneyIcons[Math.floor(Math.random() * moneyIcons.length)],
    x: Math.random() * 100, // Random x position (0-100%)
    y: Math.random() * 100, // Random y position (0-100%)
    rotation: Math.random() * 360, // Random rotation
    scale: 0.5 + Math.random() * 1, // Random scale between 0.5 and 1.5
    duration: 15 + Math.random() * 20, // Animation duration 15-35 seconds
    delay: Math.random() * 10, // Random delay 0-10 seconds
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-green-50/30" />
      
      {/* Flying cash elements */}
      {cashElements.map((element) => (
        <motion.div
          key={`cash-element-${element.id}`}
          className="absolute opacity-10 text-green-600"
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
            transform: `scale(${element.scale})`,
          }}
          initial={{
            y: 0,
            x: 0,
            rotate: element.rotation,
            opacity: 0,
          }}
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            rotate: [element.rotation, element.rotation + 360],
            opacity: [0, 0.15, 0.1, 0.15, 0],
          }}
          transition={{
            duration: element.duration,
            delay: element.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <element.Icon className="w-8 h-8" />
        </motion.div>
      ))}

      {/* Currency symbols floating */}
      {Array.from({ length: 8 }, (_, i) => (
        <motion.div
          key={`currency-symbol-${i}`}
          className="absolute text-4xl font-bold opacity-5 text-blue-600"
          style={{
            left: `${10 + i * 12}%`,
            top: `${20 + (i % 3) * 25}%`,
          }}
          initial={{ y: 0, rotate: 0 }}
          animate={{
            y: [-30, 30, -30],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20 + i * 2,
            delay: i * 1.5,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <div className="text-6xl font-black text-blue-600/15">
            {homeCurrency?.symbol || '$'}
          </div>
        </motion.div>
      ))}

      {/* Large floating money background elements */}
      {Array.from({ length: 6 }, (_, i) => (
        <motion.div
          key={`large-floating-${i}`}
          className="absolute opacity-5"
          style={{
            left: `${15 + i * 15}%`,
            top: `${10 + (i % 2) * 40}%`,
          }}
          initial={{ scale: 0, rotate: 0 }}
          animate={{
            scale: [0.5, 1.2, 0.5],
            rotate: [0, 360],
            y: [-50, 50, -50],
          }}
          transition={{
            duration: 25 + i * 3,
            delay: i * 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {homeCurrency?.symbol || '$'}
          </div>
        </motion.div>
      ))}

      {/* Floating money bills */}
      {Array.from({ length: 12 }, (_, i) => (
        <motion.div
          key={`money-bill-${i}`}
          className="absolute opacity-8"
          style={{
            left: `${5 + i * 8}%`,
            top: `${5 + (i % 4) * 20}%`,
          }}
          initial={{ 
            y: typeof window !== 'undefined' ? window.innerHeight + 100 : 1000,
            rotate: Math.random() * 360,
            x: 0 
          }}
          animate={{
            y: -100,
            rotate: [0, 180, 360],
            x: [0, 30, -30, 0],
          }}
          transition={{
            duration: 12 + Math.random() * 8,
            delay: i * 1.2,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <div className="w-16 h-10 bg-gradient-to-r from-green-200 to-green-300 rounded border-2 border-green-400 flex items-center justify-center text-green-800 text-xs font-bold opacity-20">
            <div className="text-lg font-bold text-purple-600/20">
              {homeCurrency?.code || 'USD'}
            </div>
          </div>
        </motion.div>
      ))}

      {/* Sparkling coin effects */}
      {Array.from({ length: 15 }, (_, i) => (
        <motion.div
          key={`sparkling-coin-${i}`}
          className="absolute w-3 h-3 bg-yellow-400 rounded-full opacity-20"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 0.3, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            delay: Math.random() * 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Financial percentages floating */}
      {['+12.5%', '+8.2%', '+15.7%', '+6.9%', '+11.3%', '+4.8%'].map((percentage, i) => (
        <motion.div
          key={`financial-percentage-${i}-${percentage}`}
          className="absolute text-lg font-bold opacity-10 text-green-600"
          style={{
            left: `${20 + i * 15}%`,
            top: `${30 + (i % 2) * 40}%`,
          }}
          initial={{ y: 0, opacity: 0 }}
          animate={{
            y: [-20, 20, -20],
            opacity: [0, 0.15, 0],
          }}
          transition={{
            duration: 8 + i * 1.5,
            delay: i * 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {percentage}
        </motion.div>
      ))}

      {/* Financial terms floating */}
      {['INVEST', 'SAVE', 'GROW', 'FIRE', 'WEALTH'].map((term, i) => (
        <motion.div
          key={`financial-term-${i}-${term}`}
          className="absolute text-xs font-semibold opacity-8 text-blue-500"
          style={{
            left: `${10 + i * 20}%`,
            top: `${60 + (i % 3) * 15}%`,
          }}
          initial={{ rotate: 0, scale: 0 }}
          animate={{
            rotate: [0, 360],
            scale: [0.5, 1, 0.5],
            y: [-15, 15, -15],
          }}
          transition={{
            duration: 12 + i * 2,
            delay: i * 1.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {term}
        </motion.div>
      ))}

      {/* Mini stock chart patterns */}
      {Array.from({ length: 4 }, (_, i) => (
        <motion.div
          key={`stock-chart-${i}`}
          className="absolute opacity-5"
          style={{
            left: `${25 + i * 20}%`,
            top: `${15 + i * 20}%`,
          }}
          initial={{ scale: 0, rotate: 0 }}
          animate={{
            scale: [0.8, 1.2, 0.8],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 15 + i * 3,
            delay: i * 2.5,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <svg width="40" height="25" viewBox="0 0 40 25" className="text-blue-400">
            <polyline
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              points="0,20 10,15 20,8 30,12 40,5"
            />
          </svg>
        </motion.div>
      ))}

      {/* Floating credit cards */}
      {Array.from({ length: 6 }, (_, i) => (
        <motion.div
          key={`credit-card-${i}`}
          className="absolute opacity-6"
          style={{
            left: `${15 + i * 12}%`,
            top: `${40 + (i % 2) * 30}%`,
          }}
          initial={{ 
            rotateY: 0, 
            rotateX: 0,
            y: 0 
          }}
          animate={{
            rotateY: [0, 180, 360],
            rotateX: [0, 20, 0],
            y: [-10, 10, -10],
          }}
          transition={{
            duration: 10 + i * 2,
            delay: i * 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="w-12 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded opacity-25 flex items-center justify-center text-white text-xs font-bold">
            💳
          </div>
        </motion.div>
      ))}
    </div>
  );
} 