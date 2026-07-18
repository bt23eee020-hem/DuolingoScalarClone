'use client';

import React, { useEffect, useState } from 'react';
import { Flame, Heart, Zap, Crown, Target } from 'lucide-react';
import { useUserStore } from '../store/useUserStore';
import { apiFetch } from '../services/api';

export default function StatsPanel() {
  const { user, updateHearts } = useUserStore();
  const [dailyGoal, setDailyGoal] = useState<{ goal_xp: number; current_xp: number; is_met: boolean } | null>(null);

  useEffect(() => {
    if (user) {
      apiFetch<{ goal_xp: number; current_xp: number; is_met: boolean }>('/api/users/daily-goal')
        .then(setDailyGoal)
        .catch(() => {});
    }
  }, [user, user?.xp]);

  if (!user) return null;

  const handleRefill = () => {
    if (user.hearts < 5) {
      updateHearts(5 - user.hearts, 'GAINED_REFILL');
    }
  };

  const progressPercent = dailyGoal 
    ? Math.min(100, Math.round((dailyGoal.current_xp / dailyGoal.goal_xp) * 100)) 
    : 0;

  return (
    <div className="hidden w-80 flex-col gap-6 p-6 xl:flex border-l border-gray-200 h-screen overflow-y-auto">
      {/* Stats Counters */}
      <div className="flex items-center justify-between gap-1 bg-transparent py-1">
        {/* Language flag pill */}
        <div className="flex items-center gap-1 rounded-xl border-2 border-gray-200 dark:border-[#37464f] p-1.5 hover:bg-gray-50 dark:hover:bg-[#202f36] cursor-pointer transition-colors shadow-sm shrink-0 bg-white dark:bg-[#131f24]">
          <span className="text-xl leading-none">🇪🇸</span>
        </div>

        {/* Streak count */}
        <div className="flex items-center gap-1.5 hover:bg-gray-50 dark:hover:bg-[#202f36] px-2.5 py-1.5 rounded-xl cursor-pointer transition-colors shrink-0">
          <Flame className={`h-5 w-5 ${user.streak > 0 ? 'text-orange-500 fill-orange-500' : 'text-gray-400'}`} />
          <span className="font-black text-sm text-gray-500 dark:text-gray-300">{user.streak}</span>
        </div>

        {/* Gems count */}
        <div className="flex items-center gap-1.5 hover:bg-gray-50 dark:hover:bg-[#202f36] px-2.5 py-1.5 rounded-xl cursor-pointer transition-colors shrink-0">
          <span className="text-base leading-none">💎</span>
          <span className="font-black text-sm text-cyan-500">500</span>
        </div>

        {/* Hearts count */}
        <div className="flex items-center gap-1.5 hover:bg-gray-50 dark:hover:bg-[#202f36] px-2.5 py-1.5 rounded-xl cursor-pointer transition-colors shrink-0" onClick={handleRefill}>
          <Heart className="h-5 w-5 text-red-500 fill-red-500" />
          <span className="font-black text-sm text-red-500">{user.hearts}</span>
        </div>
      </div>

      {/* Floating Mascot Duo Banner */}
      <div className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-gray-200 p-6 bg-gradient-to-br from-green-50 to-emerald-100 text-center shadow-sm overflow-hidden group">
        <div className="absolute -right-8 -top-8 w-24 h-24 bg-green-200 rounded-full opacity-35 group-hover:scale-110 transition-transform duration-300"></div>
        {/* Animated Flying Mascot placeholder using Emoji / SVG */}
        <div className="text-6xl mb-3 animate-bounce select-none">🦉</div>
        <h3 className="font-extrabold text-green-700 text-lg">Hi, I'm Duo!</h3>
        <p className="text-xs text-green-600 font-semibold mt-1">Keep learning to keep your streak active today!</p>
      </div>

      {/* Daily Goal card */}
      <div className="rounded-2xl border-2 border-gray-200 p-5 bg-white shadow-sm flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-blue-500" />
          <h3 className="font-extrabold text-gray-800 text-sm tracking-wide uppercase">Daily Quest</h3>
        </div>
        <div>
          <div className="flex justify-between items-center text-xs font-bold text-gray-500 mb-1.5">
            <span>Daily XP Goal</span>
            <span>{dailyGoal?.current_xp || 0} / {dailyGoal?.goal_xp || 50} XP</span>
          </div>
          <div className="w-full bg-gray-100 h-3.5 rounded-full overflow-hidden border border-gray-200">
            <div 
              className="bg-yellow-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
        {dailyGoal?.is_met ? (
          <div className="text-center rounded-xl bg-green-50 py-2 border border-green-200">
            <span className="text-xs font-bold text-green-600">🎉 Daily Quest Completed!</span>
          </div>
        ) : (
          <div className="text-center rounded-xl bg-blue-50 py-2 border border-blue-200">
            <span className="text-xs font-bold text-blue-600">Earn {Math.max(0, (dailyGoal?.goal_xp || 50) - (dailyGoal?.current_xp || 0))} more XP today</span>
          </div>
        )}
      </div>
    </div>
  );
}
