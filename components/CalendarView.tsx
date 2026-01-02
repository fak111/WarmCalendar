import React, { useState, useMemo } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  addMonths, 
  subMonths, 
  isSameMonth, 
  isSameDay, 
  addDays,
  addYears,
  differenceInDays,
  parseISO
} from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Calendar as CalIcon } from 'lucide-react';
import { UserSettings, DayStatus } from '../types';
import { PUBLIC_HOLIDAYS } from '../constants';
import ReminderCard from './ReminderCard';
import MoodTracker from './MoodTracker';

interface Props {
  settings: UserSettings;
}

const CalendarView: React.FC<Props> = ({ settings }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Generate Calendar Grid
  const days = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { locale: zhCN }); 
    const endDate = endOfWeek(monthEnd, { locale: zhCN });
    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [currentDate]);

  // Merge Public Holidays with Private User Anniversaries
  const allAnniversaries = useMemo(() => {
    return [...PUBLIC_HOLIDAYS, ...settings.anniversaries.filter(a => a.type === 'PRIVATE')];
  }, [settings.anniversaries]);

  // Logic to calculate status for a specific day
  const getDayStatus = (day: Date): DayStatus => {
    const dayStr = format(day, 'yyyy-MM-dd');
    const status: DayStatus = {
        isPeriod: false,
        isPeriodPrep: false,
        isPeriodRecovery: false,
        isAnniversary: false
    };

    // 1. Period Logic
    const lastPeriod = parseISO(settings.periodSettings.lastPeriodDate);
    const diff = differenceInDays(day, lastPeriod);
    const cycleLength = settings.periodSettings.cycleLength;
    const duration = settings.periodSettings.duration;
    
    if (diff >= 0) {
        const cyclePos = diff % cycleLength;
        if (cyclePos < duration) {
            status.isPeriod = true;
        } else if (cyclePos >= cycleLength - 3 && cyclePos < cycleLength) {
            status.isPeriodPrep = true;
        } else if (cyclePos >= duration && cyclePos < duration + 3) {
            status.isPeriodRecovery = true;
        }
    }

    // 2. Anniversary Logic (Enhanced for Next Year wrapping)
    allAnniversaries.forEach(a => {
        let targetDate: Date;
        let isExactMatch = false;

        if (a.date.length === 5) { // Recurring MM-DD
            const currentYear = day.getFullYear();
            const dateStr = `${currentYear}-${a.date}`;
            targetDate = parseISO(dateStr);
            
            // Exact day match check (for calendar dot/styling)
            if (isSameDay(targetDate, day)) {
                isExactMatch = true;
            }

            // Countdown check logic (relative to 'day')
            // If the date in this year has passed relative to 'day', look at next year
            let daysDiff = differenceInDays(targetDate, day);
            if (daysDiff < 0) {
                targetDate = addYears(targetDate, 1);
                daysDiff = differenceInDays(targetDate, day);
            }

            if (isExactMatch) {
                status.isAnniversary = true;
                status.anniversaryName = a.name;
            } else if (daysDiff > 0 && daysDiff <= 15) {
                // If this holiday is coming up within 15 days
                if (!status.daysToAnniversary || daysDiff < status.daysToAnniversary) {
                    status.daysToAnniversary = daysDiff;
                    status.anniversaryName = a.name;
                }
            }

        } else { // Fixed YYYY-MM-DD (e.g., Specific Lunar Holidays like Spring Fest 2025)
             targetDate = parseISO(a.date);
             if (isSameDay(targetDate, day)) {
                status.isAnniversary = true;
                status.anniversaryName = a.name;
             }
             const daysDiff = differenceInDays(targetDate, day);
             if (daysDiff > 0 && daysDiff <= 15) {
                 if (!status.daysToAnniversary || daysDiff < status.daysToAnniversary) {
                     status.daysToAnniversary = daysDiff;
                     status.anniversaryName = a.name;
                }
             }
        }
    });

    return status;
  };

  const selectedDayStatus = useMemo(() => getDayStatus(selectedDate), [selectedDate, settings, allAnniversaries]);

  return (
    <div className="max-w-md mx-auto min-h-screen bg-pink-50/50 pb-20">
        {/* Header */}
        <div className="bg-white p-4 shadow-sm sticky top-0 z-10 flex justify-between items-center rounded-b-2xl">
            <h1 className="text-xl font-bold text-gray-800">{format(currentDate, 'yyyy年 MM月', { locale: zhCN })}</h1>
            <div className="flex gap-2">
                <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="p-2 hover:bg-gray-100 rounded-full">
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <button onClick={() => setCurrentDate(new Date())} className="p-2 hover:bg-gray-100 rounded-full">
                    <CalIcon className="w-5 h-5 text-rose-500" />
                </button>
                <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="p-2 hover:bg-gray-100 rounded-full">
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
            </div>
        </div>

        {/* Calendar Grid */}
        <div className="p-4">
            <div className="grid grid-cols-7 mb-2">
                {['日', '一', '二', '三', '四', '五', '六'].map(d => (
                    <div key={d} className="text-center text-xs text-gray-400 font-medium py-2">{d}</div>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-y-2">
                {days.map(day => {
                    const status = getDayStatus(day);
                    const isSelected = isSameDay(day, selectedDate);
                    const isToday = isSameDay(day, new Date());
                    const isCurrentMonth = isSameMonth(day, currentDate);
                    
                    let bgClass = '';
                    let textClass = isCurrentMonth ? 'text-gray-800' : 'text-gray-300';
                    
                    if (status.isPeriod) {
                        bgClass = 'bg-rose-100 text-rose-700';
                    } else if (status.isAnniversary) {
                        bgClass = 'bg-amber-100 text-amber-700 font-bold border border-amber-300';
                    } else if (status.isPeriodPrep) {
                         bgClass = 'bg-rose-50/50 text-rose-400';
                    }

                    if (isSelected) {
                        bgClass = 'bg-gray-900 text-white shadow-lg ring-2 ring-offset-2 ring-gray-900';
                        textClass = 'text-white';
                    } else if (isToday) {
                        textClass = 'text-rose-500 font-bold';
                    }

                    return (
                        <div key={day.toString()} className="flex flex-col items-center">
                            <button 
                                onClick={() => setSelectedDate(day)}
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm transition-all relative ${bgClass} ${textClass}`}
                            >
                                {format(day, 'd')}
                                {status.isAnniversary && !isSelected && <div className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full" />}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>

        {/* Action Panel */}
        <div className="px-4 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
                 <h2 className="text-lg font-bold text-gray-900">
                     {isSameDay(selectedDate, new Date()) ? '今日' : format(selectedDate, 'MM月dd日')}概况
                 </h2>
                 {selectedDayStatus.anniversaryName && (
                     <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-bold">
                         {selectedDayStatus.anniversaryName}
                     </span>
                 )}
            </div>

            <ReminderCard 
                date={format(selectedDate, 'yyyy-MM-dd')}
                status={selectedDayStatus}
                partnerName={settings.partnerName}
                onRefreshTasks={() => setRefreshTrigger(prev => prev + 1)}
            />

            <MoodTracker 
                date={format(selectedDate, 'yyyy-MM-dd')}
                onSave={() => setRefreshTrigger(prev => prev + 1)}
            />
        </div>
    </div>
  );
};

export default CalendarView;
