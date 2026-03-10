import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { AuthProvider } from "@/context/AuthContext";
import Layout from "@/components/layout/Layout";
import Home from "@/pages/Home";
import Work from "@/pages/Work";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Process from "@/pages/Process";
import AuthGuard from "@/components/admin/AuthGuard";
import AdminLayout from "@/components/admin/AdminLayout";
import LoginPage from "@/pages/admin/LoginPage";
import DashboardPage from "@/pages/admin/DashboardPage";
import ProjectsPage from "@/pages/admin/ProjectsPage";
import ProcessPage from "@/pages/admin/ProcessPage";
import AboutPage from "@/pages/admin/AboutPage";
import ContactAdminPage from "@/pages/admin/ContactPage";
import MessagesPage from "@/pages/admin/MessagesPage";

function AnimatedRoutes() {
  const location = useLocation();

  return (
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
              <Route path="messages" element={<MessagesPage />} />
              <Route path="contact" element={<ContactAdminPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
