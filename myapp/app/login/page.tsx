"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; // Import Link

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/'); // Redirect to the main dashboard page
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-100">
      <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg rounded-xl">
        <h3 className="text-2xl font-bold text-center text-text-dark">Welcome back</h3>
        <p className="text-center text-text-secondary mb-6">Log in to your account to continue</p>
        <form onSubmit={handleLogin}>
          <div className="mt-4">
            <div>
              <label className="block text-text-dark" htmlFor="username">Username</label>
              <input
                type="text"
                placeholder="Username"
                className="mockup-input"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
                Login
              </button>
            </div>
          </div>
        </form>
        <div className="mt-6 text-center text-text-secondary">
          Don't have an account?{' '}
          <Link href="/create-account" className="text-primary hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}