
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCardsByProject } from '@/utils/kanbanUtils';
import { mockCards } from '@/utils/kanbanUtils';

interface CycleTimeChartProps {
  projectId: string;
}

const COLORS = {
  'todo': '#94a3b8',
  'in-progress': '#3b82f6', 
  'review': '#f59e0b',
  'done': '#10b981'
};

const STATUS_LABELS = {
  'todo': 'A Fazer',
  'in-progress': 'Em Andamento',
  'review': 'Em Revisão', 
  'done': 'Concluído'
};

export function CycleTimeChart({ projectId }: CycleTimeChartProps) {
  const projectCards = getCardsByProject(mockCards, projectId);
  
  const statusCounts = projectCards.reduce((acc, card) => {
    acc[card.column] = (acc[card.column] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(statusCounts).map(([status, count]) => ({
    name: STATUS_LABELS[status as keyof typeof STATUS_LABELS] || status,
    value: count,
    percentage: projectCards.length > 0 ? ((count / projectCards.length) * 100).toFixed(1) : '0',
    color: COLORS[status as keyof typeof COLORS] || '#gray'
  }));

  const renderCustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-gray-600">
            {data.value} cards ({data.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const renderCustomLabel = ({ percentage }: any) => {
    return `${percentage}%`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Tempo de Ciclo - Distribuição por Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={renderCustomTooltip} />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value, entry) => (
                  <span style={{ color: entry.color }}>
                    {value} ({entry.payload?.value} cards)
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium text-gray-700">Total de Cards</p>
            <p className="text-2xl font-bold">{projectCards.length}</p>
          </div>
          <div>
            <p className="font-medium text-gray-700">Taxa de Conclusão</p>
            <p className="text-2xl font-bold text-green-600">
              {projectCards.length > 0 ? 
                ((statusCounts['done'] || 0) / projectCards.length * 100).toFixed(1) : 0}%
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
