import Link from 'next/link';
import { Client } from '@/types';

export default function ClientCard({ client }: { client: Client }) {
  return (
    <Link 
      href={`/client/${client.id}`}
      className="group p-6 border rounded-xl bg-white shadow-sm hover:border-blue-500 transition-all flex justify-between items-center"
    >
      <div>
        <h3 className="text-lg font-bold text-zinc-800 group-hover:text-blue-600">
          {client.company_name}
        </h3>
        <p className="text-sm text-zinc-500">
          {client.entity_type} • {client.country}
        </p>
      </div>
      <div className="text-zinc-400 group-hover:text-blue-600 transition-colors">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}