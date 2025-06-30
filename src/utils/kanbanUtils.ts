
export interface Card {
  id: number;
  title: string;
  description: string;
  column: string;
  priority: string;
  assignee: { name: string; avatar: string };
  attachments: number;
  subtasks: { completed: number; total: number };
  dependencies: number[];
  blocked: boolean;
  timeSpent: number;
  tags?: string[];
  startTime?: Date;
  completedTime?: Date;
  executionTime?: number; // em horas
  estimatedCompletionDate?: Date;
  projectId: string;
}

export interface Column {
  id: string;
  title: string;
  color: string;
  headerColor: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  estimatedEndDate: Date;
  actualEndDate?: Date;
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold';
  progress: number;
}

export const getCardsByColumn = (cards: Card[], columnId: string): Card[] => {
  return cards.filter(card => card.column === columnId);
};

export const getCardsByProject = (cards: Card[], projectId: string): Card[] => {
  return cards.filter(card => card.projectId === projectId);
};

export const isCardOverdue = (card: Card): boolean => {
  if (!card.estimatedCompletionDate) return false;
  return new Date() > card.estimatedCompletionDate && card.column !== 'done';
};

export const getOverdueCards = (cards: Card[]): Card[] => {
  return cards.filter(card => isCardOverdue(card));
};

export const getProjectProgress = (projectId: string, cards: Card[]): number => {
  const projectCards = getCardsByProject(cards, projectId);
  if (projectCards.length === 0) return 0;
  
  const completedCards = projectCards.filter(card => card.column === 'done');
  return Math.round((completedCards.length / projectCards.length) * 100);
};

export const getProjectTimeline = (projectId: string, cards: Card[]) => {
  const projectCards = getCardsByProject(cards, projectId);
  
  const timeline = projectCards.map(card => ({
    id: card.id,
    title: card.title,
    startDate: card.startTime || new Date(),
    estimatedEndDate: card.estimatedCompletionDate || new Date(),
    actualEndDate: card.completedTime,
    progress: card.column === 'done' ? 100 : 
              card.column === 'review' ? 75 : 
              card.column === 'in-progress' ? 50 : 0,
    status: card.column,
    assignee: card.assignee.name,
    isOverdue: isCardOverdue(card),
    timeSpent: card.timeSpent,
    executionTime: card.executionTime || 0
  }));

  return timeline.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
};

export const mockProjects: Project[] = [
  {
    id: "sistema-ecommerce",
    name: "Sistema E-commerce",
    description: "Desenvolvimento de plataforma de e-commerce completa",
    startDate: new Date(2024, 0, 1),
    estimatedEndDate: new Date(2024, 3, 30),
    status: 'in-progress',
    progress: 65
  },
  {
    id: "app-mobile",
    name: "App Mobile",
    description: "Aplicativo mobile para gestão de vendas",
    startDate: new Date(2024, 1, 15),
    estimatedEndDate: new Date(2024, 4, 15),
    status: 'in-progress',
    progress: 40
  },
  {
    id: "dashboard-analytics",
    name: "Dashboard Analytics",
    description: "Dashboard para análise de dados e relatórios",
    startDate: new Date(2024, 2, 1),
    estimatedEndDate: new Date(2024, 5, 1),
    status: 'planning',
    progress: 15
  }
];

export const defaultColumns: Column[] = [
  { id: "todo", title: "A Fazer", color: "bg-white border-gray-200", headerColor: "bg-gray-50" },
  { id: "in-progress", title: "Em Andamento", color: "bg-white border-gray-200", headerColor: "bg-gray-50" },
  { id: "review", title: "Em Revisão", color: "bg-white border-gray-200", headerColor: "bg-gray-50" },
  { id: "done", title: "Concluído", color: "bg-white border-gray-200", headerColor: "bg-gray-50" }
];

export const getExecutionTime = (startTime?: Date, completedTime?: Date): number => {
  if (!startTime || !completedTime) return 0;
  const diffMs = completedTime.getTime() - startTime.getTime();
  return Math.round(diffMs / (1000 * 60 * 60)); // converter para horas
};

