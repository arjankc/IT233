import React, { useEffect, useState } from 'react';
import { Team } from '../types';
import { TEAM_COLORS, INITIAL_KPIs } from '../constants';
import { TrendingUp } from 'lucide-react';
import Sparkline from './Sparkline';

interface ScoreBoardProps {
  teams: Team[];
  currentTeamIndex: number;
}

// Calculate initial score based on constants for net change calculation
const INITIAL_SCORE = Math.floor(INITIAL_KPIs.revenue + INITIAL_KPIs.innovation - (INITIAL_KPIs.risk * 1.5));

const TeamScoreDisplay: React.FC<{ team: Team; isActive: boolean }> = ({ team, isActive }) => {
  const [highlight, setHighlight] = useState(false);
  const [prevScore, setPrevScore] = useState(team.score);
  const [delta, setDelta] = useState<number | null>(null);
  const color = TEAM_COLORS[team.id % TEAM_COLORS.length];

  // Calculate Net Change
  const netChange = team.score - INITIAL_SCORE;
  const isPositive = netChange >= 0;

  useEffect(() => {
    if (team.score !== prevScore) {
      const diff = team.score - prevScore;
      setDelta(diff);
      setHighlight(true);
      
      const highlightTimer = setTimeout(() => setHighlight(false), 1000); 
      const deltaTimer = setTimeout(() => setDelta(null), 1500); // Clear delta after animation

      setPrevScore(team.score);
      
      return () => {
        clearTimeout(highlightTimer);
        clearTimeout(deltaTimer);
      };
    }
  }, [team.score, prevScore]);

  return (
    <div 
      className={`
        relative flex-1 p-1 md:p-3 rounded-lg md:rounded-xl border-2 transition-all duration-300 overflow-visible min-w-0
        ${isActive ? `${color.border} scale-[1.02] md:scale-105 bg-slate-800 shadow-[0_0_15px_rgba(0,0,0,0.6)] z-10` : 'border-slate-600 bg-slate-800/80 opacity-70 hover:opacity-100'}
      `}
    >
      {isActive && (
        <div className="absolute -top-2 md:-top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[8px] md:text-[10px] uppercase tracking-widest font-bold px-1.5 py-0.5 md:px-3 md:py-1 rounded-full shadow-lg whitespace-nowrap z-20">
          Active
        </div>
      )}
      
      <div className="flex flex-col relative z-10">
        {/* Floating Delta Animation */}
        {delta !== null && (
          <div 
            key={Date.now()} // Force re-render for animation restart if rapid updates
            className={`absolute -top-6 md:-top-8 right-0 left-0 text-center text-lg md:text-2xl font-black animate-float-up z-50 pointer-events-none drop-shadow-md ${delta >= 0 ? 'text-emerald-400' : 'text-red-500'}`}
          >
            {delta >= 0 ? '+' : ''}{delta}
          </div>
        )}

        {/* Header */}
        <div className="flex justify-between items-start mb-0.5 md:mb-1">
          <span className={`text-[9px] md:text-xs font-bold truncate uppercase tracking-wider ${isActive ? 'text-white' : 'text-slate-400'} max-w-[70%]`}>
            {team.name}
          </span>
          <span className={`text-[8px] md:text-[10px] font-mono ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
            {isPositive ? '+' : ''}{netChange}%
          </span>
        </div>

        {/* Main Score */}
        <div className="flex items-baseline gap-0.5 md:gap-1 mb-0.5 md:mb-2">
            <span className="text-slate-400 font-serif text-[10px] md:text-sm">$</span>
            <span 
            className={`
                text-xl md:text-3xl font-black brand-font transition-all duration-500 transform block leading-none
                ${highlight ? 'scale-110 text-emerald-300 drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]' : 'text-white'}
            `}
            >
            {team.score}
            </span>
            <span className="text-[8px] md:text-[10px] text-slate-400 font-bold">M</span>
        </div>

        {/* Graph - Smaller on mobile */}
        <div className="h-6 md:h-10 w-full mt-1">
          <Sparkline history={team.history} width={120} height={40} />
        </div>
      </div>
    </div>
  );
};

const ScoreBoard: React.FC<ScoreBoardProps> = ({ teams, currentTeamIndex }) => {
  return (
    <div className="w-full bg-slate-900/95 backdrop-blur-md border-b border-slate-700 p-1 md:p-2 shadow-2xl relative md:sticky md:top-0 z-40">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-1 md:mb-3 px-1 md:px-2">
            <div className="flex items-center gap-1.5 md:gap-2">
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-emerald-500 rounded-full animate-ping"></div>
              <span className="text-slate-400 text-[9px] md:text-xs font-mono uppercase tracking-widest">Global Market Ticker</span>
            </div>
            <div className="flex items-center gap-1 md:gap-2 text-emerald-500 text-[9px] md:text-xs font-bold bg-emerald-500/10 px-1.5 py-0.5 md:px-2 md:py-1 rounded border border-emerald-500/20">
                <TrendingUp size={12} className="md:w-3.5 md:h-3.5" /> MARKET LIVE
            </div>
        </div>
        <div className="flex justify-around items-stretch gap-1 md:gap-4">
            {teams.map((team, index) => (
            <TeamScoreDisplay 
                key={team.id} 
                team={team} 
                isActive={index === currentTeamIndex} 
            />
            ))}
        </div>
      </div>
    </div>
  );
};

export default ScoreBoard;