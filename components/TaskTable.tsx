import { ComplianceTask } from '@/types';
import { isBefore, parseISO, isToday } from 'date-fns';

interface Props {
  tasks: ComplianceTask[];
  onStatusUpdate: (id: string, newStatus: string) => void;
}

export default function TaskTable({ tasks, onStatusUpdate }: Props) {
  
  const isOverdue = (dueDate: string, status: string) => {
    const date = parseISO(dueDate);
    return status === 'Pending' && isBefore(date, new Date()) && !isToday(date);
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-200">
      <table className="w-full text-sm text-left">
        <thead className="bg-zinc-50 text-zinc-600 uppercase text-xs font-semibold">
          <tr>
            <th className="px-6 py-4">Task Name</th>
            <th className="px-6 py-4">Due Date</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200">
          {tasks.map((task) => {
            const overdue = isOverdue(task.due_date, task.status);
            return (
              <tr key={task.id} className={`${overdue ? 'bg-red-50' : 'bg-white'}`}>
                <td className="px-6 py-4">
                  <div className="font-medium text-zinc-900">{task.title}</div>
                  <div className="text-zinc-500 text-xs">{task.category}</div>
                  {overdue && (
                    <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">
                      ⚠️ Overdue
                    </span>
                  )}
                </td>
                <td className={`px-6 py-4 ${overdue ? 'text-red-600 font-bold' : 'text-zinc-600'}`}>
                  {task.due_date}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    task.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {task.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => onStatusUpdate(task.id, task.status === 'Pending' ? 'Completed' : 'Pending')}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Mark as {task.status === 'Pending' ? 'Done' : 'Pending'}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}