export const shouldAutoProgress = (card: Card): boolean => {
  return card.subtasks.total > 0 && card.subtasks.completed === card.subtasks.total;
};

export const getNextColumn = (currentColumn: string): string => {
  const columnOrder = ["todo", "in-progress", "review", "done"];
  const currentIndex = columnOrder.indexOf(currentColumn);
  return currentIndex < columnOrder.length - 1 ? columnOrder[currentIndex + 1] : currentColumn;
};

export const mockCards: Card[] = [
  {
    id: 1,
    title: "Configurar autenticação",
    description: "Implementar sistema de login e registro com validação de políticas de senha",
    column: "todo",
    priority: "Alta",
    assignee: { name: "João Silva", avatar: "/placeholder.svg" },
    attachments: 2,
    subtasks: { completed: 0, total: 3 },
    dependencies: [],
    blocked: false,
    timeSpent: 0,
    tags: ["Backend", "Segurança"],
    executionTime: 0,
    estimatedCompletionDate: new Date(2024, 2, 15),
    projectId: "sistema-ecommerce"
  },
  {
    id: 2,
    title: "Design da página inicial",
    description: "Criar mockups e protótipos responsivos para todas as telas",
    column: "in-progress",
    priority: "Média",
    assignee: { name: "Maria Santos", avatar: "/placeholder.svg" },
    attachments: 5,
    subtasks: { completed: 2, total: 4 },
    dependencies: [],
    blocked: false,
    timeSpent: 8,
    tags: ["Frontend", "Design"],
    startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    executionTime: 48,
    estimatedCompletionDate: new Date(2024, 2, 20),
    projectId: "sistema-ecommerce"
  },
  {
    id: 3,
    title: "API de produtos",
    description: "Desenvolver endpoints para CRUD de produtos com validações",
    column: "review",
    priority: "Alta",
    assignee: { name: "Pedro Costa", avatar: "/placeholder.svg" },
    attachments: 1,
    subtasks: { completed: 5, total: 5 },
    dependencies: [1],
    blocked: false,
    timeSpent: 16,
    tags: ["Backend", "API"],
    startTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    executionTime: 72,
    estimatedCompletionDate: new Date(2024, 1, 28), // Data no passado para mostrar atraso
    projectId: "sistema-ecommerce"
  },
  {
    id: 4,
    title: "Testes unitários",
    description: "Escrever testes para todos os componentes críticos",
    column: "done",
    priority: "Baixa",
    assignee: { name: "João Silva", avatar: "/placeholder.svg" },
    attachments: 0,
    subtasks: { completed: 3, total: 3 },
    dependencies: [],
    blocked: false,
    timeSpent: 12,
    tags: ["QA", "Testes"],
    startTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    completedTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    executionTime: 96,
    estimatedCompletionDate: new Date(2024, 2, 10),
    projectId: "sistema-ecommerce"
  },
  {
    id: 5,
    title: "Interface do usuário",
    description: "Desenvolver componentes de interface para o app mobile",
    column: "in-progress",
    priority: "Alta",
    assignee: { name: "Ana Costa", avatar: "/placeholder.svg" },
    attachments: 3,
    subtasks: { completed: 1, total: 6 },
    dependencies: [],
    blocked: false,
    timeSpent: 24,
    tags: ["Mobile", "UI"],
    startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    executionTime: 168,
    estimatedCompletionDate: new Date(2024, 3, 5),
    projectId: "app-mobile"
  },
  {
    id: 6,
    title: "Configuração do banco de dados",
    description: "Setup inicial do banco de dados para analytics",
    column: "todo",
    priority: "Média",
    assignee: { name: "Carlos Lima", avatar: "/placeholder.svg" },
    attachments: 1,
    subtasks: { completed: 0, total: 2 },
    dependencies: [],
    blocked: false,
    timeSpent: 0,
    tags: ["Database", "Analytics"],
    executionTime: 0,
    estimatedCompletionDate: new Date(2024, 3, 20),
    projectId: "dashboard-analytics"
  }
];
