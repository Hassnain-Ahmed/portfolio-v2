import type { Testimonial } from "@/hooks/useTestimonials";
import { SITE_URL } from "./seo";

const KNOWS_ABOUT = [
  "React",
  "TypeScript",
  "Next.js",
  "Node.js",
  "UI/UX Design",
  "3D Web Experiences",
  "Frontend Architecture",
  "Tailwind CSS",
  "Supabase",
  "PostgreSQL",
];

export const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Hassnain Ahmed",
  url: SITE_URL,
  jobTitle: "Design Engineer & Creative Developer",
  description:
    "Design engineer and creative developer crafting immersive digital experiences with modern web technologies.",
  image: `${SITE_URL}/og/default.png`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Islamabad",
    addressCountry: "PK",
  },
  sameAs: [
    "https://github.com/Hassnain-Ahmed",
    "https://www.linkedin.com/in/hasnain-ahmed-869741291",
  ],
  knowsAbout: KNOWS_ABOUT,
  hasOccupation: {
    "@type": "Occupation",
    name: "Design Engineer",
    occupationLocation: {
      "@type": "Country",
      name: "Pakistan",
    },
    skills:
      "React, TypeScript, UI/UX Design, 3D Web, Frontend Architecture, Tailwind CSS, Node.js",
  },
};

export const webSiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Hassnain Ahmed",
  url: SITE_URL,
  description:
    "Portfolio of Hassnain Ahmed, design engineer and creative developer.",
};

export const collectionPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Selected Work",
  url: `${SITE_URL}/work`,
  description: "Portfolio of selected projects by Hassnain Ahmed.",
  author: {
    "@type": "Person",
    name: "Hassnain Ahmed",
  },
  // TODO: Replace with your actual top 2-3 projects from Supabase
  hasPart: [
    {
      "@type": "CreativeWork",
      name: "Portfolio 2.0",
      description:
        "Personal portfolio site with 3D Spline scenes, GSAP animations, and a Supabase-powered admin panel.",
      url: SITE_URL,
      author: { "@type": "Person", name: "Hassnain Ahmed" },
      programmingLanguage: ["TypeScript", "React"],
    },
  ],
};

export const profilePageJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  name: "About Hassnain Ahmed",
  url: `${SITE_URL}/about`,
  mainEntity: {
    "@type": "Person",
    name: "Hassnain Ahmed",
    jobTitle: "Design Engineer",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Islamabad",
      addressCountry: "PK",
    },
    knowsAbout: KNOWS_ABOUT,
  },
};

export const processJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Hassnain Ahmed's Development Process",
  url: `${SITE_URL}/process`,
  description:
    "A 7-step end-to-end development workflow from discovery to launch.",
  // TODO: Update step text to match your actual Supabase process_steps data
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Discovery",
      text: "Research goals, audience, and requirements to define project scope.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Architecture",
      text: "Design the technical architecture, data models, and system structure.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Design",
      text: "Create wireframes, UI mockups, and interactive prototypes.",
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Development",
      text: "Build the application with clean, maintainable, production-grade code.",
    },
    {
      "@type": "HowToStep",
      position: 5,
      name: "Testing",
      text: "Run thorough testing across devices, browsers, and edge cases.",
    },
    {
      "@type": "HowToStep",
      position: 6,
      name: "Deployment",
      text: "Deploy to production with CI/CD pipelines and monitoring.",
    },
    {
      "@type": "HowToStep",
      position: 7,
      name: "Launch",
      text: "Go live with performance optimization and post-launch support.",
    },
  ],
};

export const contactPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact Hassnain Ahmed",
  url: `${SITE_URL}/contact`,
  description:
    "Get in touch with Hassnain Ahmed for projects and collaborations.",
  mainEntity: {
    "@type": "Person",
    name: "Hassnain Ahmed",
    contactPoint: {
      "@type": "ContactPoint",
      email: "dev.hassnain77@gmail.com",
      contactType: "freelance inquiries",
      availableLanguage: ["English", "Urdu"],
    },
  },
};

export function testimonialsJsonLd(testimonials: Testimonial[]) {
  if (!testimonials.length) return null;

  const avg =
    testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length;

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Testimonials — Hassnain Ahmed",
    url: `${SITE_URL}/testimonials`,
    mainEntity: {
      "@type": "Person",
      name: "Hassnain Ahmed",
      url: SITE_URL,
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: avg.toFixed(1),
        bestRating: "5",
        worstRating: "1",
        ratingCount: testimonials.length,
      },
    },
    review: testimonials.map((t) => ({
      "@type": "Review",
      author: {
        "@type": "Person",
        name: t.name,
        ...(t.company && {
          worksFor: { "@type": "Organization", name: t.company },
        }),
      },
      reviewBody: t.content,
      reviewRating: {
        "@type": "Rating",
        ratingValue: t.rating,
        bestRating: 5,
        worstRating: 1,
      },
    })),
  };
}
