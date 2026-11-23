import { notFound } from 'next/navigation';
import skillsData from '@/generated/skills.json';
import docsData from '@/generated/docs.json';
import { DocsShell, type FullSkillDoc } from '@/components/DocsShell';

const skills = skillsData as FullSkillDoc[];

export function generateStaticParams() {
  return [
    { slug: 'architecture' },
    { slug: 'rationale' },
    ...skills.map((s) => ({ slug: s.slug })),
  ];
}

export default async function DocDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (slug === 'architecture') {
    return (
      <DocsShell
        skills={skills}
        activeSlug="architecture"
        title="Architecture"
        subtitle="Canonical layout, authority order, Pixelcraft loop, and self-contained skill boundaries."
        markdown={docsData.architecture}
      />
    );
  }

  if (slug === 'rationale') {
    return (
      <DocsShell
        skills={skills}
        activeSlug="rationale"
        title="Design Rationale"
        subtitle="Why Pixelcraft's rules exist, written in plain prose with explicit trade-offs."
        markdown={docsData.rationale}
      />
    );
  }

  const skill = skills.find((s) => s.slug === slug);
  if (!skill) notFound();

  return (
    <DocsShell
      skills={skills}
      activeSlug={skill.slug}
      title={skill.name}
      subtitle={skill.description}
      installCmd={`npx github:ThanhNguyxn07/Pixelcraft install codex --only ${skill.name}`}
      references={skill.references}
      scripts={skill.scripts}
      markdown={skill.body}
    />
  );
}
