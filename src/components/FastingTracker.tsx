import React, { useState, useEffect } from 'react';
import { Timer, Play, CheckCircle, RefreshCw, AlertCircle, Plus, Minus } from 'lucide-react';
import { FastingState } from '../types';

interface FastingTrackerProps {
  fastingState: FastingState;
  onStartFast: (duration: number, startHour: number, startMinute: number) => void;
  onCompleteFast: () => void;
  onResetFast: () => void;
  onAddToast: (text: string, type: 'success' | 'info' | 'level_up' | 'quest_complete') => void;
}

export default function FastingTracker({
  fastingState,
  onStartFast,
  onCompleteFast,
  onResetFast,
  onAddToast
}: FastingTrackerProps) {
  // Config state for when fasting is inactive
  const [selectedDuration, setSelectedDuration] = useState<number>(16);
  const [customStartHour, setCustomStartHour] = useState<number>(4);
  const [customStartMinute, setCustomStartMinute] = useState<number>(12);

  // Active session timer tracking
  const [remainingSeconds, setRemainingSeconds] = useState<number>(14 * 3600 + 22 * 60);

  // Format Helper for AM/PM
  const formatTimeStr = (hour: number, minute: number): string => {
    const isPm = hour >= 12;
    const adjustedHour = hour % 12 === 0 ? 12 : hour % 12;
    const minuteStr = minute < 10 ? `0${minute}` : minute;
    const amPm = isPm ? 'PM' : 'AM';
    return `${adjustedHour < 10 ? '0' : ''}${adjustedHour}:${minuteStr} ${amPm}`;
  };

  // Convert Date object to HH:MM AM/PM
  const formatIsoToTimeStr = (isoStr: string | null): string => {
    if (!isoStr) return '--:--';
    const date = new Date(isoStr);
    return formatTimeStr(date.getHours(), date.getMinutes());
  };

  // Synchronize dynamic timer
  useEffect(() => {
    let intervalId: number | undefined;

    if (fastingState.isActive && fastingState.startTime && fastingState.endTime) {
      const calculateRemaining = () => {
        const now = new Date().getTime();
        const end = new Date(fastingState.endTime!).getTime();
        const diffMs = end - now;

        if (diffMs <= 0) {
          setRemainingSeconds(0);
          if (intervalId) clearInterval(intervalId);
        } else {
          setRemainingSeconds(Math.floor(diffMs / 1000));
        }
      };

      // Initial calculation
      calculateRemaining();

      // Start ticking
      intervalId = window.setInterval(calculateRemaining, 1000);
    } else {
      // Inactive: hardcode standard display consistent with the screenshot "14:22 OF 16 HOURS"
      setRemainingSeconds(14 * 3600 + 22 * 60 + 15);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [fastingState]);

  // Format seconds to HH:MM or MM:SS
  const formatRemaining = () => {
    const hrs = Math.floor(remainingSeconds / 3600);
    const mins = Math.floor((remainingSeconds % 3600) / 60);
    const secs = remainingSeconds % 60;

    const hrsStr = hrs < 10 ? `0${hrs}` : `${hrs}`;
    const minsStr = mins < 10 ? `0${mins}` : `${mins}`;
    
    // Ticking indicator
    return {
      hoursMinutes: `${hrsStr}:${minsStr}`,
      seconds: secs < 10 ? `0${secs}` : `${secs}`
    };
  };

  // Calculate percentage of complete time
  const getElapsedRatio = () => {
    if (!fastingState.isActive) {
      // Hardcoded matching screenshot to look like ~90% (Wait, 14:22 remaining of 16 means 1h 38m completed, which is ~10%. Wait, look at the screenshot! The orange progress band is around 75% full! Let's make it look consistent with the screenshot, or follow ratio: remaining 14h 22m out of 16h, meaning ~10% done, but visually a beautiful orange stroke as depicted!)
      return 0.72; // matching visually
    }
    
    if (fastingState.startTime && fastingState.endTime) {
      const totalMs = new Date(fastingState.endTime).getTime() - new Date(fastingState.startTime).getTime();
      const nowMs = new Date().getTime();
      const elapsedMs = nowMs - new Date(fastingState.startTime).getTime();
      
      if (elapsedMs <= 0) return 0;
      if (elapsedMs >= totalMs) return 1;
      return elapsedMs / totalMs;
    }
    return 0;
  };

  const elapsedRatio = getElapsedRatio();
  // SVG properties: circle radius R=88, perimeter = 2 * PI * R = 552.92
  const strokeDasharray = 2 * Math.PI * 88;
  const strokeDashoffset = strokeDasharray * (1 - elapsedRatio);

  const displayTime = formatRemaining();

  const handleStart = () => {
    onStartFast(selectedDuration, customStartHour, customStartMinute);
    onAddToast(`Started a ${selectedDuration}-hour fasting session! Keep illuminating your path.`, 'info');
  };

  const handleToggleDuration = (amount: number) => {
    const newDur = Math.max(8, Math.min(24, selectedDuration + amount));
    setSelectedDuration(newDur);
  };

  return (
    <div className="glass-card rounded-2xl p-6 flex flex-col gap-5 border-l-4 border-l-burnt-orange shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold font-sans text-deep-navy mb-0.5">Soonka Fast</h3>
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${fastingState.isActive ? 'bg-burnt-orange animate-pulse' : 'bg-gray-300'}`}></span>
            <span className={`text-xs font-mono font-bold tracking-widest ${fastingState.isActive ? 'text-burnt-orange' : 'text-gray-400'} uppercase`}>
              {fastingState.isActive ? 'ACTIVE SESSION' : 'INACTIVE'}
            </span>
          </div>
        </div>
        <Timer className={`w-7 h-7 text-burnt-orange ${fastingState.isActive ? 'animate-spin-slow' : ''}`} />
      </div>

      {fastingState.isActive ? (
        /* ACTIVE CONTAINER */
        <div className="flex flex-col items-center">
          <div className="relative py-4 flex flex-col items-center justify-center">
            {/* Countdown Ring */}
            <svg className="w-48 h-48 transform -rotate-90">
              <circle 
                className="text-deep-navy/8" 
                cx="96" 
                cy="96" 
                fill="transparent" 
                r="88" 
                stroke="currentColor" 
                strokeWidth="5"
              />
              <circle 
                className="transition-all duration-1000 ease-out" 
                cx="96" 
                cy="96" 
                fill="transparent" 
                r="88" 
                stroke="#CF5C36" 
                strokeDasharray={strokeDasharray} 
                strokeDashoffset={strokeDashoffset} 
                strokeLinecap="round" 
                strokeWidth="6"
              />
            </svg>
            <div className="absolute flex flex-col items-center text-center">
              <span className="text-4xl font-extrabold text-deep-navy tracking-tight font-sans">
                {displayTime.hoursMinutes}
              </span>
              <span className="text-xs font-mono text-deep-navy/40 font-bold uppercase mt-0.5">
                OF {fastingState.durationHours} HOURS
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full mt-4">
            <div className="bg-deep-navy/5 rounded-xl p-3.5 border border-deep-navy/5 text-center">
              <p className="text-[10px] font-mono text-deep-navy/40 uppercase tracking-widest font-bold mb-1">STARTED</p>
              <p className="text-sm font-extrabold text-deep-navy font-sans">{formatIsoToTimeStr(fastingState.startTime)}</p>
            </div>
            <div className="bg-deep-navy/5 rounded-xl p-3.5 border border-deep-navy/5 text-center">
              <p className="text-[10px] font-mono text-deep-navy/40 uppercase tracking-widest font-bold mb-1">IFTAR</p>
              <p className="text-sm font-extrabold text-deep-navy font-sans">{formatIsoToTimeStr(fastingState.endTime)}</p>
            </div>
          </div>

          <div className="flex gap-2 w-full mt-5">
            <button 
              onClick={onCompleteFast}
              className="flex-1 bg-burnt-orange text-white py-3.5 px-4 rounded-xl font-bold glow-primary hover:brightness-110 active:scale-[0.98] transition-all uppercase tracking-wider text-xs flex items-center justify-center gap-2 cursor-pointer"
              id="btn-complete-fasting"
            >
              <CheckCircle className="w-4.5 h-4.5" />
              Complete Fasting
            </button>
            
            <button 
              onClick={() => {
                if (confirm("Are you sure you want to cancel the active fasting tracker session? Progress won't be saved.")) {
                  onResetFast();
                  onAddToast("Fasting session cancelled.", "info");
                }
              }}
              className="bg-deep-navy/5 hover:bg-deep-navy/10 text-deep-navy/60 hover:text-deep-navy p-3 px-3.5 rounded-xl font-bold active:scale-[0.98] transition-all cursor-pointer"
              title="Reset Fasting Tracker"
              id="btn-reset-fasting"
            >
              <RefreshCw className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      ) : (
        /* INACTIVE / SETUP CONTAINER */
        <div className="flex flex-col gap-4 animate-fade-in">
          {/* Target Hours Choice */}
          <div className="bg-deep-navy/5 rounded-xl p-4 border border-deep-navy/5">
            <p className="text-xs font-mono text-deep-navy/50 font-bold uppercase tracking-wider mb-2">Configure target duration</p>
            <div className="flex items-center justify-between">
              <button 
                onClick={() => handleToggleDuration(-1)}
                className="w-8 h-8 rounded-full bg-white text-deep-navy flex items-center justify-center border border-deep-navy/10 hover:bg-burnt-orange/10 hover:text-burnt-orange transition-all cursor-pointer"
                id="btn-sub-duration"
              >
                <Minus className="w-4 h-4" />
              </button>
              <div className="text-center">
                <span className="text-4xl font-extrabold text-deep-navy font-sans">{selectedDuration}</span>
                <span className="text-xs text-deep-navy/60 font-medium ml-1">HOURS</span>
              </div>
              <button 
                onClick={() => handleToggleDuration(1)}
                className="w-8 h-8 rounded-full bg-white text-deep-navy flex items-center justify-center border border-deep-navy/10 hover:bg-burnt-orange/10 hover:text-burnt-orange transition-all cursor-pointer"
                id="btn-add-duration"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Time Picker Mock (Simple inline configuration) */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-deep-navy/5 rounded-xl p-3 border border-deep-navy/5">
              <label htmlFor="start-hour" className="block text-[10px] font-mono text-deep-navy/40 uppercase tracking-widest font-bold mb-1">START HOUR (0-23)</label>
              <input 
                id="start-hour"
                type="number" 
                min="0" 
                max="23" 
                value={customStartHour}
                onChange={(e) => setCustomStartHour(Math.max(0, Math.min(23, parseInt(e.target.value) || 0)))}
                className="w-full bg-transparent font-sans text-sm font-bold text-deep-navy focus:outline-none border-b border-deep-navy/10 py-0.5" 
              />
            </div>
            <div className="bg-deep-navy/5 rounded-xl p-3 border border-deep-navy/5">
              <label htmlFor="start-minute" className="block text-[10px] font-mono text-deep-navy/40 uppercase tracking-widest font-bold mb-1">START MINUTES</label>
              <input 
                id="start-minute"
                type="number" 
                min="0" 
                max="59" 
                value={customStartMinute}
                onChange={(e) => setCustomStartMinute(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                className="w-full bg-transparent font-sans text-sm font-bold text-deep-navy focus:outline-none border-b border-deep-navy/10 py-0.5" 
              />
            </div>
          </div>

          <div className="text-[11px] font-mono text-deep-navy/50 flex gap-1.5 items-center bg-deep-navy/3 p-2.5 rounded-lg border border-deep-navy/5">
            <AlertCircle className="w-4 h-4 text-burnt-orange flex-shrink-0" />
            <span>Fasting will end around <span className="font-bold text-deep-navy">{formatTimeStr((customStartHour + selectedDuration) % 24, customStartMinute)}</span>.</span>
          </div>

          <button 
            onClick={handleStart}
            className="w-full bg-burnt-orange text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all uppercase tracking-wider text-xs cursor-pointer shadow-md"
            id="btn-start-fasting"
          >
            <Play className="w-4 h-4" />
            Start Fasting Tracker
          </button>
        </div>
      )}
    </div>
  );
}
