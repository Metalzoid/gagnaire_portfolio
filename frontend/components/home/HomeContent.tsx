"use client";

import { lazy, Suspense } from "react";
import useSnapScroll from "@/hooks/useSnapScroll";
import { ProgressBar } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { TerminalHero, HomeBio } from "@/components/home";
import { homeSections } from "@/data/sections";
import type { Profile, SkillCategory, Project, Testimonial } from "shared";
import styles from "@/app/page.module.scss";

const HomeSkills = lazy(() =>
  import("@/components/home/home-skills/HomeSkills").then((m) => ({
    default: m.HomeSkills,
  })),
);
const HomeFeaturedProjects = lazy(() =>
  import("@/components/home/home-featured/HomeFeaturedProjects").then((m) => ({
    default: m.HomeFeaturedProjects,
  })),
);
const HomeTestimonials = lazy(() =>
  import("@/components/home/home-testimonials/HomeTestimonials").then((m) => ({
    default: m.HomeTestimonials,
  })),
);
const HomeContact = lazy(() =>
  import("@/components/home/home-contact/HomeContact").then((m) => ({
    default: m.HomeContact,
  })),
);

// --------------------------------------------------------------------------
// Props pour HomeContent - données préfetchées côté serveur
// --------------------------------------------------------------------------
export interface HomeContentProps {
  profile: Profile;
  skills: SkillCategory[];
  topProjects: Project[];
  testimonials: Testimonial[];
}

// --------------------------------------------------------------------------
// Mapping section id -> composant avec props
// --------------------------------------------------------------------------
export function HomeContent({
  profile,
  skills,
  topProjects,
  testimonials,
}: HomeContentProps) {
  const { currentSection, totalSections, goToSection, containerRef } =
    useSnapScroll({ totalSections: homeSections.length });

  const sectionContent: Record<string, React.ReactNode> = {
    hero: (
      <TerminalHero
        profile={profile}
        skills={skills}
        topProjects={topProjects}
      />
    ),
    "a-propos": <HomeBio profile={profile} />,
    competences: (
      <Suspense fallback={null}>
        <HomeSkills skills={skills} />
      </Suspense>
    ),
    projets: (
      <Suspense fallback={null}>
        <HomeFeaturedProjects projects={topProjects} />
      </Suspense>
    ),
    temoignages: (
      <Suspense fallback={null}>
        <HomeTestimonials testimonials={testimonials} />
      </Suspense>
    ),
    contact: (
      <Suspense fallback={null}>
        <HomeContact />
      </Suspense>
    ),
  };

  return (
    <div className={`page page--home ${styles.homeWrapper}`}>
      <ProgressBar
        currentSection={currentSection}
        totalSections={totalSections}
        sectionLabels={homeSections.map((s) => s.label)}
        goToSection={goToSection}
      />

      <div ref={containerRef} className={styles.snapContainer}>
        {homeSections.map((section, index) => {
          const isLast = index === homeSections.length - 1;
          const content = sectionContent[section.id];

          return (
            <section
              key={section.id}
              id={section.id}
              className={`${styles.snapSection} ${
                isLast ? styles["snapSection--withFooter"] : ""
              }`}
              aria-label={section.label}
              data-snap-section
              data-snap-index={index}
            >
              <div className={styles.sectionContent}>
                {content !== undefined ? (
                  content
                ) : (
                  <>
                    {section.title && (
                      <h2 className={styles.sectionTitle}>{section.title}</h2>
                    )}
                    {section.text && (
                      <p className={styles.sectionText}>{section.text}</p>
                    )}
                  </>
                )}
              </div>
              {isLast && <Footer />}
            </section>
          );
        })}
      </div>
    </div>
  );
}
