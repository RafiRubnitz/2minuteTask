import React from 'react';
import type { SubTask } from '../types';
import SubTaskItem from './SubTaskItem';
import DownloadIcon from './icons/DownloadIcon';

interface SubTaskListProps {
  tasks: SubTask[];
  onToggleComplete: (id: number) => void;
  onReorderTasks: (draggedId: number, targetId: number) => void;
  isRtl: boolean;
  onDownload: () => void;
}

const SubTaskList: React.FC<SubTaskListProps> = ({ tasks, onToggleComplete, onReorderTasks, isRtl, onDownload }) => {
  const completedCount = tasks.filter(task => task.completed).length;
  const totalCount = tasks.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="bg-slate-800/50 rounded-xl shadow-lg ring-1 ring-slate-700/50 p-6">
      <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold text-slate-200">תוכנית הפעולה שלך</h2>
              <button
                onClick={onDownload}
                className="text-slate-400 hover:text-emerald-400 transition-colors duration-200"
                aria-label="הורד רשימה כקובץ Markdown"
                title="הורד רשימה כקובץ Markdown"
              >
                <DownloadIcon className="w-5 h-5" />
              </button>
            </div>
            <span className="text-sm font-medium text-slate-400">{completedCount} / {totalCount} הושלמו</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2.5">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-sky-500 h-2.5 rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${progress}%` }}>
              </div>
          </div>
      </div>
      <ul className="space-y-3">
        {tasks.map((task, index) => (
          <SubTaskItem
            key={task.id}
            task={task}
            index={index}
            onToggleComplete={onToggleComplete}
            onReorderTasks={onReorderTasks}
            isRtl={isRtl}
          />
        ))}
      </ul>
    </div>
  );
};

export default SubTaskList;