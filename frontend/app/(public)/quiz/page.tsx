'use client';

import { useState } from 'react';
import Link from 'next/link';
import QuizStep from '@/components/QuizStep';
import GetHelpModal from '@/components/GetHelpModal';
import { Shield, ArrowLeft } from 'lucide-react';

const DAST_10_QUESTIONS = [
  { id: 1, question: 'Have you used drugs other than those required for medical reasons?', answers: [{ value: 0, label: 'Never', description: 'No recreational use' }, { value: 1, label: 'Once or twice', description: 'Rare occurrence' }, { value: 2, label: 'Monthly', description: 'Occasional use' }, { value: 3, label: 'Weekly or more', description: 'Frequent use' }] },
  { id: 2, question: 'Do you abuse more than one drug at a time?', answers: [{ value: 0, label: 'No', description: 'Single or none' }, { value: 1, label: 'Occasionally', description: 'Rarely combine' }, { value: 2, label: 'Sometimes', description: 'Occasional polyuse' }, { value: 3, label: 'Often', description: 'Frequent polyuse' }] },
  { id: 3, question: 'Are you unable to stop using drugs when you want to?', answers: [{ value: 0, label: 'Not at all', description: 'Full control' }, { value: 1, label: 'Rarely', description: 'Usually can stop' }, { value: 2, label: 'Sometimes', description: 'Moderate difficulty' }, { value: 3, label: 'Often', description: 'Frequent inability' }] },
  { id: 4, question: 'Have you had blackouts or flashbacks as a result of drug use?', answers: [{ value: 0, label: 'Never', description: 'No memory loss' }, { value: 1, label: 'Once or twice', description: 'Rare occurrence' }, { value: 2, label: 'Occasionally', description: 'Some incidents' }, { value: 3, label: 'Frequently', description: 'Regular occurrence' }] },
  { id: 5, question: 'Do you ever feel bad about your drug abuse?', answers: [{ value: 0, label: 'Never', description: 'No guilt' }, { value: 1, label: 'Rarely', description: 'Occasional guilt' }, { value: 2, label: 'Sometimes', description: 'Moderate guilt' }, { value: 3, label: 'Often', description: 'Frequent guilt' }] },
  { id: 6, question: 'Does your family ever complain about your involvement with drugs?', answers: [{ value: 0, label: 'Never', description: 'No complaints' }, { value: 1, label: 'Rarely', description: 'Occasional concern' }, { value: 2, label: 'Sometimes', description: 'Regular complaints' }, { value: 3, label: 'Often', description: 'Frequent conflicts' }] },
  { id: 7, question: 'Have you neglected your family because of your use of drugs?', answers: [{ value: 0, label: 'Never', description: 'Prioritize family' }, { value: 1, label: 'Rarely', description: 'Occasional neglect' }, { value: 2, label: 'Sometimes', description: 'Moderate neglect' }, { value: 3, label: 'Often', description: 'Frequent neglect' }] },
  { id: 8, question: 'Have you engaged in illegal activities to obtain drugs?', answers: [{ value: 0, label: 'Never', description: 'No illegal activity' }, { value: 1, label: 'Once', description: 'Single incident' }, { value: 2, label: 'Occasionally', description: 'Few incidents' }, { value: 3, label: 'Often', description: 'Frequent acts' }] },
  { id: 9, question: 'Have you experienced withdrawal symptoms when you stopped taking drugs?', answers: [{ value: 0, label: 'Never', description: 'No withdrawal' }, { value: 1, label: 'Once', description: 'Single episode' }, { value: 2, label: 'Occasionally', description: 'Some episodes' }, { value: 3, label: 'Often', description: 'Regular withdrawal' }] },
  { id: 10, question: 'Have you had medical problems as a result of your drug use?', answers: [{ value: 0, label: 'None', description: 'No health issues' }, { value: 1, label: 'Minor', description: 'Slight concerns' }, { value: 2, label: 'Moderate', description: 'Several issues' }, { value: 3, label: 'Serious', description: 'Significant problems' }] },
];

