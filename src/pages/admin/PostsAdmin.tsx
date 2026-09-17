import CrudManager, { type Column } from '@/components/admin/CrudManager';
import FileUpload from '@/components/admin/FileUpload';
import type { Post } from '@/types';
import { CheckCircle, Circle } from 'lucide-react';

const columns: Column<Post>[] = [
  {
    key: 'title',
    label: 'Title',
    render: (p) => <span className="font-medium text-white">{p.title}</span>,
  },
  {
    key: 'slug',
    label: 'Slug',
    render: (p) => <span className="font-mono text-xs text-ink-400">{p.slug}</span>,
  },
  {
    key: 'published',
    label: 'Status',
    render: (p) => p.published
      ? <span className="flex items-center gap-1.5 text-green-400 text-xs"><CheckCircle size={14} /> Published</span>
      : <span className="flex items-center gap-1.5 text-ink-500 text-xs"><Circle size={14} /> Draft</span>,
  },
  {
    key: 'created_at',
    label: 'Created',
    render: (p) => <span className="text-ink-400 text-xs">{new Date(p.created_at).toLocaleDateString()}</span>,
  },
];

const empty: Post = {
  id: '', user_id: '', title: '', slug: '', excerpt: '', content: '', cover_image_url: '',
  published: false, published_at: null, created_at: '', updated_at: '',
};

export default function PostsAdmin() {
  return (
    <CrudManager<Post>
      table="posts"
      title="Blog Posts"
      description="Manage your blog posts and articles"
      columns={columns}
      searchKeys={['title', 'slug']}
      orderBy={{ column: 'created_at', ascending: false }}
      emptyItem={empty}
      itemName="post"
      renderForm={(item, setItem) => (
        <div className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm text-ink-300 mb-2">Title</label>
              <input type="text" value={item.title} onChange={e => setItem({ ...item, title: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm text-ink-300 mb-2">Slug</label>
              <input type="text" value={item.slug} onChange={e => setItem({ ...item, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') })} className="input-field" placeholder="my-first-post" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-ink-300 mb-2">Excerpt</label>
            <input type="text" value={item.excerpt ?? ''} onChange={e => setItem({ ...item, excerpt: e.target.value })} className="input-field" />
          </div>
          <div>
            <label className="block text-sm text-ink-300 mb-2">Content</label>
            <textarea value={item.content ?? ''} onChange={e => setItem({ ...item, content: e.target.value })} rows={10} className="input-field resize-none font-mono text-sm" />
          </div>
          <div>
            <FileUpload
              bucket="images"
              folder="blog"
              value={item.cover_image_url ?? ''}
              onChange={url => setItem({ ...item, cover_image_url: url })}
              accept="image/*"
              label="Cover Image"
            />
            <input type="text" value={item.cover_image_url ?? ''} onChange={e => setItem({ ...item, cover_image_url: e.target.value })} className="input-field mt-2" placeholder="or paste image URL" />
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={item.published}
              onChange={e => setItem({
                ...item,
                published: e.target.checked,
                published_at: e.target.checked ? (item.published_at ?? new Date().toISOString()) : null,
              })}
              className="w-4 h-4 accent-accent-500"
            />
            <span className="text-ink-200 text-sm">Published</span>
          </label>
        </div>
      )}
    />
  );
}
