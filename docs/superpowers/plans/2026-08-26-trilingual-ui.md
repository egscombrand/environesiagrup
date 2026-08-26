# Trilingual UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the interface genuinely trilingual — Indonesian, English, Simplified Chinese — by moving every hardcoded string into a typed dictionary, translating navigation labels in the database, and adding a language switcher.

**Architecture:** A typed TypeScript dictionary (`src/i18n/messages.ts`) holds every UI string for all three locales; components read it synchronously via the `locale` they already receive. `next-intl` stays for routing and middleware only. Navigation labels, which live in Supabase, gain two additive nullable columns rather than a content-model rewrite.

**Tech Stack:** Next.js 15, next-intl (routing only), Supabase, Vitest/RTL. No new dependencies.

**Spec:** `docs/superpowers/specs/2026-08-26-trilingual-ui-design.md`

## Global Constraints

- Locales are exactly `['id', 'en', 'zh']`, default `id`. Chinese is Simplified, routed as `/zh`, `og:locale` `zh_CN`.
- **The dictionary is the single source of every UI string.** No new hardcoded user-visible text in any component.
- Each locale object is annotated `: Messages` so a missing key is a compile error.
- **Never translate:** entity names (GreenLab, Environesia, LSP Praktisi Lingkungan Indonesia, GreenSkill, Bikin Indonesia Berdaya), the brand tagline "The World-Class Integrated Green Ecosystem", the office address, or "Environesia Company Group".
- `messagesFor` falls back to Indonesian for an unknown locale. That is a guard against bad input, not a translation strategy.
- Components stay synchronous. No component becomes `async` to display text.
- Existing tests must keep rendering components directly. Do not introduce a provider requirement.
- Content other than navigation labels (entities, pillars, posts, projects, documents, jobs) is out of scope and stays single-language.

---

### Task 1: Locale foundation and the dictionary

**Files:**
- Modify: `src/i18n/routing.ts`
- Modify: `src/lib/metadata.ts` (add `zh` → `zh_CN`)
- Create: `src/i18n/messages.ts`
- Test: `src/i18n/messages.test.ts`
- Modify: `src/app/sitemap.test.ts` (assert the third locale)

**Interfaces:**
- Produces: `Messages` type and `messagesFor(locale: string): Messages` from `@/i18n/messages`. Every later task consumes it.

- [ ] **Step 1: Add the locale**

In `src/i18n/routing.ts`, change `locales: ['id', 'en']` to `locales: ['id', 'en', 'zh']`. Leave `defaultLocale: 'id'`.

In `src/lib/metadata.ts`, add `zh: 'zh_CN',` to the `OG_LOCALES` map.

- [ ] **Step 2: Write the failing completeness test**

```ts
// src/i18n/messages.test.ts
import { describe, expect, it } from 'vitest';
import { messagesFor, LOCALE_MESSAGES } from './messages';

function flatKeys(obj: object, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([k, v]) =>
    typeof v === 'object' && v !== null ? flatKeys(v, `${prefix}${k}.`) : [`${prefix}${k}`]
  );
}

describe('messages', () => {
  it('gives every locale exactly the same key set', () => {
    const [id, en, zh] = [LOCALE_MESSAGES.id, LOCALE_MESSAGES.en, LOCALE_MESSAGES.zh].map((m) =>
      flatKeys(m).sort()
    );
    expect(en).toEqual(id);
    expect(zh).toEqual(id);
  });

  it('leaves no value empty in any locale', () => {
    for (const [locale, messages] of Object.entries(LOCALE_MESSAGES)) {
      const empty = flatKeys(messages).filter((key) => {
        const value = key.split('.').reduce<unknown>((acc, k) => (acc as Record<string, unknown>)[k], messages);
        return typeof value !== 'string' || value.trim() === '';
      });
      expect({ locale, empty }).toEqual({ locale, empty: [] });
    }
  });

  it('resolves a known locale and falls back to Indonesian for anything else', () => {
    expect(messagesFor('zh').nav.menu).toBe(LOCALE_MESSAGES.zh.nav.menu);
    expect(messagesFor('pt').nav.menu).toBe(LOCALE_MESSAGES.id.nav.menu);
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npx vitest run src/i18n/messages.test.ts`
Expected: FAIL — `Cannot find module './messages'`.

- [ ] **Step 4: Create the dictionary**

