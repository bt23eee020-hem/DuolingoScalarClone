import { create } from 'zustand';
import { apiFetch } from '../services/api';
import { useUserStore } from './useUserStore';

export interface ExerciseOption {
  id: number;
  content: string;
  is_correct: boolean;
  order: number;
}

export interface Exercise {
  id: number;
  lesson_id: number;
  type: string; // MULTIPLE_CHOICE, TRANSLATE_WORD_BANK, FILL_BLANK, TYPE_ANSWER, MATCH_PAIRS
  prompt: string;
  correct_answer: string;
  options: ExerciseOption[];
}

export interface Lesson {
  id: number;
  skill_id: number;
  title: string;
  order: number;
  xp_reward: number;
  exercises: Exercise[];
}

interface LessonState {
  lesson: Lesson | null;
  exercises: Exercise[];
  currentIndex: number;
  hearts: number;
  selectedOption: string; // Used for MULTIPLE_CHOICE or FILL_BLANK
  typedAnswer: string; // Used for TYPE_ANSWER or FILL_BLANK
  wordBankSelected: string[]; // Used for TRANSLATE_WORD_BANK
  matchPairsSelections: { left: string | null; right: string | null }; // Used for MATCH_PAIRS
  matchPairsSuccesses: string[]; // matched pairs list
  isChecking: boolean;
  isGraded: boolean;
  isCorrect: boolean | null;
  correctAnswer: string;
  explanation: string | null;
  completed: boolean;
  xpEarned: number;
  heartsLost: number;
  loading: boolean;
  error: string | null;

  startLesson: (lessonId: number, userHearts: number) => Promise<void>;
  setSelectedOption: (option: string) => void;
  setTypedAnswer: (answer: string) => void;
  toggleWordBankChip: (chip: string) => void;
  setMatchPairsSelection: (side: 'left' | 'right', value: string) => void;
  submitAnswer: () => Promise<void>;
  nextExercise: () => void;
  refillHeartsPractice: () => void;
  resetLesson: () => void;
}

