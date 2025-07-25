
import React, { useState, useCallback, useMemo } from 'react';
import { StoryStep, GameState } from './types';
import { generateInitialStep, generateNextStep } from './services/geminiService';
import StorySetupForm from './components/StorySetupForm';
import StoryView from './components/StoryView';
import StoryHistory from './components/StoryHistory';
import { Header } from './components/Header';
import { Spinner } from './components/Spinner';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('SETUP');
  const [storySteps, setStorySteps] = useState<StoryStep[]>([]);
  const [protagonist, setProtagonist] = useState<string>('');
  const [setting, setSetting] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartStory = useCallback(async (newProtagonist: string, newSetting: string) => {
    setIsLoading(true);
    setError(null);
    setProtagonist(newProtagonist);
    setSetting(newSetting);
    try {
      const initialStep = await generateInitialStep(newProtagonist, newSetting);
      setStorySteps([initialStep]);
      setGameState('PLAYING');
    } catch (e) {
      console.error(e);
      setError('Failed to start the story. Please check your API key and try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSelectChoice = useCallback(async (choiceIndex: number) => {
    setIsLoading(true);
    setError(null);
    
    // Update the last step with the selected choice
    const updatedLastStep = { ...storySteps[storySteps.length - 1], selectedChoiceIndex: choiceIndex };
    const currentHistory = [...storySteps.slice(0, -1), updatedLastStep];
    setStorySteps(currentHistory);

    try {
      const nextStep = await generateNextStep(protagonist, setting, currentHistory);
      setStorySteps(prevSteps => [...prevSteps, nextStep]);
    } catch (e) {
      console.error(e);
      setError('Failed to continue the story. Please try again.');
      // Revert choice selection on error
      const revertedLastStep = { ...storySteps[storySteps.length - 1], selectedChoiceIndex: null };
      setStorySteps([...storySteps.slice(0, -1), revertedLastStep]);
    } finally {
      setIsLoading(false);
    }
  }, [storySteps, protagonist, setting]);

  const handleEditChoice = useCallback(async (stepIndex: number, newChoiceIndex: number) => {
    setIsLoading(true);
    setError(null);
    setGameState('PLAYING');

    const stepToUpdate = storySteps[stepIndex];
    if (stepToUpdate.selectedChoiceIndex === newChoiceIndex) {
      setIsLoading(false);
      return;
    }
    
    const updatedStep = { ...stepToUpdate, selectedChoiceIndex: newChoiceIndex };
    const truncatedHistory = [...storySteps.slice(0, stepIndex), updatedStep];
    setStorySteps(truncatedHistory);

    try {
      const nextStep = await generateNextStep(protagonist, setting, truncatedHistory);
      setStorySteps(prevSteps => [...prevSteps, nextStep]);
    } catch (e) {
      console.error(e);
      setError('Failed to update the story from this point. Please try again.');
       // On error, we just stay with the truncated history
    } finally {
      setIsLoading(false);
    }
  }, [storySteps, protagonist, setting]);

  const handleReset = () => {
    setStorySteps([]);
    setProtagonist('');
    setSetting('');
    setError(null);
    setGameState('SETUP');
  };

  const currentStep = useMemo(() => storySteps[storySteps.length - 1], [storySteps]);

  const renderContent = () => {
    switch (gameState) {
      case 'SETUP':
        return <StorySetupForm onStart={handleStartStory} isLoading={isLoading} />;
      case 'PLAYING':
        return currentStep ? <StoryView step={currentStep} onSelectChoice={handleSelectChoice} isLoading={isLoading} /> : <Spinner text="Loading story..."/>;
      case 'HISTORY':
        return <StoryHistory steps={storySteps} onEditChoice={handleEditChoice} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col p-4 md:p-8">
      <Header 
        gameState={gameState} 
        onSetGameState={setGameState} 
        onReset={handleReset} 
        hasStory={storySteps.length > 0} 
      />
      <main className="flex-grow flex flex-col items-center justify-center w-full max-w-4xl mx-auto mt-6">
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 p-4 rounded-lg mb-6 w-full text-center">
            <p><strong>Error:</strong> {error}</p>
          </div>
        )}
        {isLoading && gameState !== 'PLAYING' && <Spinner text="Generating adventure..."/>}
        <div className="w-full">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
