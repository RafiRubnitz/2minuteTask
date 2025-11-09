import React from 'react';

const Loader: React.FC = () => (
  <div className="flex flex-col items-center justify-center p-8 space-y-4">
    <div className="w-12 h-12 border-4 border-slate-500 border-t-emerald-400 rounded-full animate-spin"></div>
    <p className="text-slate-400 font-medium">הבינה המלאכותית חושבת...</p>
  </div>
);

export default Loader;