```ts
// src/i18n/messages.ts

// Every user-visible interface string, for all three locales. The `: Messages`
// annotation on each locale is what makes a forgotten translation a build
// error instead of a page that silently renders Indonesian.
//
// Not translated by design: entity names, the brand tagline, the office
// address, and the group's own name — see the design spec.

export type Messages = {
  nav: {
    utama: string;
    footer: string;
    mobile: string;
    menu: string;
    tutup: string;
    pilihBahasa: string;
  };
  common: {
    pendingContent: string;
    layanan: string;
    layananPending: string;
    selengkapnya: string;
  };
  beranda: {
    entitasKami: string;
    pilarBisnis: string;
    jejakNegara: string;
    greenBusiness: string;
    pesanPimpinan: string;
    pesanCeoPending: string;
    manifestoPending: string;
    beritaJudul: string;
    beritaKosong: string;
    ctaJudul: string;
    ctaDeskripsi: string;
    ctaTombol: string;
  };
  entitas: {
    eyebrow: string;
    judul: string;
    intro: string;
    legalitas: string;
    legalitasPending: string;
    kembali: string;
  };
  bisnis: {
    eyebrow: string;
    judul: string;
    intro: string;
    dijalankanOleh: string;
    entitasTerkaitPending: string;
    kembali: string;
  };
  proyek: {
    eyebrow: string;
    judul: string;
    intro: string;
    daftar: string;
    kosong: string;
    dikerjakanOleh: string;
    galeri: string;
  };
  berita: {
    eyebrow: string;
    judul: string;
    intro: string;
    kosong: string;
    tidakDitemukan: string;
    tidakDitemukanDeskripsi: string;
  };
  pimpinan: {
    eyebrow: string;
    judul: string;
    intro: string;
    direksi: string;
    komisaris: string;
    direksiPending: string;
    komisarisPending: string;
  };
  tentangKami: {
    eyebrow: string;
    judul: string;
    entitasDalamGrup: string;
    strukturOrganisasi: string;
    strukturPending: string;
  };
  kontak: {
    eyebrow: string;
    judul: string;
    intro: string;
    kantorPusat: string;
    formulir: string;
    formulirPending: string;
  };
  karier: { judul: string; deskripsi: string };
  unduhan: { judul: string; deskripsi: string };
  privasi: { judul: string; deskripsi: string; catatan: string };
};

const id: Messages = {
  nav: {
    utama: 'Navigasi utama',
    footer: 'Navigasi footer',
    mobile: 'Navigasi mobile',
    menu: 'Menu',
    tutup: 'Tutup',
    pilihBahasa: 'Pilih bahasa',
  },
  common: {
    pendingContent: 'Konten halaman ini sedang disiapkan.',
    layanan: 'Layanan',
    layananPending: 'Rincian layanan akan segera hadir.',
    selengkapnya: 'Selengkapnya',
  },
  beranda: {
    entitasKami: 'Entitas Kami',
    pilarBisnis: 'Pilar Bisnis',
    jejakNegara: 'Jejak di 10 Negara',
    greenBusiness: 'Green Business',
    pesanPimpinan: 'Pesan Pimpinan',
    pesanCeoPending: 'Kutipan pesan CEO menyusul.',
    manifestoPending: 'Manifesto Green Business akan segera hadir di sini.',
    beritaJudul: 'Berita & Insight',
    beritaKosong: 'Belum ada berita terbaru.',
    ctaJudul: 'Mari berdiskusi tentang kebutuhan Anda',
    ctaDeskripsi: 'Hubungi tim kami untuk konsultasi, pengujian, pelatihan, atau sertifikasi.',
    ctaTombol: 'Hubungi Kami',
  },
  entitas: {
    eyebrow: 'Struktur Grup',
    judul: 'Entitas Kami',
    intro:
      'Lima entitas yang bergerak di konsultasi lingkungan, pengujian dan sampling, pelatihan kompetensi, sertifikasi profesi, serta konveksi custom apparel.',
    legalitas: 'Legalitas & Akreditasi',
    legalitasPending: 'Data legalitas akan segera hadir.',
    kembali: 'Semua entitas',
  },
  bisnis: {
    eyebrow: 'Layanan',
    judul: 'Pilar Bisnis',
    intro:
      'Empat pilar yang membentuk satu rantai layanan berurutan, dari perencanaan hingga pengakuan kompetensi.',
    dijalankanOleh: 'Dijalankan Oleh',
    entitasTerkaitPending: 'Entitas terkait akan segera hadir.',
    kembali: 'Semua pilar',
  },
  proyek: {
    eyebrow: 'Portofolio',
    judul: 'Proyek',
    intro: 'Rekam jejak pekerjaan grup bersama klien korporat dan instansi.',
    daftar: 'Daftar Proyek',
    kosong: 'Daftar proyek sedang disiapkan.',
    dikerjakanOleh: 'Dikerjakan Oleh',
    galeri: 'Galeri',
  },
  berita: {
    eyebrow: 'Publikasi',
    judul: 'Berita & Insight',
    intro: 'Kabar terbaru dan wawasan dari tim grup.',
    kosong: 'Belum ada berita terbaru.',
    tidakDitemukan: 'Berita tidak ditemukan',
    tidakDitemukanDeskripsi: 'Halaman berita yang Anda cari tidak tersedia.',
  },
  pimpinan: {
    eyebrow: 'Kepemimpinan',
    judul: 'Pimpinan',
    intro: 'Jajaran kepemimpinan yang mengarahkan grup dan entitas di bawahnya.',
    direksi: 'Direksi',
    komisaris: 'Komisaris',
    direksiPending: 'Profil jajaran direksi sedang disiapkan.',
    komisarisPending: 'Keberadaan dewan komisaris belum dikonfirmasi.',
  },
  tentangKami: {
    eyebrow: 'Profil',
    judul: 'Tentang Kami',
    entitasDalamGrup: 'Entitas dalam grup',
    strukturOrganisasi: 'Struktur Organisasi',
    strukturPending: 'Susunan organisasi tingkat personel sedang disiapkan.',
  },
  kontak: {
    eyebrow: 'Hubungi Kami',
    judul: 'Kontak',
    intro:
      'Untuk kebutuhan konsultasi, pengujian, pelatihan, atau sertifikasi lingkungan, tim kami dapat dihubungi melalui kantor pusat.',
    kantorPusat: 'Kantor Pusat',
    formulir: 'Formulir',
    formulirPending: 'Formulir kontak akan tersedia setelah kebijakan privasi terbit.',
  },
  karier: { judul: 'Karier', deskripsi: 'Peluang berkarier bersama grup.' },
  unduhan: {
    judul: 'Unduhan',
    deskripsi: 'Dokumen resmi grup untuk keperluan tender dan prakualifikasi.',
  },
  privasi: {
    judul: 'Kebijakan Privasi',
    deskripsi: 'Bagaimana kami menangani data yang Anda berikan.',
    catatan: 'Naskah kebijakan privasi sedang disusun bersama tim legal.',
  },
};

const en: Messages = {
  nav: {
    utama: 'Main navigation',
    footer: 'Footer navigation',
    mobile: 'Mobile navigation',
    menu: 'Menu',
    tutup: 'Close',
    pilihBahasa: 'Choose language',
  },
  common: {
    pendingContent: 'This page is being prepared.',
    layanan: 'Services',
    layananPending: 'Service details are coming soon.',
    selengkapnya: 'Explore further',
  },
  beranda: {
    entitasKami: 'Our Entities',
    pilarBisnis: 'Business Pillars',
    jejakNegara: 'Presence in 10 Countries',
    greenBusiness: 'Green Business',
    pesanPimpinan: 'Leadership Message',
    pesanCeoPending: "The CEO's message is coming soon.",
    manifestoPending: 'The Green Business manifesto will appear here soon.',
    beritaJudul: 'News & Insight',
    beritaKosong: 'No news yet.',
    ctaJudul: "Let's discuss what you need",
    ctaDeskripsi:
      'Contact our team for consulting, testing, training, or certification.',
    ctaTombol: 'Contact Us',
  },
  entitas: {
    eyebrow: 'Group Structure',
    judul: 'Our Entities',
    intro:
      'Five entities working across environmental consulting, testing and sampling, competency training, professional certification, and custom apparel manufacturing.',
    legalitas: 'Legal & Accreditation',
    legalitasPending: 'Legal details are coming soon.',
    kembali: 'All entities',
  },
  bisnis: {
    eyebrow: 'Services',
    judul: 'Business Pillars',
    intro:
      'Four pillars forming a single sequential service chain, from planning through to recognised competency.',
    dijalankanOleh: 'Delivered By',
    entitasTerkaitPending: 'Related entities are coming soon.',
    kembali: 'All pillars',
  },
  proyek: {
    eyebrow: 'Portfolio',
    judul: 'Projects',
    intro: 'A record of the group’s work with corporate and government clients.',
    daftar: 'Project List',
    kosong: 'The project list is being prepared.',
    dikerjakanOleh: 'Delivered By',
    galeri: 'Gallery',
  },
  berita: {
    eyebrow: 'Publications',
    judul: 'News & Insight',
    intro: 'Latest news and insight from the group.',
    kosong: 'No news yet.',
    tidakDitemukan: 'Article not found',
    tidakDitemukanDeskripsi: 'The article you are looking for is not available.',
  },
  pimpinan: {
    eyebrow: 'Leadership',
    judul: 'Leadership',
    intro: 'The leadership steering the group and the entities beneath it.',
    direksi: 'Board of Directors',
    komisaris: 'Board of Commissioners',
    direksiPending: 'Director profiles are being prepared.',
    komisarisPending: 'Whether a board of commissioners exists is not yet confirmed.',
  },
  tentangKami: {
    eyebrow: 'Profile',
    judul: 'About Us',
    entitasDalamGrup: 'Entities in the group',
    strukturOrganisasi: 'Organisational Structure',
    strukturPending: 'The personnel-level organisational chart is being prepared.',
  },
  kontak: {
    eyebrow: 'Get in Touch',
    judul: 'Contact',
    intro:
      'For environmental consulting, testing, training, or certification, our team can be reached at the head office.',
    kantorPusat: 'Head Office',
    formulir: 'Form',
    formulirPending: 'The contact form will be available once the privacy policy is published.',
  },
  karier: { judul: 'Careers', deskripsi: 'Career opportunities with the group.' },
  unduhan: {
    judul: 'Downloads',
    deskripsi: 'Official group documents for tender and prequalification purposes.',
  },
  privasi: {
    judul: 'Privacy Policy',
    deskripsi: 'How we handle the data you provide.',
    catatan: 'The privacy policy is being drafted with our legal team.',
  },
};

const zh: Messages = {
  nav: {
    utama: '主导航',
    footer: '页脚导航',
    mobile: '移动导航',
    menu: '菜单',
    tutup: '关闭',
    pilihBahasa: '选择语言',
  },
  common: {
    pendingContent: '本页内容正在筹备中。',
    layanan: '服务',
    layananPending: '服务详情即将发布。',
    selengkapnya: '了解更多',
  },
  beranda: {
    entitasKami: '旗下企业',
    pilarBisnis: '业务支柱',
    jejakNegara: '业务遍及十国',
    greenBusiness: '绿色商业',
    pesanPimpinan: '领导致辞',
    pesanCeoPending: '首席执行官致辞即将发布。',
    manifestoPending: '绿色商业宣言即将在此发布。',
    beritaJudul: '新闻与洞察',
    beritaKosong: '暂无最新消息。',
    ctaJudul: '欢迎与我们探讨您的需求',
    ctaDeskripsi: '如需咨询、检测、培训或认证服务，请联系我们的团队。',
    ctaTombol: '联系我们',
  },
  entitas: {
    eyebrow: '集团架构',
    judul: '旗下企业',
    intro:
      '五家企业分别从事环境咨询、检测与采样、能力培训、职业认证，以及定制服装制造。',
    legalitas: '资质与认证',
    legalitasPending: '资质信息即将发布。',
    kembali: '全部企业',
  },
  bisnis: {
    eyebrow: '服务',
    judul: '业务支柱',
    intro: '四大支柱构成一条完整的服务链，从规划直至能力认证。',
    dijalankanOleh: '承接企业',
    entitasTerkaitPending: '相关企业信息即将发布。',
    kembali: '全部支柱',
  },
  proyek: {
    eyebrow: '业绩',
    judul: '项目',
    intro: '集团与企业客户及政府机构合作的项目记录。',
    daftar: '项目列表',
    kosong: '项目列表正在筹备中。',
    dikerjakanOleh: '承接企业',
    galeri: '图库',
  },
  berita: {
    eyebrow: '出版物',
    judul: '新闻与洞察',
    intro: '来自集团团队的最新动态与洞察。',
    kosong: '暂无最新消息。',
    tidakDitemukan: '未找到该文章',
    tidakDitemukanDeskripsi: '您查找的文章不存在。',
  },
  pimpinan: {
    eyebrow: '领导团队',
    judul: '领导团队',
    intro: '带领集团及旗下企业发展的领导团队。',
    direksi: '董事会',
    komisaris: '监事会',
    direksiPending: '董事简介正在筹备中。',
    komisarisPending: '监事会是否设立尚未确认。',
  },
  tentangKami: {
    eyebrow: '简介',
    judul: '关于我们',
    entitasDalamGrup: '集团旗下企业',
    strukturOrganisasi: '组织架构',
    strukturPending: '人员层级的组织架构正在筹备中。',
  },
  kontak: {
    eyebrow: '联系我们',
    judul: '联系方式',
    intro: '如需环境咨询、检测、培训或认证服务，欢迎通过总部与我们的团队联系。',
    kantorPusat: '总部',
    formulir: '表单',
    formulirPending: '隐私政策发布后，联系表单即可使用。',
  },
  karier: { judul: '招聘', deskripsi: '加入集团的职业发展机会。' },
  unduhan: {
    judul: '下载',
    deskripsi: '用于招投标与资格预审的集团官方文件。',
  },
  privasi: {
    judul: '隐私政策',
    deskripsi: '我们如何处理您提供的数据。',
    catatan: '隐私政策文本正在与法务团队共同起草。',
  },
};

export const LOCALE_MESSAGES = { id, en, zh } as const;

export function messagesFor(locale: string): Messages {
  return (LOCALE_MESSAGES as Record<string, Messages>)[locale] ?? id;
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/i18n/messages.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 6: Update the sitemap test for the third locale**

In `src/app/sitemap.test.ts`, the existing assertions cover `/id` and `/en`. Add a Chinese assertion to the homepage test:

```ts
expect(urls).toContain('https://example.invalid/zh');
```

and to the entity test:

```ts
expect(urls).toContain('https://example.invalid/zh/entitas/greenlab');
```

- [ ] **Step 7: Verify the whole suite and the build**

Run: `npx vitest run` then `npm run build`
Expected: all tests pass; the build emits `/zh` routes alongside `/id` and `/en`.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: add Chinese locale and the trilingual message dictionary"
```

