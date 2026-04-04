'use client';

import { useState, useEffect } from 'react';

export default function AgeGate() {
  const [verified, setVerified] = useState<boolean | null>(null);
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    const checkAge = () => {
      const stored = localStorage.getItem('age-verified');
      if (stored === 'true') {
        setVerified(true);
      } else {
        setVerified(false);
      }
    };
    checkAge();
  }, []);

  if (verified === null || verified === true) return null;

  const handleVerify = () => {
    localStorage.setItem('age-verified', 'true');
    setVerified(true);
  };

  const handleDeny = () => {
    setDenied(true);
  };

  return (
    <div className="age-gate-overlay animate-fade-in">
      <div className="bg-white rounded-2xl p-8 md:p-12 max-w-md w-full mx-4 text-center animate-scale-in shadow-2xl">
        {/* Logo / Icon */}
        <div className="w-32 h-32 mx-auto mb-6 flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="/images/logo.png" 
            alt="Petrolia Liquor Store" 
            className="w-full h-auto object-contain animate-pulse-subtle mix-blend-multiply"
          />
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          Age Verification
        </h2>
        <p className="text-text-secondary mb-3 text-sm">
          Petrolia Liquor Store
        </p>

        {!denied ? (
          <>
            <div className="w-16 h-0.5 bg-accent mx-auto mb-6"></div>
            <p className="text-text-secondary mb-8 leading-relaxed">
              You must be of legal drinking age to enter this website. Please confirm that you are <strong className="text-primary">19 years of age or older</strong>.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleVerify}
                className="flex-1 btn-primary text-lg py-4"
              >
                Yes, I&apos;m 19+
              </button>
              <button
                onClick={handleDeny}
                className="flex-1 btn-outline text-lg py-4 border-gray-300 text-gray-500 hover:bg-gray-100 hover:text-gray-700 hover:border-gray-400"
              >
                No, I&apos;m Not
              </button>
            </div>
            <p className="text-xs text-text-light mt-6">
              By entering this site, you agree to our Terms of Service and Privacy Policy.
            </p>
          </>
        ) : (
          <div className="py-4">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-primary mb-2">Access Denied</h3>
            <p className="text-text-secondary">
              Sorry, you must be of legal drinking age to access this website.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
