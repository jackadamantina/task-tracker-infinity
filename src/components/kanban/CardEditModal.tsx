
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Calendar } from "lucide-react";
import { useForm } from "react-hook-form";
import { Card } from "@/types/kanban";
import { DeleteConfirmation } from "./modals/DeleteConfirmation";
import { TagsSection } from "./modals/TagsSection";
import { SubtasksSection } from "./modals/SubtasksSection";
import { DependenciesSection } from "./modals/DependenciesSection";
import { AttachmentsSection } from "./modals/AttachmentsSection";
import { useSystemUsers } from "@/hooks/useSystemUsers";
import { useSupabaseKanban } from "@/hooks/useSupabaseKanban";

interface CardEditModalProps {
  card: Card | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedCard: Card) => void;
  onDelete?: (cardId: number) => void;
}

interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

const availableTags = ["Backend", "Frontend", "API", "Design", "Segurança", "Mobile", "QA", "Testes", "Database", "Analytics"];

export function CardEditModal({ card, isOpen, onClose, onSave, onDelete }: CardEditModalProps) {
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [dependencies, setDependencies] = useState<number[]>([]);
  const [isAdmin] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { users } = useSystemUsers();
  const { cards: allCards } = useSupabaseKanban();

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      priority: "Média",
      assigneeId: "",
      estimatedCompletionDate: "",
    },
  });

  // Get current date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (card) {
      form.reset({
        title: card.title,
        description: card.description,
        priority: card.priority,
        assigneeId: card.assignee.name,
        estimatedCompletionDate: card.estimatedCompletionDate ? 
          card.estimatedCompletionDate.toISOString().split('T')[0] : "",
      });
      setSelectedTags(card.tags || []);
      setDependencies(card.dependencies || []);
      
      // Inicializar subtarefas baseado nos dados do card
      const initialSubtasks = Array.from({ length: card.subtasks.total }, (_, i) => ({
        id: `subtask-${i}`,
        title: `Subtarefa ${i + 1}`,
        completed: i < card.subtasks.completed
      }));
      setSubtasks(initialSubtasks);
    }
  }, [card, form]);

  if (!card) return null;

  const handleSave = (data: any) => {
    const selectedUser = users.find(u => u.name === data.assigneeId);
    
    const updatedCard: Card = {
      ...card,
      title: data.title,
      description: data.description,
      priority: data.priority,
      assignee: {
        name: selectedUser?.name || data.assigneeId || "Não atribuído",
        avatar: selectedUser?.avatar || "/placeholder.svg",
      },
      tags: selectedTags,
      dependencies: dependencies,
      attachments: uploadedFiles.length,
      subtasks: {
        completed: subtasks.filter(s => s.completed).length,
        total: subtasks.length,
      },
      estimatedCompletionDate: data.estimatedCompletionDate ? new Date(data.estimatedCompletionDate) : undefined,
    };

    onSave(updatedCard);
    onClose();
  };

  const handleDelete = () => {
    if (onDelete && card) {
      onDelete(card.id);
      setShowDeleteConfirm(false);
      onClose();
    }
  };

  // Converter cards do Supabase para o formato esperado pelas dependências
  const availableCards = allCards.map(supabaseCard => ({
    id: parseInt(supabaseCard.id, 10) || Date.now(),
    title: supabaseCard.title,
    project: supabaseCard.project?.name || "Sem projeto"
  })).filter(c => c.id !== card.id);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Editar Card</DialogTitle>
            {isAdmin && onDelete && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Deletar Card
              </Button>
            )}
          </div>
        </DialogHeader>

        <DeleteConfirmation
          showDeleteConfirm={showDeleteConfirm}
          setShowDeleteConfirm={setShowDeleteConfirm}
          onDelete={handleDelete}
        />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Coluna Esquerda */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={!isAdmin} />
                      </FormControl>
                      {!isAdmin && <p className="text-xs text-gray-500">Apenas administradores podem editar o título</p>}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea {...field} className="min-h-[100px]" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prioridade</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a prioridade" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Baixa">Baixa</SelectItem>
                            <SelectItem value="Média">Média</SelectItem>
                            <SelectItem value="Alta">Alta</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="assigneeId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Responsável</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um responsável" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {users.map(user => (
                              <SelectItem key={user.id} value={user.name}>
                                {user.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="estimatedCompletionDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data Estimada de Conclusão</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <Input 
                            type="date" 
                            {...field} 
                            min={today}
                            className="flex-1"
                          />
                        </div>
                      </FormControl>
                      <p className="text-xs text-gray-500">Não é possível selecionar datas passadas</p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <TagsSection
                  selectedTags={selectedTags}
                  setSelectedTags={setSelectedTags}
                  availableTags={availableTags}
                />
              </div>

              {/* Coluna Direita */}
              <div className="space-y-4">
                <SubtasksSection
                  subtasks={subtasks}
                  setSubtasks={setSubtasks}
                />

                <DependenciesSection
                  dependencies={dependencies}
                  setDependencies={setDependencies}
                  availableCards={availableCards}
                  currentCard={card}
                />

                <AttachmentsSection
                  uploadedFiles={uploadedFiles}
                  setUploadedFiles={setUploadedFiles}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">
                Salvar Alterações
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
