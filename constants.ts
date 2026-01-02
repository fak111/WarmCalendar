import { Anniversary, MoodType } from './types';

export const PUBLIC_HOLIDAYS: Anniversary[] = [
  { id: 'ph-new-year', name: '元旦', date: '01-01', type: 'PUBLIC' },
  { id: 'ph-spring-fest-2025', name: '春节', date: '2025-01-29', type: 'PUBLIC' }, // 2025 Specific
  { id: 'ph-valentines', name: '情人节', date: '02-14', type: 'PUBLIC' },
  { id: 'ph-womens', name: '妇女节', date: '03-08', type: 'PUBLIC' },
  { id: 'ph-520', name: '520', date: '05-20', type: 'PUBLIC' },
  { id: 'ph-childrens', name: '儿童节', date: '06-01', type: 'PUBLIC' },
  { id: 'ph-qixi-2025', name: '七夕', date: '2025-08-29', type: 'PUBLIC' }, // 2025 Specific
  { id: 'ph-mid-autumn-2025', name: '中秋节', date: '2025-10-06', type: 'PUBLIC' }, // 2025 Specific
  { id: 'ph-xmas-eve', name: '平安夜', date: '12-24', type: 'PUBLIC' },
  { id: 'ph-xmas', name: '圣诞节', date: '12-25', type: 'PUBLIC' },
];

export const MOOD_COLORS: Record<MoodType, string> = {
  [MoodType.HAPPY]: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  [MoodType.SAD]: 'bg-blue-100 text-blue-700 border-blue-300',
  [MoodType.ANGRY]: 'bg-red-100 text-red-700 border-red-300',
  [MoodType.NEUTRAL]: 'bg-gray-100 text-gray-700 border-gray-300',
};

export const MOOD_EMOJIS: Record<MoodType, string> = {
  [MoodType.HAPPY]: '😊',
  [MoodType.SAD]: '😢',
  [MoodType.ANGRY]: '😡',
  [MoodType.NEUTRAL]: '😐',
};
