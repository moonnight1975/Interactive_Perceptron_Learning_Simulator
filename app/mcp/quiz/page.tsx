'use client';
import { useState, useMemo } from 'react';
import Navbar from '@/components/ui/Navbar';
import { calculateThreshold, computeMCP, MCPInput } from '@/lib/mcpNeuron';
import { Trophy, RotateCcw, CheckCircle, XCircle, ArrowRight, Brain } from 'lucide-react';

type QuestionType = 'find-threshold' | 'find-output';

interface Question {
  type: QuestionType;
  n: number;
  w: number;
  p: number;
  inputs?: number[];
  weights?: number[];
  threshold?: number;
  correctAnswer: number;
  prompt: string;
}

function generateQuestion(): Question {
  const type: QuestionType = Math.random() > 0.5 ? 'find-threshold' : 'find-output';
  const n = Math.floor(Math.random() * 3) + 2;
  const w = Math.floor(Math.random() * 2) + 1;
  const p = Math.floor(Math.random() * 2);

  if (type === 'find-threshold') {
    const theta = calculateThreshold(n, w, p);
    return {
      type: 'find-threshold',
      n, w, p,
      correctAnswer: theta,
      prompt: `Given n = ${n} excitatory inputs, w = ${w} (weight), p = ${p} inhibitory inputs.\nFind the threshold using theta >= nw - p.`,
    };
  } else {
    const theta = calculateThreshold(n, w, p);
    const inputValues = Array.from({ length: n }, () => Math.round(Math.random()));
    const weights = Array.from({ length: n }, () => w);
    const mcpInputs: MCPInput[] = inputValues.map((v, i) => ({
      value: v, weight: w, type: 'excitatory' as const, label: `x${i + 1}`,
    }));
    const result = computeMCP(mcpInputs, theta);
    return {
      type: 'find-output',
      n, w, p,
      inputs: inputValues,
      weights,
      threshold: theta,
      correctAnswer: result.output,
      prompt: `Inputs: (${inputValues.join(', ')})\nWeights: all = ${w}\nThreshold theta = ${theta}\n\nFind the output Y.`,
    };
  }
}

