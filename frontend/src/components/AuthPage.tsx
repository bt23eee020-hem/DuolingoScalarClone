'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useUserStore } from '../store/useUserStore';
import { ShieldCheck, MessageSquare, Award, Globe, ChevronDown, Check, X, Sparkles, Flame, Smartphone, Heart, Target, FlaskConical, Calendar, ArrowRight, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const { login, register: signUp, error, clearError, loading } = useUserStore();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data: any) => {
    try {
      if (isLogin) {
        await login({ username: data.username, password: data.password });
      } else {
        await signUp({ username: data.username, email: data.email, password: data.password });
      }
    } catch (e) {
      // errors handled by store
    }
  };

  const flags = [
    { name: 'ENGLISH', code: 'US', emoji: '🇺🇸', accent: 'border-blue-400' },
    { name: 'SPANISH', code: 'ES', emoji: '🇪🇸', accent: 'border-yellow-400' },
    { name: 'FRENCH', code: 'FR', emoji: '🇫🇷', accent: 'border-blue-500' },
    { name: 'GERMAN', code: 'DE', emoji: '🇩🇪', accent: 'border-orange-500' },
    { name: 'ITALIAN', code: 'IT', emoji: '🇮🇹', accent: 'border-green-500' },
    { name: 'PORTUGUESE', code: 'BR', emoji: '🇧🇷', accent: 'border-emerald-400' },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans selection:bg-green-200">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 w-full border-b-2 border-gray-200 bg-white/95 backdrop-blur-md px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-3xl font-black tracking-widest text-[#58cc02] cursor-pointer hover:opacity-90 transition-opacity">duolingo</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest cursor-pointer hover:text-gray-600 transition-colors">
            <Globe className="h-4 w-4" />
            <span>Site Language: English</span>
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
      </header>

      {/* Section 1: Hero ("learn a language with duolingo") */}
      <section className="min-h-screen w-full flex flex-col justify-center items-center px-6 py-20 relative overflow-hidden bg-white">
        {/* Floating Icons & Coins Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden hidden md:block">
          {/* Gold Coins */}
          <motion.div className="absolute top-[15%] left-[10%] text-6xl drop-shadow-md select-none" animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }} transition={{ duration: 4, repeat: Infinity }}>🪙</motion.div>
          <motion.div className="absolute bottom-[25%] left-[15%] text-5xl drop-shadow-md select-none" animate={{ y: [0, 12, 0], rotate: [0, -10, 0] }} transition={{ duration: 3.5, repeat: Infinity }}>🪙</motion.div>
          <motion.div className="absolute top-[40%] right-[10%] text-6xl drop-shadow-md select-none" animate={{ y: [0, -20, 0], rotate: [0, 8, 0] }} transition={{ duration: 5, repeat: Infinity }}>🪙</motion.div>
          
          {/* Hearts */}
          <motion.div className="absolute top-[20%] right-[20%] text-5xl select-none" animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 3, repeat: Infinity }}>❤️</motion.div>
          <motion.div className="absolute bottom-[35%] right-[12%] text-6xl select-none" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 4, repeat: Infinity }}>❤️</motion.div>
          
          {/* Streak Flame */}
          <motion.div className="absolute bottom-[20%] right-[30%] text-6xl select-none animate-pulse">🔥</motion.div>
          
          {/* Blue Gems */}
          <motion.div className="absolute top-[35%] left-[25%] text-5xl select-none animate-bounce">💎</motion.div>
          <motion.div className="absolute bottom-[15%] left-[35%] text-4xl select-none animate-bounce" transition={{ delay: 0.3 }}>💎</motion.div>
        </div>

        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-12 relative z-10 text-center">
          {/* Main animated mascot */}
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
            className="w-48 h-48 md:w-56 md:h-56 rounded-full bg-gradient-to-tr from-green-400 to-emerald-500 p-1 shadow-2xl flex items-center justify-center relative"
          >
            <span className="text-8xl md:text-9xl select-none">🦉</span>
            <div className="absolute -bottom-2 bg-white border-2 border-green-400 px-4 py-1 rounded-full text-xs font-black text-green-600 uppercase tracking-widest shadow-md">
              Duo Mascot
            </div>
          </motion.div>

          <div className="max-w-2xl mt-4">
            <h1 className="text-4xl md:text-7xl font-black tracking-tight text-[#58cc02] leading-tight capitalize">
              learn a language with duolingo
            </h1>
            <p className="mt-6 text-lg md:text-xl font-bold text-gray-500 max-w-lg mx-auto leading-relaxed">
              The free, fun, and effective way to learn a language! Loved by millions worldwide.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full max-w-md justify-center">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => { setIsLogin(false); setIsAuthOpen(true); }}
              className="flex-1 rounded-2xl bg-[#58cc02] hover:bg-[#46a302] px-8 py-4 font-black uppercase text-white shadow-[0_4px_0_#46a302] border-b-4 border-transparent cursor-pointer tracking-wider text-sm transition-all text-center"
            >
              Get Started
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => { setIsLogin(true); setIsAuthOpen(true); }}
              className="flex-1 rounded-2xl bg-white hover:bg-gray-50 px-8 py-4 font-black uppercase text-[#1899d6] border-2 border-gray-200 shadow-sm cursor-pointer tracking-wider text-sm transition-all text-center"
            >
              I Already Have An Account
            </motion.button>
          </div>
        </div>
      </section>

      {/* Language Selection Banner */}
      <div className="w-full border-b-2 border-gray-200 bg-white py-4 overflow-x-auto">
        <div className="mx-auto flex max-w-5xl items-center gap-8 px-6 text-sm font-black text-gray-400 uppercase tracking-widest whitespace-nowrap justify-center min-w-max">
          <ChevronDown className="h-4 w-4 rotate-90 shrink-0 cursor-pointer hover:text-gray-600" />
          <div className="flex items-center gap-2 cursor-pointer hover:text-gray-600">
            <span className="text-xl">🇺🇸</span>
            <span>English</span>
          </div>
          <div className="flex items-center gap-2 cursor-pointer hover:text-gray-600">
            <span className="text-xl">🇪🇸</span>
            <span>Spanish</span>
          </div>
          <div className="flex items-center gap-2 cursor-pointer hover:text-gray-600">
            <span className="text-xl">🇫🇷</span>
            <span>French</span>
          </div>
          <div className="flex items-center gap-2 cursor-pointer hover:text-gray-600">
            <span className="text-xl">🇩🇪</span>
            <span>German</span>
          </div>
          <div className="flex items-center gap-2 cursor-pointer hover:text-gray-600">
            <span className="text-xl">🇮🇹</span>
            <span>Italian</span>
          </div>
          <div className="flex items-center gap-2 cursor-pointer hover:text-gray-600">
            <span className="text-xl">🇧🇷</span>
            <span>Portuguese</span>
          </div>
          <div className="flex items-center gap-2 cursor-pointer hover:text-gray-600">
            <span className="text-xl text-blue-500">➗</span>
            <span>Math</span>
          </div>
          <div className="flex items-center gap-2 cursor-pointer hover:text-gray-600">
            <span className="text-xl text-emerald-500">♟️</span>
            <span>Chess</span>
          </div>
          <ChevronDown className="h-4 w-4 -rotate-90 shrink-0 cursor-pointer hover:text-gray-600" />
        </div>
      </div>

      {/* Section: free. fun. effective. */}
      <section className="w-full flex items-center justify-center px-6 md:px-12 py-32 bg-white relative overflow-hidden">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-16 md:flex-row w-full">
          {/* Left Text */}
          <div className="flex-1 text-center md:text-left max-w-lg">
            <h2 className="text-5xl font-black text-[#58cc02] leading-tight tracking-tight lowercase">
              free. fun. effective.
            </h2>
            <p className="mt-8 text-lg text-gray-500 font-bold leading-relaxed opacity-90">
              Learning with Duolingo is fun, and <span className="text-blue-500 cursor-pointer hover:underline">research shows that it works!</span> With quick, bite-sized lessons, you’ll earn points and unlock new levels while gaining real-world communication skills.
            </p>
          </div>
          {/* Right Phone Graphic */}
          <motion.div
            className="flex-1 flex justify-center max-w-sm md:max-w-none relative h-72 md:h-96 w-full scale-[0.7] md:scale-100 origin-center md:mt-0"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-64 h-[420px] rounded-[40px] border-[8px] border-yellow-400 bg-white p-4 shadow-xl flex flex-col overflow-hidden relative">
              <div className="w-full h-4 bg-gray-100 rounded-full mb-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 h-full w-1/3 bg-[#58cc02] rounded-full" />
              </div>
              <div className="grid grid-cols-2 gap-4 flex-1">
                <div className="bg-blue-100 rounded-2xl flex items-center justify-center text-5xl border-b-4 border-blue-200">🐱</div>
                <div className="bg-green-100 rounded-2xl flex items-center justify-center text-5xl border-b-4 border-green-200">🦉</div>
                <div className="bg-orange-100 rounded-2xl flex items-center justify-center text-5xl border-b-4 border-orange-200">👩</div>
                <div className="bg-pink-100 rounded-2xl flex items-center justify-center text-5xl border-b-4 border-pink-200">👨</div>
              </div>
              <motion.div 
                className="absolute -right-12 bottom-12 z-20"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <div className="w-32 h-32 text-[100px]">🦉</div>
              </motion.div>
              <div className="absolute -bottom-8 -left-12 z-30">
                <div className="flex items-end">
                  <span className="text-7xl">👨🏽</span>
                  <div className="bg-yellow-400 text-yellow-900 px-4 py-2 font-black rounded-lg transform -rotate-12 border-b-4 border-yellow-600 ml-[-20px] mb-4">#1</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section: backed by science */}
      <section className="w-full flex items-center justify-center px-6 md:px-12 py-32 bg-white relative overflow-hidden border-t-2 border-gray-100">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-16 md:flex-row-reverse w-full">
          {/* Right Text */}
          <div className="flex-1 text-center md:text-left max-w-lg">
            <h2 className="text-5xl font-black text-[#58cc02] leading-tight tracking-tight lowercase">
              backed by science
            </h2>
            <p className="mt-8 text-lg text-gray-500 font-bold leading-relaxed opacity-90">
              We use a combination of research-backed teaching methods and delightful content to create courses that effectively teach reading, writing, listening, and speaking skills!
            </p>
          </div>
          {/* Left Graphic */}
          <motion.div
            className="flex-1 flex justify-center max-w-sm md:max-w-none relative h-72 md:h-96 w-full scale-[0.65] md:scale-100 origin-center -mt-8 md:mt-0"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="absolute top-10 left-10 text-6xl text-green-400 opacity-20">◌</div>
              <div className="absolute bottom-20 left-20 w-12 h-12 rounded-full bg-[#58cc02] shadow-lg animate-pulse" />
              <div className="w-64 h-24 bg-pink-300 rounded-3xl border-b-8 border-pink-400 shadow-xl absolute bottom-10 flex items-center justify-center">
                <div className="w-48 h-8 bg-[#58cc02] rounded-full mx-auto" />
                <div className="absolute top-[-40px] left-[-20px] flex items-end">
                  <span className="text-8xl transform scale-x-[-1]">👩🏻‍🔬</span>
                  <span className="text-3xl bg-green-200 p-2 rounded-full border-2 border-green-500 mb-4 -ml-4 z-10">🧪</span>
                </div>
              </div>
              <div className="absolute right-10 top-20 flex flex-col items-center z-20">
                <div className="w-24 h-48 bg-blue-500 rounded-[30px] border-[6px] border-gray-800 transform rotate-12 shadow-2xl relative overflow-hidden">
                  <div className="absolute bottom-0 w-full h-1/2 bg-blue-400" />
                  <div className="absolute w-8 h-8 bg-black rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-30" />
                </div>
                <div className="absolute -top-16 right-[-20px] text-[100px] transform -rotate-12">👨🏼‍🚀</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section: stay motivated */}
      <section className="w-full flex items-center justify-center px-6 md:px-12 py-32 bg-white relative overflow-hidden border-t-2 border-gray-100">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-16 md:flex-row w-full">
          {/* Left Text */}
          <div className="flex-1 text-center md:text-left max-w-lg">
            <h2 className="text-5xl font-black text-[#58cc02] leading-tight tracking-tight lowercase">
              stay motivated
            </h2>
            <p className="mt-8 text-lg text-gray-500 font-bold leading-relaxed opacity-90">
              We make it easy to form a habit of language learning with game-like features, fun challenges, and reminders from our friendly mascot, Duo the owl.
            </p>
          </div>
          {/* Right Graphic */}
          <motion.div
            className="flex-1 flex justify-center max-w-sm md:max-w-none relative h-72 md:h-96 w-full scale-[0.65] md:scale-100 origin-center -mt-8 md:mt-0"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="absolute top-10 right-10 text-[90px] animate-bounce z-30">🦉</div>
              <div className="absolute bottom-20 left-10 w-48 h-20 bg-green-400 rounded-3xl transform -rotate-12 border-b-8 border-green-600 shadow-xl flex items-center justify-center z-10">
                <span className="text-4xl">🔥</span>
                <div className="w-1/2 h-2 bg-green-200 rounded-full mt-8" />
              </div>
              <div className="absolute bottom-10 right-20 w-48 h-20 bg-green-400 rounded-3xl transform rotate-12 border-b-8 border-green-600 shadow-xl flex items-center justify-center z-10">
                <span className="text-4xl text-gray-400 grayscale">🔥</span>
                <div className="w-1/2 h-2 bg-gray-200 rounded-full mt-8" />
              </div>
              <motion.div 
                className="z-20 text-[140px] drop-shadow-2xl mb-20 transform scale-x-[-1]"
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                🏃🏼‍♀️
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 2: Duolingo English Test */}
      <section className="min-h-screen w-full flex items-center justify-center px-6 md:px-12 py-20 bg-white border-t-2 border-gray-100 relative overflow-hidden">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-12 md:flex-row w-full">
          
          {/* Left Text */}
          <div className="flex-1 text-center md:text-left max-w-lg">
            <h2 className="text-4xl md:text-5xl font-black text-[#58cc02] leading-tight tracking-tight capitalize">
              duolingo english test
            </h2>
            <p className="mt-6 text-lg text-gray-500 font-bold leading-relaxed opacity-90">
              Our convenient, fast, and affordable English test integrates the latest assessment science and AI — empowering anyone to accurately test their English where and when they’re at their best.
            </p>
            <div className="mt-8">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => { setIsLogin(true); setIsAuthOpen(true); }}
                className="rounded-2xl border-2 border-gray-250 bg-white hover:bg-gray-50 text-[#1899d6] font-black px-8 py-4 uppercase text-sm tracking-wider transition-all shadow-md cursor-pointer"
              >
                Certify Your English
              </motion.button>
            </div>
          </div>

          {/* Right Custom Illustration: Character next to Green Dotted Seal Star */}
          <motion.div
            className="flex-1 flex justify-center max-w-sm md:max-w-none relative h-72 md:h-96 w-full scale-[0.7] md:scale-100 origin-center -mt-4 md:mt-0"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Phone Frame */}
            <div className="w-68 h-90 rounded-[40px] border-[6px] border-gray-800 bg-white p-4 shadow-xl flex flex-col justify-between overflow-hidden relative">
              <div className="w-16 h-3.5 bg-gray-800 rounded-full mx-auto mb-2" />
              
              {/* Star Seal & Character Graphic inside screen */}
              <div className="flex-1 rounded-2xl bg-gradient-to-b from-[#ddf4ff] to-white p-4 border border-blue-100 flex flex-col justify-center items-center relative overflow-hidden">
                
                {/* Giant Green Seal Star */}
                <motion.div 
                  className="w-36 h-36 rounded-full bg-[#58cc02] flex items-center justify-center relative border-4 border-dashed border-white shadow-lg z-10"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                >
                  <span className="text-white text-5xl font-black">🦉</span>
                </motion.div>
                
                {/* Character standing below */}
                <div className="absolute bottom-2 z-20 flex flex-col items-center">
                  <span className="text-6xl animate-bounce">🙍‍♀️</span>
                  <span className="text-[10px] font-black bg-yellow-400 text-yellow-900 px-3 py-0.5 rounded-full uppercase tracking-wider mt-1">Verified</span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Section 3: Duolingo for Schools */}
      <section className="min-h-screen w-full flex items-center justify-center px-6 md:px-12 py-20 bg-white border-t-2 border-gray-100 relative overflow-hidden">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-12 md:flex-row-reverse w-full">
          
          {/* Right Text */}
          <div className="flex-1 text-center md:text-left max-w-lg">
            <h2 className="text-4xl md:text-5xl font-black text-[#58cc02] leading-tight tracking-tight capitalize">
              duolingo for schools
            </h2>
            <p className="mt-6 text-lg text-gray-500 font-bold leading-relaxed opacity-90">
              Teachers, we’re here to help you! Our free tools support your students as they learn languages through the Duolingo app, both in and out of the classroom.
            </p>
            <div className="mt-8">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => { setIsLogin(true); setIsAuthOpen(true); }}
                className="rounded-2xl border-2 border-gray-250 bg-white hover:bg-gray-50 text-[#1899d6] font-black px-8 py-4 uppercase text-sm tracking-wider transition-all shadow-md cursor-pointer"
              >
                Get Your Class Started
              </motion.button>
            </div>
          </div>

          {/* Left Custom Illustration: Student riding giant pencil on smartphone screen */}
          <motion.div
            className="flex-1 flex justify-center max-w-sm md:max-w-none relative h-72 md:h-96 w-full scale-[0.7] md:scale-100 origin-center -mt-4 md:mt-0"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Phone Screen Mockup */}
            <div className="w-68 h-90 rounded-[40px] border-[6px] border-gray-800 bg-white p-4 shadow-xl flex flex-col justify-between overflow-hidden relative">
              <div className="w-16 h-3.5 bg-gray-800 rounded-full mx-auto mb-2" />
              
              <div className="flex-1 rounded-2xl bg-gradient-to-b from-green-50 to-white p-4 border border-green-100 flex flex-col justify-center items-center relative overflow-hidden">
                
                {/* Giant Pencil & Rider */}
                <motion.div 
                  className="flex flex-col items-center z-10"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  {/* Character */}
                  <span className="text-5xl select-none -mb-2 z-20">👦</span>
                  {/* Pencil */}
                  <div className="w-14 h-36 rounded-full bg-gradient-to-b from-yellow-400 via-yellow-300 to-pink-400 border-2 border-yellow-600 shadow-md flex flex-col items-center justify-between p-1.5 relative">
                    <span className="text-xs font-black text-yellow-800 uppercase tracking-widest mt-2">HB</span>
                    {/* Pink eraser tip */}
                    <div className="absolute top-0 w-8 h-4 rounded-t-full bg-pink-500 border-b border-pink-700" />
                  </div>
                </motion.div>

                {/* Flying Papers */}
                <span className="absolute top-10 right-4 text-2xl select-none animate-pulse">📄</span>
                <span className="absolute bottom-16 left-4 text-2xl select-none animate-pulse" style={{ animationDelay: '0.5s' }}>📄</span>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Section 4: Duolingo ABC */}
      <section className="min-h-screen w-full flex items-center justify-center px-6 md:px-12 py-20 bg-white border-t-2 border-gray-100 relative overflow-hidden">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-12 md:flex-row w-full">
          
          {/* Left Text */}
          <div className="flex-1 text-center md:text-left max-w-lg">
            <h2 className="text-4xl md:text-5xl font-black text-[#58cc02] leading-tight tracking-tight capitalize">
              duolingo abc
            </h2>
            <p className="mt-6 text-lg text-gray-500 font-bold leading-relaxed opacity-90">
              From language to literacy! With fun phonics lessons and delightful stories, Duolingo ABC helps kids ages 3-8 learn to read and write — 100% free.
            </p>
            <div className="mt-8">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => { setIsLogin(true); setIsAuthOpen(true); }}
                className="rounded-2xl border-2 border-gray-250 bg-white hover:bg-gray-50 text-[#1899d6] font-black px-8 py-4 uppercase text-sm tracking-wider transition-all shadow-md cursor-pointer"
              >
                Learn More About ABC
              </motion.button>
            </div>
          </div>

          {/* Right Custom Illustration: Smartphone displaying Duo owl + cubes A, B, C */}
          <motion.div
            className="flex-1 flex justify-center max-w-sm md:max-w-none relative h-72 md:h-96 w-full scale-[0.7] md:scale-100 origin-center -mt-4 md:mt-0"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-end gap-3 relative">
              {/* Stacked Building Blocks (Cubes) */}
              <div className="flex flex-col gap-2 z-15">
                <div className="w-14 h-14 rounded-2xl bg-yellow-400 border-2 border-yellow-600 shadow-md flex items-center justify-center font-black text-white text-2xl">A</div>
                <div className="w-14 h-14 rounded-2xl bg-cyan-400 border-2 border-cyan-600 shadow-md flex items-center justify-center font-black text-white text-2xl">B</div>
                <div className="w-14 h-14 rounded-2xl bg-pink-400 border-2 border-pink-600 shadow-md flex items-center justify-center font-black text-white text-2xl">C</div>
              </div>

              {/* Smartphone mockup */}
              <div className="w-60 h-80 rounded-[35px] border-[5px] border-gray-800 bg-white p-3 shadow-xl flex flex-col justify-between overflow-hidden relative">
                <div className="flex-1 rounded-2xl bg-gradient-to-b from-blue-50 to-white flex flex-col justify-center items-center relative">
                  <span className="text-7xl animate-bounce">🦉</span>
                  <span className="text-xs font-black text-green-600 uppercase tracking-widest mt-2">Duo ABC</span>
                </div>
              </div>

              {/* Characters floating around */}
              <span className="absolute -top-6 right-10 text-5xl select-none animate-bounce">👶</span>
              <span className="absolute bottom-6 right-2 text-5xl select-none animate-pulse">🐻</span>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Section 5: power up with super duolingo */}
      <section className="min-h-screen w-full flex items-center justify-center px-6 py-20 bg-[#0a092d] text-white overflow-hidden relative border-t-2 border-blue-900">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-72 h-72 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-72 h-72 rounded-full bg-pink-500/20 blur-3xl" />

        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-12 md:flex-row relative z-10 w-full">
          <motion.div
            className="flex-1 flex justify-center max-w-xs md:max-w-none"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-68 h-68 rounded-full bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 p-1 shadow-[0_0_35px_rgba(168,85,247,0.7)] animate-pulse">
              <div className="w-full h-full rounded-full bg-[#0a092d] flex flex-col items-center justify-center relative overflow-hidden">
                <span className="text-7xl animate-bounce">⚡</span>
                <span className="text-xl font-black tracking-widest mt-3 bg-gradient-to-r from-blue-400 via-pink-400 to-yellow-300 bg-clip-text text-transparent">SUPER</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Premium Edition</span>
              </div>
            </div>
          </motion.div>
          
          <div className="flex-1 text-center md:text-left max-w-lg">
            <h2 className="text-3xl md:text-5xl font-black leading-tight tracking-wider bg-gradient-to-r from-blue-400 via-pink-400 to-yellow-300 bg-clip-text text-transparent uppercase">
              POWER UP WITH SUPER DUOLINGO
            </h2>
            <p className="mt-6 text-lg text-gray-300 leading-relaxed font-semibold">
              Ad-free learning, unlimited Hearts, and personalized practice reviews. Try it for free to accelerate your learning paths!
            </p>
            <div className="mt-8">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => { setIsLogin(true); setIsAuthOpen(true); }}
                className="rounded-2xl bg-gradient-to-r from-[#1cb0f6] to-[#ff4b4b] px-8 py-4 font-black uppercase text-white shadow-lg cursor-pointer tracking-wider text-sm transition-all hover:brightness-110"
              >
                Try 1 Week Free
              </motion.button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: Green Footer Layout */}
      <footer className="w-full bg-[#58cc02] text-white py-16 px-6 md:px-12 border-t-4 border-[#46a302] relative z-10">
        <div className="mx-auto max-w-5xl">
          
          {/* Green Directory Column Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-12">
            
            {/* Col 1 */}
            <div>
              <h4 className="font-black text-sm uppercase tracking-wider mb-4 text-[#eefbda]">About us</h4>
              <ul className="flex flex-col gap-2.5 text-xs font-black">
                <li className="hover:text-yellow-100 cursor-pointer transition-colors">Courses</li>
                <li className="hover:text-yellow-100 cursor-pointer transition-colors">Mission</li>
                <li className="hover:text-yellow-100 cursor-pointer transition-colors">Approach</li>
                <li className="hover:text-yellow-100 cursor-pointer transition-colors">Efficacy</li>
                <li className="hover:text-yellow-100 cursor-pointer transition-colors">Duolingo Handbook</li>
                <li className="hover:text-yellow-100 cursor-pointer transition-colors">Research</li>
                <li className="hover:text-yellow-100 cursor-pointer transition-colors">Careers</li>
                <li className="hover:text-yellow-100 cursor-pointer transition-colors">Brand guidelines</li>
                <li className="hover:text-yellow-100 cursor-pointer transition-colors">Store</li>
                <li className="hover:text-yellow-100 cursor-pointer transition-colors">Press</li>
                <li className="hover:text-yellow-100 cursor-pointer transition-colors">Investors</li>
                <li className="hover:text-yellow-100 cursor-pointer transition-colors">Contact us</li>
              </ul>
            </div>

            {/* Col 2 */}
            <div>
              <h4 className="font-black text-sm uppercase tracking-wider mb-4 text-[#eefbda]">Products</h4>
              <ul className="flex flex-col gap-2.5 text-xs font-black">
                <li className="hover:text-yellow-100 cursor-pointer transition-colors">Duolingo</li>
                <li className="hover:text-yellow-100 cursor-pointer transition-colors">Duolingo for Schools</li>
                <li className="hover:text-yellow-100 cursor-pointer transition-colors">Duolingo English Test</li>
                <li className="hover:text-yellow-100 cursor-pointer transition-colors">Podcast</li>
                <li className="hover:text-yellow-100 cursor-pointer transition-colors">Duolingo for Business</li>
                <li className="hover:text-yellow-100 cursor-pointer transition-colors">Super Duolingo</li>
                <li className="hover:text-yellow-100 cursor-pointer transition-colors">Gift Super Duolingo</li>
                <li className="hover:text-yellow-100 cursor-pointer transition-colors">Duolingo Max</li>
              </ul>
            </div>

            {/* Col 3 */}
            <div>
              <h4 className="font-black text-sm uppercase tracking-wider mb-4 text-[#eefbda]">Apps</h4>
              <ul className="flex flex-col gap-2.5 text-xs font-black">
                <li className="hover:text-yellow-100 cursor-pointer transition-colors">Duolingo for Android</li>
                <li className="hover:text-yellow-100 cursor-pointer transition-colors">Duolingo for iOS</li>
              </ul>
            </div>

            {/* Col 4 */}
            <div>
              <h4 className="font-black text-sm uppercase tracking-wider mb-4 text-[#eefbda]">Help and support</h4>
              <ul className="flex flex-col gap-2.5 text-xs font-black">
                <li className="hover:text-yellow-100 cursor-pointer transition-colors">Duolingo FAQs</li>
                <li className="hover:text-yellow-100 cursor-pointer transition-colors">Schools FAQs</li>
                <li className="hover:text-yellow-100 cursor-pointer transition-colors">Duolingo English Test FAQs</li>
                <li className="hover:text-yellow-100 cursor-pointer transition-colors">Status</li>
              </ul>
            </div>

            {/* Col 5 */}
            <div>
              <h4 className="font-black text-sm uppercase tracking-wider mb-4 text-[#eefbda]">Privacy and terms</h4>
              <ul className="flex flex-col gap-2.5 text-xs font-black">
                <li className="hover:text-yellow-100 cursor-pointer transition-colors">Community guidelines</li>
                <li className="hover:text-yellow-100 cursor-pointer transition-colors">Terms</li>
                <li className="hover:text-yellow-100 cursor-pointer transition-colors">Privacy</li>
                <li className="hover:text-yellow-100 cursor-pointer transition-colors">Do Not Sell My Info</li>
              </ul>
            </div>

          </div>

          {/* Social Links Footer Section */}
          <div className="pt-8 border-t border-[#62e403] flex flex-col md:flex-row justify-between items-center gap-6">
            <span className="text-xs font-black uppercase text-[#eefbda]">© {new Date().getFullYear()} Duolingo Clone App Inc.</span>
            <div className="flex flex-wrap gap-4 text-xs font-black">
              <span className="hover:text-yellow-100 cursor-pointer">Blog</span>
              <span className="hover:text-yellow-100 cursor-pointer">Instagram</span>
              <span className="hover:text-yellow-100 cursor-pointer">TikTok</span>
              <span className="hover:text-yellow-100 cursor-pointer">Twitter</span>
              <span className="hover:text-yellow-100 cursor-pointer">YouTube</span>
              <span className="hover:text-yellow-100 cursor-pointer">LinkedIn</span>
            </div>
          </div>

        </div>
      </footer>

      {/* Overlay Auth Modal */}
      <AnimatePresence>
        {isAuthOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAuthOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative w-full max-w-md rounded-3xl bg-white p-8 text-gray-800 shadow-2xl border-4 border-white/20 z-10"
            >
              <button
                onClick={() => setIsAuthOpen(false)}
                className="absolute top-4 right-4 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
              <h2 className="text-3xl font-extrabold text-center text-gray-800 tracking-tight">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h2>
              {error && (
                <div className="mb-4 rounded-xl bg-red-50 border-2 border-red-200 p-3 text-sm font-bold text-red-500">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <input {...register('username')} placeholder="Username or Email" className="w-full rounded-2xl border-2 border-gray-200 px-4 py-3" />
                {!isLogin && <input {...register('email')} placeholder="Email" className="w-full rounded-2xl border-2 border-gray-200 px-4 py-3" />}
                <input {...register('password')} type="password" placeholder="Password" className="w-full rounded-2xl border-2 border-gray-200 px-4 py-3" />
                <button type="submit" className="mt-2 rounded-2xl bg-green-500 py-4 font-extrabold uppercase text-white">
                  {isLogin ? 'Sign In' : 'Get Started'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
