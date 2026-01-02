import React, { useEffect, useState } from 'react';
import { DayStatus, ActionTask } from '../types';
import { AlertCircle, ShoppingBag, Coffee, CheckCircle, ExternalLink, CalendarClock } from 'lucide-react';
import { generateDailyAdvice } from '../services/geminiService';
import { saveTask, getTasksForDate } from '../services/storage';

interface Props {
  status: DayStatus;
  date: string;
  partnerName: string;
  onRefreshTasks: () => void;
}

const ReminderCard: React.FC<Props> = ({ status, date, partnerName, onRefreshTasks }) => {
  const [advice, setAdvice] = useState<{ title: string; content: string; actionItem: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState<ActionTask[]>([]);

  // Load existing tasks or generate new advice
  useEffect(() => {
    const loadData = async () => {
      // 1. Check local storage for existing tasks for this day
      const existingTasks = getTasksForDate(date);
      setTasks(existingTasks);

      // 2. Fetch Advice if it's a significant day
      setLoading(true);
      const adviceData = await generateDailyAdvice(status, partnerName);
      setAdvice(adviceData);
      setLoading(false);
    };

    loadData();
  }, [date, status, partnerName]);

  const handleCreateTask = () => {
    if (!advice) return;
    const newTask: ActionTask = {
      id: `${date}-${Date.now()}`,
      title: advice.title,
      description: advice.actionItem,
      type: status.isPeriod ? 'CARE' : 'PREPARE',
      isCompleted: false,
      date: date
    };
    saveTask(newTask);
    setTasks([...tasks, newTask]);
    onRefreshTasks();
  };

  const toggleTask = (taskId: string) => {
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return;
    
    const updatedTasks = [...tasks];
    updatedTasks[taskIndex].isCompleted = !updatedTasks[taskIndex].isCompleted;
    setTasks(updatedTasks);
    saveTask(updatedTasks[taskIndex]);
    onRefreshTasks();
  };

  // Determine Urgency Level
  // High Urgency: Period, Today is Anniversary, or Anniversary in <= 3 days
  const isHighUrgency = status.isPeriod || status.isAnniversary || (status.daysToAnniversary !== undefined && status.daysToAnniversary <= 3);
  
  // Medium Urgency: Anniversary approaching (4-15 days)
  const isMediumUrgency = !isHighUrgency && status.daysToAnniversary !== undefined && status.daysToAnniversary <= 15;

  const isPeriodPrep = status.isPeriodPrep;

  // Render logic
  // If nothing special, no tasks, not loading -> return null
  if (!isHighUrgency && !isMediumUrgency && !isPeriodPrep && tasks.length === 0 && !loading) {
    return null; 
  }

  // Styles
  let bgColor = 'bg-white text-gray-800 border border-gray-100';
  let subTextColor = 'text-gray-500';
  let icon = <AlertCircle className="w-5 h-5" />;
  
  if (isHighUrgency) {
    bgColor = 'bg-rose-500 text-white';
    subTextColor = 'text-rose-100';
    icon = <AlertCircle className="w-5 h-5 animate-pulse" />;
  } else if (isMediumUrgency) {
    bgColor = 'bg-blue-50 text-blue-900 border border-blue-200';
    subTextColor = 'text-blue-600';
    icon = <CalendarClock className="w-5 h-5 text-blue-500" />;
  } else if (isPeriodPrep) {
    bgColor = 'bg-pink-50 text-pink-900 border border-pink-200';
    subTextColor = 'text-pink-600';
  }

  const titleText = loading ? '思考中...' : (
      isMediumUrgency ? `还有${status.daysToAnniversary}天就是${status.anniversaryName}` : (advice?.title || '今日提醒')
  );

  return (
    <div className={`rounded-2xl p-6 shadow-xl mb-6 transition-all duration-300 transform hover:scale-[1.01] ${bgColor}`}>
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            {icon}
            {titleText}
          </h2>
          <p className={`mt-1 text-sm ${subTextColor}`}>
            {loading ? '正在生成暖心建议...' : advice?.content}
          </p>
        </div>
        
        {status.isPeriod && (
             <button onClick={() => window.open('https://search.jd.com/Search?keyword=暖宝宝&enc=utf-8', '_blank')} className={`p-2 rounded-full ${isHighUrgency ? 'bg-rose-400 hover:bg-rose-300' : 'bg-gray-100 hover:bg-gray-200'}`}>
                <ShoppingBag className="w-5 h-5" />
             </button>
        )}
      </div>

      <div className="mt-6 space-y-3">
         {/* Render existing tasks */}
         {tasks.map(task => (
             <div key={task.id} 
                  onClick={() => toggleTask(task.id)}
                  className={`flex items-center p-3 rounded-xl cursor-pointer transition ${isHighUrgency ? 'bg-rose-600/50 hover:bg-rose-600/70' : 'bg-white/60 hover:bg-white/80'}`}>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 ${task.isCompleted ? 'bg-green-400 border-green-400' : 'border-current'}`}>
                    {task.isCompleted && <CheckCircle className="w-3 h-3 text-white" />}
                </div>
                <span className={`flex-1 font-medium ${task.isCompleted ? 'line-through opacity-60' : ''}`}>{task.description}</span>
             </div>
         ))}

         {/* If no tasks but we have advice action item, show button to add it */}
         {tasks.length === 0 && advice && !loading && (
             <button 
                onClick={handleCreateTask}
                className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 ${isHighUrgency ? 'bg-white text-rose-600' : 'bg-gray-900 text-white'}`}
            >
                {status.isPeriod ? <Coffee className="w-4 h-4" /> : <ExternalLink className="w-4 h-4" />}
                执行：{advice.actionItem}
             </button>
         )}
      </div>
    </div>
  );
};

export default ReminderCard;
