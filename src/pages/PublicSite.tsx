import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { PortfolioDetails, Project, Post, Service, Skill, Experience, Education, Certification, Contact } from '@/types';
import Navbar from '@/components/public/Navbar';
import Hero from '@/components/public/Hero';
import About from '@/components/public/About';
import Skills from '@/components/public/Skills';
import ExperienceSection from '@/components/public/ExperienceSection';
import Certifications from '@/components/public/Certifications';
import Projects from '@/components/public/Projects';
import Blog from '@/components/public/Blog';
import Services from '@/components/public/Services';
import ContactSection from '@/components/public/ContactSection';
import Footer from '@/components/public/Footer';

export default function PublicSite() {
  const [portfolio, setPortfolio] = useState<PortfolioDetails | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [pRes, prRes, poRes, sRes, skRes, eRes, edRes, certRes] = await Promise.all([
        supabase.from('portfolio_details').select('*').maybeSingle(),
        supabase.from('projects').select('*').order('sort_order', { ascending: true }),
        supabase.from('posts').select('*').eq('published', true).order('created_at', { ascending: false }),
        supabase.from('services').select('*').order('sort_order', { ascending: true }),
        supabase.from('skills').select('*').order('sort_order', { ascending: true }),
        supabase.from('experiences').select('*').order('sort_order', { ascending: true }),
        supabase.from('education').select('*').order('sort_order', { ascending: true }),
        supabase.from('certifications').select('*').order('sort_order', { ascending: true }),
      ]);

      if (pRes.data) setPortfolio(pRes.data);
      if (prRes.data) setProjects(prRes.data);
      if (poRes.data) setPosts(poRes.data);
      if (sRes.data) setServices(sRes.data);
      if (skRes.data) setSkills(skRes.data);
      if (eRes.data) setExperiences(eRes.data);
      if (edRes.data) setEducation(edRes.data);
      if (certRes.data) setCertifications(certRes.data);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-accent-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-ink-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink-950">
      <Navbar portfolio={portfolio} />
      <Hero portfolio={portfolio} />
      <About portfolio={portfolio} />
      <Skills skills={skills} />
      <ExperienceSection experiences={experiences} education={education} />
      <Certifications certifications={certifications} />
      <Projects projects={projects} />
      <Services services={services} />
      <Blog posts={posts} />
      <ContactSection portfolio={portfolio} />
      <Footer portfolio={portfolio} />
    </div>
  );
}
