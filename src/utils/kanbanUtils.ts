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
    tags: ["Backend", "Segurança"]
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
    tags: ["Frontend", "Design"]
  },
  {
    id: 3,
    title: "API de produtos",
    description: "Desenvolver endpoints para CRUD de produtos com validações",
    column: "review",
    priority: "Alta",
    assignee: { name: "Pedro Costa", avatar: "/placeholder.svg" },
    attachments: 1,
    subtasks: { completed: 4, total: 5 },
    dependencies: [1],
    blocked: true,
    timeSpent: 16,
    tags: ["Backend", "API"]
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
    tags: ["QA", "Testes"]
  }
];
