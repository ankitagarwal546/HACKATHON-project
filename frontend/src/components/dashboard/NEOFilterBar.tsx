import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChevronDown, RotateCw } from 'lucide-react';

export type RiskLevelFilter = 'all' | 'low' | 'medium' | 'high';

interface NEOFilterBarProps {
  startDate: string;
  endDate: string;
  riskLevel: RiskLevelFilter;
  onStartDateChange: (v: string) => void;
  onEndDateChange: (v: string) => void;
  onRiskLevelChange: (v: RiskLevelFilter) => void;
  onApply: () => void;
  onRefresh: () => void;
  loading?: boolean;
}

export function NEOFilterBar({
  startDate,
  endDate,
  riskLevel,
  onStartDateChange,
  onEndDateChange,
  onRiskLevelChange,
  onApply,
  onRefresh,
  loading,
}: NEOFilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 p-4 rounded-xl bg-black/40 border border-white/10">
      <div className="flex items-center gap-2">
        <label className="text-xs font-mono text-gray-400 uppercase tracking-wider whitespace-nowrap">
          Start Date
        </label>
        <Input
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          className="w-[140px] h-9 bg-black/60 border-white/10 text-white font-mono text-sm"
        />
      </div>
      <div className="flex items-center gap-2">
        <label className="text-xs font-mono text-gray-400 uppercase tracking-wider whitespace-nowrap">
          End Date
        </label>
        <Input
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          className="w-[140px] h-9 bg-black/60 border-white/10 text-white font-mono text-sm"
        />
      </div>
      <div className="flex items-center gap-2">
        <label className="text-xs font-mono text-gray-400 uppercase tracking-wider whitespace-nowrap">
          Risk Level
        </label>
        <Select value={riskLevel} onValueChange={(v) => onRiskLevelChange(v as RiskLevelFilter)}>
          <SelectTrigger className="w-[140px] h-9 bg-black/60 border-white/10 text-white font-mono text-sm">
            <SelectValue placeholder="All Levels" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="font-mono">All Levels</SelectItem>
            <SelectItem value="low" className="font-mono">Low</SelectItem>
            <SelectItem value="medium" className="font-mono">Medium</SelectItem>
            <SelectItem value="high" className="font-mono">High</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button
        onClick={onApply}
        disabled={loading}
        className="h-9 px-4 bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/30 font-mono text-xs uppercase tracking-wider"
      >
        <ChevronDown className="w-4 h-4 mr-2 rotate-[-90deg]" />
        Apply Filters
      </Button>
      <Button
        variant="outline"
        onClick={onRefresh}
        disabled={loading}
        className="h-9 px-4 border-white/20 text-gray-400 hover:border-cyan-500/50 hover:text-cyan-400 font-mono text-xs uppercase tracking-wider"
      >
        <RotateCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
        Refresh
      </Button>
    </div>
  );
}
