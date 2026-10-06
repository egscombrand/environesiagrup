import type { Project } from '@/lib/cms/projects';
import { Section } from '@/components/layout/section';
import { Reveal } from '@/components/motion/reveal';
import { messagesFor } from '@/i18n/messages';
import { ProjectDirectoryList } from './project-directory-list';
import type { DirectoryProject } from './project-directory-logic';

const PRIMARY = '#2A7793';
const ACCENT = '#01B3A1';
const TEXT = '#444444';

// The real project list — same underlying data as the standalone /proyek
// page, but rows here are purely informational (see ProjectDirectoryList):
// no link to /proyek/[slug], no navigation at all. The detail route itself
// is untouched; this section just never links to it.
//
// "Daftar Proyek" reads as an enterprise consulting portfolio archive
// (large editorial header, then the Project Directory panel) rather than a
// card grid or a dashboard table — the real portfolio runs into the
// hundreds, which neither of those scan well. This is the entire
// Portofolio Proyek tab: nothing else (no "Rekam Jejak Global" intro, no
// "Featured Project" highlight) sits above or below it.
export function PortofolioProyekSection({ locale, projects }: { locale: string; projects: Project[] }) {
  const t = messagesFor(locale);

  return (
    <Section>
      <Reveal>
        <p className="font-mono text-label uppercase tracking-wide" style={{ color: '#666666' }}>
          {t.proyek.daftar}
        </p>
        <h2
          className="mt-3 max-w-3xl text-[clamp(30px,4vw,48px)] font-bold leading-[1.15]"
          style={{ color: PRIMARY }}
        >
          Rekam Jejak yang Terbentuk dari <span style={{ color: ACCENT }}>Proyek Nyata</span>
        </h2>
        <p className="mt-3 max-w-[650px] text-[16px] leading-[1.6]" style={{ color: TEXT }}>
          {t.proyek.daftarSubheading}
        </p>

        <div className="mt-6">
          <ProjectDirectoryList locale={locale} projects={projects.map(toDirectoryProject)} />
        </div>
      </Reveal>
    </Section>
  );
}

function toDirectoryProject(project: Project): DirectoryProject {
  return {
    id: project.id,
    title: project.title,
    client: project.client,
    sector: project.sector,
    city: project.city,
    country: project.country,
    year: project.year,
  };
}
