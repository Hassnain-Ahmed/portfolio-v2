import AboutSection from "@/components/about/AboutSection";
import SEO from "@/components/seo/SEO";
import { profilePageJsonLd } from "@/lib/jsonLd";

export default function About() {
  return (
    <main>
      <SEO
        title="About"
        description="Learn about Hassnain Ahmed — a design engineer based in Islamabad specializing in building polished, interactive web experiences with React and TypeScript."
        path="/about"
        ogType="profile"
        jsonLd={profilePageJsonLd}
      />
      <AboutSection />
    </main>
  );
}
