export interface FastingState {
  isActive: boolean;
  durationHours: number;
  startTime: string | null;
  endTime: string | null;
  isCompleted: boolean;
}

export interface UserStats {
  level: number;
  xp: number;
  nextLevelXp: number;
  fastsCompletedCount: number;
  points: number;
}

export interface LeaderboardUser {
  id: string;
  rank: number;
  name: string;
  avatarUrl: string;
  points: number;
  title: string;
  isCurrentUser?: boolean;
}

export interface Quest {
  id: string;
  title: string;
  icon: string;
  status: 'available' | 'completed' | 'locked';
  unlockLevel?: number;
  xpReward: number;
  description: string;
}

export interface HistoricalAct {
  id: string;
  category: string;
  amount?: string;
  note: string;
  timestamp: string;
  xpEarned: number;
}

export interface Notification {
  id: string;
  text: string;
  timestamp: string;
  type: 'success' | 'info' | 'level_up' | 'quest_complete';
}
