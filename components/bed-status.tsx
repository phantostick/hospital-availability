'use client';

import { Progress } from '@/components/ui/progress';

interface BedStatusProps {
  type: string;
  available: number;
  total: number;
}

export function BedStatus({ type, available, total }: BedStatusProps) {
  const percentage = (available / total) * 100;
  
  const getColor = (pct: number) => {
    if (pct > 50) return 'bg-green-500';
    if (pct > 20) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusText = (pct: number) => {
    if (pct > 50) return 'Available';
    if (pct > 20) return 'Limited';
    return 'Critical';
  };

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <p className="text-sm font-medium text-gray-700">{type}</p>
        <span className="text-xs font-semibold text-gray-600">{available}/{total}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full ${getColor(percentage)} transition-all`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-xs text-gray-500">{getStatusText(percentage)}</p>
    </div>
  );
}
