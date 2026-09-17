import CrudManager, { type Column } from '@/components/admin/CrudManager';
import type { Service } from '@/types';

const columns: Column<Service>[] = [
  {
    key: 'title',
    label: 'Title',
    render: (s) => <span className="font-medium text-white">{s.title}</span>,
  },
  {
    key: 'icon_name',
    label: 'Icon',
    render: (s) => <span className="font-mono text-xs text-accent-400">{s.icon_name}</span>,
  },
  {
    key: 'description',
    label: 'Description',
    render: (s) => <span className="text-ink-400 text-sm line-clamp-1">{s.description ?? '—'}</span>,
  },
  { key: 'sort_order', label: 'Order' },
];

const empty: Service = {
  id: '', user_id: '', title: '', description: '', icon_name: 'Code', sort_order: 0, created_at: '', updated_at: '',
};

export default function ServicesAdmin() {
  return (
    <CrudManager<Service>
      table="services"
      title="Services"
      description="Manage the services you offer"
      columns={columns}
      searchKeys={['title', 'description']}
      orderBy={{ column: 'sort_order', ascending: true }}
      emptyItem={empty}
      itemName="service"
      renderForm={(item, setItem) => (
        <div className="space-y-5">
          <div>
            <label className="block text-sm text-ink-300 mb-2">Title</label>
            <input type="text" value={item.title} onChange={e => setItem({ ...item, title: e.target.value })} className="input-field" />
          </div>
          <div>
            <label className="block text-sm text-ink-300 mb-2">Description</label>
            <textarea value={item.description ?? ''} onChange={e => setItem({ ...item, description: e.target.value })} rows={4} className="input-field resize-none" />
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm text-ink-300 mb-2">Icon Name (lucide-react)</label>
              <input type="text" value={item.icon_name} onChange={e => setItem({ ...item, icon_name: e.target.value })} className="input-field" placeholder="Code, Palette, Server..." />
              <p className="text-ink-500 text-xs mt-1">Use any icon name from lucide-react (e.g. Code, Palette, Server)</p>
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
