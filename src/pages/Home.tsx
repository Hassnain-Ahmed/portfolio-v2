import Hero from "@/components/hero/Hero";
import SEO from "@/components/seo/SEO";
import { personJsonLd, webSiteJsonLd } from "@/lib/jsonLd";

export default function Home() {
  return (
    <main>
      <SEO
        title="Hassnain Ahmed — Design Engineer & Creative Developer"
        description="Design engineer and creative developer crafting immersive digital experiences with modern web technologies. Based in Islamabad, Pakistan."
        path="/"
        jsonLd={[personJsonLd, webSiteJsonLd]}
      />
      <Hero />
    </main>
  );
}
