// Test-only factories for CMS row shapes. Not imported by application code —
// keeps component/page tests from re-typing every column on every fixture.
import type { Entity } from './entities';
import type { Pillar } from './pillars';
import type { HeroSlide } from './hero';
import type { Stat } from './stats';
import type { Project, ProjectPin } from './projects';
import type { Post } from './posts';
import type { LeadershipMember } from './leadership';
import type { Milestone } from './milestones';
import type { CmsDocument } from './documents';
import type { Job } from './jobs';
import type { NavigationNode } from './navigation';

let counter = 0;
function id() {
  counter += 1;
  return `00000000-0000-0000-0000-${String(counter).padStart(12, '0')}`;
}

const NOW = '2026-01-01T00:00:00.000Z';

export function makeEntity(overrides: Partial<Entity> = {}): Entity {
  return {
    id: id(),
    name: 'GreenLab',
    slug: 'greenlab',
    tagline: null,
    lini: 'inti',
    accent_color: '#1E7A6B',
    short_description: 'Laboratorium & sampling.',
    capability_title: null,
    capability_description: null,
    description: null,
    services: [],
    legalitas: [],
    explorer_category: null,
    explorer_description: null,
    explorer_contribution: null,
    explorer_focus: [],
    explorer_image_path: null,
    explorer_services: [],
    explorer_role: null,
    website: null,
    email: null,
    phone: null,
    logo_path: null,
    cover_image_path: null,
    social_youtube: null,
    social_tiktok: null,
    status: 'published',
    sort_order: 1,
    created_at: NOW,
    updated_at: NOW,
    deleted_at: null,
    explorerCategory: '',
    explorerDescription: '',
    explorerContribution: '',
    explorerFocus: [],
    explorerServices: [],
    explorerRole: '',
    ...overrides,
  };
}

export function makePillar(overrides: Partial<Pillar> = {}): Pillar {
  return {
    id: id(),
    name: 'Konsultasi Lingkungan',
    slug: 'konsultasi',
    icon: null,
    short_description: 'Konsultasi lingkungan.',
    description: null,
    services: [],
    status: 'published',
    sort_order: 1,
    created_at: NOW,
    updated_at: NOW,
    relatedEntityIds: [],
    ...overrides,
  };
}

export function makeHeroSlide(overrides: Partial<HeroSlide> = {}): HeroSlide {
  return {
    id: id(),
    type: 'image',
    title: 'Satu grup, lima entitas',
    subtitle: null,
    eyebrow: 'Environesia',
    description: 'Deskripsi slide.',
    desktop_image_path: null,
    mobile_image_path: null,
    video_url: null,
    video_poster_path: null,
    duration_seconds: null,
    cta_label: 'Lihat Entitas',
    cta_url: '/entitas',
    secondary_cta_label: null,
    secondary_cta_url: null,
    accent_color: null,
    status: 'published',
    sort_order: 1,
    created_at: NOW,
    updated_at: NOW,
    desktopImageUrl: undefined,
    mobileImageUrl: undefined,
    videoPosterUrl: undefined,
    ...overrides,
  };
}

export function makeStat(overrides: Partial<Stat> = {}): Stat {
  return {
    id: id(),
    label: 'Tahun Pengalaman',
    value: 10,
    prefix: null,
    suffix: '+',
    description: null,
    icon: null,
    status: 'published',
    sort_order: 1,
    created_at: NOW,
    updated_at: NOW,
    ...overrides,
  };
}

export function makeProjectPin(overrides: Partial<ProjectPin> = {}): ProjectPin {
  return {
    id: id(),
    title: 'Proyek Uji',
    slug: 'proyek-uji',
    country: 'Negara Uji',
    city: null,
    latitude: -6.2,
    longitude: 106.8,
    ...overrides,
  };
}

