import SEO from "@/components/seo/SEO";
import TestimonialsSection from "@/components/testimonials/TestimonialsSection";

export default function Testimonials() {
  return (
    <main>
      <SEO
        title="Testimonials"
        description="Read what clients and collaborators say about working with Hassnain Ahmed on web development projects."
        path="/testimonials"
      />
      <TestimonialsSection />
    </main>
  );
}
