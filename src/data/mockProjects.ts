
import { Project } from '@/types/kanban';

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
