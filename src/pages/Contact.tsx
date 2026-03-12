import ContactSection from "@/components/contact/ContactSection";
import SEO from "@/components/seo/SEO";
import { contactPageJsonLd } from "@/lib/jsonLd";

export default function Contact() {
  return (
    <main>
      <SEO
        title="Contact"
        description="Get in touch with Hassnain Ahmed for freelance projects, collaborations, or to say hello. Based in Islamabad, Pakistan — available for remote work."
        path="/contact"
        jsonLd={contactPageJsonLd}
      />
      <ContactSection />
    </main>
  );
}
