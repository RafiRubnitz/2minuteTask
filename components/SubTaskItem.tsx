import React, { useState } from 'react';
import type { SubTask } from '../types';
import DragHandleIcon from './icons/DragHandleIcon';

interface SubTaskItemProps {
  task: SubTask;
  index: number;
  onToggleComplete: (id: number) => void;
  onReorderTasks: (draggedId: number, targetId: number) => void;
  isRtl: boolean;
}

// Module-level variable to track the currently dragged item's ID
let draggedItemId: number | null = null;

const SubTaskItem: React.FC<SubTaskItemProps> = ({ task, index, onToggleComplete, onReorderTasks, isRtl }) => {
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const handleDragStart = (e: React.DragEvent<HTMLLIElement>) => {
    e.dataTransfer.setData('text/plain', task.id.toString());
    e.dataTransfer.effectAllowed = 'move';
    draggedItemId = task.id;
    setTimeout(() => {
      // Style the original item being dragged
      e.currentTarget.classList.add('opacity-40');
    }, 0);
  };

  const handleDragEnd = (e: React.DragEvent<HTMLLIElement>) => {
    e.currentTarget.classList.remove('opacity-40');
    draggedItemId = null;
    // Clean up any lingering drag-over styles
    setIsDraggingOver(false);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLLIElement>) => {
    e.preventDefault();
    if (task.id !== draggedItemId) {
        setIsDraggingOver(true);
    }
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLLIElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const droppedItemId = Number(e.dataTransfer.getData('text/plain'));
    if (droppedItemId && droppedItemId !== task.id) {
        onReorderTasks(droppedItemId, task.id);
    }
  };

  return (
    <li
      draggable={true}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex items-start gap-3 p-4 rounded-lg transition-all duration-300 border-y-2 ${
        task.completed ? 'bg-slate-700/50 text-slate-500' : 'bg-slate-700 hover:bg-slate-600/80'
      } ${isDraggingOver ? 'border-y-emerald-500' : 'border-y-transparent'}`}
    >
      <span className="cursor-grab text-slate-500 pt-1 flex-shrink-0" aria-label="Drag to reorder">
        <DragHandleIcon className="w-5 h-5" />
      </span>
      <div className="flex items-center h-6 flex-shrink-0">
        <input
          id={`task-${task.id}`}
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggleComplete(task.id)}
          className="h-5 w-5 rounded-full border-slate-500 text-emerald-500 bg-slate-800 focus:ring-emerald-500 focus:ring-2 cursor-pointer"
        />
      </div>
      <div className="min-w-0 flex-1">
        <label
          htmlFor={`task-${task.id}`}
          className={`font-medium cursor-pointer transition-colors duration-300 ${
            task.completed ? 'line-through decoration-slate-400' : 'text-slate-200'
          } ${isRtl ? 'text-right' : 'text-left'}`}
        >
          {task.description}
        </label>
      </div>
    </li>
  );
};

export default SubTaskItem;
