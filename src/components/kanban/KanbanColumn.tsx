
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, MoreHorizontal } from "lucide-react";
import { KanbanCard } from "./KanbanCard";

interface Column {
  id: string;
  title: string;
  color: string;
  headerColor: string;
}

interface Card {
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

interface KanbanColumnProps {
  column: Column;
  cards: Card[];
}

export function KanbanColumn({ column, cards }: KanbanColumnProps) {
  return (
    <div className="flex flex-col bg-white rounded-lg shadow-sm border border-gray-200">
      <div className={`${column.headerColor} rounded-t-lg p-4 border-b border-gray-200`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold text-gray-900 text-sm">{column.title}</h3>
            <Badge variant="outline" className="text-xs font-medium bg-gray-100 text-gray-600 border-gray-300">
              {cards.length}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100 rounded-md">
              <Plus className="h-4 w-4 text-gray-500" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100 rounded-md">
              <MoreHorizontal className="h-4 w-4 text-gray-500" />
            </Button>
          </div>
        </div>
      </div>
      
      <div className={`flex-1 ${column.color} rounded-b-lg p-4 space-y-3`}>
        {cards.map((card) => (
          <KanbanCard key={card.id} card={card} />
        ))}
        
        <Button 
          variant="ghost" 
          className="w-full h-10 border-2 border-dashed border-gray-300 hover:border-gray-400 text-gray-500 hover:text-gray-600 hover:bg-gray-50 transition-colors duration-200 font-medium text-sm rounded-lg"
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Card
        </Button>
      </div>
    </div>
  );
}
