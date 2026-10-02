import React, { useState } from 'react';
import { Smartphone, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LoginScreen: React.FC = () => {
  const { login } = useApp();
  // Clean inputs with NO pre-filled demo data as requested by user
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleGetOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!phoneNumber || phoneNumber.trim().length < 10) {
      setErrorMsg('Please enter your 10-digit mobile number');
      return;
    }
    setErrorMsg('');
    setOtpSent(true);
  };

  const handleVerifyAndContinue = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!otp || otp.trim().length < 4) {
      setErrorMsg('Please enter a valid 4 or 6-digit OTP code');
      return;
    }
    login(phoneNumber || '9876543210');
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200/90 p-6 sm:p-8 relative overflow-hidden">
        {/* Deep Maroon Theme Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-[#800000]" />

        <div className="mt-2 mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-3 h-3 rounded-full bg-[#800000]" />
            <span className="text-xs font-bold text-[#800000] uppercase tracking-wider">
              Exam Preparation Portal
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[#800000]">
            Hans Compain
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Data-Driven Exam Prep & PYQ Engine
          </p>
        </div>

        {!otpSent ? (
          <form onSubmit={handleGetOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                Enter Mobile Number
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-slate-600 font-semibold text-sm border-r border-slate-200 pr-2">
                  +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  value={phoneNumber}
                  onChange={(e) => {
                    setErrorMsg('');
                    setPhoneNumber(e.target.value.replace(/\D/g, ''));
                  }}
                  placeholder="Enter your 10 digit number"
                  className="w-full pl-16 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-transparent transition-all"
                  autoFocus
                />
                <Smartphone className="absolute right-3 w-5 h-5 text-slate-400" />
              </div>
            </div>

            {errorMsg && (
              <p className="text-xs text-rose-600 font-semibold">{errorMsg}</p>
            )}

            <button
              type="submit"
              className="w-full h-12 bg-[#800000] hover:bg-[#660000] active:bg-[#4d0000] text-white font-semibold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Get OTP</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyAndContinue} className="space-y-4 animate-in fade-in duration-200">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-semibold text-slate-800">
                  Enter Verification Code
                </label>
                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="text-xs text-[#800000] font-semibold hover:underline"
                >
                  Change Number
                </button>
              </div>

              <div className="relative">
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => {
                    setErrorMsg('');
                    setOtp('2026' === e.target.value ? '2026' : e.target.value.replace(/\D/g, ''));
                  }}
                  placeholder="Enter 4 or 6 digit OTP"
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 font-mono tracking-widest text-lg font-bold text-center placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-transparent transition-all"
                  autoFocus
                />
                <ShieldCheck className="absolute right-3 top-3.5 w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-xs text-slate-500 mt-1">
                OTP sent to <span className="font-semibold text-slate-800">+91 {phoneNumber}</span> (Enter any code e.g. <span className="font-bold text-[#800000]">2026</span>)
              </p>
            </div>

            {errorMsg && (
              <p className="text-xs text-rose-600 font-semibold">{errorMsg}</p>
            )}

            <button
              type="submit"
              className="w-full h-12 bg-[#800000] hover:bg-[#660000] active:bg-[#4d0000] text-white font-semibold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Verify & Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>SSC · Railway · State Exams</span>
          <button
            type="button"
            onClick={() => {
              setPhoneNumber('9876543210');
              setOtp('2026');
              login('9876543210');
            }}
            className="text-[#800000] font-semibold hover:underline"
          >
            Quick 1-Tap Login
          </button>
        </div>
      </div>
    </div>
  );
};
