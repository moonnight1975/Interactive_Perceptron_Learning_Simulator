'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { trainPerceptron, TrainingResult, TrainingStep, DataPoint, randomWeights } from '@/lib/perceptron';

export type TrainerStatus = 'idle' | 'training' | 'paused' | 'finished';

const SPEED_MAP = {
  'very-slow': 2000,
  'slow': 1000,
  'normal': 400,
  'fast': 100,
  'instant': 0,
};

export type SpeedLevel = keyof typeof SPEED_MAP;

export interface TrainerState {
  status: TrainerStatus;
  currentStepIndex: number;
  steps: TrainingStep[];
  result: TrainingResult | null;
  currentStep: TrainingStep | null;
  speed: SpeedLevel;
  isAutoPlay: boolean;
}

export function usePerceptronTrainer() {
  const [status, setStatus] = useState<TrainerStatus>('idle');
  const [steps, setSteps] = useState<TrainingStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [result, setResult] = useState<TrainingResult | null>(null);
  const [speed, setSpeed] = useState<SpeedLevel>('normal');
  const [isAutoPlay, setIsAutoPlay] = useState(false);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isPlayingRef = useRef(false);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Initialize training (pre-compute all steps)
  const initTraining = useCallback((
    dataset: DataPoint[],
    initialWeights: number[],
    initialBias: number,
    learningRate: number,
    threshold: number,
    maxEpochs: number,
    useRandom: boolean
  ) => {
    clearTimer();
    const iw = useRandom ? randomWeights(2) : initialWeights;
    const result = trainPerceptron(dataset, iw, initialBias, learningRate, threshold, maxEpochs);
    setSteps(result.steps);
    setResult(result);
    setCurrentStepIndex(-1);
    setStatus('training');
    setIsAutoPlay(false);
    isPlayingRef.current = false;
    return result;
  }, [clearTimer]);

  // Auto-advance logic
  const advance = useCallback((currentIndex: number, allSteps: TrainingStep[], currentSpeed: SpeedLevel) => {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= allSteps.length) {
      setCurrentStepIndex(allSteps.length - 1);
      setStatus('finished');
      setIsAutoPlay(false);
      isPlayingRef.current = false;
      return;
    }
    setCurrentStepIndex(nextIndex);
    const delay = SPEED_MAP[currentSpeed];
    if (delay === 0) {
      // instant: jump to end
      setCurrentStepIndex(allSteps.length - 1);
      setStatus('finished');
      setIsAutoPlay(false);
      isPlayingRef.current = false;
    } else {
      timerRef.current = setTimeout(() => {
        if (isPlayingRef.current) {
          advance(nextIndex, allSteps, currentSpeed);
        }
      }, delay);
    }
  }, []);

  const play = useCallback(() => {
    if (status === 'finished') return;
    setIsAutoPlay(true);
    setStatus('training');
    isPlayingRef.current = true;
    // start advancing from current
    setCurrentStepIndex(prev => {
      const startIndex = prev;
      const delay = SPEED_MAP[speed];
      if (delay === 0) {
        setCurrentStepIndex(steps.length - 1);
        setStatus('finished');
        setIsAutoPlay(false);
        isPlayingRef.current = false;
        return steps.length - 1;
      }
      timerRef.current = setTimeout(() => {
        if (isPlayingRef.current) {
          advance(startIndex, steps, speed);
        }
      }, delay);
      return prev;
    });
  }, [status, speed, steps, advance]);

  const pause = useCallback(() => {
    clearTimer();
    isPlayingRef.current = false;
    setIsAutoPlay(false);
    setStatus('paused');
  }, [clearTimer]);

  const nextStep = useCallback(() => {
    clearTimer();
    isPlayingRef.current = false;
    setIsAutoPlay(false);
    setCurrentStepIndex(prev => {
      const next = prev + 1;
      if (next >= steps.length) {
        setStatus('finished');
        return steps.length - 1;
      }
      return next;
    });
  }, [clearTimer, steps.length]);

  const prevStep = useCallback(() => {
    clearTimer();
    isPlayingRef.current = false;
    setIsAutoPlay(false);
    setCurrentStepIndex(prev => Math.max(-1, prev - 1));
  }, [clearTimer]);

  const reset = useCallback(() => {
    clearTimer();
    isPlayingRef.current = false;
    setIsAutoPlay(false);
    setCurrentStepIndex(-1);
    setStatus('idle');
    setSteps([]);
    setResult(null);
  }, [clearTimer]);

  const jumpToInstant = useCallback(() => {
    clearTimer();
    isPlayingRef.current = false;
    setIsAutoPlay(false);
    if (steps.length > 0) {
      setCurrentStepIndex(steps.length - 1);
      setStatus('finished');
    }
  }, [clearTimer, steps.length]);

  // Cleanup on unmount
  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  const currentStep = steps[currentStepIndex] ?? null;

  return {
    status,
    steps,
    currentStepIndex,
    currentStep,
    result,
    speed,
    setSpeed,
    isAutoPlay,
    initTraining,
    play,
    pause,
    nextStep,
    prevStep,
    reset,
    jumpToInstant,
    totalSteps: steps.length,
  };
}
