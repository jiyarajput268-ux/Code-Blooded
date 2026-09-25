import React from 'react';
import { Clock, RotateCcw, Play } from 'lucide-react';

export default function SimulatedTimeBanner({ clockState, onReset, onOpenDashboard }) {
  if (!clockState?.is_simulated) return null;

  const simDate = new Date(clockState.simulated_time).toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="bg-[#C5A059] text-white py-2 px-4 text-xs font-semibold flex items-center justify-between shadow-sm">
      <div className="flex items-center space-x-2">
        <Clock className="w-4 h-4 animate-spin text-white" />
        <span>
          <strong className="uppercase tracking-wider">Simulated Time Active:</strong> +{clockState.simulated_offset_minutes} mins ({simDate})
        </span>
      </div>

      <div className="flex items-center space-x-3">
        <button
          onClick={onOpenDashboard}
          className="hover:underline flex items-center space-x-1 font-bold text-white"
        >
          <Play className="w-3 h-3 fill-current" />
          <span>Adjust Speed</span>
        </button>
        <span>|</span>
        <button
          onClick={onReset}
          className="hover:underline flex items-center space-x-1 font-bold text-white"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Clock</span>
        </button>
      </div>
    </div>
  );
}
