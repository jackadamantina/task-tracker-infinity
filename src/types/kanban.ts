
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
