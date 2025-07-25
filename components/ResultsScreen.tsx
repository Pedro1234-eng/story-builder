
import React from 'react';
import { UserAnswer } from '../types';
import { CheckCircleIcon, XCircleIcon } from './IconComponents';

interface ResultsScreenProps {
  answers: UserAnswer[];
  onPlayAgain: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ answers, onPlayAgain }) => {
  const correctCount = answers.filter(a => a.isCorrect).length;
  const totalCount = answers.length;
  const scorePercentage = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

  let mascotImage, message;
  if (scorePercentage >= 90) {
    mascotImage = "https://picsum.photos/seed/happy/150";
    message = "Wow! You're a Math Superstar!";
  } else if (scorePercentage >= 60) {
    mascotImage = "https://picsum.photos/seed/good/150";
    message = "Great Job! Keep practicing!";
  } else {
    mascotImage = "https://picsum.photos/seed/practice/150";
    message = "Good effort! Practice makes perfect!";
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-3xl shadow-2xl">
      <div className="text-center mb-6">
        <img src={mascotImage} alt="Mascot" className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-amber-300 shadow-lg" />
        <h1 className="text-4xl font-extrabold text-sky-600">{message}</h1>
        <p className="text-slate-500 mt-2">Here's how you did:</p>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center my-8">
        <div className="bg-sky-100 p-4 rounded-xl">
          <p className="text-4xl font-bold text-sky-700">{scorePercentage}%</p>
          <p className="text-sm font-semibold text-slate-500">Score</p>
        </div>
        <div className="bg-emerald-100 p-4 rounded-xl">
          <p className="text-4xl font-bold text-emerald-700">{correctCount}</p>
          <p className="text-sm font-semibold text-slate-500">Correct</p>
        </div>
        <div className="bg-rose-100 p-4 rounded-xl">
          <p className="text-4xl font-bold text-rose-700">{totalCount}</p>
          <p className="text-sm font-semibold text-slate-500">Total</p>
        </div>
      </div>
      
      <div className="mt-8">
        <h3 className="text-xl font-bold text-slate-700 mb-4 text-center">Review Your Answers</h3>
        <div className="space-y-2 max-h-60 overflow-y-auto p-2 bg-slate-50 rounded-lg">
          {answers.map((ans, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
              <div className="flex items-center">
                {ans.isCorrect ? (
                  <CheckCircleIcon className="w-6 h-6 text-emerald-500 mr-3" />
                ) : (
                  <XCircleIcon className="w-6 h-6 text-rose-500 mr-3" />
                )}
                <span className="font-mono text-slate-700 text-lg">{ans.question}</span>
              </div>
              <div className="font-mono text-lg">
                <span className={ans.isCorrect ? "text-slate-400" : "text-rose-500 line-through mr-2"}>{ans.userAnswer}</span>
                { !ans.isCorrect && <span className="text-emerald-500 font-bold">{ans.correctAnswer}</span> }
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <button 
        onClick={onPlayAgain} 
        className="w-full mt-8 bg-amber-400 text-amber-900 font-bold text-xl py-4 rounded-xl shadow-lg hover:bg-amber-500 transition-transform transform hover:scale-105"
      >
        Play Again
      </button>
    </div>
  );
};

export default ResultsScreen;
