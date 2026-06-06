import React, { useState } from 'react';
import { Trophy, Copy, Check, UserPlus, Star, Mail, Send, X, ShieldAlert } from 'lucide-react';
import { LeaderboardUser } from '../types';

interface LeaderboardProps {
  users: LeaderboardUser[];
  onInviteFriend: (email: string) => void;
}

export default function Leaderboard({ users, onInviteFriend }: LeaderboardProps) {
  const [isWeekly, setIsWeekly] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [showInviteModal, setShowInviteModal] = useState<boolean>(false);
  const [friendEmail, setFriendEmail] = useState<string>('');

  // Sort users by points dynamically
  const sortedUsers = [...users].sort((a, b) => b.points - a.points);
  
  // Assign dynamic rank indexes
  const rankedUsers = sortedUsers.map((u, i) => ({
    ...u,
    currentRank: i + 1
  }));

  // Find user with rank 1
  const firstRank = rankedUsers.find(u => u.currentRank === 1) || rankedUsers[0];
  // Other ranks
  const otherRanks = rankedUsers.filter(u => u.currentRank > 1);

  const handleCopyCode = () => {
    navigator.clipboard.writeText('NUR-UNITY-2024');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (friendEmail.trim() && friendEmail.includes('@')) {
      onInviteFriend(friendEmail.trim());
      setFriendEmail('');
      setShowInviteModal(false);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 relative flex flex-col gap-6 shadow-sm">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold font-sans text-deep-navy">Community Leaderboard</h3>
        
        <button 
          onClick={() => setIsWeekly(!isWeekly)}
          className="text-xs font-mono font-bold text-burnt-orange tracking-widest uppercase hover:underline cursor-pointer py-1 px-2 hover:bg-burnt-orange/5 rounded-md"
          id="btn-toggle-period"
        >
          {isWeekly ? 'WEEKLY' : 'ALL-TIME'}
        </button>
      </div>

      {/* #1 SPOT FEATURE CONTAINER */}
      <div className="relative bg-deep-navy/4 rounded-xl p-5 border border-deep-navy/8 overflow-hidden">
        {/* Background Decorative Badge */}
        <div className="absolute -right-2 -top-2 opacity-[0.06] transform rotate-12 pointer-events-none select-none">
          <Trophy className="w-28 h-28 text-deep-navy" />
        </div>

        <div className="flex items-center gap-4 relative z-10">
          <div className="relative flex-shrink-0">
            <div className={`w-16 h-16 rounded-full border-2 p-1 bg-white ${firstRank.isCurrentUser ? 'border-burnt-orange' : 'border-amber-400'}`}>
              <img 
                alt={firstRank.name} 
                className="w-full h-full rounded-full object-cover" 
                src={firstRank.avatarUrl}
              />
            </div>
            
            {/* Crown icon on top right */}
            <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center border border-amber-400 shadow-md">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            </div>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] bg-burnt-orange text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter">
                Rank 1
              </span>
              <h4 className="font-extrabold text-lg text-deep-navy font-sans mb-0">
                {firstRank.name} {firstRank.isCurrentUser && <span className="text-xs font-bold text-burnt-orange font-mono">(YOU)</span>}
              </h4>
            </div>
            <p className="text-xs text-deep-navy/60 font-medium mt-0.5">{firstRank.title}</p>
            <p className="text-burnt-orange font-extrabold text-sm mt-1">{firstRank.points.toLocaleString()} Pts</p>
          </div>
        </div>
      </div>

      {/* SUBSEQUENT RANKS CONTAINER */}
      <div className="flex flex-col gap-3 max-h-72 overflow-y-auto no-scrollbar pr-0.5">
        {otherRanks.map((user) => (
          <div 
            key={user.id} 
            className={`flex items-center gap-4 p-3 rounded-xl transition-all ${
              user.isCurrentUser 
                ? 'bg-burnt-orange/5 border border-burnt-orange/20 ring-1 ring-burnt-orange/10' 
                : 'bg-deep-navy/3 hover:bg-deep-navy/5 border border-transparent'
            }`}
          >
            <span className="font-mono text-xs text-deep-navy/40 w-4 font-bold text-center">
              {user.currentRank}
            </span>
            
            <div className="w-10 h-10 rounded-full object-cover border border-deep-navy/10 relative flex-shrink-0">
              <img 
                alt={user.name} 
                className="w-full h-full rounded-full object-cover" 
                src={user.avatarUrl}
              />
              {user.isCurrentUser && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-burnt-orange text-white flex items-center justify-center text-[8px] font-bold">
                  ★
                </div>
              )}
            </div>

            <div className="flex-grow min-w-0">
              <p className="text-sm font-extrabold text-deep-navy font-sans truncate">
                {user.name} {user.isCurrentUser && <span className="text-xs font-bold text-burnt-orange font-mono">(YOU)</span>}
              </p>
              <p className="text-[9px] text-deep-navy/45 uppercase tracking-widest font-bold truncate">
                {user.title}
              </p>
            </div>
            
            <p className="text-sm font-extrabold text-deep-navy/70 whitespace-nowrap">
              {user.points.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* INVITE CTA ROW */}
      <div className="mt-2 pt-5 border-t border-deep-navy/5 select-none">
        <p className="text-xs text-deep-navy/60 text-center mb-4 italic mt-1 font-sans">
          Growth is more meaningful when shared. Invite your circle.
        </p>
        
        <button 
          onClick={() => setShowInviteModal(true)}
          className="w-full bg-burnt-orange text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2.5 shadow-md hover:brightness-110 active:scale-[0.98] transition-all text-xs tracking-wider uppercase cursor-pointer"
          id="btn-invite-trigger"
        >
          <UserPlus className="w-4.5 h-4.5" />
          INVITE FRIENDS & EARN XP
        </button>

        <div className="mt-3 flex items-center justify-between gap-2 p-2 bg-white border border-deep-navy/10 rounded-xl">
          <code className="font-mono text-xs text-deep-navy font-bold flex-grow text-center tracking-wider px-1.5 py-0.5 select-all">
            NUR-UNITY-2024
          </code>
          <button 
            onClick={handleCopyCode}
            className={`flex items-center gap-1.5 p-1.5 rounded-lg text-deep-navy/50 hover:text-burnt-orange transition-all cursor-pointer ${copied ? 'bg-green-50 text-green-600' : 'hover:bg-deep-navy/5'}`}
            title="Copy Invitation Code"
            id="btn-copy-code"
          >
            {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* INVITE FRIENDS MODAL */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-deep-navy/30 backdrop-blur-sm" onClick={() => setShowInviteModal(false)} />
          
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 relative border border-deep-navy/10 shadow-2xl animate-scale-up z-10">
            <button 
              onClick={() => setShowInviteModal(false)}
              className="absolute right-4 top-4 text-deep-navy/50 hover:text-deep-navy cursor-pointer"
              id="btn-close-invite"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-full bg-burnt-orange/10 flex items-center justify-center text-burnt-orange">
                <Mail className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-deep-navy font-sans">Share the Path of Nur</h4>
              <p className="text-xs text-deep-navy/60 leading-relaxed">
                Invite companions to join your focus group. Earn <span className="font-extrabold text-burnt-orange">+150 XP</span> instantly for each verified invite completed!
              </p>

              <form onSubmit={handleSendInvite} className="w-full mt-2 space-y-3">
                <div className="relative">
                  <input 
                    type="email" 
                    required
                    placeholder="Enter friend's email address" 
                    value={friendEmail}
                    onChange={(e) => setFriendEmail(e.target.value)}
                    className="w-full bg-deep-navy/5 border border-deep-navy/10 rounded-xl pl-4 pr-10 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-burnt-orange focus:border-burnt-orange text-deep-navy font-sans"
                    id="input-friend-email"
                  />
                  <div className="absolute right-3.5 top-3.5 text-deep-navy/35">
                    <Send className="w-4 h-4" />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-burnt-orange text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-xs uppercase tracking-wider hover:brightness-110 transition-all cursor-pointer shadow-md"
                  id="btn-send-invite"
                >
                  SEND COMPANION INVITATION
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
