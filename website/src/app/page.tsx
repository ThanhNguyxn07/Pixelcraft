import skillsData from '@/generated/skills.json';
import { ShowcaseHome, type SkillDoc } from '@/components/ShowcaseHome';

export default function HomePage() {
  return <ShowcaseHome skills={skillsData as SkillDoc[]} />;
}
