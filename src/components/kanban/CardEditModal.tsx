
import { useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { X, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { Card } from "@/utils/kanbanUtils";

interface CardEditModalProps {
  card: Card | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedCard: Card) => void;
}

export function CardEditModal({ card, isOpen, onClose, onSave }: CardEditModalProps) {
  const [newTag, setNewTag] = useState("");

  const form = useForm({
    defaultValues: {
      title: card?.title || "",
      description: card?.description || "",
      priority: card?.priority || "Média",
      assigneeName: card?.assignee.name || "",
      attachments: card?.attachments || 0,
      subtasksCompleted: card?.subtasks.completed || 0,
      subtasksTotal: card?.subtasks.total || 0,
      timeSpent: card?.timeSpent || 0,
      executionTime: card?.executionTime || 0,
    },
  });

  if (!card) return null;

  const handleSave = (data: any) => {
    const updatedCard: Card = {
      ...card,
      title: data.title,
      description: data.description,
      priority: data.priority,
      assignee: {
        ...card.assignee,
        name: data.assigneeName,
      },
      attachments: Number(data.attachments),
      subtasks: {
        completed: Number(data.subtasksCompleted),
        total: Number(data.subtasksTotal),
      },
      timeSpent: Number(data.timeSpent),
      executionTime: Number(data.executionTime),
    };

    onSave(updatedCard);
    onClose();
  };

  const addTag = () => {
    if (newTag.trim() && card.tags) {
      const updatedCard = {
        ...card,
        tags: [...card.tags, newTag.trim()],
      };
      onSave(updatedCard);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    if (card.tags) {
      const updatedCard = {
        ...card,
        tags: card.tags.filter(tag => tag !== tagToRemove),
      };
      onSave(updatedCard);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Alta": return "bg-red-50 text-red-700 border-red-200";
      case "Média": return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "Baixa": return "bg-green-50 text-green-700 border-green-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Card</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prioridade</FormLabel>
                    <FormControl>
                      <select 
                        {...field} 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Baixa">Baixa</option>
                        <option value="Média">Média</option>
                        <option value="Alta">Alta</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                name="assigneeName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Responsável</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="attachments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Anexos</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} min="0" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="subtasksCompleted"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subtarefas Concluídas</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} min="0" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subtasksTotal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total de Subtarefas</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} min="0" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="timeSpent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tempo Gasto (horas)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} min="0" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="executionTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tempo de Execução (horas)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} min="0" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Tags Section */}
            <div className="space-y-3">
              <FormLabel>Tags</FormLabel>
              <div className="flex flex-wrap gap-2 mb-2">
                {card.tags?.map((tag, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1 bg-gray-50">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 text-gray-500 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Nova tag"
                  className="flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Preview Section */}
            <div className="border-t pt-4">
              <FormLabel className="mb-3 block">Preview do Card</FormLabel>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-sm">{form.watch("title") || "Título do card"}</h4>
                  <Badge className={`${getPriorityColor(form.watch("priority"))} text-xs border`}>
                    {form.watch("priority")}
                  </Badge>
                </div>
                
                {form.watch("subtasksTotal") > 0 && (
                  <div className="mb-2">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Subtarefas</span>
                      <span>{form.watch("subtasksCompleted")}/{form.watch("subtasksTotal")}</span>
                    </div>
                    <Progress 
                      value={form.watch("subtasksTotal") > 0 ? (form.watch("subtasksCompleted") / form.watch("subtasksTotal")) * 100 : 0} 
                      className="h-1.5"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={card.assignee.avatar} />
                      <AvatarFallback className="text-xs">
                        {form.watch("assigneeName").split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-gray-600">{form.watch("assigneeName")}</span>
                  </div>
                  
                  {form.watch("timeSpent") > 0 && (
                    <span className="text-xs bg-blue-50 px-2 py-1 rounded text-blue-700">
                      {form.watch("timeSpent")}h
                    </span>
                  )}
                </div>
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
