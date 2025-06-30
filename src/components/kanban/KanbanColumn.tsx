
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Column } from "@/utils/kanbanUtils";

interface KanbanColumnProps {
  column: Column;
  cardsCount: number;
  children: React.ReactNode;
  onAddCard: () => void;
}

export function KanbanColumn({ column, cardsCount, children, onAddCard }: KanbanColumnProps) {
  return (
    <div className={`h-full flex flex-col ${column.color} border rounded-lg`}>
      <CardHeader className={`${column.headerColor} rounded-t-lg border-b flex-shrink-0`}>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-gray-700 flex items-center gap-2">
            {column.title}
            <Badge variant="secondary" className="text-xs">
              {cardsCount}
            </Badge>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onAddCard}
            className="h-6 w-6 p-0 hover:bg-gray-200"
            title="Adicionar novo card"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 p-3 overflow-y-auto">
        {children}
      </CardContent>
    </div>
  );
}
