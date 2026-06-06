import React from 'react';
import { Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { UserStats } from '../types';

interface XpProgressProps {
  stats: UserStats;
}

export default function XpProgress({ stats }: XpProgressProps) {
  const currentLevelXp = stats.xp;
  const remainingXp = stats.nextLevelXp - currentLevelXp;
  const ratio = currentLevelXp / stats.nextLevelXp;

  return (
    <div className="glass-card-navy rounded-2xl p-5 border-l-4 border-l-deep-navy shadow-sm select-none">
      <div className="flex gap-4 items-center">
        <div className="w-12 h-12 rounded-full bg-deep-navy flex items-center justify-center text-white shadow-inner flex-shrink-0">
          <Sparkles className="w-5.5 h-5.5 text-white animate-pulse" />
        </div>
        <div className="flex-grow">
          <h4 className="text-xl font-bold text-deep-navy font-sans mb-0.5">Level {stats.level}</h4>
          <p className="text-xs text-deep-navy/60 font-medium">
            {remainingXp <= 0 ? 'Fully ready!' : `${remainingXp} XP to next transcendence`}
          </p>
        </div>
      </div>
      
      {/* Interactive Progress Bar */}
      <div className="mt-4">
        <div className="h-2 w-full bg-deep-navy/10 rounded-full overflow-hidden relative">
          <motion.div 
            className="h-full bg-burnt-orange rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${ratio * 100}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
        <div className="flex justify-between items-center mt-1.5 px-0.5">
          <span className="text-[10px] font-mono text-deep-navy/40 font-bold uppercase">{currentLevelXp} XP</span>
          <span className="text-[10px] font-mono text-deep-navy/40 font-bold uppercase">{stats.nextLevelXp} XP</span>
        </div>
      </div>
    </div>
  );
}