export function makeProject(overrides: Partial<Project> = {}): Project {
  return {
    id: id(),
    title: 'Proyek Uji',
    slug: 'proyek-uji',
    summary: null,
    content: null,
    sector: null,
    services: null,
    country: 'Negara Uji',
    city: null,
    year: null,
    client: null,
    client_anonymous: false,
    client_descriptor: null,
    company: null,
    latitude: -6.2,
    longitude: 106.8,
    featured_image_path: null,
    status: 'published',
    published_at: NOW,
    sort_order: 1,
    source_document: null,
    source_page: null,
    extraction_method: null,
    confidence: null,
    import_batch_id: null,
    created_by: null,
    created_at: NOW,
    updated_at: NOW,
    deleted_at: null,
    featuredImageUrl: undefined,
    entityIds: [],
    images: [],
    ...overrides,
  };
}

export function makePost(overrides: Partial<Post> = {}): Post {
  return {
    id: id(),
    title: 'Judul Berita',
    slug: 'judul-berita',
    excerpt: 'Ringkasan berita.',
    content: null,
    cover_image_path: null,
    author: null,
    owner: null,
    media: null,
    source_url: null,
    needs_review: false,
    thumbnail_url: null,
    thumbnail_source_url: null,
    thumbnail_source: null,
    thumbnail_status: null,
    thumbnail_detection_method: null,
    thumbnail_error_reason: null,
    thumbnail_extractor_version: null,
    post_type: 'siaran_pers',
    category: null,
    tags: [],
    status: 'published',
    featured: false,
    published_at: NOW,
    seo_title: null,
    seo_description: null,
    created_by: null,
    created_at: NOW,
    updated_at: NOW,
    deleted_at: null,
    coverImageUrl: undefined,
    ...overrides,
  };
}

export function makeLeadershipMember(overrides: Partial<LeadershipMember> = {}): LeadershipMember {
  return {
    id: id(),
    name: 'Contoh Satu',
    slug: 'contoh-satu',
    position: 'Direktur Utama',
    type: 'direksi',
    photo_path: null,
    bio: null,
    profile: {},
    entity_id: null,
    status: 'published',
    sort_order: 1,
    created_at: NOW,
    updated_at: NOW,
    photoUrl: undefined,
    ...overrides,
  };
}

export function makeMilestone(overrides: Partial<Milestone> = {}): Milestone {
  return {
    id: id(),
    year: 2016,
    date_label: null,
    title: 'Grup berdiri',
    description: null,
    image_path: null,
    status: 'published',
    sort_order: 1,
    created_at: NOW,
    updated_at: NOW,
    imageUrl: undefined,
    ...overrides,
  };
}

export function makeDocument(overrides: Partial<CmsDocument> = {}): CmsDocument {
  return {
    id: id(),
    title: 'Company Profile',
    slug: 'company-profile',
    description: null,
    category: 'Company Profile',
    file_path: null,
    file_url: null,
    file_type: null,
    file_size: null,
    status: 'published',
    sort_order: 1,
    created_by: null,
    created_at: NOW,
    updated_at: NOW,
    deleted_at: null,
    fileUrl: undefined,
    ...overrides,
  };
}

export function makeJob(overrides: Partial<Job> = {}): Job {
  return {
    id: id(),
    title: 'Staff Lapangan',
    slug: 'staff-lapangan',
    entity_id: null,
    division: null,
    location: null,
    employment_type: null,
    open_date: null,
    deadline: null,
    cover_image_path: null,
    general_recruitment: null,
    specific_recruitment: null,
    google_form_url: null,
    status: 'published',
    published_at: NOW,
    created_by: null,
    created_at: NOW,
    updated_at: NOW,
    deleted_at: null,
    ...overrides,
  };
}

export function makeNavigationNode(overrides: Partial<NavigationNode> = {}): NavigationNode {
  return {
    id: id(),
    label: 'Beranda',
    label_en: null,
    label_zh: null,
    slug: null,
    url: '/',
    parent_id: null,
    sort_order: 1,
    status: 'published',
    open_new_tab: false,
    menu: 'header',
    created_at: NOW,
    updated_at: NOW,
    children: [],
    ...overrides,
  };
}
