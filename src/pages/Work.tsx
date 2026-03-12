import SEO from "@/components/seo/SEO";
import WorkSection from "@/components/work/WorkSection";
import { collectionPageJsonLd } from "@/lib/jsonLd";

export default function Work() {
  return (
    <main>
      <SEO
        title="Selected Work"
        description="Explore selected projects by Hassnain Ahmed — web applications, creative experiments, and design engineering work built with React, TypeScript, and modern tools."
        path="/work"
        jsonLd={collectionPageJsonLd}
      />
      <WorkSection />
    </main>
  );
}
