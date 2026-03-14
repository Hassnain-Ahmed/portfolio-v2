import AdminLayout from "@/components/admin/AdminLayout";
import AuthGuard from "@/components/admin/AuthGuard";
import Layout from "@/components/layout/Layout";
import { AuthProvider } from "@/context/AuthContext";
import { queryClient } from "@/lib/queryClient";
import About from "@/pages/About";
import AboutPage from "@/pages/admin/AboutPage";
import LanguagesPage from "@/pages/admin/LanguagesPage";
import ContactAdminPage from "@/pages/admin/ContactPage";
import DashboardPage from "@/pages/admin/DashboardPage";
import LoginPage from "@/pages/admin/LoginPage";
import MessagesPage from "@/pages/admin/MessagesPage";
import ProcessPage from "@/pages/admin/ProcessPage";
import ProjectsPage from "@/pages/admin/ProjectsPage";
import Contact from "@/pages/Contact";
import Home from "@/pages/Home";
import Process from "@/pages/Process";
import Work from "@/pages/Work";
import { QueryClientProvider } from "@tanstack/react-query";
import { Analytics } from "@vercel/analytics/react";
import { AnimatePresence, motion } from "motion/react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    // Transition effect on navigation
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/work" element={<Work />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/process" element={<Process />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public portfolio */}
            <Route path="/*" element={<Layout><AnimatedRoutes /></Layout>} />

            {/* Admin */}
            <Route path="/admin/login" element={<LoginPage />} />
            <Route path="/admin" element={<AuthGuard><AdminLayout /></AuthGuard>}>
              <Route index element={<DashboardPage />} />
              <Route path="projects" element={<ProjectsPage />} />
              <Route path="process" element={<ProcessPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="languages" element={<LanguagesPage />} />
              <Route path="messages" element={<MessagesPage />} />
              <Route path="contact" element={<ContactAdminPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
      <Analytics />
    </QueryClientProvider>
  );
}
