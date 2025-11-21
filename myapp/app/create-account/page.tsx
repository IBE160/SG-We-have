"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CreateAccountPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/'); // Redirect to the main dashboard page
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-100">
      <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg rounded-xl">
        <h3 className="text-2xl font-bold text-center text-text-dark">Welcome to StudyTool</h3>
        <p className="text-center text-text-secondary mb-6">Create your account to get started</p>
        <form onSubmit={handleContinue}>
          <div className="mt-4">
            <div>
              <label className="block text-text-dark" htmlFor="name">Name</label>
              <input
                type="text"
                placeholder="Your Name"
                className="mockup-input"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mt-4">
              <label className="block text-text-dark" htmlFor="email">Email</label>
              <input
                type="email"
                placeholder="your.email@example.com"
                className="mockup-input"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mt-4">
              <label className="block text-text-dark" htmlFor="password">Password</label>
              <input
                type="password"
                placeholder="Password"
                className="mockup-input"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex items-baseline justify-center mt-4">
              <button
                type="submit"
                className="mockup-button mockup-button-primary"
              >
                Continue
              </button>
            </div>
          </div>
        </form>
        <div className="mt-6 text-center text-text-secondary">
          Already have an account?{' '}
          <Link href="/login" className="text-primary hover:underline">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
