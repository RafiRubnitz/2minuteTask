import React from 'react';
import SparklesIcon from './icons/SparklesIcon';

interface TaskInputProps {
  onSubmit: () => void;
  isLoading: boolean;
  value: string;
  onChange: (value: string) => void;
}

const TaskInput: React.FC<TaskInputProps> = ({ onSubmit, isLoading, value, onChange }) => {

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="לדוגמה: תכנון טיול סופשבוע להרים"
        disabled={isLoading}
        className="flex-grow bg-slate-700 text-slate-100 placeholder-slate-400 rounded-lg px-4 py-3 border border-slate-600 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition duration-200 w-full disabled:opacity-50 disabled:cursor-not-allowed text-right"
        dir="auto"
      />
      <button
        type="submit"
        disabled={isLoading}
        className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-sky-600 text-white font-semibold px-5 py-3 rounded-lg shadow-lg hover:from-emerald-600 hover:to-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-emerald-500 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        <SparklesIcon className="w-5 h-5" />
        <span>{isLoading ? 'מפרק...' : 'פרק למשימות'}</span>
      </button>
    </form>
  );
};

export default TaskInput;