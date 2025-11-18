"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

const links = [
  { href: '/', label: 'Dashboard', icon: 'dashboard' },
  { href: '/course', label: 'My Courses', icon: 'collections_bookmark' },
  { href: '/quiz', label: 'My Quizzes', icon: 'quiz' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    router.push('/login');
  };

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-border-light bg-white p-4 sticky top-0">
        <div className="flex h-full flex-col justify-between">
            <div className="flex flex-col gap-8">
                <div className="flex items-center gap-3 px-3">
                    <div className="flex items-center justify-center rounded-lg bg-accent-blue size-10">
                        <span className="material-symbols-outlined" style={{fontSize: '24px'}}>school</span>
                    </div>
                    <h1 className="text-text-primary text-xl font-bold">StudyTool</h1>
                </div>
                <nav className="flex flex-col gap-2">
                    {links.map(({ href, label, icon }) => (
                        <Link key={href} href={href} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-text-secondary transition-colors hover:bg-background-light hover:text-text-primary ${pathname === href ? 'bg-neutral-200 text-primary' : ''}`}>
                            <span className="material-symbols-outlined" style={{fontSize: '24px', fontVariationSettings: pathname === href ? "'FILL' 1" : "'FILL' 0"}}>{icon}</span>
                            <p className="text-sm font-medium">{label}</p>
                        </Link>
                    ))}
                </nav>
            </div>
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-text-secondary transition-colors hover:bg-background-light hover:text-text-primary cursor-pointer">
                    <span className="material-symbols-outlined" style={{fontSize: '24px'}}>settings</span>
                    <p className="text-sm font-medium">Settings</p>
                </div>
                <div className="flex items-center gap-4 rounded-lg p-2">
                    <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC7qwWHeQRYf37PkmlYyuasfDpzJL2OxB_5MIFxwAUlDhpP_ZniaOUPCsmsOXI_YtRjOlicz27Q9ko87mNt_QJnQEMuqmBj3yC9J65UHlTcoWpnwpsgUwiqrPRV6ykB8PCUfXoNGJb5whgJGjNqDktoK2d22eQNOFkTzMcHOVNYwt13rkCtjvcG-putMwAj4KOlcvbkVkllruK5dZPDGh08YKv1liIUjFR0hCs9TG5dTU3Fw3LmyO7UekpDvE3i991jy2G0u7r3L9Rs')"}}></div>
                    <div className="flex flex-col">
                        <p className="text-text-primary text-sm font-semibold leading-normal">Alex Johnson</p>
                        <p className="text-text-secondary text-xs font-normal leading-normal">alex.j@email.com</p>
                    </div>
                    <button onClick={handleLogout} className="material-symbols-outlined text-text-secondary ml-auto" style={{fontSize: '20px'}} title="Logout">logout</button>
                </div>
            </div>
        </div>
    </aside>
  );
}
