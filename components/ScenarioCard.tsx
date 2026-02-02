import React from 'react';
import { Scenario, Team } from '../types';
import { Database, Zap, Smartphone, Globe, Briefcase, AlertTriangle } from 'lucide-react';

interface ScenarioCardProps {
  scenario: Scenario;
  currentTeam: Team;
  onOptionSelected: (optionId: string) => void;
}

const ScenarioCard: React.FC<ScenarioCardProps> = ({ scenario, currentTeam, onOptionSelected }) => {
  
  const getIcon = () => {
    switch (scenario.iconType) {
      case 'database': return <Database size={48} className="md:w-16 md:h-16 text-emerald-400" />;
      case 'mobile': return <Smartphone size={48} className="md:w-16 md:h-16 text-purple-400" />;
      case 'strategy': return <Zap size={48} className="md:w-16 md:h-16 text-yellow-400" />;
      case 'system': return <Globe size={48} className="md:w-16 md:h-16 text-blue-400" />;
      default: return <Briefcase size={48} className="md:w-16 md:h-16 text-gray-400" />;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto mt-2 md:mt-6 animate-pop pb-8">
      {/* Simulation Header */}
      <div className="flex justify-between items-center mb-2 md:mb-4 px-2 md:px-4">
        <span className="bg-slate-800 text-slate-400 px-2 md:px-4 py-1 rounded-md text-xs md:text-sm font-mono border border-slate-700 truncate max-w-[50%]">
          ID: {scenario.id.toUpperCase()}
        </span>
        <div className="flex items-center gap-2 text-red-400 animate-pulse">
          <AlertTriangle size={16} className="md:w-5 md:h-5" />
          <span className="font-bold tracking-widest uppercase text-xs md:text-base">Action Required</span>
        </div>
      </div>

      {/* Main Briefing Card */}
      <div className="glass-panel rounded-t-2xl md:rounded-t-3xl border-b-0 p-4 md:p-10 shadow-2xl relative overflow-hidden bg-slate-900/80">
        <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-indigo-500 to-purple-600"></div>
        
        <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-start">
          <div className="hidden md:block flex-shrink-0 bg-slate-800 p-6 rounded-xl shadow-inner border border-slate-600">
            {getIcon()}
          </div>
          
          <div className="flex-grow">
            <div className="flex items-center gap-3 mb-4 md:hidden">
                 <div className="bg-slate-800 p-3 rounded-lg border border-slate-600">
                    {getIcon()}
                 </div>
                 <h2 className="text-2xl font-black text-white brand-font leading-tight">
                    {scenario.title}
                 </h2>
            </div>

            <h2 className="hidden md:block text-3xl md:text-5xl font-black text-white mb-6 brand-font leading-tight tracking-tight">
              {scenario.title}
            </h2>
            <div className="bg-slate-800/50 p-4 md:p-6 rounded-xl md:rounded-r-xl border-l-4 border-indigo-500">
              <p className="text-lg md:text-2xl text-slate-200 leading-relaxed font-medium">
                {scenario.prompt}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Decision Interface */}
      <div className="bg-slate-800 rounded-b-2xl md:rounded-b-3xl p-4 md:p-8 border-t border-slate-700 shadow-xl">
        <h3 className="text-slate-400 text-xs md:text-sm font-bold uppercase tracking-widest mb-4 md:mb-6 ml-1">
          Select Strategic Response
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {scenario.options.map((option, index) => (
            <button
              key={option.id}
              onClick={() => onOptionSelected(option.id)}
              className="group relative bg-slate-700 hover:bg-slate-600 border-2 border-slate-600 hover:border-indigo-400 rounded-xl p-4 md:p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-indigo-500/20 flex flex-col h-full min-h-[120px] md:min-h-[180px] text-left"
            >
              <div className="absolute top-2 right-2 md:top-4 md:right-4 opacity-10 group-hover:opacity-100 transition-opacity text-3xl md:text-4xl font-black text-white">
                {String.fromCharCode(65 + index)}
              </div>
              <span className="text-base md:text-xl font-bold text-slate-200 group-hover:text-white leading-snug">
                {option.text}
              </span>
              <div className="mt-auto pt-2 md:pt-4 flex items-center text-xs md:text-sm font-semibold text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-wider">
                Execute Order <Zap size={16} className="ml-1 inline" />
              </div>
            </button>
          ))}
        </div>
      </div>
      
      <div className="mt-4 md:mt-6 text-center">
         <span className="text-slate-400 text-sm md:text-base">Current Decision Authority:</span>
         <span className="ml-2 font-black text-xl md:text-2xl text-white tracking-wide">{currentTeam.name}</span>
      </div>
    </div>
  );
};

export default ScenarioCard;