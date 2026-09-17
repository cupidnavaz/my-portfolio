import CrudManager, { type Column } from '@/components/admin/CrudManager';
import type { Education } from '@/types';

const columns: Column<Education>[] = [
  {
    key: 'degree',
    label: 'Degree',
    render: (e) => <span className="font-medium text-white">{e.degree}</span>,
  },
  { key: 'institution', label: 'Institution' },
  {
    key: 'start_date',
    label: 'Period',
    render: (e) => <span className="text-ink-400 text-xs">{e.start_date} — {e.current ? 'Present' : e.end_date ?? ''}</span>,
  },
  { key: 'sort_order', label: 'Order' },
];

const empty: Education = {
  id: '', user_id: '', degree: '', institution: '', start_date: '', end_date: null, current: false,
  description: '', sort_order: 0, created_at: '', updated_at: '',
};

export default function EducationAdmin() {
  return (
    <CrudManager<Education>
      table="education"
      title="Education"
      description="Manage your educational background"
      columns={columns}
      searchKeys={['degree', 'institution']}
      orderBy={{ column: 'sort_order', ascending: true }}
      emptyItem={empty}
      itemName="education"
      renderForm={(item, setItem) => (
        <div className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm text-ink-300 mb-2">Degree</label>
              <input type="text" value={item.degree} onChange={e => setItem({ ...item, degree: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm text-ink-300 mb-2">Institution</label>
              <input type="text" value={item.institution} onChange={e => setItem({ ...item, institution: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm text-ink-300 mb-2">Start Date</label>
              <input type="text" value={item.start_date} onChange={e => setItem({ ...item, start_date: e.target.value })} className="input-field" placeholder="2018" />
            </div>
            <div>
              <label className="block text-sm text-ink-300 mb-2">End Date</label>
              <input type="text" value={item.end_date ?? ''} onChange={e => setItem({ ...item, end_date: e.target.value || null })} className="input-field" placeholder="2022" disabled={item.current} />
            </div>
          </div>
          <div>
            <label className="block text-sm text-ink-300 mb-2">Description</label>
            <textarea value={item.description ?? ''} onChange={e => setItem({ ...item, description: e.target.value })} rows={4} className="input-field resize-none" />
          </div>
          <div className="flex items-center gap-5">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={item.current} onChange={e => setItem({ ...item, current: e.target.checked, end_date: e.target.checked ? null : item.end_date })} className="w-4 h-4 accent-accent-500" />
              <span className="text-ink-200 text-sm">Currently studying here</span>
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