export default function QuizPage() {
  const [quizState, setQuizState] = useState({ currentQuestion: 0, answers: [] as number[], isComplete: false });
  const [showGetHelpModal, setShowGetHelpModal] = useState(false);

  const currentQuestion = DAST_10_QUESTIONS[quizState.currentQuestion];
  const selectedAnswer = quizState.answers[quizState.currentQuestion];

  const handleAnswer = (value: number) => {
    const newAnswers = [...quizState.answers];
    newAnswers[quizState.currentQuestion] = value;
    setQuizState({ ...quizState, answers: newAnswers });
  };

  const handleNext = () => {
    if (quizState.currentQuestion < DAST_10_QUESTIONS.length - 1) {
      setQuizState({ ...quizState, currentQuestion: quizState.currentQuestion + 1 });
    } else {
      setQuizState({ ...quizState, isComplete: true });
    }
  };

  const totalScore = quizState.answers.reduce((sum, val) => sum + val, 0);
  const riskLevel = totalScore > 6 ? 'high' : totalScore > 3 ? 'moderate' : 'low';

  const handleRestart = () => {
    setQuizState({ currentQuestion: 0, answers: [], isComplete: false });
    setShowGetHelpModal(false);
  };

  if (quizState.isComplete) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-lg mx-auto px-4 py-12">
          <div id="quiz-result" className="bg-card border border-border rounded-2xl p-6 md:p-8 text-center animate-float-up">
            <h1 className="text-2xl font-bold text-foreground mb-6">Your Results</h1>

            <div className="mb-6 p-6 bg-gradient-to-br from-jeewan-calm/10 to-jeewan-calm/5 rounded-2xl">
              <div className="text-4xl font-bold text-jeewan-calm mb-1">{totalScore}</div>
              <p className="text-sm text-jeewan-muted">out of 30 points</p>
            </div>

            <div className={`mb-6 p-5 rounded-2xl border-2 ${
              riskLevel === 'high' ? 'bg-jeewan-warn-light border-jeewan-warn'
              : riskLevel === 'moderate' ? 'bg-jeewan-amber-light border-jeewan-amber'
              : 'bg-jeewan-nature-light border-jeewan-nature'
            }`}>
              <h2 className={`font-bold text-lg mb-1 ${
                riskLevel === 'high' ? 'text-jeewan-warn'
                : riskLevel === 'moderate' ? 'text-jeewan-amber'
                : 'text-jeewan-nature'
              }`}>
                {riskLevel === 'high' ? '⚠️ High Risk' : riskLevel === 'moderate' ? '⚠️ Moderate Risk' : '✅ Low Risk — Keep it up!'}
              </h2>
              <p className="text-sm text-jeewan-ink2 dark:text-jeewan-muted">
                {riskLevel === 'high' ? 'Professional help is strongly recommended.'
                : riskLevel === 'moderate' ? 'Consider speaking with a counsellor.'
                : 'Sign up to track your progress and earn badges.'}
              </p>
            </div>

            {riskLevel !== 'low' && (
              <button onClick={() => setShowGetHelpModal(true)} className="w-full bg-jeewan-calm hover:bg-jeewan-calm/90 text-white font-bold py-3 rounded-xl mb-3 transition">
                Get Help Now
              </button>
            )}

            {riskLevel === 'low' && (
              <Link href="/login" className="block w-full bg-jeewan-nature hover:bg-jeewan-nature/90 text-white font-bold py-3 rounded-xl mb-3 text-center transition">
                Sign Up & Track Progress
              </Link>
            )}

            <button onClick={handleRestart} className="w-full py-3 rounded-xl border border-border text-foreground font-medium hover:bg-muted transition">
              Retake Quiz
            </button>

            <p className="text-xs text-jeewan-muted mt-6">
              <strong>Confidential:</strong> This assessment is for informational purposes only.
            </p>
          </div>
        </div>
        {showGetHelpModal && <GetHelpModal isOpen onClose={() => setShowGetHelpModal(false)} />}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="flex items-center gap-2 text-sm text-jeewan-muted hover:text-jeewan-calm transition">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
          <h1 className="font-bold text-foreground">Risk Self-Assessment</h1>
          <span className="flex items-center gap-1 text-xs text-jeewan-nature bg-jeewan-nature-light px-2.5 py-1 rounded-full font-medium">
            <Shield className="w-3 h-3" /> Anonymous
          </span>
        </div>

        {/* Quiz Card */}
        <div className="bg-card border border-border rounded-2xl p-5 md:p-6">
          <QuizStep
            questionNumber={quizState.currentQuestion + 1}
            totalQuestions={DAST_10_QUESTIONS.length}
            question={currentQuestion.question}
            answers={currentQuestion.answers}
            onAnswer={handleAnswer}
            onNext={handleNext}
            isAnswered={selectedAnswer !== undefined}
          />
        </div>

        <p className="text-xs text-jeewan-muted text-center mt-4">
          🔒 All responses are confidential and not shared.
        </p>
      </div>
    </div>
  );
}
