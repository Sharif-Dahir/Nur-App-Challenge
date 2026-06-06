import React, { useState } from 'react';
import { Menu, User, Award, CheckCircle2, X } from 'lucide-react';
import { UserStats } from '../types';

interface HeaderProps {
  stats: UserStats;
  userName: string;
  onUpdateName: (name: string) => void;
}

export default function Header({ stats, userName, onUpdateName }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editName, setEditName] = useState(userName);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editName.trim()) {
      onUpdateName(editName.trim());
      setIsOpen(false);
    }
  };

  return (
    <>
      <header className="fixed top-0 w-full z-40 flex justify-between items-center px-6 h-16 backdrop-blur-xl border-b border-deep-navy/5 bg-white/80">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsOpen(true)}
            className="text-deep-navy cursor-pointer hover:opacity-80 transition-opacity p-1 rounded-md hover:bg-deep-navy/5"
            aria-label="Menu"
            id="btn-menu-drawer"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-extrabold tracking-widest text-deep-navy font-sans select-none">NUR</h1>
        </div>
        
        <button 
          onClick={() => setIsOpen(true)}
          className="h-8 w-8 rounded-full border border-deep-navy/10 overflow-hidden cursor-pointer hover:ring-2 hover:ring-burnt-orange hover:ring-offset-1 transition-all"
          id="btn-profile-trigger"
        >
          <img 
            alt="User Profile" 
            className="w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDwiWq7j2uoNnAMenjEl5aLspV2NueHBZs2_pXaHrSkVUgikdy0ZEvGOnt7ShsopinsYq9-ozFSW_YVEU_NDmnGNIkPZVOz_hp8JtWjaOO6Hx8vdIbhMoJSsS9unVjqZJQIQgWV7dmIeM03p9E4GEweY22wMhpanm8zAfL1pGEmFl_jikxV1A6d-TVpeR-x4qf_9LYtZ-iCHHh2rgDxPmj-rDd0clbow-WR47vymzOXznkls2gp7tNDUqOOzjkF4TnF0S6osW7wnFw"
          />
        </button>
      </header>

      {/* Drawer with Profile Info & Customize Name */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-deep-navy/30 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute inset-y-0 left-0 max-w-full flex">
            <div className="w-screen max-w-xs bg-white h-full shadow-2xl flex flex-col justify-between">
              {/* Header */}
              <div className="p-6 border-b border-deep-navy/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-burnt-orange" />
                  <h2 className="text-lg font-bold text-deep-navy">Your Nur Profile</h2>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-deep-navy/60 hover:text-deep-navy cursor-pointer"
                  id="btn-close-drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Profile card summary */}
                <div className="flex flex-col items-center text-center p-4 bg-deep-navy/5 rounded-xl border border-deep-navy/10">
                  <div className="h-16 w-16 rounded-full border-2 border-burnt-orange p-0.5 bg-white mb-3">
                    <img 
                      alt="User Profile" 
                      className="w-full h-full rounded-full object-cover" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDwiWq7j2uoNnAMenjEl5aLspV2NueHBZs2_pXaHrSkVUgikdy0ZEvGOnt7ShsopinsYq9-ozFSW_YVEU_NDmnGNIkPZVOz_hp8JtWjaOO6Hx8vdIbhMoJSsS9unVjqZJQIQgWV7dmIeM03p9E4GEweY22wMhpanm8zAfL1pGEmFl_jikxV1A6d-TVpeR-x4qf_9LYtZ-iCHHh2rgDxPmj-rDd0clbow-WR47vymzOXznkls2gp7tNDUqOOzjkF4TnF0S6osW7wnFw"
                    />
                  </div>
                  <h3 className="font-bold text-deep-navy text-lg">{userName}</h3>
                  <p className="text-xs text-deep-navy/60 uppercase font-mono tracking-wider font-semibold">Level {stats.level} Companion</p>
                </div>

                {/* Edit Name Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="user-display-name" className="block text-xs font-bold text-deep-navy/60 uppercase mb-1.5 font-mono">
                      Customize Name
                    </label>
                    <input
                      id="user-display-name"
                      type="text"
                      className="w-full bg-deep-navy/5 border border-deep-navy/10 rounded-lg px-3 py-2 text-sm text-deep-navy focus:outline-none focus:ring-1 focus:ring-burnt-orange focus:border-burnt-orange"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      maxLength={20}
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-burnt-orange text-white text-xs font-bold py-2 rounded-lg hover:brightness-110 transition-all font-sans"
                    id="btn-save-name"
                  >
                    SAVE PROFILE NAME
                  </button>
                </form>

                {/* Stats summary */}
                <div className="space-y-3 pt-4 border-t border-deep-navy/5">
                  <h4 className="text-xs font-bold text-deep-navy/40 uppercase font-mono tracking-wider">Discipline Milestones</h4>
                  
                  <div className="flex items-center gap-3 py-1">
                    <CheckCircle2 className="w-5 h-5 text-burnt-orange" />
                    <div>
                      <p className="text-xs font-bold text-deep-navy">Fasts Completed</p>
                      <p className="text-sm font-bold text-deep-navy/60">{stats.fastsCompletedCount} days</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 py-1">
                    <Award className="w-5 h-5 text-burnt-orange" />
                    <div>
                      <p className="text-xs font-bold text-deep-navy">Accumulated points</p>
                      <p className="text-sm font-bold text-deep-navy/60">{stats.points} pts</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Version Footer */}
              <div className="p-6 border-t border-deep-navy/5 bg-deep-navy/5">
                <p className="text-[10px] text-center font-mono text-deep-navy/40 uppercase">NUR APP VERSION 4.1.14</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
