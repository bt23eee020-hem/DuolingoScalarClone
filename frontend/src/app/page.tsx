'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useUserStore } from '../store/useUserStore';
import { apiFetch } from '../services/api';
import AuthPage from '../components/AuthPage';
import Sidebar from '../components/Sidebar';
import StatsPanel from '../components/StatsPanel';
import LearningPathMap from '../components/LearningPathMap';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

import { 
  Trophy, Shield, Award, Flame, Zap, Lock, Sparkles, Smartphone, Target, 
  FlaskConical, Calendar, ArrowRight, BookOpen, Heart, AlertTriangle, 
  CheckCircle, Snowflake, Search, Mail, ChevronRight, Edit2, Plus, 
  Medal, X, UserPlus, Check, Copy, Settings as SettingsIcon, Save 
} from 'lucide-react';

// ==========================================
// 1. LEADERBOARD VIEW
// ==========================================
interface LeaderboardEntry {
  id: number;
  user_id: number;
  username: string;
  weekly_xp: number;
  league_name: string;
  rank: number;
}

function LeaderboardView() {
  const { user } = useUserStore();
  const [league, setLeague] = useState('Bronze');

  const { data: standings, isLoading } = useQuery<LeaderboardEntry[]>({
    queryKey: ['leaderboard', league],
    queryFn: () => apiFetch<LeaderboardEntry[]>(`/api/leaderboard?league=${league}`),
    enabled: !!user,
  });

  const leaguesList = ['Bronze', 'Silver', 'Gold'];

  return (
    <div className="max-w-2xl mx-auto py-6">
      <div className="flex flex-col items-center justify-center rounded-3xl bg-gradient-to-r from-yellow-400 to-amber-500 text-white p-6 shadow-md border-b-4 border-amber-600 text-center mb-8">
        <Trophy className="h-16 w-16 mb-2 drop-shadow-md animate-bounce" />
        <h2 className="text-3xl font-black tracking-wide">Weekly Leaderboard</h2>
        <p className="text-sm font-semibold text-amber-100 mt-1">Compete against other learners in your league</p>
      </div>

      <div className="flex gap-2 mb-6 border-b-2 border-gray-155 pb-3 justify-center">
        {leaguesList.map((lg) => (
          <button
            key={lg}
            onClick={() => setLeague(lg)}
            className={`px-6 py-2.5 rounded-full font-black text-sm tracking-wide uppercase transition-all duration-200 border-b-4 cursor-pointer ${
              league === lg
                ? 'bg-yellow-400 text-white border-yellow-600'
                : 'bg-gray-100 text-gray-400 border-gray-300 hover:bg-gray-200'
            }`}
          >
            {lg} League
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <span className="text-4xl animate-spin">🌀</span>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wide mt-2">Updating standings...</span>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {standings?.map((entry) => {
            const isCurrentUser = entry.user_id === user?.id;
            let rankColor = 'bg-gray-100 text-gray-600';
            let rankIcon = null;
            if (entry.rank === 1) {
              rankColor = 'bg-yellow-100 text-yellow-600';
              rankIcon = <Award className="h-5 w-5 text-yellow-500 fill-yellow-500" />;
            } else if (entry.rank === 2) {
              rankColor = 'bg-slate-200 text-slate-700';
              rankIcon = <Shield className="h-5 w-5 text-slate-400 fill-slate-400" />;
            } else if (entry.rank === 3) {
              rankColor = 'bg-orange-100 text-orange-700';
              rankIcon = <Shield className="h-5 w-5 text-orange-400 fill-orange-400" />;
            }

            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-200 ${
                  isCurrentUser ? 'border-blue-400 bg-blue-50 shadow-sm' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center font-black ${rankColor}`}>
                    {rankIcon ? rankIcon : entry.rank}
                  </div>
                  <span className={`font-black text-md ${isCurrentUser ? 'text-blue-600' : 'text-gray-800'}`}>
                    {entry.username} {isCurrentUser && '(You)'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-gray-500 uppercase tracking-wider">{entry.weekly_xp} XP</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ==========================================
// 2. QUESTS VIEW
// ==========================================
function QuestsView() {
  const { user } = useUserStore();
  if (!user) return null;

  const xpProgress = Math.min(user.xp, 10);

  return (
    <div className="max-w-2xl mx-auto py-6">
      <div className="rounded-3xl bg-purple-500 text-white p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 mb-8 relative overflow-hidden">
        <div className="flex-1">
          <h2 className="text-2xl font-black tracking-tight mb-2">Welcome!</h2>
          <p className="text-sm font-semibold text-purple-100 leading-relaxed max-w-sm">
            Complete quests to earn rewards! Quests refresh every day.
          </p>
        </div>
        <div className="flex items-center justify-center shrink-0 relative">
          <div className="text-7xl animate-bounce">🦉</div>
          <div className="absolute -top-2 -right-2 text-3xl">🎁</div>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-black tracking-tight">Daily Quests</h3>
          <div className="flex items-center gap-1.5 text-xs font-black uppercase text-orange-500 tracking-wide">
            <ClockIcon className="h-4 w-4" />
            <span>1 HOUR</span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border-2 border-gray-200 p-5 bg-white shadow-sm flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-yellow-400 flex items-center justify-center text-white shrink-0 shadow-sm">
              <Zap className="h-6 w-6 fill-yellow-200" />
            </div>
            <div className="flex-1">
              <h4 className="font-extrabold text-gray-700 text-base">Earn 10 XP</h4>
              <div className="flex items-center gap-3 mt-2 w-full">
                <div className="flex-1 h-3.5 bg-gray-100 rounded-full overflow-hidden border border-gray-200 relative">
                  <div 
                    className="bg-yellow-400 h-full rounded-full transition-all duration-300"
                    style={{ width: `${(xpProgress / 10) * 100}%` }}
                  ></div>
                </div>
                <span className="text-xs font-black text-gray-400 shrink-0">{xpProgress} / 10</span>
                <span className="text-xl shrink-0" title="Chest Reward">📦</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border-2 border-gray-200 border-dashed p-5 bg-gray-50/50 flex items-center gap-4 opacity-75">
            <div className="h-12 w-12 rounded-xl bg-gray-200 flex items-center justify-center text-gray-400 shrink-0">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <div>
              <h4 className="font-extrabold text-gray-400 text-base">More quests unlock soon</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Temporary Helper icon
function ClockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}

// ==========================================
// 3. SHOP VIEW
// ==========================================
function ShopView() {
  const { user, fetchProfile } = useUserStore();
  const [purchasing, setPurchasing] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error' | null; text: string }>({
    type: null,
    text: '',
  });
  const [streakFreezesEquipped, setStreakFreezesEquipped] = useState(0);

  if (!user) return null;

  const handleRefill = async () => {
    if (user.hearts >= 5) {
      setMsg({ type: 'error', text: 'Your hearts are already full!' });
      return;
    }
    setPurchasing(true);
    setMsg({ type: null, text: '' });
    try {
      await apiFetch('/api/users/update-hearts', {
        method: 'POST',
        body: JSON.stringify({ amount: 5 - user.hearts, change_type: 'GAINED_PURCHASE' }),
      });
      await fetchProfile();
      setMsg({ type: 'success', text: 'Hearts refilled successfully! 💎 350 spent.' });
    } catch (err: any) {
      setMsg({ type: 'error', text: err.message || 'Purchase failed.' });
    } finally {
      setPurchasing(false);
    }
  };

  const handleBuyStreakFreeze = () => {
    if (streakFreezesEquipped >= 2) {
      setMsg({ type: 'error', text: 'You can only equip up to 2 Streak Freezes at a time!' });
      return;
    }
    setPurchasing(true);
    setTimeout(() => {
      setStreakFreezesEquipped(prev => prev + 1);
      setMsg({ type: 'success', text: 'Streak Freeze equipped successfully! 💎 200 spent.' });
      setPurchasing(false);
    }, 500);
  };

  return (
    <div className="max-w-2xl mx-auto py-6">
      <div className="rounded-3xl bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 text-white p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 mb-8 relative overflow-hidden">
        <div className="flex-1">
          <h2 className="text-2xl font-black tracking-tight mb-2">Start a family plan!</h2>
          <p className="text-sm font-semibold text-purple-200 leading-relaxed max-w-sm mb-4">
            Save on Super Duolingo when you learn with friends
          </p>
          <button className="rounded-2xl bg-slate-50 text-slate-900 font-extrabold uppercase py-3 px-6 text-xs border-b-4 border-gray-300 transition-all hover:translate-y-[1px] active:translate-y-[2px] cursor-pointer">
            Learn More
          </button>
        </div>
        <div className="flex items-center justify-center shrink-0">
          <div className="text-7xl animate-pulse">👥🦉</div>
        </div>
      </div>

      {msg.type && (
        <div className={`mb-6 rounded-2xl p-4 border-2 flex items-center gap-3 font-bold text-sm ${
          msg.type === 'success' ? 'bg-green-50 border-green-200 text-green-600' : 'bg-red-50 border-red-200 text-red-600'
        }`}>
          {msg.type === 'success' ? <CheckCircle className="h-5 w-5 shrink-0" /> : <AlertTriangle className="h-5 w-5 shrink-0" />}
          <span>{msg.text}</span>
        </div>
      )}

      <div className="mb-8">
        <h3 className="text-xl font-black tracking-tight mb-6">Hearts</h3>
        <div className="flex flex-col border-t border-gray-200 divide-y divide-gray-200">
          <div className="py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-5">
              <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center text-red-500 shrink-0">
                <Heart className="h-9 w-9 fill-red-500" />
              </div>
              <div>
                <h4 className="font-black text-gray-800 text-xl">Refill Hearts</h4>
                <p className="text-sm text-gray-500 font-semibold mt-1 max-w-md">
                  Get full hearts so you can worry less about making mistakes in a lesson
                </p>
              </div>
            </div>
            <button
              onClick={handleRefill}
              disabled={purchasing}
              className="rounded-2xl border-2 border-gray-200 bg-white hover:bg-gray-50 active:bg-gray-100 text-blue-500 font-black px-6 py-3.5 uppercase text-sm tracking-wider transition-all flex items-center justify-center gap-1.5 shrink-0 border-b-4 border-gray-300 cursor-pointer disabled:opacity-50"
            >
              <span>Get for:</span>
              <span className="text-cyan-500">💎 350</span>
            </button>
          </div>

          <div className="py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-5">
              <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-cyan-400 to-indigo-500 flex items-center justify-center text-white shrink-0 shadow-md">
                <Sparkles className="h-9 w-9 fill-cyan-100 animate-pulse" />
              </div>
              <div>
                <h4 className="font-black text-gray-800 text-xl">Unlimited Hearts</h4>
                <p className="text-sm text-gray-500 font-semibold mt-1 max-w-md">
                  Never run out of hearts with Super!
                </p>
              </div>
            </div>
            <button className="rounded-2xl border-2 border-purple-500 bg-purple-50 hover:bg-purple-100 text-purple-600 font-black px-6 py-3.5 uppercase text-sm tracking-wider transition-all shrink-0 border-b-4 border-purple-300 cursor-pointer">
              Free Trial
            </button>
          </div>
        </div>
      </div>

      <div className="mb-8 mt-4">
        <h3 className="text-xl font-black tracking-tight mb-6">Power-Ups</h3>
        <div className="flex flex-col border-t border-gray-200 divide-y divide-gray-200">
          <div className="py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-5">
              <div className="h-16 w-16 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-500 shrink-0">
                <Snowflake className="h-9 w-9 fill-cyan-50" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-black text-gray-800 text-xl">Streak Freeze</h4>
                  <span className="text-xs font-black text-gray-400 bg-gray-100 px-3 py-1 rounded-full uppercase tracking-wide">
                    {streakFreezesEquipped} / 2 EQUIPPED
                  </span>
                </div>
                <p className="text-sm text-gray-500 font-semibold mt-1 max-w-md">
                  Streak Freeze allows your streak to remain in place for one day of inactivity.
                </p>
              </div>
            </div>
            <button
              onClick={handleBuyStreakFreeze}
              disabled={purchasing}
              className="rounded-2xl border-2 border-gray-200 bg-white hover:bg-gray-50 active:bg-gray-100 text-blue-500 font-black px-6 py-3.5 uppercase text-sm tracking-wider transition-all flex items-center justify-center gap-1.5 shrink-0 border-b-4 border-gray-300 cursor-pointer disabled:opacity-50"
            >
              <span>Get for:</span>
              <span className="text-cyan-500">💎 200</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 4. PROFILE VIEW
// ==========================================
function ProfileView() {
  const { user } = useUserStore();
  const [activeTab, setActiveTab] = useState<'following' | 'followers'>('following');
  const [isFindOpen, setIsFindOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

  const [friendsList, setFriendsList] = useState([
    { username: 'polyglot_alice', name: 'Alice Smith', following: false },
    { username: 'streak_king', name: 'David Miller', following: false },
    { username: 'language_master', name: 'Sophia Chen', following: false },
    { username: 'newbie_bob', name: 'Bob Jones', following: false },
    { username: 'duo_mascot', name: 'Duo Owl', following: false },
  ]);

  if (!user) return null;

  const joinDate = new Date(user.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  });

  const filteredFriends = friendsList.filter(
    (f) => f.username.toLowerCase().includes(searchQuery.toLowerCase()) || f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFollow = (username: string) => {
    setFriendsList(prev => prev.map(f => (f.username === username ? { ...f, following: !f.following } : f)));
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      const inviteUrl = `${window.location.origin}/invite?ref=${user.username}`;
      navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const followingCount = friendsList.filter(f => f.following).length;

  return (
    <div className="max-w-5xl mx-auto py-6 flex flex-col lg:flex-row gap-8">
      {/* Left Column (Main Profile) */}
      <div className="flex-1 flex flex-col gap-8">
        
        {/* Profile Header Card */}
        <div className="border-b-2 border-gray-200 dark:border-gray-800 pb-8">
          <div className="w-full h-48 rounded-2xl bg-[#4b96b8] dark:bg-[#1a3442] flex items-center justify-center relative shadow-sm overflow-hidden mb-4">
            <div className="absolute right-4 top-4 bg-black/30 p-2 rounded-full cursor-pointer hover:bg-black/50 transition-colors">
              <Edit2 className="h-4 w-4 text-white" />
            </div>
            {/* Avatar outline silhouette */}
            <div className="relative w-32 h-40 mt-16">
              <div className="absolute inset-0 bg-[#3a7d9b] dark:bg-[#20516b] rounded-t-full border-4 border-dashed border-[#84d8ff] dark:border-[#1cb0f6] flex items-center justify-center shadow-lg">
                <Plus className="h-8 w-8 text-[#1a3442] dark:text-[#0b1f2b]" />
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-black text-gray-800 dark:text-white tracking-tight">{user.username}</h2>
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mt-1">{user.username.toLowerCase()}_</p>
              <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mt-3">Joined {joinDate}</p>
              
              <div className="flex items-center gap-4 mt-3 text-[15px] font-black text-blue-500 dark:text-blue-400 uppercase tracking-wide">
                <span className="cursor-pointer hover:opacity-80 transition-opacity">{followingCount} Following</span>
                <span className="cursor-pointer hover:opacity-80 transition-opacity">0 Followers</span>
              </div>
            </div>
            <div className="text-3xl" title="Active Language">🇪🇸</div>
          </div>
        </div>

        {/* Statistics Section */}
        <div>
          <h3 className="text-2xl font-black text-gray-800 dark:text-white mb-4 tracking-tight">Statistics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl border-2 border-gray-200 dark:border-gray-800 p-4 flex items-center gap-4 bg-white dark:bg-[#202f36] shadow-sm">
              <Flame className="h-7 w-7 text-gray-300 dark:text-gray-600 fill-gray-300 dark:fill-gray-600 shrink-0" />
              <div>
                <div className="text-xl font-black text-gray-800 dark:text-white leading-none">{user.streak}</div>
                <div className="text-[13px] font-bold text-gray-400 dark:text-gray-500 mt-1">Day streak</div>
              </div>
            </div>
            <div className="rounded-2xl border-2 border-gray-200 dark:border-gray-800 p-4 flex items-center gap-4 bg-white dark:bg-[#202f36] shadow-sm">
              <Zap className="h-7 w-7 text-yellow-500 fill-yellow-500 shrink-0" />
              <div>
                <div className="text-xl font-black text-gray-800 dark:text-white leading-none">{user.xp || 0}</div>
                <div className="text-[13px] font-bold text-gray-400 dark:text-gray-500 mt-1">Total XP</div>
              </div>
            </div>
            <div className="rounded-2xl border-2 border-gray-200 dark:border-gray-800 p-4 flex items-center gap-4 bg-white dark:bg-[#202f36] shadow-sm">
              <Shield className="h-7 w-7 text-gray-300 dark:text-gray-600 fill-gray-300 dark:fill-gray-600 shrink-0" />
              <div>
                <div className="text-xl font-black text-gray-800 dark:text-white leading-none">None</div>
                <div className="text-[13px] font-bold text-gray-400 dark:text-gray-500 mt-1">Current league</div>
              </div>
            </div>
            <div className="rounded-2xl border-2 border-gray-200 dark:border-gray-800 p-4 flex items-center gap-4 bg-white dark:bg-[#202f36] shadow-sm">
              <Medal className="h-7 w-7 text-gray-300 dark:text-gray-600 fill-gray-300 dark:fill-gray-600 shrink-0" />
              <div>
                <div className="text-xl font-black text-gray-800 dark:text-white leading-none">0</div>
                <div className="text-[13px] font-bold text-gray-400 dark:text-gray-500 mt-1">Top 3 finishes</div>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-black text-gray-800 dark:text-white tracking-tight">Achievements</h3>
            <span className="text-sm font-black text-blue-500 dark:text-blue-400 uppercase tracking-widest cursor-pointer hover:opacity-80">View All</span>
          </div>
          <div className="rounded-2xl border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-[#202f36] flex flex-col divide-y-2 divide-gray-200 dark:divide-gray-800 shadow-sm">
            
            {/* Wildfire Achievement */}
            <div className="p-6 flex gap-6 items-center">
              <div className="relative shrink-0">
                <div className="w-20 h-24 rounded-2xl bg-[#ff4b4b] border-b-4 border-[#cc3c3c] flex items-center justify-center overflow-hidden">
                  <Flame className="h-10 w-10 text-yellow-300 fill-yellow-300" />
                  <div className="absolute bottom-1 bg-white/20 px-2 py-0.5 rounded-full text-[10px] font-black text-white uppercase tracking-wider">Level 1</div>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-end mb-2">
                  <h4 className="text-xl font-black text-gray-800 dark:text-white">Wildfire</h4>
                  <span className="text-[15px] font-bold text-gray-400">{user.streak}/3</span>
                </div>
                <div className="w-full h-4 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${Math.min((user.streak/3)*100, 100)}%` }}></div>
                </div>
                <p className="text-sm font-bold text-gray-500 dark:text-gray-400">Reach a 3 day streak</p>
              </div>
            </div>

            {/* Sage Achievement */}
            <div className="p-6 flex gap-6 items-center">
              <div className="relative shrink-0">
                <div className="w-20 h-24 rounded-2xl bg-[#58cc02] border-b-4 border-[#46a302] flex items-center justify-center overflow-hidden flex-col">
                  <span className="text-4xl">🧙‍♂️</span>
                  <div className="absolute bottom-1 bg-white/20 px-2 py-0.5 rounded-full text-[10px] font-black text-white uppercase tracking-wider">Level 1</div>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-end mb-2">
                  <h4 className="text-xl font-black text-gray-800 dark:text-white">Sage</h4>
                  <span className="text-[15px] font-bold text-gray-400">{user.xp || 0}/100</span>
                </div>
                <div className="w-full h-4 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${Math.min(((user.xp || 0)/100)*100, 100)}%` }}></div>
                </div>
                <p className="text-sm font-bold text-gray-500 dark:text-gray-400">Earn 100 XP</p>
              </div>
            </div>

            {/* Champion Achievement */}
            <div className="p-6 flex gap-6 items-center">
              <div className="relative shrink-0">
                <div className="w-20 h-24 rounded-2xl bg-[#ce82ff] border-b-4 border-[#a568cc] flex flex-col items-center justify-center overflow-hidden">
                  <Award className="h-10 w-10 text-yellow-300 fill-yellow-300" />
                  <div className="absolute bottom-1 bg-white/20 px-2 py-0.5 rounded-full text-[10px] font-black text-white uppercase tracking-wider">Level 1</div>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-end mb-2">
                  <h4 className="text-xl font-black text-gray-800 dark:text-white">Champion</h4>
                  <span className="text-[15px] font-bold text-gray-400">0/1</span>
                </div>
                <div className="w-full h-4 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-yellow-400 rounded-full" style={{ width: '0%' }}></div>
                </div>
                <p className="text-sm font-bold text-gray-500 dark:text-gray-400">Unlock Leaderboards by completing 10 lessons</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Right Column (Sidebar specifically for Profile) */}
      <div className="lg:w-[340px] shrink-0 flex flex-col gap-6">
        
        {/* Top Stats */}
        <div className="hidden lg:flex items-center justify-end gap-6 text-sm font-black mb-2">
          <span className="text-xl cursor-pointer">🇪🇸</span>
          <div className="flex items-center gap-1.5 text-gray-400 cursor-pointer hover:opacity-80">
            <Flame className="h-5 w-5 text-gray-400 fill-gray-400" />
            <span>{user.streak}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#1cb0f6] cursor-pointer hover:opacity-80">
            <span className="text-lg">💎</span>
            <span>500</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#ff4b4b] cursor-pointer hover:opacity-80">
            <Heart className="h-5 w-5 fill-[#ff4b4b]" />
            <span>{user.hearts}</span>
          </div>
        </div>

        {/* Following/Followers Card */}
        <div className="rounded-2xl border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-[#202f36] shadow-sm overflow-hidden flex flex-col">
          <div className="flex w-full">
            <button 
              onClick={() => setActiveTab('following')}
              className={`flex-1 py-4 text-xs font-black uppercase tracking-widest transition-colors ${activeTab === 'following' ? 'text-[#1cb0f6] border-b-2 border-[#1cb0f6]' : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
            >
              Following
            </button>
            <button 
              onClick={() => setActiveTab('followers')}
              className={`flex-1 py-4 text-xs font-black uppercase tracking-widest transition-colors ${activeTab === 'followers' ? 'text-[#1cb0f6] border-b-2 border-[#1cb0f6]' : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
            >
              Followers
            </button>
          </div>
          {activeTab === 'following' && followingCount > 0 ? (
            <div className="flex flex-col p-4 max-h-60 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800">
              {friendsList.filter(f => f.following).map(friend => (
                <div key={friend.username} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-500 font-bold text-lg">
                      {friend.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-extrabold text-[15px] text-gray-800 dark:text-white">{friend.name}</div>
                      <div className="text-xs text-gray-400">@{friend.username}</div>
                    </div>
                  </div>
                  <button onClick={() => toggleFollow(friend.username)} className="text-xs font-bold text-gray-400 hover:text-red-500 transition-colors uppercase">
                    Unfollow
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 flex flex-col items-center">
              {/* Friends Illustration */}
              <div className="w-full flex justify-center mb-6 relative h-24 items-end">
                <span className="text-4xl absolute -left-2 z-10 transform -scale-x-1">🙍‍♀️</span>
                <span className="text-4xl absolute left-6 z-20">👩🏽‍🎤</span>
                <span className="text-5xl absolute left-14 z-30 mb-2">👦🏼</span>
                <span className="text-4xl absolute left-24 z-20">👱‍♀️</span>
                <span className="text-4xl absolute right-12 z-20 mb-1">👨🏻</span>
                <span className="text-3xl absolute right-4 z-10">👵🏼</span>
                <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 absolute bottom-0 rounded-full" />
              </div>
              <p className="text-center text-[15px] font-bold text-gray-600 dark:text-gray-300 leading-relaxed px-4">
                Learning is more fun and effective when you connect with others.
              </p>
            </div>
          )}
        </div>

        {/* Add friends card */}
        <div className="rounded-2xl border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-[#202f36] shadow-sm p-4">
          <h4 className="text-lg font-black text-gray-800 dark:text-white mb-2 px-2">Add friends</h4>
          <div className="flex flex-col">
            <button 
              onClick={() => setIsFindOpen(true)}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full flex items-center justify-center shrink-0">
                  <Search className="h-6 w-6 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
                </div>
                <span className="text-[15px] font-black text-gray-800 dark:text-white">Find friends</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
            </button>
            <div className="w-full h-[2px] bg-gray-100 dark:bg-gray-800 my-1 ml-14" />
            <button 
              onClick={() => setIsInviteOpen(true)}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-2xl">📬</span>
                </div>
                <span className="text-[15px] font-black text-gray-800 dark:text-white">Invite friends</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
            </button>
          </div>
        </div>

        {/* Footer links */}
        <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center px-4 pt-4 text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-loose">
          <a href="#" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">About</a>
          <a href="#" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Blog</a>
          <a href="#" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Store</a>
          <a href="#" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Efficacy</a>
          <a href="#" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Careers</a>
          <a href="#" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Investors</a>
          <a href="#" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Terms</a>
          <a href="#" className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors">Privacy</a>
        </div>
      </div>

      {/* MODALS */}
      <AnimatePresence>
        {isFindOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-md rounded-3xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-[#202f36] p-6 shadow-2xl text-gray-800 dark:text-white">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-black">Find Friends</h3>
                <button onClick={() => setIsFindOpen(false)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 cursor-pointer"><X className="h-5 w-5" /></button>
              </div>
              <div className="relative mt-4">
                <Search className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                <input type="text" placeholder="Search name or username..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-[#131f24] pl-10 pr-4 py-3 font-bold text-sm focus:border-blue-400 focus:outline-none" />
              </div>
              <div className="mt-4 max-h-60 overflow-y-auto flex flex-col gap-2">
                {filteredFriends.map(friend => (
                  <div key={friend.username} className="flex items-center justify-between p-3 rounded-2xl border-2 border-gray-150 dark:border-gray-700">
                    <div>
                      <div className="font-extrabold text-sm">{friend.name}</div>
                      <div className="text-[10px] text-gray-400">@{friend.username}</div>
                    </div>
                    <button onClick={() => toggleFollow(friend.username)} className="rounded-xl bg-blue-500 text-white px-4 py-2 text-xs font-black uppercase shadow-sm">{friend.following ? 'Following' : 'Follow'}</button>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isInviteOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-sm rounded-3xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-[#202f36] p-6 shadow-2xl text-gray-800 dark:text-white">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-black">Invite Friends</h3>
                <button onClick={() => setIsInviteOpen(false)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 cursor-pointer"><X className="h-5 w-5" /></button>
              </div>
              <div className="flex flex-col items-center gap-4 mt-6">
                <span className="text-5xl animate-bounce">📬</span>
                <p className="text-xs text-gray-400 font-semibold text-center">Share this learning link with friends!</p>
                <div className="flex items-center gap-2 w-full mt-2 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#131f24] p-2 overflow-hidden">
                  <span className="text-[10px] font-semibold text-gray-500 flex-1 truncate px-2">{typeof window !== 'undefined' ? `${window.location.origin}/invite?ref=${user.username}` : ''}</span>
                  <button onClick={handleCopyLink} className="h-9 px-3.5 rounded-xl text-xs font-black uppercase bg-blue-500 text-white border-b-4 border-blue-700">{copied ? 'Copied' : 'Copy'}</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ==========================================
// 5. SETTINGS VIEW
// ==========================================
function SettingsView() {
  const { user, fetchProfile } = useUserStore();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [goalXp, setGoalXp] = useState(50);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      apiFetch<{ goal_xp: number }>('/api/users/daily-goal').then(data => setGoalXp(data.goal_xp)).catch(() => {});
    }
  }, [user]);

  if (!user) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus({ type: null, message: '' });
    try {
      await apiFetch('/api/users/profile', { method: 'PUT', body: JSON.stringify({ username, email }) });
      await apiFetch(`/api/users/daily-goal/set/${goalXp}`, { method: 'POST' });
      await fetchProfile();
      setStatus({ type: 'success', message: 'Settings saved successfully!' });
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || 'Failed to update settings.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-6">
      <div className="flex items-center gap-4 pb-6 border-b-2 border-gray-100 mb-8 mt-4">
        <div className="h-14 w-14 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 border-2 border-gray-200"><SettingsIcon className="h-7 w-7" /></div>
        <div>
          <h2 className="text-2xl font-black tracking-tight text-gray-800">Account Settings</h2>
          <p className="text-xs font-semibold text-gray-400 mt-1 uppercase tracking-wide">Customize your learning profile</p>
        </div>
      </div>

      {status.type && (
        <div className={`mb-6 rounded-2xl p-4 border-2 flex items-center gap-3 font-bold text-sm ${
          status.type === 'success' ? 'bg-green-50 border-green-200 text-green-600' : 'bg-red-50 border-red-200 text-red-600'
        }`}>
          {status.type === 'success' ? <CheckCircle className="h-5 w-5 shrink-0" /> : <AlertTriangle className="h-5 w-5 shrink-0" />}
          <span>{status.message}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="flex flex-col gap-6">
        <div className="rounded-2xl border-2 border-gray-200 p-5 bg-white shadow-sm flex flex-col gap-4">
          <h3 className="font-extrabold text-sm text-gray-400 uppercase tracking-wider">Profile Information</h3>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Username</label>
            <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} className="w-full rounded-2xl border-2 border-gray-200 px-4 py-3 font-bold text-gray-700 focus:border-blue-400 focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Email address</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-2xl border-2 border-gray-200 px-4 py-3 font-bold text-gray-700 focus:border-blue-400 focus:outline-none" />
          </div>
        </div>

        <div className="rounded-2xl border-2 border-gray-200 p-5 bg-white shadow-sm flex flex-col gap-4">
          <h3 className="font-extrabold text-sm text-gray-400 uppercase tracking-wider">Daily Study Goal</h3>
          <div className="grid grid-cols-3 gap-3">
            {[{ label: 'Basic', xp: 20 }, { label: 'Regular', xp: 50 }, { label: 'Serious', xp: 100 }].map((level) => (
              <button key={level.xp} type="button" onClick={() => setGoalXp(level.xp)} className={`p-3.5 rounded-2xl border-2 text-center font-black text-xs uppercase transition-all ${
                goalXp === level.xp ? 'border-blue-400 bg-blue-50 text-blue-600' : 'border-gray-200 hover:bg-gray-50 text-gray-600'
              }`}>{level.label}<span className="block text-[10px] font-bold text-gray-400 mt-0.5">{level.xp} XP / day</span></button>
            ))}
          </div>
        </div>

        <button type="submit" disabled={saving} className="w-full rounded-2xl bg-blue-500 hover:bg-blue-600 py-4 font-black uppercase text-white border-b-4 border-blue-700 shadow-md flex items-center justify-center gap-2">
          <Save className="h-5 w-5" />
          <span>{saving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </form>
    </div>
  );
}

// ==========================================
// MAIN COMPONENT
// ==========================================
function HomeContent() {
  const { user, loading } = useUserStore();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'learn';

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="text-6xl animate-bounce">🦉</div>
          <div className="mt-4 h-2.5 w-32 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 rounded-full animate-[loading_1.5s_infinite_ease-in-out]"></div>
          </div>
          <span className="text-xs font-bold text-gray-400 mt-2 uppercase tracking-wide">Loading Duolingo...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  const renderView = () => {
    switch (activeTab) {
      case 'leaderboard':
        return <LeaderboardView />;
      case 'quests':
        return <QuestsView />;
      case 'shop':
        return <ShopView />;
      case 'profile':
        return <ProfileView />;
      case 'settings':
        return <SettingsView />;
      case 'learn':
      default:
        return (
          <div className="flex-1 overflow-y-auto border-r border-gray-100 min-h-screen">
            <LearningPathMap />
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-white text-gray-800">
      {/* Sidebar Layout Navigation */}
      <Sidebar />

      {/* Main Content Layout Container */}
      <main className="flex-1 flex min-h-screen md:pl-64 pb-20 md:pb-0">
        
        {/* Central sliding panel */}
        <div className="flex-grow flex flex-col overflow-y-auto min-h-screen">
          
          {/* Mobile Top Bar */}
          <div className="lg:hidden sticky top-0 z-10 flex items-center justify-between bg-white dark:bg-[#131f24] border-b-2 border-gray-200 dark:border-gray-800 px-4 py-3 shrink-0">
            <div className="flex items-center gap-1 rounded-xl border-2 border-gray-200 dark:border-[#37464f] p-1 bg-white dark:bg-[#202f36] shadow-sm">
              <span className="text-lg leading-none">🇪🇸</span>
            </div>
            <div className="flex items-center gap-1">
              <Flame className={`h-5 w-5 ${user?.streak && user.streak > 0 ? 'text-orange-500 fill-orange-500' : 'text-gray-400'}`} />
              <span className="font-black text-sm text-gray-500 dark:text-gray-300">{user?.streak || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-base leading-none">💎</span>
              <span className="font-black text-sm text-cyan-500">500</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="h-5 w-5 text-red-500 fill-red-500" />
              <span className="font-black text-sm text-red-500">{user?.hearts || 0}</span>
            </div>
          </div>

          <div className="p-4 md:p-6 lg:p-8 flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 25 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -25 }}
                transition={{ duration: 0.22, ease: 'easeInOut' }}
                className="min-h-full"
              >
                {renderView()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Right Info and Quests Bar (only shown on learn, quests, leaderboard, shop, settings tabs for clean design) */}
        {activeTab !== 'profile' && (
          <div className="hidden lg:block w-80 shrink-0 p-6 border-l border-gray-200 bg-white">
            <StatsPanel />
          </div>
        )}
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="text-6xl animate-bounce">🦉</div>
        </div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
