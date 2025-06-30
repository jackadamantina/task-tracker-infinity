
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface DeleteConfirmationProps {
  showDeleteConfirm: boolean;
  setShowDeleteConfirm: (show: boolean) => void;
  onDelete: () => void;
}

export function DeleteConfirmation({ 
  showDeleteConfirm, 
  setShowDeleteConfirm, 
  onDelete 
}: DeleteConfirmationProps) {
  if (!showDeleteConfirm) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
      <h4 className="text-red-800 font-medium mb-2">Confirmar Exclusão</h4>
      <p className="text-red-700 text-sm mb-3">
        Tem certeza que deseja deletar este card? Esta ação não pode ser desfeita.
      </p>
      <div className="flex gap-2">
        <Button
          variant="destructive"
          size="sm"
          onClick={onDelete}
        >
          Sim, Deletar
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowDeleteConfirm(false)}
        >
          Cancelar
        </Button>
      </div>
    </div>
  );
}
