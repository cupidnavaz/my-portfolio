import { Routes, Route } from 'react-router-dom';
import PublicSite from '@/pages/PublicSite';
import PostDetail from '@/pages/PostDetail';
import AdminLogin from '@/pages/admin/Login';
import AdminLayout from '@/components/admin/AdminLayout';
import Dashboard from '@/pages/admin/Dashboard';
import PortfolioDetailsAdmin from '@/pages/admin/PortfolioDetailsAdmin';
import ProjectsAdmin from '@/pages/admin/ProjectsAdmin';
import PostsAdmin from '@/pages/admin/PostsAdmin';
import ServicesAdmin from '@/pages/admin/ServicesAdmin';
import SkillsAdmin from '@/pages/admin/SkillsAdmin';
import ExperiencesAdmin from '@/pages/admin/ExperiencesAdmin';
import EducationAdmin from '@/pages/admin/EducationAdmin';
import CertificationsAdmin from '@/pages/admin/CertificationsAdmin';
import ContactsAdmin from '@/pages/admin/ContactsAdmin';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicSite />} />
      <Route path="/blog/:slug" element={<PostDetail />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="portfolio" element={<PortfolioDetailsAdmin />} />
        <Route path="projects" element={<ProjectsAdmin />} />
        <Route path="posts" element={<PostsAdmin />} />
        <Route path="services" element={<ServicesAdmin />} />
        <Route path="skills" element={<SkillsAdmin />} />
        <Route path="experiences" element={<ExperiencesAdmin />} />
        <Route path="education" element={<EducationAdmin />} />
        <Route path="certifications" element={<CertificationsAdmin />} />
        <Route path="contacts" element={<ContactsAdmin />} />
      </Route>
    </Routes>
  );
}
