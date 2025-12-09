'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/components/SupabaseClientProvider';
import SettingsModal from '@/components/SettingsModal';

export default function AppHeader() {
  const { user } = useAuth();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <>
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-border-light px-10 py-4 bg-sidebar">
        <Link href="/dashboard" className="flex items-center gap-3 cursor-pointer">
          <div className="flex items-center justify-center rounded-lg bg-accent-blue size-10">
            <span className="material-symbols-outlined text-white" style={{fontSize: '24px'}}>school</span>
          </div>
          <h2 className="text-text-primary text-xl font-bold leading-tight">StudyTool</h2>
        </Link>
        <div className="flex flex-1 justify-end gap-8">
          <nav className="flex items-center gap-9">
            <Link className="text-text-primary text-sm font-medium leading-normal hover:text-accent-blue transition-colors" href="/dashboard">Dashboard</Link>
            <Link className="text-text-primary text-sm font-medium leading-normal hover:text-accent-blue transition-colors" href="/notes">Notes</Link>
            <Link className="text-text-primary text-sm font-medium leading-normal hover:text-accent-blue transition-colors" href="/quiz">Quizzes</Link>
          </nav>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-border-light text-text-primary hover:bg-sidebar-hover transition-colors"
            >
              <span className="material-symbols-outlined text-xl">settings</span>
            </button>
            <button className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-border-light text-text-primary hover:bg-sidebar-hover transition-colors">
              <span className="material-symbols-outlined text-xl">notifications</span>
            </button>
            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 bg-border-light flex items-center justify-center text-text-secondary font-bold">
              {user?.email?.[0].toUpperCase()}
            </div>
          </div>
        </div>
      </header>
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
}
