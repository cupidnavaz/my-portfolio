import CrudManager, { type Column } from '@/components/admin/CrudManager';
import type { Experience } from '@/types';

const columns: Column<Experience>[] = [
  {
    key: 'role',
    label: 'Role',
    render: (e) => <span className="font-medium text-white">{e.role}</span>,
  },
  { key: 'company', label: 'Company' },
  {
    key: 'start_date',
    label: 'Period',
    render: (e) => <span className="text-ink-400 text-xs">{e.start_date} — {e.current ? 'Present' : e.end_date ?? ''}</span>,
  },
  { key: 'sort_order', label: 'Order' },
];

const empty: Experience = {
  id: '', user_id: '', role: '', company: '', start_date: '', end_date: null, current: false,
  description: '', sort_order: 0, created_at: '', updated_at: '',
};

export default function ExperiencesAdmin() {
  return (
    <CrudManager<Experience>
      table="experiences"
      title="Work Experience"
      description="Manage your work history"
      columns={columns}
      searchKeys={['role', 'company']}
      orderBy={{ column: 'sort_order', ascending: true }}
      emptyItem={empty}
      itemName="experience"
      renderForm={(item, setItem) => (
        <div className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm text-ink-300 mb-2">Role</label>
              <input type="text" value={item.role} onChange={e => setItem({ ...item, role: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm text-ink-300 mb-2">Company</label>
              <input type="text" value={item.company} onChange={e => setItem({ ...item, company: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm text-ink-300 mb-2">Start Date</label>
              <input type="text" value={item.start_date} onChange={e => setItem({ ...item, start_date: e.target.value })} className="input-field" placeholder="Jan 2022" />
            </div>
            <div>
              <label className="block text-sm text-ink-300 mb-2">End Date</label>
              <input type="text" value={item.end_date ?? ''} onChange={e => setItem({ ...item, end_date: e.target.value || null })} className="input-field" placeholder="Dec 2023" disabled={item.current} />
            </div>
          </div>
          <div>
            <label className="block text-sm text-ink-300 mb-2">Description</label>
            <textarea value={item.description ?? ''} onChange={e => setItem({ ...item, description: e.target.value })} rows={4} className="input-field resize-none" />
          </div>
          <div className="flex items-center gap-5">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={item.current} onChange={e => setItem({ ...item, current: e.target.checked, end_date: e.target.checked ? null : item.end_date })} className="w-4 h-4 accent-accent-500" />
              <span className="text-ink-200 text-sm">Currently working here</span>
            </label>
            <div>
              <label className="block text-sm text-ink-300 mb-2">Sort Order</label>
              <input type="number" value={item.sort_order} onChange={e => setItem({ ...item, sort_order: parseInt(e.target.value) || 0 })} className="input-field w-32" />
            </div>
          </div>
        </div>
      )}
    />
  );
}
