
interface ProjectHeaderProps {
  currentProject: { id: string; name: string; description: string } | undefined;
  userRole: 'admin' | 'user';
}

export function ProjectHeader({ currentProject, userRole }: ProjectHeaderProps) {
  return (
    <div className="bg-white rounded-lg border p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
        <h2 className="text-xl font-semibold text-gray-900">
          Projeto: {currentProject?.name || 'Projeto não encontrado'}
        </h2>
        {userRole === 'admin' && (
          <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
            Administrador
          </span>
        )}
      </div>
      <p className="text-gray-600 mt-1 text-sm">
        {currentProject?.description || 'Descrição não disponível'}
      </p>
    </div>
  );
}
