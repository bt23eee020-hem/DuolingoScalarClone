'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { apiFetch } from '../services/api';
import { BookOpen, Star, Award, ShieldAlert, ChevronsRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Course {
  id: number;
  name: string;
  units: {
    id: number;
    title: string;
    description: string;
    order: number;
    skills: {
      id: number;
      title: string;
      description: string;
      order: number;
      lessons: {
        id: number;
        title: string;
        order: number;
        xp_reward: number;
      }[];
    }[];
  }[];
}

export default function LearningPathMap() {
  const router = useRouter();
  const { data: course, isLoading, error } = useQuery<Course>({
    queryKey: ['course-tree'],
    queryFn: () => apiFetch('/api/courses/1'),
  });
  const [selectedSkill, setSelectedSkill] = useState<any>(null);

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8">
        <div className="flex flex-col items-center">
          <div className="text-5xl animate-bounce">🦉</div>
          <div className="mt-4 h-2 w-28 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8 text-center text-red-500">
        <ShieldAlert className="h-16 w-16 mb-4" />
        <h2 className="text-2xl font-black">Something went wrong</h2>
        <p className="mt-2 text-gray-500 font-semibold">Could not load path. Is the backend API running?</p>
      </div>
    );
  }

  // Offset array for the winding snake path of nodes
  const snakeOffsets = ['translate-x-0', 'translate-x-6', 'translate-x-12', 'translate-x-6', 'translate-x-0', '-translate-x-6', '-translate-x-12', '-translate-x-6'];

  return (
    <div className="flex flex-1 flex-col items-center py-8 px-4 max-w-2xl mx-auto pb-24 md:pb-8">
      <h2 className="text-2xl font-black text-gray-800 self-start mb-6">Your English Path</h2>

      {course.units?.map((unit) => (
        <div key={unit.id} className="w-full mb-10">
          {/* Unit Header */}
          <div className="rounded-2xl bg-[#58cc02] text-white p-5 border-b-4 border-[#46a302] mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-green-100 opacity-90">SECTION 1, UNIT {unit.order}</h4>
                <h3 className="text-xl font-black tracking-wide mt-0.5">{unit.title}</h3>
              </div>
              <button className="flex items-center gap-2 bg-[#46a302] hover:bg-[#3d8f02] border-b-4 border-green-800 text-white rounded-2xl px-4 py-2.5 text-xs font-black uppercase tracking-wider transition-all cursor-pointer">
                <BookOpen className="h-4 w-4" />
                <span>Guidebook</span>
              </button>
            </div>
          </div>

          {/* Skill Nodes List */}
          <div className="flex flex-col items-center gap-8 relative">
            {/* Connecting path line */}
            <div className="absolute top-12 bottom-12 w-2 bg-gray-200 -z-10 rounded-full left-1/2 -translate-x-1/2"></div>

            {unit.skills?.map((skill, index) => {
              const offsetClass = snakeOffsets[index % snakeOffsets.length];
              const isLastNode = index === (unit.skills?.length || 0) - 1;
              
              return (
                <div key={skill.id} className={`relative flex flex-col items-center ${offsetClass}`}>
                  
                  {/* Floating Bouncing Owl Mascot */}
                  {index === 1 && (
                    <motion.div
                      animate={{ y: [0, -8, 0] }}
                      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                      className="absolute -right-20 top-2 text-5xl hidden md:block select-none"
                    >
                      🦉
                    </motion.div>
                  )}

                  {/* "JUMP HERE?" speech bubble */}
                  {isLastNode && (
                    <div className="absolute -top-12 bg-white dark:bg-[#202f36] border-2 border-gray-200 dark:border-[#37464f] rounded-2xl px-4 py-1.5 text-[10px] font-black uppercase text-purple-500 dark:text-purple-400 tracking-wide shadow-sm animate-pulse z-10">
                      JUMP HERE?
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white dark:bg-[#202f36] border-b-2 border-r-2 border-gray-200 dark:border-[#37464f] rotate-45"></div>
                    </div>
                  )}

                  {/* Skill Node Button */}
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedSkill(selectedSkill?.id === skill.id ? null : skill)}
                    className={`relative flex h-24 w-24 items-center justify-center rounded-full border-b-8 shadow-md text-white cursor-pointer group transition-colors ${
                      isLastNode
                        ? 'bg-purple-500 hover:bg-purple-400 border-purple-700'
                        : 'bg-[#58cc02] hover:bg-[#61e002] border-[#46a302]'
                    }`}
                  >
                    {/* Progress Circle Outer */}
                    <div className={`absolute inset-0 rounded-full border-4 scale-105 pointer-events-none opacity-60 ${
                      isLastNode ? 'border-purple-200' : 'border-[#58cc02]'
                    }`}></div>
                    
                    {/* Inner Icon */}
                    {isLastNode ? (
                      <ChevronsRight className="h-10 w-10 text-white fill-none drop-shadow-md stroke-[3]" />
                    ) : (
                      <Star className="h-10 w-10 text-white fill-white drop-shadow-md" />
                    )}
                  </motion.button>

                  <span className="mt-2 text-sm font-extrabold text-gray-700 tracking-wide text-center">
                    {skill.title}
                  </span>

                  {/* Popover Tooltip for Starting Lesson */}
                  <AnimatePresence>
                    {selectedSkill?.id === skill.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute bottom-28 z-30 flex w-72 flex-col items-center rounded-2xl border-2 border-gray-200 bg-white p-5 text-gray-800 shadow-xl"
                      >
                        <h4 className="text-md font-black">{skill.title}</h4>
                        <p className="text-xs text-gray-500 font-semibold mt-1 text-center">
                          {skill.description}
                        </p>
                        
                        <div className="mt-4 flex w-full flex-col gap-2">
                          {skill.lessons?.map((lesson: any) => (
                            <button
                              key={lesson.id}
                              onClick={() => {
                                router.push(`/lesson/${lesson.id}`);
                              }}
                              className="w-full rounded-xl bg-blue-500 hover:bg-blue-600 active:bg-blue-700 py-2.5 px-4 text-xs font-black uppercase text-white border-b-4 border-blue-700 hover:translate-y-[1px] active:translate-y-[3px] transition-all cursor-pointer flex justify-between items-center"
                            >
                              <span>Start Lesson {lesson.order}</span>
                              <span className="bg-white/20 px-2 py-0.5 rounded text-[10px]">+{lesson.xp_reward} XP</span>
                            </button>
                          ))}
                        </div>

                        {/* Arrow */}
                        <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-b-2 border-r-2 border-gray-200 rotate-45"></div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
