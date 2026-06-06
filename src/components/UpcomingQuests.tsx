import React, { useState, useEffect } from 'react';
import { Lock, Heart, CheckCircle2, User, Volume2, VolumeX, Sparkles, Plus, Play, Calendar, HelpCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Quest, HistoricalAct } from '../types';

interface UpcomingQuestsProps {
  quests: Quest[];
  userLevel: number;
  isPremium: boolean;
  onCompleteQuest: (questId: string, xpReward: number) => void;
  onAddHistoricalAct: (act: HistoricalAct) => void;
  onAddToast: (text: string, type: 'success' | 'info' | 'level_up' | 'quest_complete') => void;
}

export default function UpcomingQuests({
  quests,
  userLevel,
  isPremium,
  onCompleteQuest,
  onAddHistoricalAct,
  onAddToast
}: UpcomingQuestsProps) {
  const [activeQuest, setActiveQuest] = useState<Quest | null>(null);
  
  // Meditation states
  const [breathState, setBreathState] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [meditationTime, setMeditationTime] = useState<number>(60); // 1 minute
  const [isMeditationRunning, setIsMeditationRunning] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Charity states
  const [charityCategory, setCharityCategory] = useState<string>('Monetary Giving');
  const [charityAmount, setCharityAmount] = useState<string>('');
  const [charityNote, setCharityNote] = useState<string>('');

  // General unlock status checker
  const isQuestUnlocked = (quest: Quest): boolean => {
    if (isPremium) return true; // Premium bypasses levels
    if (quest.unlockLevel && userLevel >= quest.unlockLevel) return true;
    return quest.status !== 'locked';
  };

  // Sound oscillator for breathing guide support (optional, clean synthesized sound!)
  const playBreathingTick = (frequency: number, duration: number) => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
      
      gainNode.gain.setValueAtTime(0.02, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio context blocked or not supported, ignore
    }
  };

  // Handle breathing sequence ticking
  useEffect(() => {
    let intervalId: number | undefined;
    let sequenceId: number | undefined;

    if (activeQuest?.id === 'meditation-master' && isMeditationRunning) {
      // 1. Run countdown timer
      intervalId = window.setInterval(() => {
        setMeditationTime((prev) => {
          if (prev <= 1) {
            handleCompleteMeditation();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // 2. Cycle breathing state every 4 seconds
      let cycle = 0;
      sequenceId = window.setInterval(() => {
        cycle = (cycle + 1) % 3;
        if (cycle === 0) {
          setBreathState('inhale');
          playBreathingTick(440, 0.4); // A4 note
        } else if (cycle === 1) {
          setBreathState('hold');
          playBreathingTick(554.37, 0.2); // C#5 note
        } else {
          setBreathState('exhale');
          playBreathingTick(349.23, 0.4); // F4 note
        }
      }, 4000);
    } else {
      setMeditationTime(60);
      setBreathState('inhale');
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
      if (sequenceId) clearInterval(sequenceId);
    };
  }, [activeQuest, isMeditationRunning]);

  const handleQuestClick = (quest: Quest) => {
    if (!isQuestUnlocked(quest)) {
      onAddToast(`Locked! Complete fasts and earn XP to reach Level ${quest.unlockLevel}, or upgrade to Premium for immediate access.`, 'info');
      return;
    }
    if (quest.status === 'completed') {
      onAddToast(`You have already completed the ${quest.title} challenge today. Outstanding discipline!`, 'success');
      return;
    }
    setActiveQuest(quest);
  };

  const handleCompleteMeditation = () => {
    setIsMeditationRunning(false);
    onCompleteQuest('meditation-master', 120);
    
    const newAct: HistoricalAct = {
      id: `act-${Date.now()}`,
      category: 'Spiritual Mind',
      note: 'Engaged in 2 minutes of quiet breathing and focused spiritual meditation.',
      timestamp: new Date().toISOString(),
      xpEarned: 120
    };
    onAddHistoricalAct(newAct);
    setActiveQuest(null);
  };

  const handleCharitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!charityNote.trim()) return;

    onCompleteQuest('charity-link', 150);
    
    const newAct: HistoricalAct = {
      id: `act-${Date.now()}`,
      category: charityCategory,
      amount: charityAmount.trim() ? `$${charityAmount.trim()}` : undefined,
      note: charityNote.trim(),
      timestamp: new Date().toISOString(),
      xpEarned: 150
    };
    
    onAddHistoricalAct(newAct);
    onAddToast(`Act of goodwill recorded successfully! You've earned +150 XP.`, 'success');
    
    // Clear inputs
    setCharityAmount('');
    setCharityNote('');
    setActiveQuest(null);
  };

  return (
    <div className="select-none">
      <h3 className="text-xl font-bold text-deep-navy font-sans tracking-tight mb-4">Upcoming Quests</h3>
      
      {/* 2x2 grid representing bento-grid in mockup */}
      <div className="grid grid-cols-2 gap-4">
        {quests.map((quest) => {
          const unlocked = isQuestUnlocked(quest);
          const completed = quest.status === 'completed';

          return (
            <div 
              key={quest.id}
              onClick={() => handleQuestClick(quest)}
              className={`glass-card rounded-2xl p-4 flex flex-col items-center text-center gap-3 relative group transition-all duration-300 border bg-white ${
                completed 
                  ? 'border-green-500/20 bg-green-50/10 cursor-pointer shadow-sm' 
                  : !unlocked 
                    ? 'opacity-40 border-deep-navy/5 cursor-not-allowed'
                    : 'border-deep-navy/6 hover:border-burnt-orange shadow-sm cursor-pointer hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              {/* Top corners status labels */}
              {completed && (
                <span className="absolute top-2 right-2 text-green-600">
                  <CheckCircle2 className="w-5 h-5 fill-green-50 text-green-600" />
                </span>
              )}
              {!unlocked && (
                <span className="absolute top-2 right-2 text-deep-navy/35">
                  <Lock className="w-4 h-4" />
                </span>
              )}
              {unlocked && !completed && quest.xpReward && (
                <span className="absolute top-2 right-2 text-[8px] font-mono font-extrabold uppercase bg-burnt-orange/10 text-burnt-orange px-1.5 py-0.5 rounded-full">
                  +{quest.xpReward} XP
                </span>
              )}

              {/* Central Vector Container */}
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                completed 
                  ? 'bg-green-100 text-green-600'
                  : !unlocked
                    ? 'bg-deep-navy/5 text-deep-navy/35'
                    : 'bg-deep-navy/5 text-burnt-orange group-hover:bg-burnt-orange/10'
              }`}>
                {/* Custom Lucide icons map match to Material symbol values */}
                {quest.id === 'meditation-master' ? (
                  <span className="text-xl">🧘</span>
                ) : quest.id === 'charity-link' ? (
                  <span className="text-xl">🤲</span>
                ) : quest.id === 'night-prayer' ? (
                  <span className="text-xl">🌙</span>
                ) : (
                  <span className="text-xl">📖</span>
                )}
              </div>

              <span className={`text-xs font-sans font-bold tracking-tight ${
                completed 
                  ? 'text-green-800' 
                  : !unlocked 
                    ? 'text-deep-navy/35' 
                    : 'text-deep-navy'
              }`}>
                {quest.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* DETAILED INTERACTIVE POPUPS FOR ACTIVE QUESTS */}
      <AnimatePresence>
        {activeQuest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              className="absolute inset-0 bg-deep-navy/30 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (activeQuest.id === 'meditation-master' && isMeditationRunning) {
                  if (confirm("Cancel current meditation session?")) {
                    setIsMeditationRunning(false);
                    setActiveQuest(null);
                  }
                } else {
                  setActiveQuest(null);
                }
              }}
            />

            {/* Modal Body */}
            <motion.div 
              className="bg-white rounded-2xl w-full max-w-sm p-6 relative border border-deep-navy/10 shadow-2xl overflow-hidden z-10"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
            >
              {/* Close button */}
              <button 
                onClick={() => {
                  if (activeQuest.id === 'meditation-master' && isMeditationRunning) {
                    if (confirm("Cancel meditating?")) {
                      setIsMeditationRunning(false);
                      setActiveQuest(null);
                    }
                  } else {
                    setActiveQuest(null);
                  }
                }}
                className="absolute right-4 top-4 text-deep-navy/40 hover:text-deep-navy cursor-pointer"
                id="btn-close-quest-modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* MEDITATION QUEST FORM */}
              {activeQuest.id === 'meditation-master' && (
                <div className="flex flex-col items-center text-center gap-5 pt-2">
                  <div className="h-10 w-10 rounded-full bg-burnt-orange/15 text-burnt-orange flex items-center justify-center">
                    <span className="text-lg">🧘</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-deep-navy font-sans">Spiritual Breathing Mastery</h4>
                    <p className="text-xs text-deep-navy/50 max-w-xs mt-1 leading-relaxed">
                      Deep rhythmic breathing activates the parasympathetic nerve pathway, fostering mental clarity. Follow the expanding orb.
                    </p>
                  </div>

                  {isMeditationRunning ? (
                    /* ACTIVE SEQUENCER */
                    <div className="flex flex-col items-center gap-6 py-4 w-full">
                      {/* Interactive breathing ball container */}
                      <div className="relative h-44 w-full flex items-center justify-center">
                        {/* Ring */}
                        <div className="absolute h-40 w-40 rounded-full border border-deep-navy/5" />
                        
                        {/* Dynamic breathing orb */}
                        <motion.div 
                          className={`rounded-full flex items-center justify-center text-white font-bold text-sm ${
                            breathState === 'inhale' 
                              ? 'bg-burnt-orange' 
                              : breathState === 'hold' 
                                ? 'bg-deep-navy' 
                                : 'bg-burnt-orange/70'
                          }`}
                          animate={{
                            scale: breathState === 'inhale' ? 1.6 : breathState === 'hold' ? 1.6 : 0.95,
                          }}
                          transition={{
                            duration: 4,
                            ease: "easeInOut"
                          }}
                          style={{ width: '80px', height: '80px' }}
                        >
                          <span className="uppercase text-xs font-mono font-bold tracking-widest select-none">
                            {breathState}
                          </span>
                        </motion.div>
                      </div>

                      {/* Display remaining duration */}
                      <div className="space-y-1">
                        <p className="text-3xl font-extrabold text-deep-navy font-mono">
                          00:{meditationTime < 10 ? `0${meditationTime}` : meditationTime}
                        </p>
                        <p className="text-[10px] font-mono font-bold uppercase text-deep-navy/40 tracking-wider">REMAINING TIME</p>
                      </div>

                      {/* Control buttons */}
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => setSoundEnabled(!soundEnabled)}
                          className="bg-deep-navy/5 hover:bg-deep-navy/10 text-deep-navy p-2.5 rounded-xl cursor-pointer"
                          title="Toggle Breath Tones"
                          id="btn-toggle-sound"
                        >
                          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                        </button>
                        <button 
                          onClick={() => setIsMeditationRunning(false)}
                          className="bg-deep-navy text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-deep-navy/90 transition-all cursor-pointer"
                          id="btn-pause-meditation"
                        >
                          PAUSE SESSION
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* INACTIVE INTRO */
                    <div className="py-6 w-full space-y-4">
                      <div className="text-center bg-deep-navy/5 p-4 rounded-xl border border-deep-navy/5">
                        <p className="text-3xl font-extrabold text-deep-navy font-sans tracking-tight">1:00</p>
                        <p className="text-[10px] font-mono font-bold text-deep-navy/40 tracking-widest uppercase mt-0.5">Session Target</p>
                      </div>

                      <button 
                        onClick={() => {
                          setIsMeditationRunning(true);
                          playBreathingTick(440, 0.4);
                        }}
                        className="w-full bg-burnt-orange text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all text-xs tracking-wider uppercase cursor-pointer"
                        id="btn-start-meditation"
                      >
                        <Play className="w-4 h-4 fill-white" />
                        START AUDIOBREATH SEQUENCE
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* CHARITY INTEGRATION FORM */}
              {activeQuest.id === 'charity-link' && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 border-b border-deep-navy/5 pb-3">
                    <div className="h-10 w-10 rounded-full bg-burnt-orange/15 text-burnt-orange flex items-center justify-center text-lg flex-shrink-0">
                      🤲
                    </div>
                    <div>
                      <h4 className="font-bold text-deep-navy font-sans text-base">Log Act of Charity</h4>
                      <p className="text-[10px] font-mono text-deep-navy/40 tracking-wide">COMPANION CHARITY TRACKER</p>
                    </div>
                  </div>

                  <form onSubmit={handleCharitySubmit} className="space-y-4">
                    {/* Log Type Selector */}
                    <div>
                      <label htmlFor="charity-type" className="block text-[10px] font-bold text-deep-navy/50 font-mono uppercase mb-1.5">
                        Category of Goodwill
                      </label>
                      <select 
                        id="charity-type"
                        className="w-full bg-deep-navy/5 border border-deep-navy/10 rounded-xl px-3 py-2.5 text-sm text-deep-navy font-sans focus:outline-none focus:ring-1 focus:ring-burnt-orange"
                        value={charityCategory}
                        onChange={(e) => setCharityCategory(e.target.value)}
                      >
                        <option value="Monetary Contribution">Monetary Contribution (Donated Funds)</option>
                        <option value="Sustenance Provision">Sustenance Provision (Feeding Others)</option>
                        <option value="Volunteer Service">Volunteer Service (Community Labor)</option>
                        <option value="Offering Kind Words">Offering Comfort (Kind Words & Guidance)</option>
                        <option value="Fostering Harmony">Fostering Harmony (Sincere Smile & Support)</option>
                      </select>
                    </div>

                    {/* Optional Amount */}
                    {(charityCategory === 'Monetary Contribution') && (
                      <div>
                        <label htmlFor="charity-sum" className="block text-[10px] font-bold text-deep-navy/50 font-mono uppercase mb-1.5">
                          Amount Given (USD/Optional)
                        </label>
                        <input 
                          id="charity-sum"
                          type="number" 
                          placeholder="e.g. 10" 
                          value={charityAmount}
                          onChange={(e) => setCharityAmount(e.target.value)}
                          className="w-full bg-deep-navy/5 border border-deep-navy/10 rounded-xl px-3 pl-4 py-2 text-sm text-deep-navy focus:outline-none focus:ring-1 focus:ring-burnt-orange"
                        />
                      </div>
                    )}

                    {/* Note details */}
                    <div>
                      <label htmlFor="charity-description" className="block text-[10px] font-bold text-deep-navy/50 font-mono uppercase mb-1.5">
                        Notes & Reflection
                      </label>
                      <textarea 
                        id="charity-description"
                        required
                        rows={3}
                        maxLength={200}
                        placeholder="Log what action you took today! e.g., Sent $25 to the relief fund program, or smiled and helped carrying groceries for our elders." 
                        value={charityNote}
                        onChange={(e) => setCharityNote(e.target.value)}
                        className="w-full bg-deep-navy/5 border border-deep-navy/10 rounded-xl px-3 py-2 text-sm text-deep-navy font-sans focus:outline-none focus:ring-1 focus:ring-burnt-orange resize-none"
                      />
                    </div>

                    <p className="text-[10px] text-deep-navy/40 leading-relaxed italic text-center select-none pt-1">
                      "Each joint of every person must perform charity every day the sun rises: to act justly between two people is a charity."
                    </p>

                    <button 
                      type="submit"
                      className="w-full bg-burnt-orange text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:brightness-110 transition-all text-xs uppercase tracking-wider cursor-pointer shadow-md"
                      id="btn-log-charity"
                    >
                      LOG DEED & EARN +150 XP
                    </button>
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
