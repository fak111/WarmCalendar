import React, { useState } from 'react';
import { UserSettings, PeriodSettings, Anniversary } from '../types';
import { Heart, Calendar as CalendarIcon, ArrowRight } from 'lucide-react';

interface Props {
  onComplete: (settings: UserSettings) => void;
}

const Onboarding: React.FC<Props> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [partnerName, setPartnerName] = useState('');
  const [lastPeriod, setLastPeriod] = useState('');
  const [cycleLength, setCycleLength] = useState(28);
  const [duration, setDuration] = useState(5);
  const [bday, setBday] = useState('');

  const handleFinish = () => {
    const periodSettings: PeriodSettings = {
      lastPeriodDate: lastPeriod,
      cycleLength,
      duration,
    };

    const initialAnniversaries: Anniversary[] = [];
    if (bday) {
      initialAnniversaries.push({
        id: 'private-bday',
        name: '她的生日',
        date: bday.slice(5), // MM-DD
        type: 'PRIVATE',
      });
    }

    const settings: UserSettings = {
      name,
      partnerName,
      periodSettings,
      anniversaries: initialAnniversaries,
      isOnboarded: true,
    };

    onComplete(settings);
  };

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <div className="flex justify-center mb-4">
          <div className="bg-rose-100 p-3 rounded-full">
            <Heart className="w-8 h-8 text-rose-500 fill-rose-500" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 text-center">
          {step === 1 ? '欢迎使用暖心日历' : step === 2 ? '关于她' : '重要日子'}
        </h1>

        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <p className="text-gray-500 text-center">让我们先认识一下彼此。</p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">你的昵称</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none transition"
                placeholder="例如：大白"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">她的昵称</label>
              <input
                type="text"
                value={partnerName}
                onChange={(e) => setPartnerName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none transition"
                placeholder="例如：宝宝"
              />
            </div>
            <button
              onClick={() => { if (name && partnerName) setStep(2); }}
              disabled={!name || !partnerName}
              className="w-full bg-rose-500 text-white py-3 rounded-xl font-medium mt-4 hover:bg-rose-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              下一步 <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-fade-in">
             <p className="text-gray-500 text-center">记录生理期，系统将自动智能预测。</p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">上次姨妈什么时候来的？</label>
              <input
                type="date"
                value={lastPeriod}
                onChange={(e) => setLastPeriod(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rose-500 outline-none"
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">周期长度 (天)</label>
                <input
                  type="number"
                  value={cycleLength}
                  onChange={(e) => setCycleLength(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">持续天数</label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none"
                />
              </div>
            </div>
             <button
              onClick={() => { if (lastPeriod) setStep(3); }}
              disabled={!lastPeriod}
              className="w-full bg-rose-500 text-white py-3 rounded-xl font-medium mt-4 hover:bg-rose-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              下一步 <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-fade-in">
             <p className="text-gray-500 text-center">千万不能忘记的日子。</p>
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">她的生日 (公历)</label>
              <input
                type="date"
                value={bday}
                onChange={(e) => setBday(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rose-500 outline-none"
              />
            </div>
            
            <button
              onClick={handleFinish}
              className="w-full bg-rose-500 text-white py-3 rounded-xl font-medium mt-8 hover:bg-rose-600 transition shadow-lg shadow-rose-200 flex items-center justify-center gap-2"
            >
              <CalendarIcon className="w-4 h-4" /> 生成专属日历
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
