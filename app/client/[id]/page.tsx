'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Client, ComplianceTask } from '@/types';
import TaskTable from '@/components/TaskTable';
import AddTaskModal from '@/components/AddTaskModal';

export default function ClientTasksPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [client, setClient] = useState<Client | null>(null);
  const [tasks, setTasks] = useState<ComplianceTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  const fetchData = useCallback(async () => {
    try {

      const { data: clientData } = await supabase
        .from('clients')
        .select('*')
        .eq('id', id)
        .single();
      setClient(clientData);

      const { data: taskData } = await supabase
        .from('tasks')
        .select('*')
        .eq('client_id', id)
        .order('due_date', { ascending: true });
      setTasks(taskData || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleStatusUpdate = async (taskId: string, newStatus: string) => {
    const { error } = await supabase
      .from('tasks')
      .update({ status: newStatus })
      .eq('id', taskId);
    
    if (!error) fetchData(); 
  };

  const filteredTasks = tasks.filter(task => 
    filter === 'All' ? true : task.status === filter
  );

  if (loading) return <div className="p-10 text-center">Loading dashboard...</div>;

  return (
    <main className="min-h-screen bg-zinc-50 p-8 dark:bg-zinc-950">
      <div className="mx-auto max-w-5xl">
        <button 
          onClick={() => router.push('/')}
          className="mb-6 flex items-center text-sm font-medium text-zinc-500 hover:text-blue-600 transition-colors"
        >
          ← Back to Clients
        </button>

        <header className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
              {client?.company_name}
            </h1>
            <p className="text-zinc-500">{client?.entity_type} • {client?.country}</p>
          </div>

          <div className="flex rounded-lg border border-zinc-200 bg-white p-1 dark:border-zinc-800 dark:bg-zinc-900">
            {['All', 'Pending', 'Completed'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                  filter === f 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </header>

        <section className="mb-10">
          <h2 className="mb-4 text-lg font-semibold">Add New Compliance Task</h2>
          <AddTaskModal clientId={id as string} onRefresh={fetchData} />
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Compliance Tasks</h2>
            <span className="text-sm text-zinc-500">{filteredTasks.length} Tasks Found</span>
          </div>
          
          <TaskTable 
            tasks={filteredTasks} 
            onStatusUpdate={handleStatusUpdate} 
          />
        </section>
      </div>
    </main>
  );
}