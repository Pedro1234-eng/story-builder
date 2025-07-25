
import React, { useState } from 'react';
import { StoryStep } from '../types';

interface StoryHistoryProps {
  steps: StoryStep[];
  onEditChoice: (stepIndex: number, newChoiceIndex: number) => void;
}

interface HistoryStepProps {
  step: StoryStep;
  stepIndex: number;
  onEditChoice: (stepIndex: number, newChoiceIndex: number) => void;
  isLastStep: boolean;
}

const HistoryStep: React.FC<HistoryStepProps> = ({ step, stepIndex, onEditChoice, isLastStep }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleChoiceSelection = (newChoiceIndex: number) => {
    setIsEditing(false);
    onEditChoice(stepIndex, newChoiceIndex);
  };
  
  const selectedChoiceText = step.selectedChoiceIndex !== null ? step.choices[step.selectedChoiceIndex] : 'Awaiting decision...';

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 relative backdrop-blur-sm">
      <div className="flex flex-col md:flex-row gap-6">
        <img src={step.image} alt={step.promptForImage} className="w-full md:w-48 h-auto object-cover rounded-lg border-2 border-gray-600"/>
        <div className="flex-1">
          <p className="text-gray-300 mb-4">{step.paragraph}</p>
          <div className="border-t border-gray-700 pt-4">
            <span className="font-bold text-gray-500 text-sm uppercase">Decision Made</span>
            <p className="text-cyan-300 mt-1">{selectedChoiceText}</p>
          </div>
        </div>
      </div>
      
      {!isLastStep && step.selectedChoiceIndex !== null && (
         <div className="mt-4 pt-4 border-t border-gray-700/50">
           {!isEditing ? (
             <button 
               onClick={() => setIsEditing(true)} 
               className="text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
             >
               Change this decision
             </button>
           ) : (
             <div>
                <h4 className="text-sm font-bold text-gray-300 mb-2">Choose a different path:</h4>
                <div className="space-y-2">
                  {step.choices.map((choice, index) => (
                    index !== step.selectedChoiceIndex && (
                      <button 
                        key={index}
                        onClick={() => handleChoiceSelection(index)}
                        className="w-full text-left text-sm p-3 bg-gray-700/80 rounded-md hover:bg-cyan-500/20"
                      >
                         <span className="font-bold text-cyan-400 mr-2">{index + 1}.</span> {choice}
                      </button>
                    )
                  ))}
                </div>
                <button onClick={() => setIsEditing(false)} className="text-xs text-gray-400 mt-3 hover:text-white">Cancel</button>
             </div>
           )}
         </div>
      )}
    </div>
  );
};


const StoryHistory: React.FC<StoryHistoryProps> = ({ steps, onEditChoice }) => {
  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in">
       <h2 className="text-3xl font-bold text-center text-cyan-300 mb-2">Your Story So Far</h2>
       <p className="text-center text-gray-400 mb-8">Review your adventure and change past decisions to explore new timelines.</p>

      <div className="space-y-6">
        {steps.map((step, index) => (
           <HistoryStep 
             key={step.id} 
             step={step} 
             stepIndex={index} 
             onEditChoice={onEditChoice} 
             isLastStep={index === steps.length - 1 && step.selectedChoiceIndex === null}
           />
        ))}
      </div>
    </div>
  );
};

export default StoryHistory;
