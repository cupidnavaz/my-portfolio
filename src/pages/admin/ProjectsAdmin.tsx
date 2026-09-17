import CrudManager, { type Column } from '@/components/admin/CrudManager';
import FileUpload from '@/components/admin/FileUpload';
import type { Project } from '@/types';
import { Star } from 'lucide-react';

const columns: Column<Project>[] = [
  {
    key: 'title',
    label: 'Title',
    render: (p) => <span className="font-medium text-white">{p.title}</span>,
  },
  {
    key: 'tags',
    label: 'Tags',
    render: (p) => (
      <div className="flex flex-wrap gap-1">
        {p.tags.slice(0, 3).map(t => (
          <span key={t} className="text-xs text-ink-300 bg-ink-800/60 px-2 py-0.5 rounded">{t}</span>
        ))}
        {p.tags.length > 3 && <span className="text-xs text-ink-500">+{p.tags.length - 3}</span>}
      </div>
    ),
  },
  {
    key: 'featured',
    label: 'Featured',
    render: (p) => p.featured ? <Star size={16} className="text-accent-400 fill-accent-400" /> : <span className="text-ink-600">—</span>,
  },
  { key: 'sort_order', label: 'Order' },
];

const empty: Project = {
  id: '', user_id: '', title: '', description: '', image_url: '', live_url: '', repo_url: '',
  tags: [], featured: false, sort_order: 0, created_at: '', updated_at: '',
};

export default function ProjectsAdmin() {
  return (
    <CrudManager<Project>
      table="projects"
      title="Projects"
      description="Manage your portfolio projects"
      columns={columns}
      searchKeys={['title', 'description']}
      orderBy={{ column: 'sort_order', ascending: true }}
      emptyItem={empty}
      itemName="project"
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
              <FileUpload
                bucket="images"
                folder="projects"
                value={item.image_url ?? ''}
                onChange={url => setItem({ ...item, image_url: url })}
                accept="image/*"
                label="Project Image"
              />
              <input type="text" value={item.image_url ?? ''} onChange={e => setItem({ ...item, image_url: e.target.value })} className="input-field mt-2" placeholder="or paste image URL" />
            </div>
            <div>
              <label className="block text-sm text-ink-300 mb-2">Live URL</label>
              <input type="text" value={item.live_url ?? ''} onChange={e => setItem({ ...item, live_url: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm text-ink-300 mb-2">Repo URL</label>
              <input type="text" value={item.repo_url ?? ''} onChange={e => setItem({ ...item, repo_url: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm text-ink-300 mb-2">Sort Order</label>
              <input type="number" value={item.sort_order} onChange={e => setItem({ ...item, sort_order: parseInt(e.target.value) || 0 })} className="input-field" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-ink-300 mb-2">Tags (comma-separated)</label>
            <input type="text" value={item.tags.join(', ')} onChange={e => setItem({ ...item, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })} className="input-field" placeholder="React, TypeScript, ..." />
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={item.featured} onChange={e => setItem({ ...item, featured: e.target.checked })} className="w-4 h-4 accent-accent-500" />
            <span className="text-ink-200 text-sm">Featured project</span>
          </label>
        </div>
      )}
    />
  );
}
