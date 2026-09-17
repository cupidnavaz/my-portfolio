import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import type { Post, PortfolioDetails } from '@/types';
import { ArrowLeft, Calendar, ArrowRight } from 'lucide-react';

export default function PostDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    (async () => {
      const [poRes, pRes] = await Promise.all([
        supabase.from('portfolio_details').select('*').maybeSingle(),
        supabase.from('posts').select('*').eq('slug', slug).eq('published', true).maybeSingle(),
      ]);
      if (poRes.data) setPortfolio(poRes.data);
      if (pRes.data) setPost(pRes.data);
      else setNotFound(true);
      setLoading(false);
    })();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink-950">
        <div className="w-10 h-10 border-2 border-accent-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink-950">
        <div className="text-center">
          <h1 className="text-4xl font-display font-bold text-white mb-4">Post Not Found</h1>
          <Link to="/" className="btn-primary">Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink-950">
      <header className="border-b border-ink-800/50">
        <div className="container-max section-padding !py-6">
          <Link to="/#blog" className="inline-flex items-center gap-2 text-ink-400 hover:text-accent-400 transition-colors text-sm">
            <ArrowLeft size={18} /> Back to Blog
          </Link>
        </div>
      </header>

      <article className="container-max section-padding">
        <div className="max-w-3xl mx-auto animate-fade-in-up">
          <div className="flex items-center gap-3 text-sm text-ink-400 mb-4">
            <Calendar size={16} />
            <time>{new Date(post.published_at ?? post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">{post.title}</h1>
          {post.excerpt && <p className="text-xl text-ink-300 mb-8 leading-relaxed">{post.excerpt}</p>}
          {post.cover_image_url && (
            <div className="rounded-2xl overflow-hidden mb-10 border border-ink-800">
              <img src={post.cover_image_url} alt={post.title} className="w-full h-auto object-cover" />
            </div>
          )}
          <div className="prose prose-invert max-w-none">
            <div className="text-ink-200 leading-relaxed whitespace-pre-wrap text-lg">{post.content}</div>
          </div>
        </div>
      </article>

      <footer className="border-t border-ink-800/50 mt-20">
        <div className="container-max section-padding !py-12 text-center">
          <p className="text-ink-400 text-sm mb-4">{portfolio?.name ?? 'Portfolio'}</p>
          <Link to="/#blog" className="inline-flex items-center gap-2 text-accent-400 hover:text-accent-300 transition-colors">
            Read more posts <ArrowRight size={18} />
          </Link>
        </div>
      </footer>
    </div>
  );
}
