import DeferredSection from "@/components/layout/DeferredSection";
import Hero from "@/components/hero/Hero";
import SEO from "@/components/seo/SEO";
import { personJsonLd, webSiteJsonLd } from "@/lib/jsonLd";
import { lazy } from "react";

// Only the hero is eager (it's the LCP). Every section below streams in as it
// approaches the viewport via DeferredSection, so heavy deps (WavyBackground,
// WarpBackground, @xyflow/react, three.js) and their fetches stay off the
// initial load.
const AboutSection = lazy(() => import("@/components/about/AboutSection"));
const WorkSection = lazy(() => import("@/components/work/WorkSection"));
const ProcessSection = lazy(() => import("@/components/process/ProcessSection"));
const TestimonialsSection = lazy(
  () => import("@/components/testimonials/TestimonialsSection")
);
const ContactSection = lazy(() => import("@/components/contact/ContactSection"));

export default function Landing() {
  return (
    <main>
      <SEO
        title="Hassnain Ahmed — Full-Stack Developer building AI & SaaS products"
        description="Full-stack developer shipping AI-powered products and SaaS end to end — frontend, backend, and everything between. Based in Islamabad, building worldwide."
        path="/"
        jsonLd={[personJsonLd, webSiteJsonLd]}
      />

      <Hero />

      <DeferredSection id="about" minHeight="100vh">
        <AboutSection />
      </DeferredSection>

      <DeferredSection id="work" minHeight="100vh">
        <WorkSection />
      </DeferredSection>

      <DeferredSection id="process" minHeight="100vh">
        <ProcessSection />
      </DeferredSection>

      <DeferredSection id="testimonials" minHeight="100vh">
        <TestimonialsSection />
      </DeferredSection>

      <DeferredSection id="contact" minHeight="100vh">
        <ContactSection />
      </DeferredSection>
    </main>
  );
}
