
import React from 'react';
import { SparklesIcon } from './IconComponents';

const Spinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-sky-600">
      <SparklesIcon className="w-16 h-16 animate-pulse" />
      <p className="mt-4 text-xl font-semibold">Generating your quiz...</p>
      <p className="text-sm text-sky-500">Our AI tutor is thinking hard!</p>
    </div>
  );
};

export default Spinner;
