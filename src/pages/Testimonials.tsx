import SEO from "@/components/seo/SEO";
import TestimonialsSection from "@/components/testimonials/TestimonialsSection";
import { useTestimonials } from "@/hooks/useTestimonials";
import { testimonialsJsonLd } from "@/lib/jsonLd";

export default function Testimonials() {
  const { data: testimonials } = useTestimonials();

  const avg =
    testimonials && testimonials.length
      ? (
          testimonials.reduce((s, t) => s + t.rating, 0) /
          testimonials.length
        ).toFixed(1)
      : null;

  const description = avg
    ? `See what clients say about working with Hassnain Ahmed. Rated ${avg}/5 from ${testimonials!.length}+ verified reviews on web development projects.`
    : "Read what clients and collaborators say about working with Hassnain Ahmed on web development projects.";

  const jsonLd = testimonials?.length
    ? testimonialsJsonLd(testimonials)
    : undefined;

  return (
    <main>
      <SEO
        title="Testimonials"
        description={description}
        path="/testimonials"
        jsonLd={jsonLd ?? undefined}
      />
      <TestimonialsSection />
    </main>
  );
}
