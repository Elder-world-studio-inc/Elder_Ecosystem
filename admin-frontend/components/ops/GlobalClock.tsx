"use client";

import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

const TIMEZONES = [
  { city: 'JAX', label: 'Jacksonville', tz: 'America/New_York' },
  { city: 'MEM', label: 'Memphis', tz: 'America/Chicago' },
  { city: 'MUX', label: 'Multan', tz: 'Asia/Karachi' },
];

export default function GlobalClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {TIMEZONES.map((zone) => {
        const localTime = time.toLocaleTimeString('en-US', {
          timeZone: zone.tz,
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        });
        
        return (
          <div key={zone.city} className="bg-gray-950 border border-gray-800 p-4 rounded-lg flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">{zone.city}</p>
              <p className="text-gray-400 text-xs">{zone.label}</p>
            </div>
            <div className="flex items-center gap-2 text-white font-mono text-xl">
              <Clock size={16} className="text-gray-600" />
              {localTime}
            </div>
          </div>
        );
      })}
    </div>
  );
}
