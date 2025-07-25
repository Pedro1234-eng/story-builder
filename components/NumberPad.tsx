
import React from 'react';

interface NumberPadProps {
  onNumberClick: (num: string) => void;
  onBackspace: () => void;
  onSubmit: () => void;
}

const NumberPadButton: React.FC<{ onClick: () => void; children: React.ReactNode; className?: string }> = ({ onClick, children, className = '' }) => (
  <button
    onClick={onClick}
    className={`bg-white rounded-xl shadow-md h-16 text-2xl font-bold text-slate-700 active:bg-amber-200 transition-all focus:outline-none focus:ring-2 focus:ring-amber-400 ${className}`}
  >
    {children}
  </button>
);

const NumberPad: React.FC<NumberPadProps> = ({ onNumberClick, onBackspace, onSubmit }) => {
  const buttons = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

  return (
    <div className="grid grid-cols-3 gap-3 p-4 bg-slate-100 rounded-2xl shadow-inner w-full max-w-xs mx-auto">
      {buttons.map((num) => (
        <NumberPadButton key={num} onClick={() => onNumberClick(num)}>{num}</NumberPadButton>
      ))}
      <NumberPadButton onClick={onBackspace} className="bg-rose-200 text-rose-700">⌫</NumberPadButton>
      <NumberPadButton onClick={() => onNumberClick('0')}>0</NumberPadButton>
      <NumberPadButton onClick={onSubmit} className="bg-emerald-300 text-emerald-800">↵</NumberPadButton>
    </div>
  );
};

export default NumberPad;
