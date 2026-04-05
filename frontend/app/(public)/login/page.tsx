'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Phone, Eye, EyeOff, Shield, ArrowRight, Users, Heart, Building2, Settings, Chrome } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';

type AuthStep = 'login-method' | 'email-login' | 'signup';
type UserRole = 'user' | 'counsellor' | 'volunteer' | 'institution' | 'admin';

export default function LoginPage() {
  const router = useRouter();
  const { user, loginWithGoogle, loginWithEmail, registerWithEmail, setRole, loading } = useAuth();

  const [step, setStep] = useState<AuthStep>('login-method');
  const [role, setLocalRole] = useState<UserRole>('user');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const roleRoutes: Record<UserRole, string> = {
    user: '/dashboard',
    counsellor: '/counsellor-dashboard',
    volunteer: '/volunteer',
    institution: '/institution',
    admin: '/admin',
  };

  // Redirect if already logged in
  useEffect(() => {
    if (user && !loading) {
      const savedRole = localStorage.getItem('jeewan_role') as UserRole || 'user';
      router.push(roleRoutes[savedRole] || '/dashboard');
    }
  }, [user, loading]);

  const handleRoleSelect = (r: UserRole) => {
    setLocalRole(r);
    setRole(r);
  };

  const handleGoogleLogin = async () => {
    setError('');
    setIsLoading(true);
    try {
      setRole(role);
      await loginWithGoogle();
      router.push(roleRoutes[role]);
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-in popup was closed');
      } else {
        setError(err.message || 'Google sign-in failed');
      }
    }
    setIsLoading(false);
  };

  const handleEmailLogin = async () => {
    setError('');
    if (!email || !password) { setError('Please enter email and password'); return; }
    setIsLoading(true);
    try {
      setRole(role);
      await loginWithEmail(email, password);
      router.push(roleRoutes[role]);
    } catch (err: any) {
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        setError('Invalid email or password');
      } else if (err.code === 'auth/user-not-found') {
        setError('No account found with this email');
      } else {
        setError(err.message || 'Login failed');
      }
    }
    setIsLoading(false);
  };

  const handleSignup = async () => {
    setError('');
    if (!name) { setError('Please enter your name'); return; }
    if (!email) { setError('Please enter your email'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setIsLoading(true);
    try {
      setRole(role);
      await registerWithEmail(email, password, name);
      router.push(roleRoutes[role]);
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists');
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak');
      } else {
        setError(err.message || 'Registration failed');
      }
    }
    setIsLoading(false);
  };

  const inputClass = "w-full p-3.5 rounded-xl border border-border bg-card text-foreground text-sm focus:border-jeewan-calm focus:ring-2 focus:ring-jeewan-calm/20 transition";

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-jeewan-calm border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-jeewan-calm rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg text-foreground">JEE</span>
              <span className="font-bold text-lg text-jeewan-nature">WAN</span>
            </div>
          </Link>
          <h1 className="text-xl font-bold text-foreground mt-4 mb-1">
            {step === 'signup' ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-sm text-jeewan-muted">
            {step === 'login-method' ? 'Choose how you\'d like to sign in' : step === 'signup' ? 'Join the movement' : 'Sign in with your email'}
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          {error && (
            <div className="mb-4 p-3 bg-jeewan-warn-light border border-jeewan-warn/30 text-jeewan-warn rounded-lg text-xs font-medium">
              {error}
            </div>
          )}

          {step === 'login-method' && (
            <div className="space-y-3">
              {/* Role Selector */}
              <div>
                <p className="text-[10px] font-bold text-jeewan-muted uppercase tracking-wider mb-2">I am a:</p>
                <div className="grid grid-cols-3 gap-1.5 mb-3">
                  {[
                    { key: 'user' as UserRole, label: 'User', icon: Users },
                    { key: 'counsellor' as UserRole, label: 'Counsellor', icon: Shield },
                    { key: 'volunteer' as UserRole, label: 'Volunteer', icon: Heart },
                    { key: 'institution' as UserRole, label: 'College/NGO', icon: Building2 },
                    { key: 'admin' as UserRole, label: 'Admin', icon: Settings },
                  ].map((r) => {
                    const Icon = r.icon;
                    return (
                      <button
                        key={r.key}
                        onClick={() => handleRoleSelect(r.key)}
                        className={`flex flex-col items-center gap-1 py-2 px-1 rounded-lg text-[10px] font-bold transition ${
                          role === r.key
                            ? 'bg-jeewan-calm text-white'
                            : 'bg-jeewan-surface dark:bg-muted text-jeewan-muted hover:text-foreground'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {r.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Google Sign-In — Primary CTA */}
              <button
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 h-12 rounded-xl bg-white dark:bg-card border-2 border-border text-foreground font-semibold text-sm hover:border-jeewan-calm hover:shadow-md transition disabled:opacity-60"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                {isLoading ? 'Signing in...' : 'Continue with Google'}
              </button>

              <div className="relative my-3">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
                <div className="relative flex justify-center text-xs"><span className="px-3 bg-card text-jeewan-muted">or</span></div>
              </div>

              {/* Email Login */}
              <button onClick={() => setStep('email-login')} className="w-full flex items-center justify-center gap-3 h-12 rounded-xl border-2 border-border text-foreground font-medium text-sm hover:border-jeewan-calm hover:bg-jeewan-calm-light transition">
                <Mail className="h-4 w-4" /> Sign in with Email
              </button>

              <div className="relative my-3">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
                <div className="relative flex justify-center text-xs"><span className="px-3 bg-card text-jeewan-muted">or</span></div>
              </div>

              <button onClick={() => setStep('signup')} className="w-full bg-jeewan-calm hover:bg-jeewan-calm/90 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2">
                New to JEEWAN? <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 'email-login' && (
            <div className="space-y-3">
              <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} disabled={isLoading} autoFocus />
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} disabled={isLoading} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">
                  {showPassword ? <EyeOff className="h-4 w-4 text-jeewan-muted" /> : <Eye className="h-4 w-4 text-jeewan-muted" />}
                </button>
              </div>
              <button onClick={handleEmailLogin} disabled={isLoading || !email || !password} className="w-full bg-jeewan-calm hover:bg-jeewan-calm/90 text-white font-bold py-3 rounded-xl transition disabled:opacity-40">
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
              <button onClick={() => { setStep('login-method'); setError(''); }} className="w-full py-2.5 rounded-xl border border-border text-foreground text-sm hover:bg-muted transition">Back</button>
            </div>
          )}

          {step === 'signup' && (
            <div className="space-y-3">
              <input type="text" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} disabled={isLoading} autoFocus />
              <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} disabled={isLoading} />
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} placeholder="Create password (min 6 chars)" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} disabled={isLoading} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">
                  {showPassword ? <EyeOff className="h-4 w-4 text-jeewan-muted" /> : <Eye className="h-4 w-4 text-jeewan-muted" />}
                </button>
              </div>
              <button onClick={handleSignup} disabled={isLoading || !email || !name || password.length < 6} className="w-full bg-jeewan-calm hover:bg-jeewan-calm/90 text-white font-bold py-3 rounded-xl transition disabled:opacity-40">
                {isLoading ? 'Creating...' : 'Create Account'}
              </button>

              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
                <div className="relative flex justify-center text-xs"><span className="px-3 bg-card text-jeewan-muted">or</span></div>
              </div>

              <button
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 h-11 rounded-xl border-2 border-border text-foreground font-medium text-sm hover:border-jeewan-calm transition disabled:opacity-60"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Sign up with Google
              </button>

              <button onClick={() => { setStep('login-method'); setError(''); }} className="w-full py-2.5 rounded-xl border border-border text-foreground text-sm hover:bg-muted transition">
                Already have an account?
              </button>
            </div>
          )}
        </div>

        <p className="text-[10px] text-center text-jeewan-muted mt-5">
          By signing in, you agree to our Privacy Policy and Terms of Service
        </p>
      </div>
    </div>
  );
}
