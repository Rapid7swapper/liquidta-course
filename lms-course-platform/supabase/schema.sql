-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Enums
create type member_role as enum ('owner', 'admin', 'employee');
create type resource_type as enum ('pdf', 'video', 'link', 'file');
create type question_type as enum ('multiple_choice', 'true_false', 'multiple_select');

-- Organizations
create table organizations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  logo text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create table organization_members (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  user_id text not null,
  role member_role default 'employee' not null,
  created_at timestamptz default now() not null,
  unique(organization_id, user_id)
);

create index idx_organization_members_user_id on organization_members(user_id);

-- Courses
create table courses (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  image_url text,
  is_published boolean default false not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create table modules (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  position integer not null,
  is_published boolean default false not null,
  course_id uuid not null references courses(id) on delete cascade,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index idx_modules_course_id on modules(course_id);

create table lessons (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  video_url text,
  position integer not null,
  is_published boolean default false not null,
  is_free boolean default false not null,
  module_id uuid not null references modules(id) on delete cascade,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index idx_lessons_module_id on lessons(module_id);

create table resources (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  url text not null,
  type resource_type not null,
  lesson_id uuid not null references lessons(id) on delete cascade,
  created_at timestamptz default now() not null
);

create index idx_resources_lesson_id on resources(lesson_id);

-- Quiz System
create table quizzes (
  id uuid primary key default uuid_generate_v4(),
  module_id uuid unique not null references modules(id) on delete cascade,
  passing_score integer default 80 not null,
  max_attempts integer,
  time_limit_minutes integer,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create table questions (
  id uuid primary key default uuid_generate_v4(),
  quiz_id uuid not null references quizzes(id) on delete cascade,
  text text not null,
  type question_type not null,
  position integer not null,
  points integer default 1 not null,
  created_at timestamptz default now() not null
);

create index idx_questions_quiz_id on questions(quiz_id);

create table question_options (
  id uuid primary key default uuid_generate_v4(),
  question_id uuid not null references questions(id) on delete cascade,
  text text not null,
  is_correct boolean default false not null,
  position integer not null
);

create index idx_question_options_question_id on question_options(question_id);

create table quiz_attempts (
  id uuid primary key default uuid_generate_v4(),
  quiz_id uuid not null references quizzes(id) on delete cascade,
  user_id text not null,
  score integer not null,
  passed boolean not null,
  answers jsonb not null,
  started_at timestamptz default now() not null,
  completed_at timestamptz
);

create index idx_quiz_attempts_quiz_id on quiz_attempts(quiz_id);
create index idx_quiz_attempts_user_id on quiz_attempts(user_id);

-- Progress Tracking
create table enrollments (
  id uuid primary key default uuid_generate_v4(),
  user_id text not null,
  course_id uuid not null references courses(id) on delete cascade,
  organization_id uuid references organizations(id),
  enrolled_at timestamptz default now() not null,
  completed_at timestamptz,
  unique(user_id, course_id)
);

create index idx_enrollments_course_id on enrollments(course_id);
create index idx_enrollments_organization_id on enrollments(organization_id);

create table lesson_progress (
  id uuid primary key default uuid_generate_v4(),
  lesson_id uuid not null references lessons(id) on delete cascade,
  enrollment_id uuid not null references enrollments(id) on delete cascade,
  is_completed boolean default false not null,
  watched_seconds integer default 0 not null,
  total_seconds integer default 0 not null,
  completed_at timestamptz,
  updated_at timestamptz default now() not null,
  unique(lesson_id, enrollment_id)
);

create index idx_lesson_progress_enrollment_id on lesson_progress(enrollment_id);

-- Certificates
create table certificates (
  id uuid primary key default uuid_generate_v4(),
  enrollment_id uuid unique not null references enrollments(id) on delete cascade,
  certificate_id uuid unique default uuid_generate_v4() not null,
  issued_at timestamptz default now() not null
);

-- Updated at triggers
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger organizations_updated_at before update on organizations
  for each row execute function update_updated_at();

create trigger courses_updated_at before update on courses
  for each row execute function update_updated_at();

create trigger modules_updated_at before update on modules
  for each row execute function update_updated_at();

create trigger lessons_updated_at before update on lessons
  for each row execute function update_updated_at();

create trigger quizzes_updated_at before update on quizzes
  for each row execute function update_updated_at();

create trigger lesson_progress_updated_at before update on lesson_progress
  for each row execute function update_updated_at();

-- Row Level Security (RLS)
alter table organizations enable row level security;
alter table organization_members enable row level security;
alter table courses enable row level security;
alter table modules enable row level security;
alter table lessons enable row level security;
alter table resources enable row level security;
alter table quizzes enable row level security;
alter table questions enable row level security;
alter table question_options enable row level security;
alter table quiz_attempts enable row level security;
alter table enrollments enable row level security;
alter table lesson_progress enable row level security;
alter table certificates enable row level security;

-- Basic RLS policies (allow all for authenticated users - customize as needed)
create policy "Allow read access to published courses" on courses
  for select using (is_published = true);

create policy "Allow read access to published modules" on modules
  for select using (is_published = true);

create policy "Allow read access to published lessons" on lessons
  for select using (is_published = true);

create policy "Allow read access to resources" on resources
  for select using (true);

create policy "Allow read access to quizzes" on quizzes
  for select using (true);

create policy "Allow read access to questions" on questions
  for select using (true);

create policy "Allow read access to question options" on question_options
  for select using (true);
