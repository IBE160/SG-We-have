"use client";

import { usePathname, useRouter } from 'next/navigation';
import Sidebar from './Sidebar';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Determine "logged in" state purely based on the current path
  const isLoggedIn = pathname !== '/login' && pathname !== '/create-account';

  // Redirect to login if trying to access a protected route while "logged out"
  // This is now handled by the visual state, if isLoggedIn is false, it means we are on /login
  // If we are not on /login and isLoggedIn is false, it means we should be redirected to /login
  if (!isLoggedIn && pathname !== '/login' && pathname !== '/create-account') {
    router.push('/login');
    return null; // Prevent rendering children while redirecting
  }

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-row">
      {isLoggedIn && <Sidebar />} {/* Render Sidebar only if "logged in" */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}
