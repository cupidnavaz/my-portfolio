import CrudManager, { type Column } from '@/components/admin/CrudManager';
import type { Skill } from '@/types';

const columns: Column<Skill>[] = [
  {
    key: 'name',
    label: 'Name',
    render: (s) => <span className="font-medium text-white">{s.name}</span>,
  },
  { key: 'category', label: 'Category' },
  {
    key: 'proficiency',
    label: 'Proficiency',
    render: (s) => (
      <div className="flex items-center gap-2">
        <div className="w-20 h-1.5 bg-ink-800 rounded-full overflow-hidden">
          <div className="h-full bg-accent-500 rounded-full" style={{ width: `${s.proficiency}%` }} />
        </div>
        <span className="text-ink-400 text-xs font-mono">{s.proficiency}%</span>
      </div>
    ),
  },
  { key: 'sort_order', label: 'Order' },
];

const empty: Skill = {
  id: '', user_id: '', name: '', category: 'General', proficiency: 80, sort_order: 0, created_at: '', updated_at: '',
};

export default function SkillsAdmin() {
  return (
    <CrudManager<Skill>
      table="skills"
      title="Skills"
      description="Manage your technical skills"
      columns={columns}
      searchKeys={['name', 'category']}
      orderBy={{ column: 'sort_order', ascending: true }}
      emptyItem={empty}
      itemName="skill"
      renderForm={(item, setItem) => (
        <div className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm text-ink-300 mb-2">Name</label>
              <input type="text" value={item.name} onChange={e => setItem({ ...item, name: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm text-ink-300 mb-2">Category</label>
              <input type="text" value={item.category} onChange={e => setItem({ ...item, category: e.target.value })} className="input-field" placeholder="Frontend, Backend, ..." />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm text-ink-300 mb-2">Proficiency (0-100)</label>
              <input type="number" min={0} max={100} value={item.proficiency} onChange={e => setItem({ ...item, proficiency: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)) })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm text-ink-300 mb-2">Sort Order</label>
              <input type="number" value={item.sort_order} onChange={e => setItem({ ...item, sort_order: parseInt(e.target.value) || 0 })} className="input-field" />
            </div>
          </div>
        </div>
      )}
    />
  );
}
