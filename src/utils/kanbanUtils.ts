
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
  { id: "todo", title: "A Fazer", color: "bg-blue-50 border-blue-200", headerColor: "bg-blue-100" },
  { id: "in-progress", title: "Em Andamento", color: "bg-amber-50 border-amber-200", headerColor: "bg-amber-100" },
  { id: "review", title: "Em Revisão", color: "bg-purple-50 border-purple-200", headerColor: "bg-purple-100" },
  { id: "done", title: "Concluído", color: "bg-green-50 border-green-200", headerColor: "bg-green-100" }
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
