import Link from 'next/link';

const TABS = [
  { href: '/wp-admin/content/siaran-pers', label: 'Daftar', key: 'list' },
  { href: '/wp-admin/content/siaran-pers/import', label: 'Import Excel / CSV', key: 'import' },
  { href: '/wp-admin/content/siaran-pers/new', label: 'Tambah Siaran Pers', key: 'new' },
] as const;

export function SiaranPersTabs({ active }: { active: 'list' | 'import' }) {
  return (
    <nav aria-label="Menu Siaran Pers" className="flex flex-wrap gap-2 border-b border-[#e3e8ee] pb-3">
      {TABS.map((tab) => {
        const isActive = tab.key === active;
        return (
          <Link
            key={tab.key}
            href={tab.href}
            aria-current={isActive ? 'page' : undefined}
            className={`rounded-[10px] px-3.5 py-2 text-small transition-colors ${
              isActive ? 'bg-[#2a7793]/10 font-medium text-[#2a7793]' : 'text-[#64748b] hover:text-ink'
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
