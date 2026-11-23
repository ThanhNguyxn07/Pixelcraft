import skillsData from '@/generated/skills.json';
import docsData from '@/generated/docs.json';
import { DocsShell, type FullSkillDoc } from '@/components/DocsShell';

export default function DocsIndexPage() {
  const skills = skillsData as FullSkillDoc[];
  return (
    <DocsShell
      skills={skills}
      activeSlug="overview"
      title="Pixelcraft Documentation"
      subtitle="Portable Agent Skills for distinctive, evidence-verified UI and rigorous UX across every frontend stack. Select any of the 26 skills or foundation docs from the sidebar."
      installCmd="npx github:ThanhNguyxn07/Pixelcraft install codex"
      markdown={docsData.architecture}
    />
  );
}
