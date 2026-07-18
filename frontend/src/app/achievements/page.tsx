'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '../../services/api';
import Sidebar from '../../components/Sidebar';
import StatsPanel from '../../components/StatsPanel';
import { Award, Lock, CheckCircle2, Zap, Flame, Crown, BookOpen } from 'lucide-react';
import { useUserStore } from '../../store/useUserStore';

interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  target_type: string;
  target_value: number;
  unlocked: boolean;
  unlocked_at: string | null;
}

export default function Achievements() {
  const { user } = useUserStore();

  const { data: achievements, isLoading } = useQuery<Achievement[]>({
    queryKey: ['achievements'],
    queryFn: () => apiFetch<Achievement[]>('/api/achievements'),
    enabled: !!user,
  });

  const getIcon = (iconName: string, unlocked: boolean) => {
    const color = unlocked ? 'text-orange-500 fill-orange-100' : 'text-gray-300';
    switch (iconName) {
      case 'zap': return <Zap className={`h-8 w-8 ${color}`} />;
      case 'flame': return <Flame className={`h-8 w-8 ${color}`} />;
      case 'crown': return <Crown className={`h-8 w-8 ${color}`} />;
      case 'book-open': return <BookOpen className={`h-8 w-8 ${color}`} />;
      default: return <Award className={`h-8 w-8 ${color}`} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-white text-gray-800">
      <Sidebar />

      <main className="flex-1 flex min-h-screen md:pl-64">
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-2xl mx-auto">
            {/* Header banner */}
            <div className="flex flex-col items-center justify-center rounded-2xl bg-gradient-to-r from-orange-400 to-rose-500 text-white p-6 shadow-md border-b-4 border-rose-600 text-center mb-8">
              <Award className="h-16 w-16 mb-2 drop-shadow-md animate-bounce" />
              <h2 className="text-3xl font-black tracking-wide">Your Achievements</h2>
              <p className="text-sm font-semibold text-rose-100 mt-1">Unlock badges as you complete language milestones</p>
            </div>

            {/* Achievements List */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <span className="text-4xl animate-spin">🌀</span>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wide mt-2">Loading milestones...</span>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {achievements?.map((ach) => (
                  <div
                    key={ach.id}
                    className={`flex items-start justify-between p-5 rounded-2xl border-2 transition-all duration-200 bg-white ${
                      ach.unlocked
                        ? 'border-orange-200 shadow-sm'
                        : 'border-gray-200 opacity-75'
                    }`}
                  >
                    <div className="flex gap-4">
                      {/* Icon */}
                      <div className="p-3 rounded-2xl bg-gray-50 flex items-center justify-center">
                        {getIcon(ach.icon, ach.unlocked)}
                      </div>
                      
                      <div>
                        <h3 className="font-black text-lg text-gray-800 flex items-center gap-2">
                          {ach.title}
                          {ach.unlocked && <CheckCircle2 className="h-5 w-5 text-green-500 fill-green-50" />}
                        </h3>
                        <p className="text-sm font-semibold text-gray-500 mt-1">
                          {ach.description}
                        </p>
                        
                        <div className="mt-2.5 inline-block rounded-lg bg-gray-100 px-2.5 py-1 text-[11px] font-extrabold text-gray-500 uppercase tracking-wide">
                          Target: {ach.target_value} {ach.target_type.toUpperCase()}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end">
                      {ach.unlocked ? (
                        <span className="text-[10px] font-bold text-green-600 uppercase tracking-wider bg-green-50 px-2 py-1 rounded-lg border border-green-200">
                          Unlocked
                        </span>
                      ) : (
                        <div className="flex items-center gap-1 text-gray-400 font-bold text-xs uppercase tracking-wider">
                          <Lock className="h-3.5 w-3.5" />
                          <span>Locked</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <StatsPanel />
      </main>
    </div>
  );
}
