import { Link } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';
import type { Post } from '@/types';

interface Props {
  posts: Post[];
}

export default function Blog({ posts }: Props) {
  if (posts.length === 0) return null;

  return (
    <section id="blog" className="section-padding">
      <div className="container-max">
        <div className="text-center mb-16 animate-fade-in-up">
          <p className="text-accent-400 font-mono text-sm mb-4">// Blog</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white">Latest Posts</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.slice(0, 6).map((post, i) => (
            <Link key={post.id} to={`/blog/${post.slug}`} className="group glass-card overflow-hidden hover:border-accent-500/30 transition-all duration-300 hover:-translate-y-1 animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
              {post.cover_image_url ? (
                <div className="aspect-video overflow-hidden bg-ink-800">
                  <img src={post.cover_image_url} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              ) : (
                <div className="aspect-video bg-gradient-to-br from-ink-800 to-ink-900 flex items-center justify-center">
                  <span className="font-display text-3xl text-ink-700 font-bold">{post.title.charAt(0)}</span>
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center gap-2 text-xs text-ink-500 mb-3">
                  <Calendar size={14} />
                  <time>{new Date(post.published_at ?? post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</time>
                </div>
                <h3 className="font-display font-semibold text-white text-lg mb-2 group-hover:text-accent-400 transition-colors">{post.title}</h3>
                {post.excerpt && <p className="text-ink-400 text-sm leading-relaxed line-clamp-2 mb-4">{post.excerpt}</p>}
                <span className="inline-flex items-center gap-1.5 text-sm text-accent-400 group-hover:gap-2.5 transition-all">
                  Read More <ArrowRight size={16} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
