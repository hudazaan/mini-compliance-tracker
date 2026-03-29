'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Client } from '@/types';
import ClientCard from '@/components/ClientCard';

export default function Home() {
  const [clients, setClients] = useState<Client[]>([]);
  const [searchQuery, setSearchQuery] = useState(''); 
  const [stats, setStats] = useState({ total: 0, overdue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {

        const { data: clientData, error: clientError } = await supabase
          .from('clients')
          .select('*')
          .order('company_name', { ascending: true });
        
        if (clientError) throw clientError;
        setClients(clientData || []);

        const { data: taskData } = await supabase.from('tasks').select('due_date, status');
        if (taskData) {
          const overdueCount = taskData.filter(t => 
            t.status === 'Pending' && new Date(t.due_date) < new Date()
          ).length;
          setStats({ total: clientData?.length || 0, overdue: overdueCount });
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredClients = clients.filter((client) =>
    client.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.entity_type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#18181b] text-zinc-400">
        <div className="animate-pulse font-bold">Initializing Dashboard...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#18181b] p-6 md:p-12 font-sans text-zinc-100">
      <div className="mx-auto max-w-5xl">

        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Compliance Tracker</h1>
            <p className="text-zinc-400 mt-1 text-lg">Real-time regulatory tracking for your portfolio.</p>
          </div>
          <button 
            onClick={() => alert('Client registration module coming soon!')}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold shadow-md hover:bg-blue-700 transition-all text-sm active:scale-95"
          >
            + Register New Client
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-[#27272a] p-6 rounded-2xl border border-[#3f3f46] shadow-sm">
            <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Active Entities</p>
            <p className="text-4xl font-bold text-white mt-2">{stats.total}</p>
          </div>
          <div className="bg-[#27272a] p-6 rounded-2xl border border-[#3f3f46] shadow-sm border-l-4 border-l-red-500">
            <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Critical Alerts</p>
            <p className="text-4xl font-bold text-red-500 mt-2">{stats.overdue}</p>
          </div>
          <div className="bg-[#27272a] p-6 rounded-2xl border border-[#3f3f46] shadow-sm">
            <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Engine Status</p>
            <p className="text-emerald-500 text-lg font-bold mt-4 flex items-center gap-2">
              <span className="h-2 w-2 bg-emerald-500 rounded-full animate-ping"></span>
              Live Sync
            </p>
          </div>
        </div>

        <div className="relative mb-8">
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by company, country, or type..." 
            className="w-full bg-[#27272a] border border-[#3f3f46] rounded-xl py-4 pl-12 pr-4 text-white placeholder-zinc-500 shadow-sm outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
          />
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {filteredClients.length > 0 ? (
            filteredClients.map((client) => (
              <ClientCard key={client.id} client={client} />
            ))
          ) : (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-[#3f3f46] rounded-2xl">
              <p className="text-zinc-500 font-medium">No results match your search query.</p>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}