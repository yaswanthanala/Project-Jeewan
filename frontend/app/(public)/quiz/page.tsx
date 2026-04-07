'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import QuizStep from '@/components/QuizStep';
import GetHelpModal from '@/components/GetHelpModal';
import { Shield, ArrowLeft, ShieldAlert } from 'lucide-react';
import { riskAPI, getUser } from '@/lib/api';
import { useLanguage } from '@/lib/i18n';

const DAST_10_QUESTIONS = [
  { id: 1, question: 'Have you used drugs other than those required for medical reasons?', answers: [{ value: 0, label: 'No', description: 'No recreational use' }, { value: 1, label: 'Yes', description: 'Used recreationally' }] },
  { id: 2, question: 'Do you abuse more than one drug at a time?', answers: [{ value: 0, label: 'No', description: 'Single or none' }, { value: 1, label: 'Yes', description: 'Polysubstance use' }] },
  { id: 3, question: 'Are you always able to stop using drugs when you want to?', answers: [{ value: 1, label: 'Yes', description: 'Full control' }, { value: 0, label: 'No', description: 'Difficulty stopping' }] },
  { id: 4, question: 'Have you had blackouts or flashbacks as a result of drug use?', answers: [{ value: 0, label: 'No', description: 'No memory loss' }, { value: 1, label: 'Yes', description: 'Experienced blackouts' }] },
  { id: 5, question: 'Do you ever feel bad or guilty about your drug use?', answers: [{ value: 0, label: 'No', description: 'No guilt' }, { value: 1, label: 'Yes', description: 'Feel guilty' }] },
  { id: 6, question: 'Does your spouse (or parents) ever complain about your drug use?', answers: [{ value: 0, label: 'No', description: 'No complaints' }, { value: 1, label: 'Yes', description: 'Family concerns' }] },
  { id: 7, question: 'Have you neglected your family because of your use of drugs?', answers: [{ value: 0, label: 'No', description: 'Prioritize family' }, { value: 1, label: 'Yes', description: 'Family neglect' }] },
  { id: 8, question: 'Have you engaged in illegal activities to obtain drugs?', answers: [{ value: 0, label: 'No', description: 'No illegal activity' }, { value: 1, label: 'Yes', description: 'Illegal acts' }] },
  { id: 9, question: 'Have you ever experienced withdrawal symptoms when you stopped?', answers: [{ value: 0, label: 'No', description: 'No withdrawal' }, { value: 1, label: 'Yes', description: 'Withdrawal symptoms' }] },
  { id: 10, question: 'Have you had medical problems as a result of your drug use?', answers: [{ value: 0, label: 'No', description: 'No health issues' }, { value: 1, label: 'Yes', description: 'Medical complications' }] },
];

export default function QuizPage() {
  const { t } = useLanguage();
  const [quizState, setQuizState] = useState({ currentQuestion: 0, answers: [] as number[], isComplete: false });
  const [showGetHelpModal, setShowGetHelpModal] = useState(false);
  const [serverResult, setServerResult] = useState<{ risk_level: string; recommendation: string; score: number } | null>(null);

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
      // Submit to Risk MS
      const user = getUser();
      riskAPI.assess(quizState.answers, user?.id || 'anonymous', user?.institution || '')
        .then((data) => { if (data) setServerResult(data); })
        .catch(() => {});
    }
  };

  const totalScore = serverResult?.score ?? quizState.answers.reduce((sum, val) => sum + val, 0);
  const riskLevel = serverResult?.risk_level ?? (totalScore > 6 ? 'high' : totalScore > 3 ? 'moderate' : 'low');

  const handleRestart = () => {
    setQuizState({ currentQuestion: 0, answers: [], isComplete: false });
    setShowGetHelpModal(false);
    setServerResult(null);
  };

  if (quizState.isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <div id="quiz-result" className="bg-card border border-border shadow-xl rounded-3xl p-8 md:p-12 text-center animate-float-up">
            <h1 className="text-2xl font-bold text-foreground mb-6">Your Results</h1>

            <div className="mb-6 p-6 bg-gradient-to-br from-jeewan-calm/10 to-jeewan-calm/5 rounded-2xl">
              <div className="text-4xl font-bold text-jeewan-calm mb-1">{totalScore}</div>
              <p className="text-sm text-jeewan-muted">out of 10 points (DAST-10)</p>
            </div>

            <div className={`mb-6 p-5 rounded-2xl border-2 ${
              riskLevel === 'high' || riskLevel === 'severe' ? 'bg-jeewan-warn-light border-jeewan-warn'
              : riskLevel === 'moderate' ? 'bg-jeewan-amber-light border-jeewan-amber'
              : 'bg-jeewan-nature-light border-jeewan-nature'
            }`}>
              <h2 className={`font-bold text-lg mb-1 ${
                riskLevel === 'high' || riskLevel === 'severe' ? 'text-jeewan-warn'
                : riskLevel === 'moderate' ? 'text-jeewan-amber'
                : 'text-jeewan-nature'
              }`}>
                {riskLevel === 'severe' ? '🆘 Severe Addiction' : riskLevel === 'high' ? '⚠️ High Risk' : riskLevel === 'moderate' ? '⚠️ Moderate Risk' : '✅ Low Risk'}
              </h2>
              <p className="text-sm text-jeewan-ink2 dark:text-jeewan-muted font-medium italic">
                {serverResult?.recommendation || (
                  riskLevel === 'high' || riskLevel === 'severe' ? 'Professional help is strongly recommended.'
                  : riskLevel === 'moderate' ? 'Consider speaking with a counsellor.'
                  : 'No major intervention needed at this stage.'
                )}
              </p>
              {serverResult?.recommendation?.includes('NLP Analysis Verified') && (
                <div className="mt-3 pt-3 border-t border-black/5 dark:border-white/5 flex items-center justify-center gap-1.5 text-[10px] font-bold text-jeewan-calm uppercase tracking-widest">
                  <ShieldAlert className="w-3 h-3" /> AI Psychometric Analysis Active
                </div>
              )}
            </div>

            {(riskLevel === 'high' || riskLevel === 'severe' || riskLevel === 'moderate') && (
              <button onClick={() => setShowGetHelpModal(true)} className="w-full bg-jeewan-calm hover:bg-jeewan-calm/90 text-white font-bold py-3 rounded-xl mb-3 transition shadow-lg shadow-jeewan-calm/20">
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
        {showGetHelpModal && (
          <GetHelpModal 
            isOpen 
            onClose={() => setShowGetHelpModal(false)} 
            score={totalScore}
            riskLevel={riskLevel}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center gap-2 text-sm text-jeewan-muted hover:text-jeewan-calm transition">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
          <h1 className="font-bold text-foreground">Risk Self-Assessment</h1>
          <span className="flex items-center gap-1 text-xs text-jeewan-nature bg-jeewan-nature-light px-2.5 py-1 rounded-full font-medium">
            <Shield className="w-3 h-3" /> Anonymous
          </span>
        </div>

        {/* Quiz Card */}
        <div className="bg-card border border-border shadow-lg rounded-3xl p-6 md:p-10 mb-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-muted">
            <div 
              className="h-full bg-jeewan-calm transition-all duration-500" 
              style={{ width: `${((quizState.currentQuestion + 1) / DAST_10_QUESTIONS.length) * 100}%` }} 
            />
          </div>
          
          <QuizStep
            questionNumber={quizState.currentQuestion + 1}
            totalQuestions={DAST_10_QUESTIONS.length}
            question={currentQuestion.question}
            answers={currentQuestion.answers}
            selectedValue={selectedAnswer}
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
