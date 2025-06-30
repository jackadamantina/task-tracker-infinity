
import { Column } from '@/types/kanban';

export const defaultColumns: Column[] = [
  { id: "todo", title: "A Fazer", color: "bg-white border-gray-200", headerColor: "bg-gray-50" },
  { id: "in-progress", title: "Em Andamento", color: "bg-white border-gray-200", headerColor: "bg-gray-50" },
  { id: "review", title: "Em Revisão", color: "bg-white border-gray-200", headerColor: "bg-gray-50" },
  { id: "done", title: "Concluído", color: "bg-white border-gray-200", headerColor: "bg-gray-50" }
];
