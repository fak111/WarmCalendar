import React, { useState, useEffect } from 'react';
import { MoodType, MoodLog } from '../types';
import { MOOD_COLORS, MOOD_EMOJIS } from '../constants';
import { saveMood, getMoodForDate } from '../services/storage';

interface Props {
  date: string;
  onSave: () => void;
}

const MoodTracker: React.FC<Props> = ({ date, onSave }) => {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [note, setNote] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const existing = getMoodForDate(date);
    if (existing) {
        setSelectedMood(existing.mood);
        setNote(existing.note);
        setIsSaved(true);
    } else {
        setSelectedMood(null);
        setNote('');
        setIsSaved(false);
    }
  }, [date]);

  const handleSave = () => {
    if (!selectedMood) return;
    saveMood({
        date,
        mood: selectedMood,
        note
    });
    setIsSaved(true);
    onSave();
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">她今天心情怎么样？</h3>
      
      <div className="grid grid-cols-4 gap-3 mb-4">
        {Object.values(MoodType).map((mood) => (
          <button
            key={mood}
            onClick={() => { setSelectedMood(mood); setIsSaved(false); }}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
              selectedMood === mood
                ? MOOD_COLORS[mood]
                : 'border-transparent bg-gray-50 text-gray-400 hover:bg-gray-100'
            }`}
          >
            <span className="text-2xl mb-1">{MOOD_EMOJIS[mood]}</span>
            <span className="text-xs font-medium">{mood}</span>
          </button>
        ))}
      </div>

      <div className="relative">
        <textarea
          value={note}
          onChange={(e) => { setNote(e.target.value); setIsSaved(false); }}
          placeholder="简单记一句原因，比如：因为没吃到好吃的..."
          className="w-full bg-gray-50 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 resize-none h-20"
        />
      </div>

      {!isSaved && (
          <button 
            onClick={handleSave}
            disabled={!selectedMood}
            className="w-full mt-4 bg-gray-900 text-white py-2.5 rounded-xl font-medium disabled:opacity-50 hover:bg-black transition"
          >
            记录心情
          </button>
      )}
      {isSaved && (
          <div className="mt-4 text-center text-sm text-green-600 flex items-center justify-center gap-1">
              <span>已归档，明年今日精准避雷</span>
          </div>
      )}
    </div>
  );
};

export default MoodTracker;
