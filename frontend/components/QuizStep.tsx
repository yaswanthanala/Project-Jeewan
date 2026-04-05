'use client';

import { Button } from '@/components/ui/button';

interface QuizStepProps {
  questionNumber: number;
  totalQuestions: number;
  question: string;
  answers: { value: number; label: string; description: string }[];
  onAnswer: (value: number) => void;
  onNext: () => void;
  isAnswered: boolean;
}

export default function QuizStep({
  questionNumber,
  totalQuestions,
  question,
  answers,
  onAnswer,
  onNext,
  isAnswered,
}: QuizStepProps) {
  const progress = (questionNumber / totalQuestions) * 100;
  const minutesLeft = Math.ceil(((totalQuestions - questionNumber) * 0.5));

  return (
    <div className="animate-float-up">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-jeewan-muted mb-2">
          <span>Question {questionNumber} of {totalQuestions}</span>
          <span>~{minutesLeft} min left</span>
        </div>
        <div className="w-full bg-jeewan-surface dark:bg-muted rounded-full h-2 overflow-hidden">
          <div
            className="bg-jeewan-calm h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-jeewan-muted mt-1.5">{Math.round(progress)}% complete</p>
      </div>

      {/* Question */}
      <div className="mb-6">
        <p className="text-xs font-medium text-jeewan-calm uppercase tracking-wider mb-2">Question {questionNumber}</p>
        <h2 className="text-lg md:text-xl font-semibold text-foreground leading-relaxed">
          {question}
        </h2>
      </div>

      {/* Answers */}
      <div className="space-y-2.5 mb-6">
        {answers.map((answer, idx) => (
          <button
            key={idx}
            data-answer
            onClick={() => onAnswer(answer.value)}
            className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
              isAnswered
                ? 'border-jeewan-calm-mid bg-jeewan-calm-light text-jeewan-calm'
                : 'border-border hover:border-jeewan-calm-mid hover:bg-jeewan-calm-light/50 text-foreground'
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <span className="font-medium text-sm">{answer.label}</span>
                <span className="text-xs text-jeewan-muted ml-2">{answer.description}</span>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                isAnswered ? 'border-jeewan-calm bg-jeewan-calm' : 'border-border'
              }`}>
                {isAnswered && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Next Button */}
      <Button
        id="quiz-next"
        onClick={onNext}
        disabled={!isAnswered}
        className="w-full bg-jeewan-calm hover:bg-jeewan-calm/90 text-white font-bold py-3 rounded-xl disabled:opacity-40"
      >
        {questionNumber === totalQuestions ? 'See Results' : 'Next Question →'}
      </Button>
    </div>
  );
}
