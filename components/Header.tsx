
import React from 'react';
import { GameState } from '../types';
import { BookOpenIcon, CogIcon, ArrowPathIcon, PlayIcon } from './icons';

interface HeaderProps {
    gameState: GameState;
    onSetGameState: (state: GameState) => void;
    onReset: () => void;
    hasStory: boolean;
}

const NavButton: React.FC<{
  onClick: () => void;
  isActive: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}> = ({ onClick, isActive, disabled = false, children }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
      isActive
        ? 'bg-cyan-500 text-gray-900'
        : 'text-gray-300 hover:bg-gray-700'
    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
  >
    {children}
  </button>
);


export const Header: React.FC<HeaderProps> = ({ gameState, onSetGameState, onReset, hasStory }) => {
    return (
        <header className="w-full max-w-4xl mx-auto flex justify-between items-center p-4 bg-gray-800/50 border border-gray-700 rounded-2xl backdrop-blur-sm">
            <h1 className="text-xl md:text-2xl font-bold text-white">
                Story Engine <span className="text-cyan-400">AI</span>
            </h1>
            <div className="flex items-center gap-2 md:gap-4">
                {hasStory && (
                    <>
                        <NavButton onClick={() => onSetGameState('PLAYING')} isActive={gameState === 'PLAYING'}>
                            <PlayIcon className="w-5 h-5"/>
                            <span className="hidden md:inline">Play</span>
                        </NavButton>
                        <NavButton onClick={() => onSetGameState('HISTORY')} isActive={gameState === 'HISTORY'}>
                            <BookOpenIcon className="w-5 h-5"/>
                            <span className="hidden md:inline">History</span>
                        </NavButton>
                    </>
                )}
                 <NavButton onClick={() => onSetGameState('SETUP')} isActive={gameState === 'SETUP'} disabled={!hasStory}>
                    <CogIcon className="w-5 h-5"/>
                    <span className="hidden md:inline">Setup</span>
                 </NavButton>
                <button
                  onClick={onReset}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 bg-red-600/80 hover:bg-red-500 text-white"
                  title="Start a new story"
                >
                  <ArrowPathIcon className="w-5 h-5"/>
                  <span className="hidden md:inline">New Story</span>
                </button>
            </div>
        </header>
    )
}
