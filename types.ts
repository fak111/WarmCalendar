export enum MoodType {
  HAPPY = '开心',
  SAD = '委屈',
  ANGRY = '生气',
  NEUTRAL = '平稳',
}

export interface MoodLog {
  date: string; // ISO date string YYYY-MM-DD
  mood: MoodType;
  note: string;
}

export interface PeriodSettings {
  lastPeriodDate: string; // YYYY-MM-DD
  cycleLength: number; // e.g., 28
  duration: number; // e.g., 5
}

export interface Anniversary {
  id: string;
  name: string;
  date: string; // MM-DD (recurring) or YYYY-MM-DD (one time)
  type: 'PUBLIC' | 'PRIVATE';
}

export interface UserSettings {
  name: string;
  partnerName: string;
  periodSettings: PeriodSettings;
  anniversaries: Anniversary[];
  isOnboarded: boolean;
}

export interface DayStatus {
  isPeriod: boolean;
  isPeriodPrep: boolean; // 3 days before
  isPeriodRecovery: boolean; // 3 days after
  isAnniversary: boolean;
  anniversaryName?: string;
  daysToAnniversary?: number; // If close
}

export interface ActionTask {
  id: string;
  title: string;
  description: string;
  type: 'SHOPPING' | 'CARE' | 'PREPARE';
  isCompleted: boolean;
  date: string;
}
