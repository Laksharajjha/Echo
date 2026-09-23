import React from 'react';
import { motion } from 'framer-motion';

type ProgressBarProps = {
  label: string;
  value: number; // 0.0-1.0
  color?: string;
  showPercent?: boolean;
};

export default function ProgressBar({ label, value, color = 'bg-echo-cyan', showPercent = false }: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, value * 100));

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-medium text-gray-400">{label}</span>
        {showPercent && <span className="text-xs text-gray-500">{Math.round(pct)}%</span>}
      </div>
      <div className="w-full bg-echo-darker rounded-full h-1.5 border border-echo-border overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
