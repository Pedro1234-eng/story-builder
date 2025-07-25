
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { QuizQuestion, UserAnswer } from '../types';
import NumberPad from './NumberPad';
import { SoundOnIcon, CheckCircleIcon, XCircleIcon } from './IconComponents';

interface QuizScreenProps {
  questions: QuizQuestion[];
  instructions: string;
  onQuizComplete: (answers: UserAnswer[]) => void;
  isMuted: boolean;
}

type Feedback = {
  type: 'correct' | 'incorrect';
  message: string;
} | null;

const QuizScreen: React.FC<QuizScreenProps> = ({ questions, instructions, onQuizComplete, isMuted }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [feedback, setFeedback] = useState<Feedback>(null);

  const correctSoundRef = useRef<HTMLAudioElement | null>(null);
  const incorrectSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    correctSoundRef.current = new Audio('https://cdn.pixabay.com/audio/2022/03/15/audio_22183387d8.mp3');
    incorrectSoundRef.current = new Audio('https://cdn.pixabay.com/audio/2021/08/04/audio_c6cc1ee1e1.mp3');
  }, []);
  
  const currentQuestion = questions[currentQuestionIndex];

  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window && !isMuted) {
      // Replace operators with words for better pronunciation
      const speakableText = text
        .replace(/\*/g, 'times')
        .replace(/\//g, 'divided by')
        .replace(/\+/g, 'plus')
        .replace(/-/g, 'minus')
        .replace(/=/g, 'equals');
      const utterance = new SpeechSynthesisUtterance(speakableText + " equals?");
      utterance.rate = 0.9;
      utterance.pitch = 1.2;
      window.speechSynthesis.cancel(); // Cancel any previous speech
      window.speechSynthesis.speak(utterance);
    }
  }, [isMuted]);

  useEffect(() => {
    if (currentQuestion) {
        speak(currentQuestion.expression);
    }
  }, [currentQuestion, speak]);

  const handleNextQuestion = useCallback(() => {
    setFeedback(null);
    setUserAnswer('');
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      onQuizComplete(userAnswers);
    }
  }, [currentQuestionIndex, questions.length, onQuizComplete, userAnswers]);


  const handleSubmit = useCallback(() => {
    if (feedback) { // If feedback is showing, this button proceeds to the next question
        handleNextQuestion();
        return;
    }

    if (userAnswer === '') return;

    const answerNum = parseInt(userAnswer, 10);
    const isCorrect = answerNum === currentQuestion.correct_answer;
    
    const newAnswer: UserAnswer = {
      question: currentQuestion.expression,
      userAnswer: answerNum,
      correctAnswer: currentQuestion.correct_answer,
      isCorrect,
    };
    setUserAnswers(prev => [...prev, newAnswer]);

    if(isCorrect) {
        setFeedback({ type: 'correct', message: 'Correct!' });
        if(!isMuted) correctSoundRef.current?.play();
    } else {
        setFeedback({ type: 'incorrect', message: `Oops! The answer is ${currentQuestion.correct_answer}`});
        if(!isMuted) incorrectSoundRef.current?.play();
    }
    
  }, [userAnswer, currentQuestion, isMuted, feedback, handleNextQuestion]);
  

  const handleNumberClick = (num: string) => {
    if (feedback) return;
    setUserAnswer(prev => prev + num);
  };

  const handleBackspace = () => {
    if (feedback) return;
    setUserAnswer(prev => prev.slice(0, -1));
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-3xl shadow-2xl flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-4">
        <div className="text-sm font-bold text-slate-500">
          Question {currentQuestionIndex + 1} / {questions.length}
        </div>
        <div className="text-sm text-center text-sky-600 font-semibold p-2 bg-sky-100 rounded-lg">{instructions}</div>
      </div>

      <div className="w-full bg-sky-100 p-8 rounded-2xl text-center my-4 relative">
        <button onClick={() => speak(currentQuestion.expression)} className="absolute top-3 right-3 text-sky-500 hover:text-sky-700">
            <SoundOnIcon className="w-6 h-6"/>
        </button>
        <p className="text-5xl font-extrabold text-slate-800 tracking-wider">
          {currentQuestion.expression} = ?
        </p>
      </div>

      <div className="w-full my-4 h-24 flex items-center justify-center bg-slate-100 rounded-2xl shadow-inner">
        {feedback ? (
          <div className={`flex items-center text-3xl font-bold ${feedback.type === 'correct' ? 'text-emerald-500' : 'text-rose-500'}`}>
            {feedback.type === 'correct' ? <CheckCircleIcon className="w-10 h-10 mr-3"/> : <XCircleIcon className="w-10 h-10 mr-3"/> }
            {feedback.message}
          </div>
        ) : (
          <p className="text-5xl font-bold text-slate-700">{userAnswer || '...'}</p>
        )}
      </div>
      
      {feedback ? (
        <button 
          onClick={handleNextQuestion} 
          className="w-full max-w-xs mt-4 bg-amber-400 text-amber-900 font-bold text-xl py-4 rounded-xl shadow-lg hover:bg-amber-500 transition-transform transform hover:scale-105"
        >
          {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'See Results'}
        </button>
      ) : (
        <NumberPad 
          onNumberClick={handleNumberClick} 
          onBackspace={handleBackspace} 
          onSubmit={handleSubmit} 
        />
      )}
    </div>
  );
};

export default QuizScreen;
