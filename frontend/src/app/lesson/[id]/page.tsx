'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Heart, X, CheckCircle, AlertTriangle, Volume2 } from 'lucide-react';
import { useLessonStore } from '../../../store/useLessonStore';
import { useUserStore } from '../../../store/useUserStore';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';

export default function LessonPlayerPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUserStore();
  const lessonId = Number(params?.id);

  const {
    lesson,
    exercises,
    currentIndex,
    hearts,
    selectedOption,
    typedAnswer,
    wordBankSelected,
    matchPairsSelections,
    matchPairsSuccesses,
    isChecking,
    isGraded,
    isCorrect,
    correctAnswer,
    explanation,
    completed,
    xpEarned,
    heartsLost,
    loading,
    error,
    startLesson,
    setSelectedOption,
    setTypedAnswer,
    toggleWordBankChip,
    setMatchPairsSelection,
    submitAnswer,
    nextExercise,
    refillHeartsPractice,
  } = useLessonStore();

  useEffect(() => {
    if (lessonId && user) {
      startLesson(lessonId, user.hearts);
    }
  }, [lessonId, user, startLesson]);

  // Trigger confetti on successful completion
  useEffect(() => {
    if (completed && hearts > 0) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  }, [completed, hearts]);

  // Keyboard Shortcuts (Enter to validate/advance, Numbers 1-9 to select MC options)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (completed || loading) return;
      const currentExercise = exercises[currentIndex];
      if (!currentExercise) return;

      if (e.key === 'Enter') {
        e.preventDefault();
        if (!isGraded) {
          const canSubmit = !isChecking && (
            (currentExercise.type === 'MULTIPLE_CHOICE' && selectedOption) ||
            (currentExercise.type === 'TRANSLATE_WORD_BANK' && wordBankSelected.length > 0) ||
            (currentExercise.type === 'FILL_BLANK' && (selectedOption || typedAnswer)) ||
            (currentExercise.type === 'TYPE_ANSWER' && typedAnswer) ||
            (currentExercise.type === 'MATCH_PAIRS' && matchPairsSuccesses.length === currentExercise.options.length)
          );
          if (canSubmit) {
            submitAnswer();
          }
        } else {
          nextExercise();
        }
      }

      if (!isGraded && currentExercise.type === 'MULTIPLE_CHOICE') {
        const num = Number(e.key);
        if (num >= 1 && num <= (currentExercise.options?.length || 0)) {
          setSelectedOption(currentExercise.options[num - 1].content);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [completed, loading, exercises, currentIndex, isGraded, isChecking, selectedOption, wordBankSelected, typedAnswer, matchPairsSuccesses, submitAnswer, nextExercise, setSelectedOption]);


  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white p-6">
        <span className="text-5xl animate-bounce">🦉</span>
        <h2 className="text-xl font-black text-gray-500 mt-4 uppercase tracking-widest">Loading Lesson Player...</h2>
      </div>
    );
  }

  if (error || !lesson || exercises.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white p-6 text-center">
        <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-black text-gray-800">Error loading lesson</h2>
        <p className="text-sm font-semibold text-gray-500 mt-2">Could not fetch lesson content. Please verify backend state.</p>
        <button onClick={() => router.push('/')} className="mt-6 rounded-2xl bg-green-500 py-3 px-6 text-xs font-black uppercase text-white border-b-4 border-green-700 cursor-pointer">
          Back to Path
        </button>
      </div>
    );
  }

  const exercise = exercises[currentIndex];
  const progressPercent = Math.round(((currentIndex) / exercises.length) * 100);

  const speak = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      // Simple language heuristic: if prompt contains common English words, use English, else Spanish
      const isEnglish = /\b(the|is|which|what|who|where|translate|this|of|to|in|coffee|milk|water|taco|bread|tea|apple|banana|orange|grape|juice|wine|beer)\b/i.test(text);
      utterance.lang = isEnglish ? 'en-US' : 'es-ES';
      window.speechSynthesis.speak(utterance);
    }
  };

  // Helper to render current exercise input options
  const renderExerciseContent = () => {
    switch (exercise.type) {
      case 'MULTIPLE_CHOICE':
        return (
          <div className="grid grid-cols-1 gap-3 max-w-md mx-auto w-full mt-6">
            {exercise.options?.map((opt) => {
              const isSelected = selectedOption === opt.content;
              return (
                <button
                  key={opt.id}
                  disabled={isGraded}
                  onClick={() => {
                    setSelectedOption(opt.content);
                    speak(opt.content);
                  }}
                  className={`w-full text-left p-4 rounded-2xl border-2 font-bold transition-all text-sm cursor-pointer ${
                    isSelected
                      ? 'border-blue-400 bg-blue-50 text-blue-600'
                      : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  {opt.content}
                </button>
              );
            })}
          </div>
        );

      case 'TRANSLATE_WORD_BANK':
        // original unselected chips
        const allChips = exercise.options?.map(o => o.content) || [];
        const unselectedChips = allChips.filter(c => !wordBankSelected.includes(c));

        return (
          <div className="flex flex-col gap-6 max-w-xl mx-auto w-full mt-6">
            {/* Selected chips tray */}
            <div className="min-h-[70px] border-b-2 border-gray-200 py-3 flex flex-wrap gap-2 items-center justify-center bg-gray-50/50 rounded-xl px-4">
              {wordBankSelected.map((chip, idx) => (
                <button
                  key={idx}
                  disabled={isGraded}
                  onClick={() => {
                    toggleWordBankChip(chip);
                    speak(chip);
                  }}
                  className="rounded-xl border-2 border-gray-200 bg-white px-4 py-2 font-bold text-sm shadow-sm cursor-pointer hover:bg-gray-100"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Unselected chips tray */}
            <div className="flex flex-wrap gap-2 items-center justify-center mt-4">
              {unselectedChips.map((chip, idx) => (
                <button
                  key={idx}
                  disabled={isGraded}
                  onClick={() => {
                    toggleWordBankChip(chip);
                    speak(chip);
                  }}
                  className="rounded-xl border-2 border-gray-200 bg-white px-4 py-2 font-bold text-sm shadow-sm cursor-pointer hover:bg-gray-50 active:bg-gray-100"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        );

      case 'FILL_BLANK':
        return (
          <div className="flex flex-col gap-6 max-w-md mx-auto w-full mt-6">
            <div className="text-lg font-bold text-gray-600 text-center italic">
              {exercise.prompt}
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              {exercise.options?.map((opt) => {
                const isSelected = selectedOption === opt.content;
                return (
                  <button
                    key={opt.id}
                    disabled={isGraded}
                    onClick={() => setSelectedOption(opt.content)}
                    className={`p-3 rounded-xl border-2 text-center font-bold text-sm cursor-pointer ${
                      isSelected
                        ? 'border-blue-400 bg-blue-50 text-blue-600'
                        : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    {opt.content}
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 'TYPE_ANSWER':
        return (
          <div className="max-w-md mx-auto w-full mt-6">
            <textarea
              disabled={isGraded}
              value={typedAnswer}
              onChange={(e) => setTypedAnswer(e.target.value)}
              placeholder="Type the translation..."
              className="w-full rounded-2xl border-2 border-gray-200 p-4 font-bold text-gray-700 placeholder-gray-400 focus:border-green-500 focus:outline-none min-h-[100px] resize-none"
            />
          </div>
        );

      case 'MATCH_PAIRS':
        // left options are odd indexes, right options are even order/content
        const leftOptions = exercise.options?.filter((_, idx) => idx % 2 === 0).map(o => o.content) || [];
        const rightOptions = exercise.options?.filter((_, idx) => idx % 2 !== 0).map(o => o.content) || [];

        return (
          <div className="grid grid-cols-2 gap-6 max-w-lg mx-auto w-full mt-6">
            {/* Left Column */}
            <div className="flex flex-col gap-3">
              {leftOptions.map((item, idx) => {
                const isMatched = matchPairsSuccesses.includes(item);
                const isSelected = matchPairsSelections.left === item;
                return (
                  <button
                    key={idx}
                    disabled={isGraded || isMatched}
                    onClick={() => setMatchPairsSelection('left', item)}
                    className={`p-4 rounded-xl border-2 text-left font-bold text-sm transition-all cursor-pointer ${
                      isMatched
                        ? 'border-green-300 bg-green-50 text-green-600 opacity-60'
                        : isSelected
                        ? 'border-blue-400 bg-blue-50 text-blue-600'
                        : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-3">
              {rightOptions.map((item, idx) => {
                const isMatched = matchPairsSuccesses.includes(item);
                const isSelected = matchPairsSelections.right === item;
                return (
                  <button
                    key={idx}
                    disabled={isGraded || isMatched}
                    onClick={() => setMatchPairsSelection('right', item)}
                    className={`p-4 rounded-xl border-2 text-left font-bold text-sm transition-all cursor-pointer ${
                      isMatched
                        ? 'border-green-300 bg-green-50 text-green-600 opacity-60'
                        : isSelected
                        ? 'border-blue-400 bg-blue-50 text-blue-600'
                        : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // If lesson is complete
  if (completed) {
    const isSuccess = hearts > 0;
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white p-6">
        <div className="max-w-md text-center flex flex-col items-center">
          <span className="text-8xl mb-4 animate-bounce">🦉</span>
          
          {isSuccess ? (
            <>
              <h2 className="text-4xl font-black text-green-500">Lesson Complete!</h2>
              <p className="text-md font-semibold text-gray-500 mt-2">
                Awesome work! You passed the lesson with hearts left.
              </p>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 w-full mt-8">
                <div className="rounded-2xl border-2 border-gray-200 p-4 bg-white">
                  <div className="text-xs font-bold text-gray-400 uppercase">XP Reward</div>
                  <div className="text-2xl font-black text-yellow-500 mt-1">+{xpEarned} XP</div>
                </div>
                <div className="rounded-2xl border-2 border-gray-200 p-4 bg-white">
                  <div className="text-xs font-bold text-gray-400 uppercase">Hearts Lost</div>
                  <div className="text-2xl font-black text-red-500 mt-1">{heartsLost}</div>
                </div>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-4xl font-black text-red-500">Out of Hearts!</h2>
              <p className="text-md font-semibold text-gray-500 mt-2">
                Don't give up! You can refill your hearts by practicing or start over.
              </p>
              
              <button
                onClick={refillHeartsPractice}
                className="mt-8 w-full rounded-2xl bg-yellow-400 hover:bg-yellow-500 py-4 font-black uppercase text-white border-b-4 border-yellow-600 shadow-md cursor-pointer"
              >
                Refill Hearts & Practice
              </button>
            </>
          )}

          <button
            onClick={() => {
              router.push('/');
            }}
            className="mt-4 w-full rounded-2xl bg-green-500 hover:bg-green-600 py-4 font-black uppercase text-white border-b-4 border-green-700 shadow-md cursor-pointer"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white text-gray-800 pb-36">
      {/* Header bar */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-150 max-w-4xl mx-auto w-full">
        <button onClick={() => router.push('/')} className="text-gray-400 hover:text-gray-600 cursor-pointer">
          <X className="h-6 w-6" />
        </button>

        {/* Progress Bar */}
        <div className="flex-1 mx-6 bg-gray-100 h-3 rounded-full overflow-hidden border border-gray-200 max-w-xl">
          <div
            className="bg-green-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>

        {/* Hearts indicator */}
        <div className="flex items-center gap-1.5 font-bold text-red-500">
          <Heart className="h-6 w-6 fill-red-500" />
          <span>{hearts}</span>
        </div>
      </header>

      {/* Main question box */}
      <main className="flex-1 flex flex-col justify-center px-6 py-12 max-w-2xl mx-auto w-full">
        <span className="text-4xl text-center mb-3">🦉</span>
        <div className="flex items-center justify-center gap-3">
          <h2 className="text-2xl font-black text-gray-800 text-center tracking-tight">
            {exercise.prompt}
          </h2>
          <button
            onClick={() => speak(exercise.prompt)}
            className="p-2.5 rounded-2xl border-2 border-gray-200 hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition-all text-gray-500 hover:text-gray-800 shrink-0 shadow-sm"
            title="Listen"
          >
            <Volume2 className="h-5 w-5" />
          </button>
        </div>

        {/* Dynamic Exercise Input fields */}
        {renderExerciseContent()}
      </main>

      {/* Bottom validate control footer */}
      <footer className={`fixed bottom-0 left-0 w-full p-6 border-t ${
        isGraded
          ? isCorrect
            ? 'bg-green-100 border-green-200'
            : 'bg-red-100 border-red-200'
          : 'bg-white border-gray-200'
      }`}>
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          {isGraded ? (
            <div className="flex items-start gap-3 w-full sm:w-auto">
              {isCorrect ? (
                <>
                  <CheckCircle className="h-8 w-8 text-green-600 fill-green-50 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-black text-green-700 text-lg">Excellent! You are correct.</h3>
                    <p className="text-xs text-green-600 font-semibold mt-0.5">Keep it up!</p>
                  </div>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-8 w-8 text-red-600 fill-red-50 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-black text-red-700 text-lg">Correct Solution:</h3>
                    <p className="text-sm font-bold text-red-600 mt-0.5">{correctAnswer}</p>
                    {explanation && <p className="text-xs text-red-500 font-semibold mt-1">{explanation}</p>}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wide">
              Question {currentIndex + 1} of {exercises.length}
            </div>
          )}

          <div className="w-full sm:w-auto flex justify-end">
            {!isGraded ? (
              <button
                onClick={submitAnswer}
                disabled={
                  isChecking ||
                  (exercise.type === 'MULTIPLE_CHOICE' && !selectedOption) ||
                  (exercise.type === 'TRANSLATE_WORD_BANK' && wordBankSelected.length === 0) ||
                  (exercise.type === 'FILL_BLANK' && !selectedOption && !typedAnswer) ||
                  (exercise.type === 'TYPE_ANSWER' && !typedAnswer) ||
                  (exercise.type === 'MATCH_PAIRS' && matchPairsSuccesses.length < exercise.options.length)
                }
                className="w-full sm:w-48 rounded-2xl bg-green-500 hover:bg-green-600 disabled:opacity-50 py-4 font-black uppercase text-white border-b-4 border-green-700 cursor-pointer transition-all active:translate-y-[2px]"
              >
                {isChecking ? 'Checking...' : 'Check Answer'}
              </button>
            ) : (
              <button
                onClick={nextExercise}
                className={`w-full sm:w-48 rounded-2xl py-4 font-black uppercase text-white border-b-4 shadow-sm cursor-pointer transition-all active:translate-y-[2px] ${
                  isCorrect
                    ? 'bg-green-600 hover:bg-green-700 border-green-800'
                    : 'bg-red-600 hover:bg-red-700 border-red-800'
                }`}
              >
                Continue
              </button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