export default function MCPQuizPage() {
  const [question, setQuestion] = useState<Question>(generateQuestion);
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [showSolution, setShowSolution] = useState(false);

  const handleSubmit = () => {
    const userAnswer = parseFloat(answer);
    const correct = userAnswer === question.correctAnswer;
    setIsCorrect(correct);
    setSubmitted(true);
    setScore(prev => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1,
    }));
  };

  const handleNext = () => {
    setQuestion(generateQuestion());
    setAnswer('');
    setSubmitted(false);
    setShowSolution(false);
  };

  const handleReset = () => {
    setScore({ correct: 0, total: 0 });
    handleNext();
  };

  const solutionText = useMemo(() => {
    if (question.type === 'find-threshold') {
      return `theta >= nw - p\ntheta >= (${question.n} x ${question.w}) - ${question.p}\ntheta >= ${question.n * question.w} - ${question.p}\ntheta >= ${question.correctAnswer}\n\nAnswer: theta = ${question.correctAnswer}`;
    } else {
      const yin = question.inputs!.reduce((sum, v, i) => sum + v * question.weights![i], 0);
      const terms = question.inputs!.map((v, i) => `${v}x${question.weights![i]}`).join(' + ');
      return `Yin = ${terms} = ${yin}\ntheta = ${question.threshold}\n${yin} ${yin >= question.threshold! ? '>=' : '<'} ${question.threshold}\n\nAnswer: Y = ${question.correctAnswer}`;
    }
  }, [question]);

  return (
    <div className="min-h-screen pt-16">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 pt-8 pb-20">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 badge badge-primary mb-4">
            <Brain size={14} /> Interactive Quiz
          </div>
          <h1 className="text-3xl font-black mb-2">
            MCP Neuron <span className="gradient-text-accent">Quiz</span>
          </h1>
          <p className="text-[var(--text-muted)] text-sm">
            Test your understanding of the McCulloch-Pitts threshold rule.
          </p>
        </div>

        <div className="flex gap-3 justify-center mb-6">
          <div className="stat-card px-6">
            <div className="stat-value text-[#00FF94]">{score.correct}</div>
            <div className="stat-label">Correct</div>
          </div>
          <div className="stat-card px-6">
            <div className="stat-value text-[var(--text-muted)]">{score.total}</div>
            <div className="stat-label">Total</div>
          </div>
          <div className="stat-card px-6">
            <div className="stat-value gradient-text">{score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0}%</div>
            <div className="stat-label">Score</div>
          </div>
        </div>

        <div className="glass-card p-8 mb-4" style={{ border: `1px solid ${submitted ? (isCorrect ? 'rgba(0,255,148,0.3)' : 'rgba(255,68,68,0.3)') : 'rgba(108,99,255,0.2)'}` }}>
          <div className="flex items-center gap-2 mb-4">
            <span className="badge badge-primary">Q{score.total + (submitted ? 0 : 1)}</span>
            <span className="badge" style={{ background: question.type === 'find-threshold' ? 'rgba(255,184,0,0.1)' : 'rgba(0,212,255,0.1)', color: question.type === 'find-threshold' ? '#FFB800' : '#00D4FF', border: `1px solid ${question.type === 'find-threshold' ? 'rgba(255,184,0,0.3)' : 'rgba(0,212,255,0.3)'}` }}>
              {question.type === 'find-threshold' ? 'Find theta' : 'Find Output'}
            </span>
          </div>

          <div className="formula-box mb-6 whitespace-pre-line text-sm">{question.prompt}</div>

          <div className="flex gap-3">
            <input
              type="number"
              step="0.5"
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              placeholder="Your answer..."
              className="neon-input flex-1 text-lg text-center"
              disabled={submitted}
              onKeyDown={e => e.key === 'Enter' && !submitted && answer && handleSubmit()}
            />
            {!submitted ? (
              <button onClick={handleSubmit} disabled={!answer} className="neon-btn neon-btn-primary px-6">
                Check
              </button>
            ) : (
              <button onClick={handleNext} className="neon-btn neon-btn-primary px-6">
                Next <ArrowRight size={14} />
              </button>
            )}
          </div>

          {submitted && (
            <div className={`mt-4 p-4 rounded-xl flex items-center gap-3 animate-fade-in-up ${isCorrect ? 'bg-[rgba(0,255,148,0.08)]' : 'bg-[rgba(255,68,68,0.08)]'}`} style={{ border: `1px solid ${isCorrect ? 'rgba(0,255,148,0.3)' : 'rgba(255,68,68,0.3)'}` }}>
              {isCorrect ? (
                <><CheckCircle size={22} className="text-[#00FF94]" /><div><div className="font-bold text-[#00FF94]">Correct!</div><div className="text-xs text-[var(--text-muted)]">Great understanding of the MCP model.</div></div></>
              ) : (
                <><XCircle size={22} className="text-[#FF4444]" /><div><div className="font-bold text-[#FF4444]">Incorrect</div><div className="text-xs text-[var(--text-muted)]">The correct answer is <span className="text-white font-bold">{question.correctAnswer}</span></div></div></>
              )}
            </div>
          )}
        </div>

        {submitted && (
          <div className="glass-card p-6">
            <button onClick={() => setShowSolution(!showSolution)} className="neon-btn neon-btn-ghost w-full py-2 text-sm mb-3">
              {showSolution ? 'Hide Solution' : 'Show Solution'}
            </button>
            {showSolution && (
              <div className="formula-box whitespace-pre-line text-sm animate-fade-in-up">{solutionText}</div>
            )}
          </div>
        )}

        <div className="text-center mt-6">
          <button onClick={handleReset} className="neon-btn neon-btn-ghost text-sm">
            <RotateCcw size={14} /> Reset Score
          </button>
        </div>
      </div>
    </div>
  );
}
