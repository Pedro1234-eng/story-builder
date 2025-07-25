
import React from 'react';
import { StoryStep } from '../types';
import { Spinner } from './Spinner';

interface StoryViewProps {
  step: StoryStep;
  onSelectChoice: (choiceIndex: number) => void;
  isLoading: boolean;
}

const ChoiceButton: React.FC<{
  choice: string;
  index: number;
  onClick: (index: number) => void;
  disabled: boolean;
}> = ({ choice, index, onClick, disabled }) => (
  <button
    onClick={() => onClick(index)}
    disabled={disabled}
    className="w-full text-left p-4 bg-gray-800/60 border border-gray-700 rounded-lg hover:bg-cyan-500/20 hover:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-wait"
  >
    <span className="font-bold text-cyan-400 mr-3">{index + 1}.</span>
    <span>{choice}</span>
  </button>
);

const StoryView: React.FC<StoryViewProps> = ({ step, onSelectChoice, isLoading }) => {
  const areChoicesLocked = step.selectedChoiceIndex !== null || isLoading;

  return (
    <div className="w-full mx-auto animate-fade-in">
      <div className="bg-gray-800/50 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-sm">
        <div className="aspect-video bg-gray-900 flex items-center justify-center relative">
          <img src={step.image} alt={step.promptForImage} className="w-full h-full object-cover" />
           {isLoading && step.selectedChoiceIndex !== null && (
             <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
               <Spinner text="The next chapter is being written..." />
             </div>
           )}
        </div>
        <div className="p-6 md:p-8">
          <p className="text-gray-300 text-lg/relaxed mb-8">{step.paragraph}</p>
          
          <h3 className="font-bold text-xl text-cyan-300 mb-4">What happens next?</h3>
          <div className="space-y-4">
            {step.choices.map((choice, index) => (
              <ChoiceButton
                key={index}
                choice={choice}
                index={index}
                onClick={onSelectChoice}
                disabled={areChoicesLocked}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryView;
