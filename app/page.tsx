import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { SectionHeading } from "@/components/section-heading";
import { ExpertiseGrid } from "@/components/expertise-grid";
import { ExperienceTimeline } from "@/components/experience-timeline";
import { CertificationGrid } from "@/components/certification-grid";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";
import { MotionWrapper } from "@/components/motion-wrapper";
import { FeaturedProjectsStrip } from "@/components/featured-projects-strip";
import { DemosSection } from "@/components/demos-section";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <FeaturedProjectsStrip />
        <DemosSection />

        <section id="about" className="mx-auto max-w-6xl px-4 py-20 md:px-6">
          <div className="section-divider" />
          <MotionWrapper>
            <SectionHeading
              eyebrow="About"
              title="Architecture-first cloud delivery with practical engineering depth"
              description="I work across cloud infrastructure, architecture decisions, delivery automation, and security controls. My focus is building platforms that are scalable, governable, and easier for product teams to operate confidently."
            />
          </MotionWrapper>
        </section>

        <section id="expertise" className="mx-auto max-w-6xl px-4 py-20 md:px-6">
          <div className="section-divider" />
          <SectionHeading
            eyebrow="Expertise"
            title="Cloud, platform, and DevSecOps capabilities"
            description="Organized by architecture and delivery domains to support recruiter and client review."
          />
          <ExpertiseGrid />
        </section>

        <section id="experience" className="mx-auto max-w-6xl px-4 py-20 md:px-6">
          <div className="section-divider" />
          <SectionHeading
            eyebrow="Experience"
            title="Consulting and cloud engineering timeline"
            description="Dates and role details are centralized in editable data files for quick owner updates."
          />
          <ExperienceTimeline />
        </section>

        <section id="certifications" className="mx-auto max-w-6xl px-4 py-20 md:px-6">
          <div className="section-divider" />
          <SectionHeading
            eyebrow="Certifications"
            title="Microsoft credential portfolio"
            description="Credentials are marked owner verification pending by default and should be updated once links are confirmed."
          />
          <CertificationGrid />
        </section>

        <section className="mx-auto max-w-6xl px-4 py-20 md:px-6">
          <div className="section-divider" />
          <ContactSection />
        </section>
      </main>
      <Footer />
    </>
  );
}
