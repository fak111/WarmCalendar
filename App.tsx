import React, { useState, useEffect } from 'react';
import { UserSettings } from './types';
import { getSettings, saveSettings } from './services/storage';
import Onboarding from './components/Onboarding';
import CalendarView from './components/CalendarView';

const App: React.FC = () => {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadedSettings = getSettings();
    if (loadedSettings && loadedSettings.isOnboarded) {
      setSettings(loadedSettings);
    }
    setLoading(false);
  }, []);

  const handleOnboardingComplete = (newSettings: UserSettings) => {
    saveSettings(newSettings);
    setSettings(newSettings);
  };

  if (loading) return <div className="min-h-screen bg-pink-50 flex items-center justify-center">Loading...</div>;

  return (
    <div className="antialiased text-gray-900">
      {!settings ? (
        <Onboarding onComplete={handleOnboardingComplete} />
      ) : (
        <CalendarView settings={settings} />
      )}
    </div>
  );
};

export default App;
