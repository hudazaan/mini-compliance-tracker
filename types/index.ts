export interface Client {
  id: string;
  company_name: string;
  country: string;
  entity_type: string;
}

export interface ComplianceTask {
  id: string;
  client_id: string;
  title: string;
  description: string;
  category: string;
  due_date: string;
  status: 'Pending' | 'Completed';
  priority: 'Low' | 'Medium' | 'High';
}