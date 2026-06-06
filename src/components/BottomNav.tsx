import React from 'react';
import { Home, Trophy, Sparkles, FolderHeart } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'home' | 'challenges' | 'premium';
  onChangeTab: (tab: 'home' | 'challenges' | 'premium') => void;
}

export default function BottomNav({ activeTab, onChangeTab }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 w-full z-40 flex justify-around items-center pt-2 pb-5 px-6 backdrop-blur-2xl border-t border-deep-navy/6 bg-white/90 rounded-t-2xl shadow-[0_-4px_24px_rgba(8,61,119,0.03)] select-none">
      <button 
        onClick={() => onChangeTab('home')}
        className={`flex flex-col items-center justify-center py-1.5 px-3 transition-all duration-200 cursor-pointer ${
          activeTab === 'home' 
            ? 'text-deep-navy font-extrabold scale-100' 
            : 'text-deep-navy/40 hover:text-deep-navy/70 scale-95 hover:scale-100'
        }`}
        id="btn-nav-home"
      >
        <Home className={`w-5 h-5 ${activeTab === 'home' ? 'stroke-[2.5px]' : 'stroke-2'}`} />
        <span className="text-[10px] uppercase font-mono font-bold mt-1 tracking-wider">Home</span>
      </button>

      <button 
        onClick={() => onChangeTab('challenges')}
        className={`flex flex-col items-center justify-center py-1.5 px-3 transition-all duration-200 cursor-pointer ${
          activeTab === 'challenges' 
            ? 'text-deep-navy font-extrabold scale-100' 
            : 'text-deep-navy/40 hover:text-deep-navy/70 scale-95 hover:scale-100'
        }`}
        id="btn-nav-challenges"
      >
        <Trophy className={`w-5 h-5 ${activeTab === 'challenges' ? 'stroke-[2.5px] fill-amber-100' : 'stroke-2'}`} />
        <span className="text-[10px] uppercase font-mono font-bold mt-1 tracking-wider">Challenges</span>
      </button>

      <button 
        onClick={() => onChangeTab('premium')}
        className={`flex flex-col items-center justify-center py-1.5 px-3 transition-all duration-200 cursor-pointer ${
          activeTab === 'premium' 
            ? 'text-deep-navy font-extrabold scale-100' 
            : 'text-deep-navy/40 hover:text-deep-navy/70 scale-95 hover:scale-100'
        }`}
        id="btn-nav-premium"
      >
        <Sparkles className={`w-5 h-5 ${activeTab === 'premium' ? 'stroke-[2.5px] text-burnt-orange fill-burnt-orange/10' : 'stroke-2'}`} />
        <span className="text-[10px] uppercase font-mono font-bold mt-1 tracking-wider">Premium</span>
      </button>
    </nav>
  );
}
