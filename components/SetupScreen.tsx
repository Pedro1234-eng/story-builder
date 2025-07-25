
import React, { useState } from 'react';
import { CLASS_LEVELS, OPERATIONS, NUM_QUESTIONS_OPTIONS } from '../constants';
import { QuizSettings, ClassLevel, Operation } from '../types';
import { SparklesIcon } from './IconComponents';

interface SetupScreenProps {
  onStartQuiz: (settings: QuizSettings) => void;
}

const SetupScreen: React.FC<SetupScreenProps> = ({ onStartQuiz }) => {
  const [level, setLevel] = useState<ClassLevel>('P1');
  const [operations, setOperations] = useState<Operation[]>(['Addition']);
  const [numQuestions, setNumQuestions] = useState<number>(5);

  const handleOperationToggle = (op: Operation) => {
    setOperations(prev => {
      if (op === 'Mixed') {
        return ['Mixed'];
      }
      const newOps = prev.includes(op)
        ? prev.filter(p => p !== op && p !== 'Mixed')
        : [...prev.filter(p => p !== 'Mixed'), op];
      return newOps.length === 0 ? ['Addition'] : newOps;
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (operations.length > 0) {
      onStartQuiz({ level, operations, numQuestions });
    } else {
      alert("Please select at least one operation.");
    }
  };

  const OptionButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border-2 ${
        active ? 'bg-sky-500 text-white border-sky-500 shadow-md' : 'bg-white text-sky-700 border-sky-200 hover:bg-sky-100'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="w-full max-w-lg mx-auto p-6 bg-white rounded-3xl shadow-2xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-sky-600">SmartCalc Kids</h1>
        <p className="text-slate-500 mt-2">Let's make math fun!</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label className="text-lg font-bold text-slate-700 mb-3 block">1. Select Your Class</label>
          <div className="grid grid-cols-3 gap-3">
            {CLASS_LEVELS.map(l => (
              <OptionButton key={l} active={level === l} onClick={() => setLevel(l)}>{l}</OptionButton>
            ))}
          </div>
        </div>

        <div>
          <label className="text-lg font-bold text-slate-700 mb-3 block">2. Choose Your Challenge</label>
          <div className="grid grid-cols-3 gap-3">
            {OPERATIONS.map(op => (
              <OptionButton key={op} active={operations.includes(op)} onClick={() => handleOperationToggle(op)}>{op}</OptionButton>
            ))}
          </div>
        </div>

        <div>
          <label className="text-lg font-bold text-slate-700 mb-3 block">3. How Many Questions?</label>
          <div className="flex justify-center space-x-3">
            {NUM_QUESTIONS_OPTIONS.map(num => (
              <OptionButton key={num} active={numQuestions === num} onClick={() => setNumQuestions(num)}>{num}</OptionButton>
            ))}
          </div>
        </div>

        <button 
          type="submit" 
          className="w-full flex items-center justify-center bg-amber-400 text-amber-900 font-bold text-xl py-4 rounded-xl shadow-lg hover:bg-amber-500 transition-transform transform hover:scale-105"
        >
          <SparklesIcon className="w-6 h-6 mr-2" />
          Generate My Quiz!
        </button>
      </form>
    </div>
  );
};

export default SetupScreen;
