"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'Home' },
  { href: '/quiz', label: 'Quizzes' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <nav>
        <ul>
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link href={href} className={pathname === href ? 'active' : ''}>
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
