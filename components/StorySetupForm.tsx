
import React, { useState } from 'react';
import { Spinner } from './Spinner';

interface StorySetupFormProps {
  onStart: (protagonist: string, setting: string) => void;
  isLoading: boolean;
}

const StorySetupForm: React.FC<StorySetupFormProps> = ({ onStart, isLoading }) => {
  const [protagonist, setProtagonist] = useState('A brave little rabbit');
  const [setting, setSetting] = useState('A tropical jungle forest');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (protagonist.trim() && setting.trim() && !isLoading) {
      onStart(protagonist.trim(), setting.trim());
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-gray-800/50 p-8 rounded-2xl shadow-2xl border border-gray-700 backdrop-blur-sm">
      <h2 className="text-3xl font-bold text-center text-cyan-300 mb-2">Create Your Story</h2>
      <p className="text-center text-gray-400 mb-8">Define the hero and the world to begin your adventure.</p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="protagonist" className="block text-sm font-medium text-gray-300 mb-2">
            The Protagonist
          </label>
          <input
            type="text"
            id="protagonist"
            value={protagonist}
            onChange={(e) => setProtagonist(e.target.value)}
            className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-300"
            placeholder="e.g., A curious robot with a heart of gold"
            required
            disabled={isLoading}
          />
        </div>
        <div>
          <label htmlFor="setting" className="block text-sm font-medium text-gray-300 mb-2">
            The Setting
          </label>
          <input
            type="text"
            id="setting"
            value={setting}
            onChange={(e) => setSetting(e.target.value)}
            className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-300"
            placeholder="e.g., A futuristic city floating in the clouds"
            required
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !protagonist || !setting}
          className="w-full flex justify-center items-center gap-3 bg-cyan-500 text-gray-900 font-bold py-3 px-4 rounded-lg hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-400 transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Spinner small /> Generating World...
            </>
          ) : (
            'Begin Adventure'
          )}
        </button>
      </form>
    </div>
  );
};

export default StorySetupForm;
