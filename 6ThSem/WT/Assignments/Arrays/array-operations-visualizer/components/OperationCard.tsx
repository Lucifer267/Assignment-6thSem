
import React from 'react';

interface OperationCardProps {
  title: string;
  children: React.ReactNode;
  icon: React.ReactNode;
}

export const OperationCard: React.FC<OperationCardProps> = ({ title, children, icon }) => {
  return (
    <div className="bg-slate-800/50 rounded-lg shadow-lg backdrop-blur-sm border border-slate-700 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="text-blue-400 mr-3">{icon}</div>
          <h2 className="text-2xl font-semibold text-slate-200">{title}</h2>
        </div>
        <div className="space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
};
