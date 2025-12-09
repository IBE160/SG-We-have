'use client';

import { useThemeStore } from '@/lib/stores/useThemeStore';
import { X, Moon, Sun } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { theme, toggleTheme } = useThemeStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-modal rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200 border border-border-light">
        <div className="flex items-center justify-between p-4 border-b border-border-light">
          <h2 className="text-lg font-bold text-text-primary">Settings</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-background-light transition-colors text-text-secondary hover:text-text-primary"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          {/* Theme Toggle Section */}
          <div className="pt-0">
            <h3 className="text-md font-bold text-text-primary mb-2">Theme</h3>
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Current Theme: <span className="capitalize font-medium text-text-primary">{theme}</span></span>
              
              <button
                type="button"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-text-inverse bg-accent-blue rounded-lg hover:opacity-90 transition-opacity"
                onClick={toggleTheme}
              >
                {theme === 'light' ? (
                  <>
                    <Moon size={16} />
                    <span>Dark Mode</span>
                  </>
                ) : (
                  <>
                    <Sun size={16} />
                    <span>Light Mode</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
