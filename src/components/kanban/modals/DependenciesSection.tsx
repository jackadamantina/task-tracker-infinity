
import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";
import { Card } from "@/types/kanban";

interface AvailableCard {
  id: number;
  title: string;
  project: string;
}

interface DependenciesSectionProps {
  dependencies: number[];
  setDependencies: (deps: number[]) => void;
  availableCards: AvailableCard[];
  currentCard: Card;
}

export function DependenciesSection({ 
  dependencies, 
  setDependencies, 
  availableCards, 
  currentCard 
}: DependenciesSectionProps) {
  const addDependency = (cardId: string) => {
    const id = parseInt(cardId);
    if (!dependencies.includes(id)) {
      setDependencies([...dependencies, id]);
    }
  };

  const removeDependency = (cardId: number) => {
    setDependencies(dependencies.filter(id => id !== cardId));
  };

  return (
    <div className="space-y-3">
      <FormLabel>Dependências</FormLabel>
      <p className="text-xs text-gray-500">
        Selecione cards que devem ser concluídos antes deste card
      </p>
      <div className="space-y-2 max-h-32 overflow-y-auto">
        {dependencies.map(depId => {
          const depCard = availableCards.find(c => c.id === depId);
          if (!depCard) return null;
          return (
            <div key={depId} className="flex items-center gap-2 p-2 border rounded text-sm">
              <span className="flex-1">{depCard.title}</span>
              <span className="text-xs text-gray-500">({depCard.project})</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeDependency(depId)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          );
        })}
      </div>
      {availableCards.length > 0 ? (
        <Select onValueChange={addDependency}>
          <SelectTrigger>
            <SelectValue placeholder="Adicionar dependência" />
          </SelectTrigger>
          <SelectContent>
            {availableCards.filter(c => !dependencies.includes(c.id)).map(c => (
              <SelectItem key={c.id} value={c.id.toString()}>
                <div className="flex flex-col items-start">
                  <span>{c.title}</span>
                  <span className="text-xs text-gray-500">Projeto: {c.project}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <p className="text-xs text-gray-500 italic">
          Nenhum outro card disponível
        </p>
      )}
    </div>
  );
}
