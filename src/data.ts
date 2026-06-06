import { LeaderboardUser, Quest } from './types';

export const INITIAL_LEADERBOARD: LeaderboardUser[] = [
  {
    id: 'omar-farook',
    rank: 1,
    name: 'Omar Farook',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCL_5PKPeDmHECQ8k-9mI4WXm79OKjQ3_Ceg3lGHl0fM0CbqvJDblqCt2_j2-VMZOMehqbnXfkwEl15m00hIXbaZ6ksvb5czXSajfsQ5RlM9n6hg6zibjPxQifUGqSQKq279lDVvVyQTXanpLGtbIM0AwHLraAvAk_ponVt4-5fpa5TPCN7NkhoDx1mrndCQUWvVm0oQckNBe1lbf4KBs_-SLk81KFZ1FxZEJMCkQLJqXBi2FG8zhK80mzySPBPZqdURNiP50tpsWU',
    points: 2850,
    title: 'King of Good Deeds'
  },
  {
    id: 'layla-s',
    rank: 2,
    name: 'Layla S.',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCtSFt9dogs-5KXIn5Yp7qE-HLMlCWm4zmTE1dHXaRFKrT5TZBB75UYHEmTd5TwfSv51yOJkOCz1M-qxXtaYYQAy9BsZzcsFJrC2YSfTp7qgoUQoD49pjLjFrIzeV_3HkQbRnLw6opMC6jrBOk2KTamjoIU4t-36C0IWedjaREn8Lf3orLZjeCln1J18wZFa7ZEFLEgmStUUgXA49KOuMiMytws1KkfyJ_vwNLE2Dco_Oobzbd9oXmsdJpOAdeWmxw6OFmIYa-Pco8',
    points: 2420,
    title: 'Virtue Seeker'
  },
  {
    id: 'ahmed-k',
    rank: 3,
    name: 'Ahmed K.',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFAzihuqgPGHDkntY23_4j-JgKGOx7abbqSe75_8rvgYaIMaFcYRJ-I65yj63xnumsiNpidRMjzSBbH9Qpx8PApGh6gLxRtXyRUxM-IUabFunHAV8bxF3KuPUwJM-8WL7Tc75z8_w4y5cNHKhFduf7xn-mBiTXMLqmuvsYMdcavEH2eLGpGJOIi7-Rmph20phjMIOMXCw-4HlT-kYSCv0qyMX0abtdcpH7Mpskkxy2nbE91TbcPPUIsjl-7Xgmsr_Bi4Ks8r8GvVk',
    points: 2100,
    title: 'Pillar Strength'
  }
];

export const INITIAL_QUESTS: Quest[] = [
  {
    id: 'meditation-master',
    title: 'Meditation Master',
    icon: 'self_improvement',
    status: 'available',
    xpReward: 120,
    description: 'Engage in 2 minutes of focused spiritual breathing and mindfulness to clear your mind and align your spirit.'
  },
  {
    id: 'charity-link',
    title: 'Charity Link',
    icon: 'volunteer_activism',
    status: 'available',
    xpReward: 150,
    description: 'Log a direct act of giving or service today—whether a small monetary contribution, volunteering time, or offering kind words of support.'
  },
  {
    id: 'night-prayer',
    title: 'Night Prayer',
    icon: 'lock',
    status: 'locked',
    unlockLevel: 13,
    xpReward: 200,
    description: 'Unlocks at Level 13. Strengthen your discipline by scheduling and recording your night-time devotions.'
  },
  {
    id: 'holy-recitation',
    title: 'Holy Recitation',
    icon: 'lock',
    status: 'locked',
    unlockLevel: 15,
    xpReward: 250,
    description: 'Unlocks at Level 15. Track your Daily Verses read and deepen your structural study of scripture.'
  }
];

export const SPIRITUAL_QUOTES = [
  {
    text: "The best of fasting is that which disciplines the soul and opens the heart to goodwill.",
    author: "Reflections on Wisdom"
  },
  {
    text: "True spiritual growth comes not merely from refraining, but from actively replacing with virtue.",
    author: "Al-Jawziyyah"
  },
  {
    text: "When you give in silence, your wealth moves from your hands into the eternal treasury of the spirit.",
    author: "Saying of Devotion"
  },
  {
    text: "Quiet your mind, and your heart will catch the illumination it has been seeking.",
    author: "Spiritual Proverb"
  }
];

export const PREMIUM_PERKS = [
  {
    title: 'Precision Prayer Alerts',
    description: 'High-accuracy, latitude-based push notifications for and sunrise/sunset timings.',
    icon: 'notifications_active'
  },
  {
    title: 'Advanced Analytics Dashboard',
    description: 'Understand your monthly discipline coefficients, prayer consistency indexes, and mood correlation matrices.',
    icon: 'insights'
  },
  {
    title: 'Communal Circles',
    description: 'Form private growth micro-circles with close family and friends with custom, private dashboards and fast progress indicators.',
    icon: 'groups'
  },
  {
    title: 'Custom Notification Sounds & Illumination Themes',
    description: 'Unlock stunning themes like Twilight Rose, Cosmic Obsidian, or Warm Amber, and authentic audio recordings.',
    icon: 'palette'
  }
];
