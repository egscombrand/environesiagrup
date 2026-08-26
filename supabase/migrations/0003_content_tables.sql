-- Content schema. Every table follows the same conventions: uuid pk
-- (except the site_settings singleton), created_at/updated_at maintained by
-- public.set_updated_at(), sort_order for admin-controlled ordering, and a
-- status check constraint of draft|published|archived where the row is
-- something the public site can show or hide.

-- ---------------------------------------------------------------------
-- site_settings: single row (id fixed at 1), general/social/SEO/footer.
-- ---------------------------------------------------------------------
create table public.site_settings (
  id int primary key default 1 check (id = 1),
  site_name text not null default 'Environesia Company Group',
  tagline text,
  logo_path text,
  favicon_path text,
  email text,
  phone text,
  whatsapp text,
  address text,
  map_url text,
  google_maps_url text,
  social_instagram text,
  social_linkedin text,
  social_facebook text,
  social_youtube text,
  social_tiktok text,
  social_twitter text,
  seo_default_title text,
  seo_default_description text,
  seo_default_og_image text,
  seo_keywords text,
  seo_robots text not null default 'index,follow',
  footer_copyright text,
  footer_description text,
  footer_links jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles (id)
);

create trigger set_site_settings_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

insert into public.site_settings (id) values (1) on conflict (id) do nothing;

