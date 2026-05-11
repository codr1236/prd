import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

export const TimeLeftDisplay = React.memo(() => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const tomorrow = new Date();
      tomorrow.setUTCHours(24, 0, 0, 0);
      const diff = tomorrow.getTime() - now.getTime();
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      return `${hours}h ${minutes}m ${seconds}s`;
    };

    setTimeLeft(calculateTime());
    const timer = setInterval(() => {
      setTimeLeft(calculateTime());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-4xl font-mono font-bold text-white mb-10 tracking-widest bg-zinc-800/30 py-4 rounded-2xl border border-zinc-800">
      {timeLeft}
    </div>
  );
});

TimeLeftDisplay.displayName = 'TimeLeftDisplay';
