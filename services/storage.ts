import { UserSettings, MoodLog, ActionTask } from '../types';

const SETTINGS_KEY = 'warmcal_settings';
const MOODS_KEY = 'warmcal_moods';
const TASKS_KEY = 'warmcal_tasks';

export const saveSettings = (settings: UserSettings) => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

export const getSettings = (): UserSettings | null => {
  const data = localStorage.getItem(SETTINGS_KEY);
  return data ? JSON.parse(data) : null;
};

export const saveMood = (mood: MoodLog) => {
  const moods = getMoods();
  // Upsert
  const index = moods.findIndex((m) => m.date === mood.date);
  if (index >= 0) {
    moods[index] = mood;
  } else {
    moods.push(mood);
  }
  localStorage.setItem(MOODS_KEY, JSON.stringify(moods));
};

export const getMoods = (): MoodLog[] => {
  const data = localStorage.getItem(MOODS_KEY);
  return data ? JSON.parse(data) : [];
};

export const getMoodForDate = (date: string): MoodLog | undefined => {
  const moods = getMoods();
  return moods.find((m) => m.date === date);
};

export const saveTask = (task: ActionTask) => {
  const tasks = getTasks();
  const index = tasks.findIndex(t => t.id === task.id);
  if (index >= 0) {
    tasks[index] = task;
  } else {
    tasks.push(task);
  }
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
};

export const getTasks = (): ActionTask[] => {
  const data = localStorage.getItem(TASKS_KEY);
  return data ? JSON.parse(data) : [];
};

export const getTasksForDate = (date: string): ActionTask[] => {
  return getTasks().filter(t => t.date === date);
}