---

### Task 2: Shared components and homepage sections

**Files:**
- Modify: `src/components/layout/pending-content.tsx`, `src/components/layout/header-mobile-nav.tsx`, `src/components/layout/footer.tsx`, `src/components/layout/header.tsx`
- Modify: `src/components/home/entity-cards.tsx`, `business-pillars.tsx`, `country-map-section.tsx`, `green-business-split.tsx`, `news-cards.tsx`, `cta-section.tsx`
- Test: the matching `*.test.tsx` files

**Interfaces:**
- Consumes: `messagesFor` from `@/i18n/messages`

Components that do not currently receive `locale` gain it as a required prop; their parent pages already have it. `PendingContent` gains `locale`; every caller passes it.

- [ ] **Step 1: Thread locale and replace strings**

For each component: add `locale: string` to its props if absent, add `const t = messagesFor(locale);` at the top of the body, and replace each hardcoded string with its dictionary key. The mapping:

| Component | Hardcoded | Key |
|---|---|---|
| `pending-content.tsx` | `Konten halaman ini sedang disiapkan.` | `t.common.pendingContent` |
| `header-mobile-nav.tsx` | `Menu` / `Tutup` / `Navigasi mobile` | `t.nav.menu` / `t.nav.tutup` / `t.nav.mobile` |
| `header.tsx` | `Navigasi utama` | `t.nav.utama` |
| `footer.tsx` | `Navigasi footer` | `t.nav.footer` |
| `entity-cards.tsx` | `Entitas Kami` | `t.beranda.entitasKami` |
| `business-pillars.tsx` | `Pilar Bisnis` | `t.beranda.pilarBisnis` |
| `country-map-section.tsx` | `Jejak di 10 Negara` | `t.beranda.jejakNegara` |
| `green-business-split.tsx` | `Green Business` / `Pesan Pimpinan` / manifesto / CEO pending | `t.beranda.greenBusiness` / `.pesanPimpinan` / `.manifestoPending` / `.pesanCeoPending` |
| `news-cards.tsx` | `Berita & Insight` / `Belum ada berita terbaru.` | `t.beranda.beritaJudul` / `.beritaKosong` |
| `cta-section.tsx` | headline / description / button | `t.beranda.ctaJudul` / `.ctaDeskripsi` / `.ctaTombol` |

