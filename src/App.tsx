import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Sparkles, 
  Compass, 
  CircleDot, 
  Calendar, 
  Clock, 
  ChevronRight, 
  User, 
  Star, 
  HelpCircle,
  Gem,
  CheckCircle,
  TrendingUp,
  Quote,
  ShieldCheck,
  Flame,
  Plus
} from 'lucide-react';

import Header from './components/Header';
import FastingTracker from './components/FastingTracker';
import XpProgress from './components/XpProgress';
import Leaderboard from './components/Leaderboard';
import UpcomingQuests from './components/UpcomingQuests';
import BottomNav from './components/BottomNav';

import { FastingState, UserStats, LeaderboardUser, Quest, HistoricalAct, Notification } from './types';
import { INITIAL_LEADERBOARD, INITIAL_QUESTS, SPIRITUAL_QUOTES, PREMIUM_PERKS } from './data';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<'home' | 'challenges' | 'premium'>('challenges');
  
  // Custom user profile name
  const [userName, setUserName] = useState<string>('Sharif S.');

  // Core stats
  const [userStats, setUserStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('nur_user_stats');
    if (saved) {
      try { return JSON.parse(saved); } catch(e) {}
    }
    return {
      level: 12,
      xp: 760, // starts at index consistent with screenshot (~72-76%)
      nextLevelXp: 1000,
      fastsCompletedCount: 34,
      points: 2250 // placed strategically in leaderboard
    };
  });

  // Fasting tracker state
  const [fastingState, setFastingState] = useState<FastingState>(() => {
    const saved = localStorage.getItem('nur_fasting_state');
    if (saved) {
      try { return JSON.parse(saved); } catch(e) {}
    }
    return {
      isActive: false,
      durationHours: 16,
      startTime: null,
      endTime: null,
      isCompleted: false
    };
  });

  // Historical logged acts of charity or devotion
  const [historicalActs, setHistoricalActs] = useState<HistoricalAct[]>(() => {
    const saved = localStorage.getItem('nur_historical_acts');
    if (saved) {
      try { return JSON.parse(saved); } catch(e) {}
    }
    return [
      {
        id: 'hist-1',
        category: 'Spiritual Mind',
        note: 'Completed 1-minute conscious breathing and silent self-reflection.',
        timestamp: new Date(Date.now() - 3600 * 1000 * 5).toISOString(),
        xpEarned: 120
      },
      {
        id: 'hist-2',
        category: 'Sustenance Provision',
        note: 'Coordinated box of organic dates and water bottles for evening neighbors feeding.',
        timestamp: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
        xpEarned: 150
      },
      {
        id: 'hist-3',
        category: 'Fostering Harmony',
        note: 'Offered sincere family guidance and supported home organization.',
        timestamp: new Date(Date.now() - 3600 * 1000 * 48).toISOString(),
        xpEarned: 100
      }
    ];
  });

  // Current quest statuses
  const [quests, setQuests] = useState<Quest[]>(() => {
    const saved = localStorage.getItem('nur_quests');
    if (saved) {
      try { return JSON.parse(saved); } catch(e) {}
    }
    return INITIAL_QUESTS;
  });

  // Premium bypass activation code trigger
  const [isPremium, setIsPremium] = useState<boolean>(() => {
    return localStorage.getItem('nur_is_premium') === 'true';
  });

  // Leaderboard data
  const [leaderboardUsers, setLeaderboardUsers] = useState<LeaderboardUser[]>(INITIAL_LEADERBOARD);

  // Active floating toasts list
  const [toasts, setToasts] = useState<Notification[]>([]);

  // Rotating daily quotes indicator
  const [quoteIndex, setQuoteIndex] = useState<number>(0);

  // Rotate quotes every 15 seconds
  useEffect(() => {
    const quoteTimer = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % SPIRITUAL_QUOTES.length);
    }, 15000);
    return () => clearInterval(quoteTimer);
  }, []);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('nur_user_stats', JSON.stringify(userStats));
  }, [userStats]);

  useEffect(() => {
    localStorage.setItem('nur_fasting_state', JSON.stringify(fastingState));
  }, [fastingState]);

  useEffect(() => {
    localStorage.setItem('nur_historical_acts', JSON.stringify(historicalActs));
  }, [historicalActs]);

  useEffect(() => {
    localStorage.setItem('nur_quests', JSON.stringify(quests));
  }, [quests]);

  useEffect(() => {
    localStorage.setItem('nur_is_premium', isPremium.toString());
  }, [isPremium]);

  // Merge current user dynamically in leaderboard list!
  useEffect(() => {
    const currentUserInLeaderboard: LeaderboardUser = {
      id: 'current-user-sharif',
      rank: 3, // placeholder, sorted immediately below
      name: userName,
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDwiWq7j2uoNnAMenjEl5aLspV2NueHBZs2_pXaHrSkVUgikdy0ZEvGOnt7ShsopinsYq9-ozFSW_YVEU_NDmnGNIkPZVOz_hp8JtWjaOO6Hx8vdIbhMoJSsS9unVjqZJQIQgWV7dmIeM03p9E4GEweY22wMhpanm8zAfL1pGEmFl_jikxV1A6d-TVpeR-x4qf_9LYtZ-iCHHh2rgDxPmj-rDd0clbow-WR47vymzOXznkls2gp7tNDUqOOzjkF4TnF0S6osW7wnFw',
      points: userStats.points,
      title: userStats.level >= 13 ? 'Ascended Virtuous' : 'Virtue Seeker',
      isCurrentUser: true
    };

    // Filter out standard duplicates and combine
    const otherUsers = INITIAL_LEADERBOARD.filter(u => u.id !== 'current-user-sharif');
    setLeaderboardUsers([currentUserInLeaderboard, ...otherUsers]);
  }, [userName, userStats.points, userStats.level]);

  // Toast adder helper
  const addToast = (text: string, type: 'success' | 'info' | 'level_up' | 'quest_complete') => {
    const newToast: Notification = {
      id: `toast-${Date.now()}-${Math.random()}`,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type
    };
    setToasts((prev) => [newToast, ...prev]);

    // Fast decay
    setTimeout(() => {
      setToasts((prev) => prev.filter(t => t.id !== newToast.id));
    }, 4500);
  };

  // Fasting actions
  const handleStartFast = (duration: number, startHour: number, startMinute: number) => {
    const now = new Date();
    
    // Set custom start date
    const start = new Date();
    start.setHours(startHour);
    start.setMinutes(startMinute);
    start.setSeconds(0);
    
    // Calculate custom end date representing sunset / completion offset
    const end = new Date(start.getTime() + duration * 3600 * 1000);

    setFastingState({
      isActive: true,
      durationHours: duration,
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      isCompleted: false
    });
  };

  const handleResetFast = () => {
    setFastingState({
      isActive: false,
      durationHours: 16,
      startTime: null,
      endTime: null,
      isCompleted: false
    });
  };

  const handleCompleteFast = () => {
    // Award XP
    const xpReward = 150;
    const pointReward = 200;
    
    addToast(`Outstanding discipline! You completed your ${fastingState.durationHours}-hour fast! 🎉`, 'success');
    awardXp(xpReward, pointReward);

    // Save historical log
    const newAct: HistoricalAct = {
      id: `act-${Date.now()}`,
      category: 'Soonka Fast',
      note: `Triumphantly completed standard ${fastingState.durationHours}-hour spiritual fast session.`,
      timestamp: new Date().toISOString(),
      xpEarned: xpReward
    };
    setHistoricalActs(prev => [newAct, ...prev]);

    // Reset fast tracker state
    setFastingState({
      isActive: false,
      durationHours: 16,
      startTime: null,
      endTime: null,
      isCompleted: true
    });

    setUserStats(prev => ({
      ...prev,
      fastsCompletedCount: prev.fastsCompletedCount + 1
    }));
  };

  // General XP award engine (with level up calculations!)
  const awardXp = (amount: number, pointAmount: number) => {
    addToast(`Earned +${amount} XP & +${pointAmount} Pts`, 'quest_complete');
    
    setUserStats((prev) => {
      let isLevelUp = false;
      let newXp = prev.xp + amount;
      let newLevel = prev.level;
      let currentThreshold = prev.nextLevelXp;

      while (newXp >= currentThreshold) {
        newXp -= currentThreshold;
        newLevel += 1;
        isLevelUp = true;
      }

      if (isLevelUp) {
        // Trigger timeout to prevent blocking React lifecycle rendering
        setTimeout(() => {
          addToast(`Congratulations Companion! You transcended to Level ${newLevel}! ✨`, 'level_up');
        }, 1000);
      }

      return {
        ...prev,
        level: newLevel,
        xp: newXp,
        points: prev.points + pointAmount
      };
    });
  };

  // Complete specific bento grid quest
  const handleCompleteQuest = (questId: string, xpReward: number) => {
    const pointReward = Math.floor(xpReward * 1.2);
    
    setQuests((prev) => 
      prev.map(q => q.id === questId ? { ...q, status: 'completed' } : q)
    );

    addToast(`Completed Quest: ${quests.find(q => q.id === questId)?.title}!`, 'success');
    awardXp(xpReward, pointReward);
  };

  const handleAddHistoricalAct = (act: HistoricalAct) => {
    setHistoricalActs(prev => [act, ...prev]);
  };

  const handleInviteFriend = (email: string) => {
    addToast(`Invitation sent to ${email}! Sent companion access key. +150 XP rewarded!`, 'success');
    awardXp(150, 180);
  };

  const handleUpdateName = (newName: string) => {
    setUserName(newName);
    addToast(`Display profile name updated to ${newName}.`, 'info');
  };

  // Reset all local storage values (Clean helper for user testing!)
  const handleResetAllApp = () => {
    if (confirm("Reset everything to factory parameters?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const activeQuote = SPIRITUAL_QUOTES[quoteIndex];

  return (
    <div className="min-h-screen bg-slate-50 text-deep-navy pb-24 font-sans selection:bg-burnt-orange/10 selection:text-burnt-orange">
      {/* Upper Navigation Header */}
      <Header 
        stats={userStats} 
        userName={userName} 
        onUpdateName={handleUpdateName} 
      />

      <main className="max-w-md mx-auto pt-24 px-5 space-y-8">
        
        {/* TOAST SYSTEM WRAPPER */}
        <div className="fixed bottom-24 right-5 left-5 z-50 flex flex-col gap-2 max-w-sm mx-auto pointer-events-none select-none">
          <AnimatePresence>
            {toasts.map((toast) => (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                className={`p-3 px-4 rounded-xl shadow-xl flex items-center justify-between gap-3 text-xs font-bold leading-snug border pointer-events-auto ${
                  toast.type === 'success' 
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-500/20' 
                    : toast.type === 'level_up'
                      ? 'bg-amber-50 text-amber-900 border-amber-500/30'
                      : toast.type === 'quest_complete'
                        ? 'bg-burnt-orange/5 text-burnt-orange border-burnt-orange/20'
                        : 'bg-white text-deep-navy border-deep-navy/10'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded-full text-indigo-700 bg-white">
                    {toast.type === 'success' ? '✓' : toast.type === 'level_up' ? '★' : '✦'}
                  </span>
                  <span>{toast.text}</span>
                </div>
                <span className="text-[9px] font-mono opacity-50 uppercase">{toast.timestamp}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* ================= VIEW SWITCHER ================= */}
        
        {activeTab === 'home' && (
          <motion.div 
            id="tabview-home"
            className="space-y-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Greeting block */}
            <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-deep-navy/6 shadow-sm select-none">
              <div>
                <p className="text-xs font-mono font-bold text-burnt-orange uppercase tracking-wider">Welcome Companion</p>
                <h2 className="text-2xl font-extrabold tracking-tight mt-0.5 text-deep-navy">{userName}</h2>
                <p className="text-xs text-deep-navy/55 mt-1 font-medium">Have a serene and disciplined day.</p>
              </div>
              <div className="h-14 w-14 rounded-2xl bg-deep-navy text-white flex flex-col items-center justify-center p-1 font-sans">
                <span className="text-2xl font-extrabold leading-none">{userStats.fastsCompletedCount}</span>
                <span className="text-[8px] font-mono uppercase tracking-tighter mt-1 font-bold text-slate-300">FASTS</span>
              </div>
            </div>

            {/* Rotating Spiritual Quote */}
            <div className="bg-white rounded-2xl p-5 border border-deep-navy/6 shadow-sm relative overflow-hidden select-none">
              <div className="absolute right-4 bottom-4 text-deep-navy/3 pointer-events-none">
                <Quote className="w-20 h-20" />
              </div>
              <p className="text-sm font-medium text-deep-navy/80 leading-relaxed italic z-10 relative">
                "{activeQuote.text}"
              </p>
              <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-burnt-orange mt-2 z-10 relative">
                — {activeQuote.author}
              </p>
            </div>

            {/* Overview level and stat card */}
            <XpProgress stats={userStats} />

            {/* Historical Acts Timeline logged */}
            <div className="bg-white rounded-2xl p-5 border border-deep-navy/6 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold uppercase font-mono tracking-wider text-deep-navy">Your Growth Timeline</h3>
                <span className="text-[10px] font-mono text-burnt-orange font-bold uppercase">PERSISTENT DIARY</span>
              </div>

              <div className="space-y-4 max-h-72 overflow-y-auto no-scrollbar">
                {historicalActs.length > 0 ? (
                  historicalActs.map((act, idx) => (
                    <div key={act.id} className="relative flex gap-3 pl-1 group select-none">
                      {/* Vertical axis line */}
                      {idx !== historicalActs.length - 1 && (
                        <div className="absolute left-[11px] top-6 bottom-0 w-0.5 bg-deep-navy/5" />
                      )}
                      
                      {/* Point indicator */}
                      <div className="h-6 w-6 rounded-full bg-deep-navy/5 flex items-center justify-center border border-deep-navy/10 mt-1 flex-shrink-0">
                        <span className="text-xs">✓</span>
                      </div>

                      <div className="flex-grow pt-0.5">
                        <div className="flex justify-between items-baseline">
                          <span className="text-xs font-bold text-burnt-orange font-sans">{act.category}</span>
                          <span className="text-[9px] font-mono font-medium text-deep-navy/40">
                            {new Date(act.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        <p className="text-sm text-deep-navy/80 leading-relaxed font-sans mt-0.5 font-medium">{act.note}</p>
                        {act.amount && (
                          <span className="inline-block text-[9px] font-mono font-semibold bg-emerald-50 text-emerald-800 px-1.5 py-0.5 mt-1 rounded-md border border-emerald-500/10">
                            Logged: {act.amount}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-deep-navy/50 text-center italic py-4">No logged acts yet today. Start fasting or complete a bento quest!</p>
                )}
              </div>
            </div>

            {/* Clear database action */}
            <div className="pt-4 flex justify-center">
              <button 
                onClick={handleResetAllApp}
                className="text-[10px] font-mono text-deep-navy/40 hover:text-red-500 uppercase tracking-widest font-bold cursor-pointer transition-all hover:underline"
                id="btn-factory-reset"
              >
                RESET PLATFORM DIARY
              </button>
            </div>
          </motion.div>
        )}

        {activeTab === 'challenges' && (
          <motion.div 
            id="tabview-challenges"
            className="space-y-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* HERO HEADER */}
            <section className="space-y-2 select-none">
              <span className="text-xs font-mono font-extrabold text-burnt-orange uppercase tracking-[0.2em]">Spiritual Growth</span>
              <h2 className="text-4xl font-extrabold text-deep-navy tracking-tight font-sans">Daily Challenges</h2>
              <p className="text-deep-navy/60 text-sm font-medium leading-relaxed max-w-sm">
                Illuminating your path through discipline and communal connection.
              </p>
            </section>

            {/* CORE TARGET COMPONENT: Fasting Tracker */}
            <FastingTracker 
              fastingState={fastingState} 
              onStartFast={handleStartFast}
              onCompleteFast={handleCompleteFast}
              onResetFast={handleResetFast}
              onAddToast={addToast}
            />

            {/* Level & XP Card */}
            <XpProgress stats={userStats} />

            {/* Community Leaderboard */}
            <Leaderboard users={leaderboardUsers} onInviteFriend={handleInviteFriend} />

            {/* Upcoming Quests */}
            <UpcomingQuests 
              quests={quests} 
              userLevel={userStats.level} 
              isPremium={isPremium} 
              onCompleteQuest={handleCompleteQuest}
              onAddHistoricalAct={handleAddHistoricalAct}
              onAddToast={addToast}
            />
          </motion.div>
        )}

        {activeTab === 'premium' && (
          <motion.div 
            id="tabview-premium"
            className="space-y-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-gradient-to-br from-indigo-900 via-deep-navy to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-white/10 select-none">
              <div className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-amber-300 fill-amber-300 animate-pulse" />
                <span className="text-xs font-mono font-extrabold tracking-widest text-amber-300 uppercase">NUR PREMIUM SUITE</span>
              </div>
              <h3 className="text-2xl font-extrabold tracking-tight mt-3 font-sans">Reach Full Tranquility</h3>
              <p className="text-xs text-slate-300 leading-relaxed mt-1.5 font-medium">
                Unlock exclusive spiritual vectors, micro-group collaboration circles, custom notifications, and advanced diagnostic metrics.
              </p>

              {/* Status indicator */}
              <div className="mt-5 p-3.5 rounded-xl bg-white/10 border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-indigo-200 font-bold block uppercase tracking-wider">CURRENT COMPANION STATUS</span>
                  <span className="text-sm font-bold font-sans mt-0.5 inline-flex items-center gap-1.5 text-white">
                    {isPremium ? (
                      <>
                        <ShieldCheck className="w-4.5 h-4.5 text-green-400" />
                        Premium Active (Ascended)
                      </>
                    ) : (
                      'Free Account Tier'
                    )}
                  </span>
                </div>
                
                {/* Premium Switcher Button */}
                <button 
                  onClick={() => {
                    const nextVal = !isPremium;
                    setIsPremium(nextVal);
                    addToast(nextVal ? "Nur Premium activated successfully! All quests unlocked. ✨" : "Premium subscription disabled.", nextVal ? 'success' : 'info');
                  }}
                  className={`px-4 py-2 text-xs font-bold font-sans rounded-lg transition-all uppercase tracking-wider cursor-pointer shadow ${
                    isPremium 
                      ? 'bg-rose-500 hover:bg-rose-600 text-white' 
                      : 'bg-amber-300 text-indigo-950 hover:bg-amber-400 font-extrabold'
                  }`}
                  id="btn-toggle-premium"
                >
                  {isPremium ? 'DEACTIVATE' : 'ACTIVATE'}
                </button>
              </div>
            </div>

            {/* List of perks visual */}
            <div className="space-y-4 select-none">
              <h4 className="text-xs font-bold uppercase font-mono tracking-wider text-deep-navy">Premium Companionship Perks</h4>
              
              <div className="space-y-3">
                {PREMIUM_PERKS.map((perk, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-xl border border-deep-navy/6 shadow-sm flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-burnt-orange/10 flex items-center justify-center text-burnt-orange flex-shrink-0">
                      {idx === 0 ? '🔔' : idx === 1 ? '📊' : idx === 2 ? '👥' : '🎨'}
                    </div>
                    <div>
                      <h5 className="font-bold text-sm text-deep-navy font-sans">{perk.title}</h5>
                      <p className="text-xs text-deep-navy/55 leading-relaxed mt-1">{perk.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

      </main>

      {/* Persistent bottom navigational container */}
      <BottomNav activeTab={activeTab} onChangeTab={setActiveTab} />
    </div>
  );
}