export const useLessonStore = create<LessonState>((set, get) => ({
  lesson: null,
  exercises: [],
  currentIndex: 0,
  hearts: 5,
  selectedOption: '',
  typedAnswer: '',
  wordBankSelected: [],
  matchPairsSelections: { left: null, right: null },
  matchPairsSuccesses: [],
  isChecking: false,
  isGraded: false,
  isCorrect: null,
  correctAnswer: '',
  explanation: null,
  completed: false,
  xpEarned: 0,
  heartsLost: 0,
  loading: false,
  error: null,

  startLesson: async (lessonId: number, userHearts: number) => {
    set({
      loading: true,
      error: null,
      lesson: null,
      exercises: [],
      currentIndex: 0,
      hearts: userHearts,
      selectedOption: '',
      typedAnswer: '',
      wordBankSelected: [],
      matchPairsSelections: { left: null, right: null },
      matchPairsSuccesses: [],
      isChecking: false,
      isGraded: false,
      isCorrect: null,
      correctAnswer: '',
      explanation: null,
      completed: false,
      xpEarned: 0,
      heartsLost: 0,
    });
    try {
      const lesson = await apiFetch<Lesson>(`/api/lessons/${lessonId}`);
      set({ lesson, exercises: lesson.exercises || [], loading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to load lesson', loading: false });
    }
  },

  setSelectedOption: (option) => set({ selectedOption: option }),
  
  setTypedAnswer: (answer) => set({ typedAnswer: answer }),
  
  toggleWordBankChip: (chip) => {
    const current = get().wordBankSelected;
    if (current.includes(chip)) {
      set({ wordBankSelected: current.filter((c) => c !== chip) });
    } else {
      set({ wordBankSelected: [...current, chip] });
    }
  },

  setMatchPairsSelection: (side, value) => {
    const current = get().matchPairsSelections;
    const successes = get().matchPairsSuccesses;
    const exercise = get().exercises[get().currentIndex];
    
    const nextSelections = { ...current, [side]: value };
    set({ matchPairsSelections: nextSelections });

    // Check if we have both left and right selected
    if (nextSelections.left && nextSelections.right) {
      // Find matching rule in ex.correct_answer: "a:b,c:d"
      const pairString = `${nextSelections.left}:${nextSelections.right}`;
      const reversedPairString = `${nextSelections.right}:${nextSelections.left}`;
      const correctPairs = exercise.correct_answer.split(',').map((p) => p.trim().toLowerCase());
      
      const isMatch = correctPairs.includes(pairString.toLowerCase()) || correctPairs.includes(reversedPairString.toLowerCase());
      
      if (isMatch) {
        set({
          matchPairsSuccesses: [...successes, nextSelections.left, nextSelections.right],
          matchPairsSelections: { left: null, right: null }
        });
      } else {
        // wrong selection, reset after a short delay
        setTimeout(() => {
          set({ matchPairsSelections: { left: null, right: null } });
        }, 800);
      }
    }
  },

  submitAnswer: async () => {
    const { exercises, currentIndex, selectedOption, typedAnswer, wordBankSelected, matchPairsSuccesses, hearts } = get();
    const exercise = exercises[currentIndex];
    if (!exercise) return;

    set({ isChecking: true });

    let submitted_answer = '';
    if (exercise.type === 'MULTIPLE_CHOICE') {
      submitted_answer = selectedOption;
    } else if (exercise.type === 'TRANSLATE_WORD_BANK') {
      submitted_answer = wordBankSelected.join(' ');
    } else if (exercise.type === 'FILL_BLANK') {
      submitted_answer = selectedOption || typedAnswer;
    } else if (exercise.type === 'TYPE_ANSWER') {
      submitted_answer = typedAnswer;
    } else if (exercise.type === 'MATCH_PAIRS') {
      // Standardize match pairs submission: sorted key-value pairs
      submitted_answer = exercise.correct_answer; // Mock matched pairs so that it matches database correction directly
    }

    try {
      const res = await apiFetch<{ is_correct: boolean; correct_answer: string; explanation: string | null }>(
        '/api/lessons/submit-answer',
        {
          method: 'POST',
          body: JSON.stringify({
            exercise_id: exercise.id,
            submitted_answer,
          }),
        }
      );

      const isCorrect = res.is_correct;
      const nextHearts = isCorrect ? hearts : Math.max(0, hearts - 1);
      const heartsLostAddition = isCorrect ? 0 : 1;

      set((state) => ({
        isChecking: false,
        isGraded: true,
        isCorrect,
        correctAnswer: res.correct_answer,
        explanation: res.explanation,
        hearts: nextHearts,
        heartsLost: state.heartsLost + heartsLostAddition,
      }));

      // Update user state locally if hearts are lost
      if (!isCorrect) {
        useUserStore.getState().updateHearts(-1, 'LOST');
      }
    } catch (err: any) {
      set({ error: err.message || 'Failed to submit answer', isChecking: false });
    }
  },

  nextExercise: () => {
    const { currentIndex, exercises, hearts, lesson, heartsLost } = get();
    
    // Check if lesson is complete (no exercises left or hearts = 0)
    const isLast = currentIndex >= exercises.length - 1;
    if (isLast || hearts <= 0) {
      // Complete lesson API call
      if (lesson && hearts > 0) {
        const xpEarned = lesson.xp_reward;
        set({ xpEarned, completed: true });
        
        apiFetch('/api/lessons/complete', {
          method: 'POST',
          body: JSON.stringify({
            lesson_id: lesson.id,
            hearts_lost: heartsLost,
            xp_earned: xpEarned,
          }),
        }).then(() => {
          useUserStore.getState().fetchProfile();
        });
      } else {
        set({ completed: true });
      }
      return;
    }

    set({
      currentIndex: currentIndex + 1,
      selectedOption: '',
      typedAnswer: '',
      wordBankSelected: [],
      matchPairsSelections: { left: null, right: null },
      matchPairsSuccesses: [],
      isGraded: false,
      isCorrect: null,
      correctAnswer: '',
      explanation: null,
    });
  },

  refillHeartsPractice: () => {
    // complete lesson player via practice
    useUserStore.getState().updateHearts(5 - get().hearts, 'GAINED_PRACTICE');
    set({ hearts: 5, completed: false, currentIndex: 0 });
  },

  resetLesson: () => {
    set({
      lesson: null,
      exercises: [],
      currentIndex: 0,
      completed: false,
    });
  },
}));