-- ---------------------------------------------------------------------
-- navigation_items: self-referencing tree, parent/child menus.
-- ---------------------------------------------------------------------
create table public.navigation_items (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  slug text,
  url text not null,
  parent_id uuid references public.navigation_items (id) on delete cascade,
  sort_order int not null default 0,
  status text not null default 'published' check (status in ('draft', 'published', 'archived')),
  open_new_tab boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index navigation_items_parent_id_idx on public.navigation_items (parent_id);

create trigger set_navigation_items_updated_at
  before update on public.navigation_items
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- entities: the five group companies.
-- ---------------------------------------------------------------------
create table public.entities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  tagline text,
  lini text check (lini in ('inti', 'penunjang')),
  accent_color text,
  short_description text,
  description text,
  services text[] not null default '{}',
  legalitas text[] not null default '{}',
  website text,
  email text,
  phone text,
  logo_path text,
  cover_image_path text,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create trigger set_entities_updated_at
  before update on public.entities
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- business_pillars + pillar_entities (many-to-many "related entities").
-- ---------------------------------------------------------------------
create table public.business_pillars (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  icon text,
  short_description text,
  description text,
  services text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_business_pillars_updated_at
  before update on public.business_pillars
  for each row execute function public.set_updated_at();

create table public.pillar_entities (
  pillar_id uuid not null references public.business_pillars (id) on delete cascade,
  entity_id uuid not null references public.entities (id) on delete cascade,
  primary key (pillar_id, entity_id)
);

-- ---------------------------------------------------------------------
-- hero_slides
-- ---------------------------------------------------------------------
create table public.hero_slides (
  id uuid primary key default gen_random_uuid(),
  type text not null default 'image' check (type in ('image', 'video')),
  title text not null,
  subtitle text,
  eyebrow text,
  description text,
  desktop_image_path text,
  mobile_image_path text,
  video_url text,
  video_poster_path text,
  cta_label text,
  cta_url text,
  secondary_cta_label text,
  secondary_cta_url text,
  accent_color text,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_hero_slides_updated_at
  before update on public.hero_slides
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- stats (homepage "angka kunci")
-- ---------------------------------------------------------------------
create table public.stats (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  value numeric not null default 0,
  prefix text,
  suffix text,
  description text,
  icon text,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_stats_updated_at
  before update on public.stats
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- projects + gallery + entity relations
-- ---------------------------------------------------------------------
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  summary text,
  content text,
  sector text,
  country text,
  city text,
  year int,
  client text,
  client_anonymous boolean not null default false,
  client_descriptor text,
  latitude double precision,
  longitude double precision,
  featured_image_path text,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  published_at timestamptz,
  sort_order int not null default 0,
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create trigger set_projects_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

create table public.project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  image_path text not null,
  alt_text text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index project_images_project_id_idx on public.project_images (project_id);

create table public.project_entities (
  project_id uuid not null references public.projects (id) on delete cascade,
  entity_id uuid not null references public.entities (id) on delete cascade,
  primary key (project_id, entity_id)
);

-- ---------------------------------------------------------------------
-- posts (berita / insight)
-- ---------------------------------------------------------------------
create table public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text,
  cover_image_path text,
  author text,
  category text,
  tags text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  featured boolean not null default false,
  published_at timestamptz,
  seo_title text,
  seo_description text,
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create trigger set_posts_updated_at
  before update on public.posts
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- leadership (direksi / komisaris)
-- ---------------------------------------------------------------------
create table public.leadership (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  position text not null,
  type text not null default 'direksi' check (type in ('direksi', 'komisaris', 'lainnya')),
  photo_path text,
  bio text,
  entity_id uuid references public.entities (id) on delete set null,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_leadership_updated_at
  before update on public.leadership
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- milestones (company history timeline)
-- ---------------------------------------------------------------------
create table public.milestones (
  id uuid primary key default gen_random_uuid(),
  year int not null,
  title text not null,
  description text,
  image_path text,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_milestones_updated_at
  before update on public.milestones
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- documents (unduhan)
-- ---------------------------------------------------------------------
create table public.documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  category text not null default 'Other'
    check (category in ('Company Profile', 'Legal', 'Certification', 'License', 'Report', 'Other')),
  file_path text,
  file_url text,
  file_type text,
  file_size bigint,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  sort_order int not null default 0,
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create trigger set_documents_updated_at
  before update on public.documents
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- jobs (karier)
-- ---------------------------------------------------------------------
create table public.jobs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  entity_id uuid references public.entities (id) on delete set null,
  location text,
  employment_type text,
  description text,
  requirements text,
  responsibilities text,
  deadline date,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  published_at timestamptz,
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create trigger set_jobs_updated_at
  before update on public.jobs
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- pages + page_sections: the guarded, section-toggle homepage builder.
-- ---------------------------------------------------------------------
create table public.pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_pages_updated_at
  before update on public.pages
  for each row execute function public.set_updated_at();

create table public.page_sections (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.pages (id) on delete cascade,
  section_key text not null,
  title_override text,
  subtitle_override text,
  config jsonb not null default '{}'::jsonb,
  status text not null default 'published' check (status in ('draft', 'published', 'archived')),
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (page_id, section_key)
);

create trigger set_page_sections_updated_at
  before update on public.page_sections
  for each row execute function public.set_updated_at();

insert into public.pages (slug, title) values ('home', 'Beranda')
  on conflict (slug) do nothing;

insert into public.page_sections (page_id, section_key, sort_order, status)
select p.id, s.key, s.ord, 'published'
from public.pages p
cross join (values
  ('hero', 0), ('stats', 1), ('entities', 2), ('pillars', 3),
  ('map', 4), ('green_business', 5), ('news', 6), ('cta', 7)
) as s (key, ord)
where p.slug = 'home'
on conflict (page_id, section_key) do nothing;

-- ---------------------------------------------------------------------
-- media library index (actual bytes live in Supabase Storage)
-- ---------------------------------------------------------------------
create table public.media (
  id uuid primary key default gen_random_uuid(),
  bucket text not null default 'media',
  path text not null,
  folder text,
  file_name text not null,
  file_type text,
  file_size bigint,
  alt_text text,
  uploaded_by uuid references public.profiles (id),
  created_at timestamptz not null default now(),
  unique (bucket, path)
);

-- ---------------------------------------------------------------------
-- audit_logs
-- ---------------------------------------------------------------------
create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles (id),
  action text not null,
  resource text not null,
  resource_id text,
  old_data jsonb,
  new_data jsonb,
  created_at timestamptz not null default now()
);

create index audit_logs_resource_idx on public.audit_logs (resource, resource_id);
