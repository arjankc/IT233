import React from 'react';
import { Team } from '../types';
import { Trophy, RefreshCw, Star, Briefcase } from 'lucide-react';
import { TEAM_COLORS } from '../constants';
import Sparkline from './Sparkline';

interface VictoryScreenProps {
  teams: Team[];
  onRestart: () => void;
}

const VictoryScreen: React.FC<VictoryScreenProps> = ({ teams, onRestart }) => {
  // Sort teams by score descending
  const sortedTeams = [...teams].sort((a, b) => b.score - a.score);
  const winner = sortedTeams[0];

  return (
    <div className="min-h-[100dvh] w-full bg-slate-900 flex flex-col p-4 overflow-y-auto">
      <div className="max-w-4xl w-full bg-slate-800 border border-slate-600 rounded-3xl p-6 md:p-12 text-center shadow-2xl relative m-auto">
          {/* Celebration Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-800 via-slate-800 to-indigo-900/50 opacity-50 rounded-3xl pointer-events-none"></div>
          
          <div className="relative z-10">
            <Briefcase size={64} className="md:w-20 md:h-20 text-emerald-400 mx-auto mb-4" />
            
            <h2 className="text-xl md:text-2xl text-slate-300 uppercase tracking-widest font-bold mb-2">Fiscal Year Closed</h2>
            <h1 className="text-4xl md:text-7xl font-black text-white mb-8 brand-font drop-shadow-lg leading-tight">
              {winner.name}<br/>
              <span className="text-2xl md:text-4xl text-emerald-400">Dominates The Market</span>
            </h1>

            <div className="mb-10 text-left">
              <h3 className="text-lg md:text-xl text-slate-400 mb-6 font-bold uppercase tracking-wider border-b border-slate-700 pb-2">Final Market Performance</h3>
              <div className="space-y-6">
                {sortedTeams.map((team, index) => {
                   const color = TEAM_COLORS[team.id % TEAM_COLORS.length];
                   return (
                    <div key={team.id} className="w-full bg-slate-900/80 rounded-2xl border border-slate-700 overflow-hidden shadow-lg hover:border-slate-500 transition-colors">
                        <div className="p-4 md:p-5 flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-800">
                            <div className="flex items-center gap-4 w-full md:w-auto">
                                 {/* Rank Badge */}
                                 <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex-shrink-0 flex items-center justify-center font-black text-lg md:text-xl shadow-inner ${index === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-black' : 'bg-slate-700 text-slate-200'}`}>
                                    #{index + 1}
                                 </div>
                                 <div className="min-w-0 flex-1">
                                    <h3 className={`text-xl md:text-2xl font-bold ${color.text} truncate`}>{team.name}</h3>
                                    <div className="flex items-center gap-2 text-slate-400 text-[10px] md:text-xs font-mono uppercase">
                                        {index === 0 && <Star size={12} className="text-yellow-500 fill-current" />}
                                        Market Cap History
                                    </div>
                                 </div>
                            </div>
                            <div className="text-right w-full md:w-auto flex justify-between md:block items-center">
                                 <span className="md:hidden text-slate-400 font-bold text-xs">FINAL VALUATION</span>
                                 <div>
                                     <div className="text-2xl md:text-3xl font-black text-white tracking-tight">${team.score}M</div>
                                 </div>
                            </div>
                        </div>
                        
                        {/* Chart Area */}
                        <div className="bg-slate-950/50 relative h-20 md:h-24 w-full border-t border-slate-800/50">
                             <Sparkline history={team.history} width={600} height={100} />
                        </div>
                    </div>
                   );
                })}
              </div>
            </div>

            <button
              onClick={onRestart}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-base md:text-lg font-bold py-3 md:py-4 px-8 md:px-12 rounded-full shadow-lg transition-transform hover:scale-105 flex items-center gap-2 mx-auto"
            >
              <RefreshCw size={20} />
              Initialize New Session
            </button>
          </div>
        </div>
    </div>
  );
};

export default VictoryScreen;