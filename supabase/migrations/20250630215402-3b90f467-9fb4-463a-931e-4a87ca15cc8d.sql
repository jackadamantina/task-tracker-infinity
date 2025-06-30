
-- Tabela para perfis/roles
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  permissions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela para grupos
CREATE TABLE public.groups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela para usuários do sistema
CREATE TABLE public.system_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  profile_id UUID REFERENCES public.profiles(id),
  group_id UUID REFERENCES public.groups(id),
  status TEXT NOT NULL DEFAULT 'active',
  avatar TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela para projetos
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#3B82F6',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela para colunas do kanban
CREATE TABLE public.kanban_columns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  color TEXT DEFAULT 'bg-white border-gray-200',
  header_color TEXT DEFAULT 'bg-gray-50',
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela para cards do kanban
CREATE TABLE public.kanban_cards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  column_id UUID REFERENCES public.kanban_columns(id),
  project_id UUID REFERENCES public.projects(id),
  assignee_id UUID REFERENCES public.system_users(id),
  priority TEXT NOT NULL DEFAULT 'Média',
  tags TEXT[] DEFAULT '{}',
  dependencies UUID[] DEFAULT '{}',
  attachments INTEGER DEFAULT 0,
  subtasks_completed INTEGER DEFAULT 0,
  subtasks_total INTEGER DEFAULT 0,
  time_spent INTEGER DEFAULT 0,
  estimated_completion_date TIMESTAMP WITH TIME ZONE,
  start_time TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kanban_columns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kanban_cards ENABLE ROW LEVEL SECURITY;

-- Políticas RLS permissivas para desenvolvimento (ajustar conforme necessário)
CREATE POLICY "Allow all operations" ON public.profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON public.groups FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON public.system_users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON public.projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON public.kanban_columns FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations" ON public.kanban_cards FOR ALL USING (true) WITH CHECK (true);

-- Inserir dados iniciais
INSERT INTO public.profiles (name, description, permissions) VALUES 
('Administrador', 'Acesso total ao sistema', '["all"]'),
('Gerente', 'Gerenciar projetos e usuários', '["manage_projects", "manage_users"]'),
('Desenvolvedor', 'Criar e editar tasks', '["create_tasks", "edit_tasks"]'),
('Usuário', 'Visualizar e comentar', '["view_tasks", "comment"]');

INSERT INTO public.groups (name, description) VALUES 
('Desenvolvimento', 'Equipe de desenvolvimento'),
('Design', 'Equipe de design'),
('Qualidade', 'Equipe de QA'),
('Gerência', 'Equipe de gerenciamento');

INSERT INTO public.projects (name, description, color) VALUES 
('Sistema E-commerce', 'Desenvolvimento do sistema de e-commerce', '#3B82F6'),
('App Mobile', 'Aplicativo mobile da empresa', '#10B981'),
('Dashboard Analytics', 'Dashboard de analytics', '#F59E0B');

INSERT INTO public.kanban_columns (title, color, header_color, position) VALUES 
('Backlog', 'bg-gray-50 border-gray-200', 'bg-gray-100', 0),
('Em Progresso', 'bg-blue-50 border-blue-200', 'bg-blue-100', 1),
('Em Revisão', 'bg-yellow-50 border-yellow-200', 'bg-yellow-100', 2),
('Concluído', 'bg-green-50 border-green-200', 'bg-green-100', 3);
