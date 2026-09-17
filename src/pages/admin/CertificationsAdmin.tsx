import CrudManager, { type Column } from '@/components/admin/CrudManager';
import type { Certification } from '@/types';
import { ExternalLink } from 'lucide-react';

const columns: Column<Certification>[] = [
  {
    key: 'title',
    label: 'Title',
    render: (c) => <span className="font-medium text-white">{c.title}</span>,
  },
  { key: 'issuer', label: 'Issuer' },
  {
    key: 'issue_date',
    label: 'Issued',
    render: (c) => <span className="text-ink-400 text-xs">{c.issue_date}</span>,
  },
  {
    key: 'credential_url',
    label: 'Link',
    render: (c) => c.credential_url
      ? <a href={c.credential_url} target="_blank" rel="noopener noreferrer" className="text-accent-400 hover:text-accent-300"><ExternalLink size={16} /></a>
      : <span className="text-ink-600">—</span>,
  },
  { key: 'sort_order', label: 'Order' },
];

const empty: Certification = {
  id: '', user_id: '', title: '', issuer: '', issue_date: '', expiry_date: null,
  credential_id: null, credential_url: null, description: null, sort_order: 0,
  created_at: '', updated_at: '',
};

export default function CertificationsAdmin() {
  return (
    <CrudManager<Certification>
      table="certifications"
      title="Certifications"
      description="Manage your professional training and certifications"
      columns={columns}
      searchKeys={['title', 'issuer']}
      orderBy={{ column: 'sort_order', ascending: true }}
      emptyItem={empty}
      itemName="certification"
      renderForm={(item, setItem) => (
        <div className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm text-ink-300 mb-2">Title</label>
              <input type="text" value={item.title} onChange={e => setItem({ ...item, title: e.target.value })} className="input-field" placeholder="AWS Solutions Architect" />
            </div>
            <div>
              <label className="block text-sm text-ink-300 mb-2">Issuer</label>
              <input type="text" value={item.issuer} onChange={e => setItem({ ...item, issuer: e.target.value })} className="input-field" placeholder="Amazon Web Services" />
            </div>
            <div>
              <label className="block text-sm text-ink-300 mb-2">Issue Date</label>
              <input type="text" value={item.issue_date} onChange={e => setItem({ ...item, issue_date: e.target.value })} className="input-field" placeholder="Mar 2024" />
            </div>
            <div>
              <label className="block text-sm text-ink-300 mb-2">Expiry Date (optional)</label>
              <input type="text" value={item.expiry_date ?? ''} onChange={e => setItem({ ...item, expiry_date: e.target.value || null })} className="input-field" placeholder="Mar 2027" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-ink-300 mb-2">Description</label>
            <textarea value={item.description ?? ''} onChange={e => setItem({ ...item, description: e.target.value })} rows={3} className="input-field resize-none" />
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm text-ink-300 mb-2">Credential ID</label>
              <input type="text" value={item.credential_id ?? ''} onChange={e => setItem({ ...item, credential_id: e.target.value || null })} className="input-field" placeholder="ABC-123-456" />
            </div>
            <div>
              <label className="block text-sm text-ink-300 mb-2">Credential URL</label>
              <input type="text" value={item.credential_url ?? ''} onChange={e => setItem({ ...item, credential_url: e.target.value || null })} className="input-field" placeholder="https://..." />
            </div>
          </div>
          <div>
            <label className="block text-sm text-ink-300 mb-2">Sort Order</label>
            <input type="number" value={item.sort_order} onChange={e => setItem({ ...item, sort_order: parseInt(e.target.value) || 0 })} className="input-field w-32" />
          </div>
        </div>
      )}
    />
  );
}
