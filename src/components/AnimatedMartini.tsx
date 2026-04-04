'use client';

import React from 'react';

export default function AnimatedMartini() {
  return (
    <div className="relative w-[40px] h-[40px] md:w-[50px] md:h-[50px] flex items-center justify-center text-[var(--color-primary)]">
      <style>{`
        @keyframes pourStream {
          0% { stroke-dashoffset: 30; opacity: 0; }
          5% { stroke-dashoffset: 30; opacity: 1; }
          15% { stroke-dashoffset: 0; opacity: 1; }
          25% { stroke-dashoffset: -30; opacity: 1; }
          30% { stroke-dashoffset: -30; opacity: 0; }
          100% { stroke-dashoffset: 30; opacity: 0; }
        }
        @keyframes fillUp {
          0% { d: path('M 15.5 21 L 16.5 21 L 16 22 Z'); opacity: 0; }
          15% { d: path('M 15.5 21 L 16.5 21 L 16 22 Z'); opacity: 1; }
          35% { d: path('M 4.5 10.5 Q 16 12 27.5 10.5 L 16 22 Z'); opacity: 1; }
          100% { d: path('M 4.5 10.5 Q 16 12 27.5 10.5 L 16 22 Z'); opacity: 1; }
        }
        @keyframes dropOlive {
          0% { transform: translateY(-40px) rotate(15deg); opacity: 0; }
          25% { transform: translateY(-40px) rotate(15deg); opacity: 0; }
          40% { transform: translateY(0px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(0px) rotate(0deg); opacity: 1; }
        }
        @keyframes splash {
          0% { transform: scale(0); opacity: 0; }
          39% { transform: scale(0); opacity: 0; }
          40% { transform: scale(1) translateY(-5px); opacity: 1; }
          50% { transform: scale(1.5) translateY(-10px); opacity: 0; }
          100% { transform: scale(0); opacity: 0; }
        }
      `}</style>
      
      <svg viewBox="0 0 32 32" className="w-full h-full" overflow="visible">
        {/* Glass Stem and Base */}
        <path d="M 16 22 L 16 30 M 11 30 L 21 30" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        
        {/* Poured Liquid (Stream) */}
        <line x1="16" y1="-8" x2="16" y2="20" stroke="#facc15" strokeWidth="2" strokeLinecap="round" 
              style={{
                strokeDasharray: 30,
                strokeDashoffset: 30,
                animation: 'pourStream 4s infinite ease-in'
              }} 
        />
        
        {/* Liquid Inside Glass */}
        <path fill="#facc15" opacity="0.85"
              style={{ animation: 'fillUp 4s forwards infinite ease-out' }} 
        />
        
        {/* Glass Bowl Outline */}
        <path d="M 2 8 L 16 22 L 30 8 Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        
        {/* Splash drops */}
        <g style={{ animation: 'splash 4s infinite ease-out', transformOrigin: '16px 12px' }} fill="#facc15">
          <circle cx="12" cy="10" r="1" />
          <circle cx="20" cy="9" r="1.5" />
          <circle cx="16" cy="7" r="1" />
        </g>
        
        {/* Olive & Toothpick */}
        <g style={{ animation: 'dropOlive 4s forwards infinite cubic-bezier(0.34, 1.56, 0.64, 1)', transformOrigin: '16px 12px' }}>
          <line x1="22" y1="2" x2="13" y2="15" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
          <circle cx="15" cy="12" r="3.5" fill="#84cc16" stroke="currentColor" strokeWidth="1" />
          <circle cx="16" cy="11" r="1.2" fill="#ef4444" /> {/* Pimento */}
        </g>
        
        {/* Front Glass reflection highlight */}
        <path d="M 6 11 L 14 19" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
      </svg>
    </div>
  );
}
