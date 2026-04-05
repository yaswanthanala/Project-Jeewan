'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Phone, Eye, EyeOff, Shield, ArrowRight, Users, Heart, Building2, Settings } from 'lucide-react';
import Link from 'next/link';

type AuthStep = 'login-method' | 'email-otp' | 'phone-otp' | 'signup';
type UserRole = 'user' | 'counsellor' | 'volunteer' | 'institution' | 'admin';

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<AuthStep>('login-method');
  const [role, setRole] = useState<UserRole>('user');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
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

  const handleSendOTP = async (method: 'email' | 'phone') => {
    setError('');
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setStep(method === 'email' ? 'email-otp' : 'phone-otp');
    setIsLoading(false);
  };

  const handleVerifyOTP = async () => {
    setError('');
    if (otp.length !== 6) { setError('OTP must be 6 digits'); return; }
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    router.push(roleRoutes[role]);
    setIsLoading(false);
  };

  const handleSignup = async () => {
    setError('');
    if (password.length < 8) { setError('Password must be at least 8 characters'); return; }
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    router.push(roleRoutes[role]);
    setIsLoading(false);
  };

  const handleDemoLogin = () => {
    router.push(roleRoutes[role]);
  };

  const inputClass = "w-full p-3.5 rounded-xl border border-border bg-card text-foreground text-sm focus:border-jeewan-calm focus:ring-2 focus:ring-jeewan-calm/20 transition";

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
            {step === 'login-method' ? 'Choose how you\'d like to sign in' : step === 'signup' ? 'Join the movement' : 'Verify your identity'}
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
              {/* Demo Login Banner */}
              <button onClick={handleDemoLogin} className="w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-jeewan-nature text-white font-bold text-sm hover:bg-jeewan-nature/90 transition">
                🚀 Demo Login — Skip to Dashboard
              </button>
              <p className="text-[10px] text-center text-jeewan-muted">Use demo to explore all features instantly</p>

              {/* Role Selector */}
              <div className="mt-1">
                <p className="text-[10px] font-bold text-jeewan-muted uppercase tracking-wider mb-2">I am a:</p>
                <div className="grid grid-cols-3 gap-1.5 mb-1">
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
                        onClick={() => setRole(r.key)}
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
              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
                <div className="relative flex justify-center text-xs"><span className="px-3 bg-card text-jeewan-muted">or sign in</span></div>
              </div>
              <button onClick={() => handleSendOTP('email')} className="w-full flex items-center justify-center gap-3 h-12 rounded-xl border-2 border-border text-foreground font-medium text-sm hover:border-jeewan-calm hover:bg-jeewan-calm-light transition">
                <Mail className="h-4 w-4" /> Sign in with Email
              </button>
              <button onClick={() => handleSendOTP('phone')} className="w-full flex items-center justify-center gap-3 h-12 rounded-xl border-2 border-border text-foreground font-medium text-sm hover:border-jeewan-calm hover:bg-jeewan-calm-light transition">
                <Phone className="h-4 w-4" /> Sign in with Phone
              </button>
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
                <div className="relative flex justify-center text-xs"><span className="px-3 bg-card text-jeewan-muted">or</span></div>
              </div>
              <button onClick={() => setStep('signup')} className="w-full bg-jeewan-calm hover:bg-jeewan-calm/90 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2">
                New to JEEWAN? <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {(step === 'email-otp' || step === 'phone-otp') && (
            <div className="space-y-3">
              <input type={step === 'email-otp' ? 'email' : 'tel'} placeholder={step === 'email-otp' ? 'Enter your email' : '+91 XXXXX XXXXX'} value={step === 'email-otp' ? email : phone} onChange={(e) => step === 'email-otp' ? setEmail(e.target.value) : setPhone(e.target.value)} className={inputClass} disabled={isLoading} />
              <input type="text" placeholder="Enter 6-digit OTP" value={otp} onChange={(e) => setOtp(e.target.value.slice(0, 6))} maxLength={6} className={inputClass} disabled={isLoading} />
              <button onClick={handleVerifyOTP} disabled={isLoading || otp.length !== 6} className="w-full bg-jeewan-calm hover:bg-jeewan-calm/90 text-white font-bold py-3 rounded-xl transition disabled:opacity-40">
                {isLoading ? 'Verifying...' : 'Verify & Login'}
              </button>
              <button onClick={() => { setStep('login-method'); setOtp(''); }} className="w-full py-2.5 rounded-xl border border-border text-foreground text-sm hover:bg-muted transition">Back</button>
            </div>
          )}

          {step === 'signup' && (
            <div className="space-y-3">
              <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} disabled={isLoading} />
              <input type="tel" placeholder="Phone number" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} disabled={isLoading} />
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} placeholder="Create password (min 8 chars)" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} disabled={isLoading} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">
                  {showPassword ? <EyeOff className="h-4 w-4 text-jeewan-muted" /> : <Eye className="h-4 w-4 text-jeewan-muted" />}
                </button>
              </div>
              <button onClick={handleSignup} disabled={isLoading || !email || password.length < 8} className="w-full bg-jeewan-calm hover:bg-jeewan-calm/90 text-white font-bold py-3 rounded-xl transition disabled:opacity-40">
                {isLoading ? 'Creating...' : 'Create Account'}
              </button>
              <button onClick={() => setStep('login-method')} className="w-full py-2.5 rounded-xl border border-border text-foreground text-sm hover:bg-muted transition">
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
