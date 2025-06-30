
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
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
    <div className="flex flex-col">
      <div className={`${column.headerColor} rounded-t-xl p-5 border-b-2 border-amber-200 shadow-md`}>
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-900 text-lg">{column.title}</h3>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="text-sm font-bold bg-white text-amber-700 border border-amber-300">
              {cards.length}
            </Badge>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-white hover:text-amber-700 rounded-full">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <div className={`flex-1 ${column.color} rounded-b-xl p-4 space-y-4 border-2 ${column.color.includes('border') ? '' : 'border-gray-200'} shadow-lg`}>
        {cards.map((card) => (
          <KanbanCard key={card.id} card={card} />
        ))}
        
        {/* Botão para adicionar novo card */}
        <Button 
          variant="dashed" 
          className="w-full h-12 border-2 border-dashed border-amber-300 hover:border-amber-400 text-amber-700 hover:bg-amber-50 transition-all duration-300 font-semibold"
        >
          <Plus className="h-5 w-5 mr-2" />
          Adicionar Card
        </Button>
      </div>
    </div>
  );
}
