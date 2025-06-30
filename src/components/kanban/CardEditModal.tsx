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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Plus, Upload, Trash2, Calendar } from "lucide-react";
import { useForm } from "react-hook-form";
import { Card, mockCards } from "@/data/mockCards";

interface CardEditModalProps {
  card: Card | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedCard: Card) => void;
}

interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

const mockTeamMembers = [
  { id: "1", name: "João Silva", avatar: "/placeholder.svg" },
  { id: "2", name: "Maria Santos", avatar: "/placeholder.svg" },
  { id: "3", name: "Pedro Costa", avatar: "/placeholder.svg" },
  { id: "4", name: "Ana Costa", avatar: "/placeholder.svg" },
  { id: "5", name: "Carlos Lima", avatar: "/placeholder.svg" },
];

const availableTags = ["Backend", "Frontend", "API", "Design", "Segurança", "Mobile", "QA", "Testes", "Database", "Analytics"];

export function CardEditModal({ card, isOpen, onClose, onSave }: CardEditModalProps) {
  const [newTag, setNewTag] = useState("");
  const [newSubtask, setNewSubtask] = useState("");
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [dependencies, setDependencies] = useState<number[]>([]);
  const [isAdmin] = useState(true);

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      priority: "Média",
      assigneeId: "",
      estimatedCompletionDate: "",
    },
  });

  // Obter a data atual no formato YYYY-MM-DD
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
    const selectedMember = mockTeamMembers.find(m => m.name === data.assigneeId) || mockTeamMembers[0];
    
    const updatedCard: Card = {
      ...card,
      title: data.title,
      description: data.description,
      priority: data.priority,
      assignee: {
        name: selectedMember.name,
        avatar: selectedMember.avatar,
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

  const addTag = (tag: string) => {
    if (tag.trim() && !selectedTags.includes(tag.trim())) {
      setSelectedTags([...selectedTags, tag.trim()]);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
  };

  const addSubtask = () => {
    if (newSubtask.trim()) {
      setSubtasks([...subtasks, {
        id: Date.now().toString(),
        title: newSubtask.trim(),
        completed: false
      }]);
      setNewSubtask("");
    }
  };

  const toggleSubtask = (id: string) => {
    setSubtasks(subtasks.map(s => 
      s.id === id ? { ...s, completed: !s.completed } : s
    ));
  };

  const removeSubtask = (id: string) => {
    setSubtasks(subtasks.filter(s => s.id !== id));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles([...uploadedFiles, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const addDependency = (cardId: string) => {
    const id = parseInt(cardId);
    if (!dependencies.includes(id)) {
      setDependencies([...dependencies, id]);
    }
  };

  const removeDependency = (cardId: number) => {
    setDependencies(dependencies.filter(id => id !== cardId));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Alta": return "bg-red-50 text-red-700 border-red-200";
      case "Média": return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "Baixa": return "bg-green-50 text-green-700 border-green-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const availableCards = mockCards.filter(c => c.id !== card.id);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Card</DialogTitle>
        </DialogHeader>

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
                            {mockTeamMembers.map(member => (
                              <SelectItem key={member.id} value={member.name}>
                                {member.name}
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

                {/* Tags */}
                <div className="space-y-3">
                  <FormLabel>Tags</FormLabel>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {selectedTags.map((tag, index) => (
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
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Nova tag"
                      className="flex-1"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag(newTag), setNewTag(""))}
                    />
                    <Button type="button" onClick={() => { addTag(newTag); setNewTag(""); }} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {availableTags.filter(tag => !selectedTags.includes(tag)).map(tag => (
                      <Badge 
                        key={tag} 
                        variant="outline" 
                        className="cursor-pointer hover:bg-blue-50 text-xs"
                        onClick={() => addTag(tag)}
                      >
                        + {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Coluna Direita */}
              <div className="space-y-4">
                {/* Subtarefas */}
                <div className="space-y-3">
                  <FormLabel>Subtarefas</FormLabel>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {subtasks.map(subtask => (
                      <div key={subtask.id} className="flex items-center gap-2 p-2 border rounded">
                        <input
                          type="checkbox"
                          checked={subtask.completed}
                          onChange={() => toggleSubtask(subtask.id)}
                          className="rounded"
                        />
                        <span className={`flex-1 text-sm ${subtask.completed ? 'line-through text-gray-500' : ''}`}>
                          {subtask.title}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSubtask(subtask.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newSubtask}
                      onChange={(e) => setNewSubtask(e.target.value)}
                      placeholder="Nova subtarefa"
                      className="flex-1"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSubtask())}
                    />
                    <Button type="button" onClick={addSubtask} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Dependências */}
                <div className="space-y-3">
                  <FormLabel>Dependências</FormLabel>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {dependencies.map(depId => {
                      const depCard = availableCards.find(c => c.id === depId);
                      if (!depCard) return null;
                      return (
                        <div key={depId} className="flex items-center gap-2 p-2 border rounded text-sm">
                          <span className="flex-1">{depCard.title}</span>
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
                  <Select onValueChange={addDependency}>
                    <SelectTrigger>
                      <SelectValue placeholder="Adicionar dependência" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCards.filter(c => !dependencies.includes(c.id)).map(c => (
                        <SelectItem key={c.id} value={c.id.toString()}>
                          {c.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Arquivos */}
                <div className="space-y-3">
                  <FormLabel>Anexos</FormLabel>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 border rounded text-sm">
                        <span className="flex-1">{file.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                      accept="image/*,.pdf,.doc,.docx,.txt"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('file-upload')?.click()}
                      className="w-full"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Adicionar Arquivos
                    </Button>
                  </div>
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
