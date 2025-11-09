import React, { useState, useCallback } from 'react';
import { SubTask } from './types';
import { breakDownTask, isTaskPlannable } from './services/geminiService';
import TaskInput from './components/TaskInput';
import SubTaskList from './components/SubTaskList';
import Loader from './components/Loader';

const isHebrew = (text: string) => /[\u0590-\u05FF]/.test(text);

const App: React.FC = () => {
  const [mainTask, setMainTask] = useState<string>('');
  const [subTasks, setSubTasks] = useState<SubTask[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isRtl, setIsRtl] = useState<boolean>(false);

  const handleTaskChange = (task: string) => {
    setMainTask(task);
    setIsRtl(isHebrew(task));
  };

  const handleSubmit = useCallback(async () => {
    if (!mainTask.trim()) {
      setError('אנא הזינו משימה.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSubTasks([]);

    try {
      // Step 1: Validate if the task is plannable
      const validation = await isTaskPlannable(mainTask);

      if (!validation.isPlannable) {
          setError(`הבקשה אינה משימה שניתן לתכנן. סיבה: ${validation.reason}`);
          setIsLoading(false);
          return;
      }

      // Step 2: If plannable, proceed to break it down
      const result = await breakDownTask(mainTask);
      
      if (result.length === 0) {
        setError('הבינה המלאכותית לא הצליחה לפרק את המשימה. נסו לנסח אותה מחדש.');
      } else {
        const tasksWithState = result.map((item, index) => ({
          id: Date.now() + index,
          description: item.task,
          completed: false,
        }));
        setSubTasks(tasksWithState);
      }

    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      if (errorMessage.includes("validate")) {
        setError('אירעה שגיאה באימות המשימה. אנא נסו שוב.');
      } else {
        setError('נכשל בפירוק המשימה. אנא בדקו את החיבור ונסו שוב.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [mainTask]);

  const handleToggleComplete = (id: number) => {
    setSubTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleReorderTasks = useCallback((draggedId: number, targetId: number) => {
    setSubTasks(prevTasks => {
      const draggedIndex = prevTasks.findIndex(t => t.id === draggedId);
      const targetIndex = prevTasks.findIndex(t => t.id === targetId);

      if (draggedIndex === -1 || targetIndex === -1) {
        return prevTasks;
      }

      const newTasks = [...prevTasks];
      const [draggedItem] = newTasks.splice(draggedIndex, 1);
      newTasks.splice(targetIndex, 0, draggedItem);
      
      return newTasks;
    });
  }, []);

  const handleDownload = useCallback(() => {
    if (subTasks.length === 0) return;

    const markdownContent = [
      `# ${mainTask}`,
      '',
      ...subTasks.map(task => `- [${task.completed ? 'x' : ' '}] ${task.description}`)
    ].join('\n');

    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
    
    // Sanitize filename
    const sanitizedTaskName = mainTask.replace(/[\\?%*:|"<>]/g, '').replace(/\s+/g, '_');
    const filename = `${sanitizedTaskName || 'tasks'}.md`;

    // Create a link and trigger the download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }, [mainTask, subTasks]);

  return (
    <div 
      className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center p-4 sm:p-6 lg:p-8"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <main className="w-full max-w-2xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-sky-500">
            מפרק המשימות החכם
          </h1>
          <p className="mt-3 text-lg text-slate-400">
            הפכו מטרות גדולות לפעולות קטנות של שתי דקות.
          </p>
        </header>

        <section className="bg-slate-800/50 rounded-xl shadow-2xl shadow-slate-950/50 ring-1 ring-slate-700/50 p-6 mb-8">
          <TaskInput 
            onSubmit={handleSubmit} 
            isLoading={isLoading} 
            value={mainTask} 
            onChange={handleTaskChange} 
          />
        </section>

        <section>
          {isLoading && <Loader />}
          {error && (
            <div className="bg-red-900/50 text-red-300 p-4 rounded-lg text-center">
              <p className="font-semibold">אירעה שגיאה</p>
              <p>{error}</p>
            </div>
          )}
          {!isLoading && !error && subTasks.length > 0 && (
            <SubTaskList 
              tasks={subTasks} 
              onToggleComplete={handleToggleComplete} 
              onReorderTasks={handleReorderTasks}
              isRtl={isRtl}
              onDownload={handleDownload}
            />
          )}
          {!isLoading && !error && subTasks.length === 0 && (
             <div className="text-center text-slate-500 py-10">
                <p className="text-lg">תתי-המשימות שלכם יופיעו כאן.</p>
                <p className="mt-1">הזינו משימה למעלה כדי להתחיל!</p>
             </div>
          )}
        </section>
      </main>
      <footer className="text-center text-slate-600 mt-auto pt-8">
        <p>מופעל על ידי Google Gemini</p>
      </footer>
    </div>
  );
};

export default App;