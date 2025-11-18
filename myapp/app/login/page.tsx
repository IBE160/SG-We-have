"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden bg-gradient-to-br from-[#F8F9FA] to-[#E9ECEF]" style={{fontFamily: '"Inter", "Noto Sans", sans-serif'}}>
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-4 flex flex-1 justify-center items-center py-5">
          <div className="layout-content-container flex flex-col max-w-[420px] flex-1">
            <div className="flex flex-col items-center justify-center w-full gap-6">
              <div className="flex items-center justify-center text-[#1D2129] p-2 rounded-xl bg-white shadow-sm border border-[#DDE1E6]">
                <span className="material-symbols-outlined text-4xl">
                  school
                </span>
              </div>
              <div className="w-full bg-white rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.05)] border border-[#DDE1E6] p-8">
                <div className="flex flex-col items-center">
                  <h1 className="text-[#1D2129] tracking-light text-[28px] font-bold leading-tight text-center pb-2">Welcome Back</h1>
                  <p className="text-[#616889] text-base font-normal leading-normal pb-6 text-center">Log in to your account to continue</p>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex w-full flex-wrap items-end gap-4">
                    <label className="flex flex-col w-full flex-1">
                      <p className="text-[#1D2129] text-sm font-medium leading-normal pb-2">Email</p>
                      <input
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#1D2129] focus:outline-none focus:ring-2 focus:ring-primary/50 border border-[#DDE1E6] bg-white h-12 placeholder:text-[#616889]/80 px-4 text-base font-normal leading-normal"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </label>
                  </div>
                  <div className="flex w-full flex-wrap items-end gap-4">
                    <label className="flex flex-col w-full flex-1">
                      <div className="flex justify-between items-center pb-2">
                        <p className="text-[#1D2129] text-sm font-medium leading-normal">Password</p>
                        <Link className="text-sm font-medium text-primary hover:underline" href="#">Forgot Password?</Link>
                      </div>
                      <div className="flex w-full flex-1 items-stretch rounded-lg">
                        <input
                          className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#1D2129] focus:outline-none focus:ring-2 focus:ring-primary/50 border border-[#DDE1E6] bg-white h-12 placeholder:text-[#616889]/80 p-4 rounded-r-none border-r-0 pr-2 text-base font-normal leading-normal"
                          placeholder="Enter your password"
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-[#616889] flex border border-[#DDE1E6] bg-white items-center justify-center px-4 rounded-r-lg border-l-0 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
                        >
                          <span className="material-symbols-outlined text-xl">
                            {showPassword ? 'visibility_off' : 'visibility'}
                          </span>
                        </button>
                      </div>
                    </label>
                  </div>
                  <button className="flex items-center justify-center font-medium w-full px-4 py-3 h-12 text-base rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors duration-200 mt-2">Log In</button>
                </div>
              </div>
              <p className="text-[#616889] text-center text-base">Don't have an account? <Link className="font-medium text-primary hover:underline" href="#">Sign Up</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
