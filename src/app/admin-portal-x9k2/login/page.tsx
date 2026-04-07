'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginAction } from '../actions';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthError('');
    
    const result = await loginAction(password);
    
    if (result.success) {
      router.push('/admin-portal-x9k2');
    } else {
      setAuthError(result.error || 'Login failed');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center p-4">
      <div className="bg-[var(--color-surface)] rounded-sm border border-[var(--color-border)] p-8 max-w-md w-full animate-scale-in">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-accent to-amber-500 rounded-2xl flex items-center justify-center shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2-2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-primary" style={{ fontFamily: 'var(--font-heading)' }}>Admin Portal</h1>
          <p className="text-text-secondary text-sm mt-1">Enter your password to continue</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="input-field text-center text-lg"
              autoFocus
              disabled={isLoading}
            />
            {authError && (
              <p className="text-red-500 text-sm text-center mt-2">{authError}</p>
            )}
          </div>
          <button type="submit" className="btn-primary w-full text-lg py-4" disabled={isLoading}>
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
