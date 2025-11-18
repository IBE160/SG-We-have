"use client";

import Link from 'next/link';
import { useState } from 'react';
import Modal from '@/app/components/Modal';

export default function Home() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newCourseTitle, setNewCourseTitle] = useState('');

  const handleCreateCourse = async () => {
    // This function is now redundant as the card links to /course
    // but keeping it for now in case it's needed elsewhere or for future API integration
    console.log('Create course logic would go here if not navigating to /course');
  };

  return (
    <main className="flex-1 p-10">
      <div className="mx-auto max-w-5xl">
        {/* PageHeading */}
        <div className="flex flex-wrap justify-between gap-3 pb-8">
          <div className="flex min-w-72 flex-col gap-2">
            <h1 className="text-text-primary text-4xl font-black leading-tight tracking-[-0.033em]">Welcome back, Alex!</h1>
            <p className="text-text-secondary text-lg font-normal leading-normal">Ready to dive back into your studies?</p>
          </div>
        </div>
        {/* Action Cards with Glassmorphism background */}
        <div className="relative grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Glassmorphism Accent */}
          <div className="absolute inset-x-0 top-1/2 h-64 -translate-y-1/2 transform">
            <div className="absolute left-[5%] h-full w-2/5 rounded-full bg-accent-blue/10 blur-3xl"></div>
            <div className="absolute right-[5%] h-full w-2/5 rounded-full bg-accent-purple/10 blur-3xl"></div>
          </div>
          {/* Card 1: Create New Course */}
          <div className="relative flex flex-col justify-between gap-6 rounded-xl border border-border-light bg-white/70 p-6 shadow-soft backdrop-blur-md transition-shadow hover:shadow-soft-hover">
            <div className="flex flex-col gap-3">
              <div className="flex size-12 items-center justify-center rounded-lg bg-accent-blue/10">
                <span className="material-symbols-outlined text-accent-blue" style={{fontSize: '28px'}}>add_circle</span>
              </div>
              <h2 className="text-text-primary text-xl font-bold leading-normal">Create a New Course</h2>
              <p className="text-text-secondary text-sm font-normal leading-normal">Start by organizing your notes into a new subject.</p>
            </div>
            <Link href="/course">
              <button className="w-full rounded-lg bg-accent-blue py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90">Get Started</button>
            </Link>
          </div>
          {/* Card 2: Continue Last Note */}
          <div className="relative flex flex-col justify-between gap-6 rounded-xl border border-border-light bg-white/70 p-6 shadow-soft backdrop-blur-md transition-shadow hover:shadow-soft-hover">
            <div className="flex flex-col gap-3">
              <div className="flex size-12 items-center justify-center rounded-lg bg-accent-purple/10">
                <span className="material-symbols-outlined text-accent-purple" style={{fontSize: '28px'}}>history_edu</span>
              </div>
              <h2 className="text-text-primary text-xl font-bold leading-normal">Pick Up Where You Left Off</h2>
              <p className="text-text-secondary text-sm font-normal leading-normal">Lecture 3: Quantum Physics</p>
            </div>
            <Link href="/course/some-placeholder-id">
              <button className="w-full rounded-lg bg-accent-purple py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90">View Notes</button>
            </Link>
          </div>
          {/* Card 3: Create a Quiz */}
          <div className="relative flex flex-col justify-between gap-6 rounded-xl border border-border-light bg-white/70 p-6 shadow-soft backdrop-blur-md transition-shadow hover:shadow-soft-hover">
            <div className="flex flex-col gap-3">
              <div className="flex size-12 items-center justify-center rounded-lg bg-accent-green/10">
                <span className="material-symbols-outlined text-accent-green" style={{fontSize: '28px'}}>quiz</span>
              </div>
              <h2 className="text-text-primary text-xl font-bold leading-normal">Test Your Knowledge</h2>
              <p className="text-text-secondary text-sm font-normal leading-normal">Generate a practice quiz from any of your existing notes.</p>
            </div>
            <Link href="/quiz">
              <button className="w-full rounded-lg bg-accent-green py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90">Create Quiz</button>
            </Link>
          </div>
        </div>
      </div>

      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New Course">
        <input
          type="text"
          placeholder="Course Title"
          className="form-input w-full rounded-lg border-border-light focus:ring-2 focus:ring-primary/50 focus:border-primary/50 h-12 px-4"
          value={newCourseTitle}
          onChange={(e) => setNewCourseTitle(e.target.value)}
        />
        <button className="w-full mt-4 rounded-lg bg-primary py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90" onClick={handleCreateCourse}>Create</button>
      </Modal>
    </main>
  );
}
