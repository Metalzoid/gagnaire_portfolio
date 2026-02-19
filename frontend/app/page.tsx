import { HomeContent, TerminalChunkPreload } from "@/components/home";
import {
  getProfile,
  getSkills,
  getTopProjects,
  getTestimonials,
} from "@/services/api";

export default async function HomePage() {
  const [profile, skills, topProjects, testimonials] = await Promise.all([
    getProfile(),
    getSkills(),
    getTopProjects(),
    getTestimonials(),
  ]);

  return (
    <>
      <TerminalChunkPreload />
      <HomeContent
        profile={profile}
        skills={skills}
        topProjects={topProjects}
        testimonials={testimonials}
      />
    </>
  );
}
