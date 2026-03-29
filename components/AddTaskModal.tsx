'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AddTaskModal({ clientId, onRefresh }: { clientId: string, onRefresh: () => void }) {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase.from('tasks').insert([
      { 
        client_id: clientId, 
        title, 
        due_date: dueDate, 
        status: 'Pending', 
        category: 'General Compliance',
        priority: 'Medium' 
      }
    ]);

    if (!error) {
      setTitle('');
      setDueDate('');
      onRefresh();
    }
    setLoading(false);
  };

  return (
    <div className="rounded-xl border-2 border-zinc-300 bg-white p-6 shadow-md dark:border-zinc-700 dark:bg-zinc-900">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 md:flex-row md:items-end">
        
        <div className="flex-1">
          <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-200 mb-2">
            Task Title
          </label>
          <input 
            type="text"
            value={title} 
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Annual Tax Filing"
            className="w-full rounded-lg border-2 border-zinc-300 bg-zinc-50 p-3 text-zinc-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
            required 
          />
        </div>

        <div className="w-full md:w-48">
          <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-200 mb-2">
            Due Date
          </label>
          <input 
            type="date" 
            value={dueDate} 
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full rounded-lg border-2 border-zinc-300 bg-zinc-50 p-3 text-zinc-900 outline-none focus:border-blue-600 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
            required 
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full md:w-auto rounded-lg bg-blue-600 px-8 py-3.5 font-bold text-white transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add Task'}
        </button>
      </form>
    </div>
  );
}