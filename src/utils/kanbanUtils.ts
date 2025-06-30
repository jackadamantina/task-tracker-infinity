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
}

export interface Column {
  id: string;
  title: string;
  color: string;
  headerColor: string;
}

export const getCardsByColumn = (cards: Card[], columnId: string): Card[] => {
  return cards.filter(card => card.column === columnId);
};

export const mockProjects = ["Sistema E-commerce", "App Mobile", "Dashboard Analytics"];

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
    executionTime: 0
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
    startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 dias atrás
    executionTime: 48
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
    executionTime: 72
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
    executionTime: 96
  }
];
