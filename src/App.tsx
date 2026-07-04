import AdminLayout from "@/components/admin/AdminLayout";
import AuthGuard from "@/components/admin/AuthGuard";
import Layout from "@/components/layout/Layout";
import { AuthProvider } from "@/context/AuthContext";
import { queryClient } from "@/lib/queryClient";
import Landing from "@/pages/Landing";
import { QueryClientProvider } from "@tanstack/react-query";
import { Analytics } from "@vercel/analytics/react";
import { AnimatePresence, motion } from "motion/react";
import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";

// Home + Layout stay eager (the LCP path). Everything else is code-split so a
// first-time visitor to "/" never downloads the Process (xyflow), admin
// (dnd-kit), or other route bundles up front.
const Work = lazy(() => import("@/pages/Work"));
const About = lazy(() => import("@/pages/About"));
const Contact = lazy(() => import("@/pages/Contact"));
const Process = lazy(() => import("@/pages/Process"));
const Testimonials = lazy(() => import("@/pages/Testimonials"));

const LoginPage = lazy(() => import("@/pages/admin/LoginPage"));
const DashboardPage = lazy(() => import("@/pages/admin/DashboardPage"));
const ProjectsPage = lazy(() => import("@/pages/admin/ProjectsPage"));
const HeroPage = lazy(() => import("@/pages/admin/HeroPage"));
const ProcessPage = lazy(() => import("@/pages/admin/ProcessPage"));
const AboutPage = lazy(() => import("@/pages/admin/AboutPage"));
const LanguagesPage = lazy(() => import("@/pages/admin/LanguagesPage"));
const TestimonialsAdminPage = lazy(() => import("@/pages/admin/TestimonialsPage"));
const MessagesPage = lazy(() => import("@/pages/admin/MessagesPage"));
const ContactAdminPage = lazy(() => import("@/pages/admin/ContactPage"));

function RouteFallback() {
  return (
    <div
      className="flex min-h-[60vh] w-full items-center justify-center"
      role="status"
      aria-label="Loading"
    >
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/15 border-t-white/70" />
    </div>
  );
}

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
        <Suspense fallback={<RouteFallback />}>
          <Routes location={location}>
            <Route path="/" element={<Landing />} />
            <Route path="/work" element={<Work />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/process" element={<Process />} />
            <Route path="/testimonials" element={<Testimonials />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              {/* Public portfolio */}
              <Route path="/*" element={<Layout><AnimatedRoutes /></Layout>} />

              {/* Admin */}
              <Route path="/admin/login" element={<LoginPage />} />
              <Route path="/admin" element={<AuthGuard><AdminLayout /></AuthGuard>}>
                <Route index element={<DashboardPage />} />
                <Route path="projects" element={<ProjectsPage />} />
                <Route path="hero" element={<HeroPage />} />
                <Route path="process" element={<ProcessPage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="languages" element={<LanguagesPage />} />
                <Route path="testimonials" element={<TestimonialsAdminPage />} />
                <Route path="messages" element={<MessagesPage />} />
                <Route path="contact" element={<ContactAdminPage />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
      <Analytics />
    </QueryClientProvider>
  );
}