`PendingContent`'s own `title` and `description` props stay — callers supply those from the dictionary in Task 3.

- [ ] **Step 2: Update the affected tests**

Each test that renders one of these components must now pass a locale. For components that gained the prop, add `locale="id"`. Assertions on Indonesian strings keep passing because `id` is the default dictionary.

Add one test proving translation actually switches, in `src/components/home/cta-section.test.tsx` (create it if absent):

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CTASection } from './cta-section';

describe('CTASection', () => {
  it('renders Indonesian copy for the id locale', () => {
    render(<CTASection locale="id" />);
    expect(screen.getByText('Mari berdiskusi tentang kebutuhan Anda')).toBeInTheDocument();
  });

  it('renders Chinese copy for the zh locale', () => {
    render(<CTASection locale="zh" />);
    expect(screen.getByText('欢迎与我们探讨您的需求')).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Verify**

Run: `npx vitest run` then `npx tsc --noEmit`
Expected: all pass, types clean.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: translate shared components and homepage sections"
```

---

### Task 3: Pages

**Files:**
- Modify every page under `src/app/[locale]/` that holds hardcoded text: `entitas/page.tsx`, `entitas/[slug]/page.tsx`, `bisnis/page.tsx`, `bisnis/[pilar]/page.tsx`, `proyek/page.tsx`, `proyek/[slug]/page.tsx`, `berita/page.tsx`, `berita/[slug]/page.tsx`, `pimpinan/page.tsx`, `pimpinan/direksi/page.tsx`, `pimpinan/komisaris/page.tsx`, `tentang-kami/page.tsx`, `tentang-kami/struktur-organisasi/page.tsx`, `tentang-kami/sejarah|visi-misi|makna-logo|green-business|penghargaan/page.tsx`, `kontak/page.tsx`, `karier/page.tsx`, `unduhan/page.tsx`, `kebijakan-privasi/page.tsx`
- Test: the matching `*.test.tsx` files

**Interfaces:**
- Consumes: `messagesFor`, and `PendingContent`'s new `locale` prop from Task 2

Every page already awaits `locale` from `params`. Add `const t = messagesFor(locale);` after that await and replace each string per the dictionary namespace matching the page (`t.entitas.*`, `t.bisnis.*`, and so on).

The five `PendingContent` scaffolds under `tentang-kami/` currently pass literal `title`/`description`. They keep passing literals for now — those five titles (`Sejarah`, `Visi & Misi`, `Makna Logo`, `Green Business`, `Penghargaan`) come from `TENTANG_KAMI_ROUTES` in `src/lib/tentang-kami-routes.ts`, which is a route registry, not the message dictionary. Translating that registry is deferred with the rest of content; pass `locale` so the pending notice itself translates.

- [ ] **Step 1: Replace strings page by page**

Work through the list. For each page, after `const { locale } = await params;` add `const t = messagesFor(locale);`, then replace visible strings with dictionary lookups. Pass `locale` to every `PendingContent`, `EntityCard`, and section component that now requires it.

- [ ] **Step 2: Update page tests**

Tests asserting Indonesian strings keep passing under the `id` locale. Where a test renders with `locale: 'en'`, its assertions on Indonesian text must move to the English value from the dictionary — check each failure rather than assuming.

- [ ] **Step 3: Add a page-level translation test**

```tsx
// src/app/[locale]/kontak/page.test.tsx — add to the existing describe
it('renders Chinese copy for the zh locale', async () => {
  render(await KontakPage({ params: Promise.resolve({ locale: 'zh' }) }));
  expect(screen.getByRole('heading', { level: 1, name: '联系方式' })).toBeInTheDocument();
});
```

- [ ] **Step 4: Verify**

Run: `npx vitest run`, `npx tsc --noEmit`, `npm run build`
Expected: all pass; build succeeds.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: translate page-level interface strings"
```

---

### Task 4: Language switcher

**Files:**
- Create: `src/components/layout/language-switcher.tsx`
- Test: `src/components/layout/language-switcher.test.tsx`
- Modify: `src/components/layout/header.tsx`

**Interfaces:**
- Consumes: `routing` from `@/i18n/routing`, `messagesFor`
- Produces: `LanguageSwitcher({ locale, pathname }: { locale: string; pathname: string })`

The switcher takes the current pathname as a prop rather than reading it from a hook, so it stays a Server Component and remains directly testable. The header obtains the pathname from `next/headers`.

- [ ] **Step 1: Write the failing test**

```tsx
// src/components/layout/language-switcher.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LanguageSwitcher } from './language-switcher';

describe('LanguageSwitcher', () => {
  it('offers all three locales', () => {
    render(<LanguageSwitcher locale="id" pathname="/id" />);
    ['ID', 'EN', '中文'].forEach((label) =>
      expect(screen.getByRole('link', { name: label })).toBeInTheDocument()
    );
  });

  it('keeps the visitor on the same page when switching language', () => {
    render(<LanguageSwitcher locale="id" pathname="/id/entitas/greenlab" />);

    expect(screen.getByRole('link', { name: 'EN' })).toHaveAttribute(
      'href',
      '/en/entitas/greenlab'
    );
    expect(screen.getByRole('link', { name: '中文' })).toHaveAttribute(
      'href',
      '/zh/entitas/greenlab'
    );
  });

  it('marks the active locale for assistive tech', () => {
    render(<LanguageSwitcher locale="zh" pathname="/zh" />);
    expect(screen.getByRole('link', { name: '中文' })).toHaveAttribute('aria-current', 'true');
  });

  it('handles the bare locale root without leaving a trailing slash', () => {
    render(<LanguageSwitcher locale="id" pathname="/id" />);
    expect(screen.getByRole('link', { name: 'EN' })).toHaveAttribute('href', '/en');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/layout/language-switcher.test.tsx`
Expected: FAIL — `Cannot find module './language-switcher'`.

- [ ] **Step 3: Implement**

```tsx
// src/components/layout/language-switcher.tsx
import Link from 'next/link';
import { routing } from '@/i18n/routing';
import { messagesFor } from '@/i18n/messages';

const LABELS: Record<string, string> = { id: 'ID', en: 'EN', zh: '中文' };

// Takes the pathname as a prop rather than reading a client hook, so this
// stays a Server Component and can be rendered directly in a test.
export function LanguageSwitcher({ locale, pathname }: { locale: string; pathname: string }) {
  const t = messagesFor(locale);

  // strip the leading locale segment; '/id/entitas' -> '/entitas', '/id' -> ''
  const rest = pathname.replace(/^\/[^/]+/, '');

  return (
    <nav aria-label={t.nav.pilihBahasa} className="flex items-center gap-2">
      {routing.locales.map((candidate) => (
        <Link
          key={candidate}
          href={`/${candidate}${rest}`}
          aria-current={candidate === locale ? 'true' : undefined}
          className={
            candidate === locale
              ? 'font-mono text-label uppercase text-forest'
              : 'font-mono text-label uppercase text-slate hover:text-forest'
          }
        >
          {LABELS[candidate] ?? candidate}
        </Link>
      ))}
    </nav>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/components/layout/language-switcher.test.tsx`
Expected: PASS (4 tests).

- [ ] **Step 5: Render it in the header**

In `src/components/layout/header.tsx`, add `import { headers } from 'next/headers';` and `import { LanguageSwitcher } from './language-switcher';`. Inside the async component body:

```tsx
const requestHeaders = await headers();
const pathname = requestHeaders.get('x-pathname') ?? `/${locale}`;
```

Render `<LanguageSwitcher locale={locale} pathname={pathname} />` beside the desktop nav.

Next does not expose the pathname in headers by default, so set it in middleware. In `src/middleware.ts`, inside the non-`/wp-admin` branch, before returning the intl middleware result:

```ts
const response = intlMiddleware(request);
response.headers.set('x-pathname', request.nextUrl.pathname);
return response;
```

- [ ] **Step 6: Verify the switcher works end to end**

```bash
npm run build
npm run dev &
sleep 5
curl -s http://localhost:3000/id/entitas | grep -o 'href="/zh/entitas"' | head -1
curl -s http://localhost:3000/zh/entitas | grep -o '旗下企业' | head -1
kill %1
```

Expected: the first curl finds the Chinese link preserving `/entitas`; the second finds Chinese page text. **Kill the dev server afterwards.**

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add language switcher"
```

---

### Task 5: Translate navigation labels

**Files:**
- Create: `supabase/migrations/0008_navigation_translations.sql`
- Modify: `src/lib/cms/navigation.ts`
- Modify: `src/components/admin/navigation-form.tsx`
- Modify: `src/app/wp-admin/(protected)/site/navigation/actions.ts`
- Modify: `src/components/layout/header.tsx`, `src/components/layout/footer.tsx`
- Test: `src/lib/cms/navigation.test.ts`

**Interfaces:**
- Produces: `navigationLabel(node: NavigationNode, locale: string): string` from `@/lib/cms/navigation`

Navigation lives in Supabase with a single `label` column. Two additive nullable columns carry the translations; a null falls back to `label`, so an untranslated item renders Indonesian rather than blank.

- [ ] **Step 1: Write the migration**

```sql
-- supabase/migrations/0008_navigation_translations.sql
-- Navigation labels are the only content translated in this phase: they sit in
-- the header on every page, so leaving them Indonesian would make the Chinese
-- and English sites read as half-finished. Both columns are nullable and a null
-- falls back to `label`, so existing rows stay valid and an untranslated item
-- degrades to Indonesian rather than rendering empty.
alter table public.navigation_items
  add column label_en text,
  add column label_zh text;
```

- [ ] **Step 2: Write the failing resolver test**

```ts
// src/lib/cms/navigation.test.ts
import { describe, expect, it } from 'vitest';
import { navigationLabel } from './navigation';

const node = {
  label: 'Entitas',
  label_en: 'Entities',
  label_zh: '旗下企业',
} as Parameters<typeof navigationLabel>[0];

describe('navigationLabel', () => {
  it('returns the label for the requested locale', () => {
    expect(navigationLabel(node, 'id')).toBe('Entitas');
    expect(navigationLabel(node, 'en')).toBe('Entities');
    expect(navigationLabel(node, 'zh')).toBe('旗下企业');
  });

  it('falls back to Indonesian when a translation is missing', () => {
    const untranslated = { label: 'Karier', label_en: null, label_zh: null } as typeof node;
    expect(navigationLabel(untranslated, 'zh')).toBe('Karier');
  });

  it('falls back to Indonesian for an unknown locale', () => {
    expect(navigationLabel(node, 'pt')).toBe('Entitas');
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npx vitest run src/lib/cms/navigation.test.ts`
Expected: FAIL — `navigationLabel` is not exported.

- [ ] **Step 4: Implement the resolver**

In `src/lib/cms/navigation.ts`, add:

```ts
// Resolves a navigation item's label for a locale. A missing translation falls
// back to the Indonesian `label` rather than rendering an empty menu item.
export function navigationLabel(
  node: Pick<NavigationRow, 'label' | 'label_en' | 'label_zh'>,
  locale: string
): string {
  if (locale === 'en') return node.label_en?.trim() || node.label;
  if (locale === 'zh') return node.label_zh?.trim() || node.label;
  return node.label;
}
```

- [ ] **Step 5: Regenerate the database types**

`src/lib/supabase/database.types.ts` must include the two new columns on `navigation_items` (Row, Insert, and Update). Add `label_en: string | null` and `label_zh: string | null` to `Row`, and `label_en?: string | null` / `label_zh?: string | null` to `Insert` and `Update`.

- [ ] **Step 6: Use the resolver in header and footer**

In both, replace the direct `item.label` render with `navigationLabel(item, locale)`.

- [ ] **Step 7: Add the admin inputs**

In `src/components/admin/navigation-form.tsx`, beside the existing `label` input, add two more:

```tsx
<label className={labelClass}>
  Label (English)
  <input type="text" name="label_en" defaultValue={initialValues.label_en ?? ''} className={inputClass} />
</label>
<label className={labelClass}>
  Label (中文)
  <input type="text" name="label_zh" defaultValue={initialValues.label_zh ?? ''} className={inputClass} />
</label>
```

Match the surrounding markup's existing class names and wrapper structure rather than the shape shown here if they differ.

In `src/app/wp-admin/(protected)/site/navigation/actions.ts`, add to the zod schema:

```ts
label_en: z.string().optional(),
label_zh: z.string().optional(),
```

and to the parsed payload:

```ts
label_en: formData.get('label_en') || null,
label_zh: formData.get('label_zh') || null,
```

- [ ] **Step 8: Apply the migration and verify**

```bash
npx supabase db push
npx vitest run
npx tsc --noEmit
npm run build
```

Expected: migration applies; all tests pass; types clean; build succeeds.

If `supabase db push` is unavailable in this environment, report that rather than skipping — the migration must reach the database before navigation translations render.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: translate navigation labels"
```

---

## Exit criteria

- `/id`, `/en`, `/zh` all resolve; the build emits all three.
- Every interface string outside content comes from the dictionary; no hardcoded user-visible text remains in the touched files.
- The completeness test fails if any locale misses a key or leaves one empty.
- The language switcher preserves the current path across all three locales.
- Navigation labels render per locale, falling back to Indonesian when untranslated.
- Entity names, the brand tagline, the office address, and the group name remain untranslated in all locales.
- `npm run build`, `npx vitest run`, and `npx tsc --noEmit` all pass.
