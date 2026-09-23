import React from 'react';

type BadgeProps = {
  children: React.ReactNode;
  variant?: 'cyan' | 'amber' | 'green' | 'red' | 'gray';
  className?: string;
};

export default function Badge({ children, variant = 'gray', className = '' }: BadgeProps) {
  const colors = {
    cyan: 'bg-echo-cyan/10 text-echo-cyan border-echo-cyan/20',
    amber: 'bg-echo-amber/10 text-echo-amber border-echo-amber/20',
    green: 'bg-green-500/10 text-green-400 border-green-500/20',
    red: 'bg-red-500/10 text-red-400 border-red-500/20',
    gray: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${colors[variant]} ${className}`}>
      {children}
    </span>
  );
}
