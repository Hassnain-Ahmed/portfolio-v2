import SEO from "@/components/seo/SEO";
import ProcessSection from "@/components/process/ProcessSection";
import { processJsonLd } from "@/lib/jsonLd";

export default function Process() {
  return (
    <main>
      <SEO
        title="Development Process"
        description="A look inside Hassnain Ahmed's development process — from discovery and architecture through design, development, testing, and launch."
        path="/process"
        jsonLd={processJsonLd}
      />
      <ProcessSection />
    </main>
  );
}
