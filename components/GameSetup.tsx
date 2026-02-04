import React, { useState } from 'react';
import { Users, MonitorPlay } from 'lucide-react';

interface GameSetupProps {
  onStartGame: (teamNames: string[]) => void;
}

const GameSetup: React.FC<GameSetupProps> = ({ onStartGame }) => {
  const [teamCount, setTeamCount] = useState<2 | 4>(2);
  const [names, setNames] = useState<string[]>(['Team Alpha', 'Team Beta', 'Team Gamma', 'Team Delta']);

  const handleNameChange = (index: number, value: string) => {
    const newNames = [...names];
    newNames[index] = value;
    setNames(newNames);
  };

  const handleStart = () => {
    onStartGame(names.slice(0, teamCount));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 overflow-y-auto">
      <div className="max-w-3xl w-full bg-slate-800 border border-slate-700 rounded-3xl p-6 md:p-10 shadow-2xl my-10 md:my-0">
        <div className="text-center mb-6 md:mb-10">
          <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 mb-2 md:mb-4 brand-font">
            TEAM DUEL
          </h1>
          <p className="text-base md:text-xl text-slate-400">Business Information Systems Simulation</p>
        </div>

        <div className="mb-8 md:mb-10">
          <label className="block text-slate-300 text-base md:text-lg mb-4 font-bold uppercase tracking-wider">Select Mode</label>
          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            <button 
              onClick={() => setTeamCount(2)}
              className={`flex-1 p-4 md:p-6 rounded-xl border-2 flex flex-col items-center gap-2 md:gap-3 transition-all ${teamCount === 2 ? 'bg-indigo-600 border-indigo-400 shadow-lg scale-[1.02] md:scale-105' : 'bg-slate-700 border-slate-600 hover:bg-slate-600'}`}
            >
              <Users size={24} className="md:w-8 md:h-8" />
              <span className="text-lg md:text-xl font-bold">Quick Duel (2 Teams)</span>
            </button>
            <button 
              onClick={() => setTeamCount(4)}
              className={`flex-1 p-4 md:p-6 rounded-xl border-2 flex flex-col items-center gap-2 md:gap-3 transition-all ${teamCount === 4 ? 'bg-indigo-600 border-indigo-400 shadow-lg scale-[1.02] md:scale-105' : 'bg-slate-700 border-slate-600 hover:bg-slate-600'}`}
            >
              <div className="flex gap-1"><Users size={20} className="md:w-6 md:h-6" /><Users size={20} className="md:w-6 md:h-6" /></div>
              <span className="text-lg md:text-xl font-bold">Squad Battle (4 Teams)</span>
            </button>
          </div>
        </div>

        <div className="mb-8 md:mb-10">
          <label className="block text-slate-300 text-base md:text-lg mb-4 font-bold uppercase tracking-wider">Team Names</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: teamCount }).map((_, i) => (
              <div key={i} className="flex flex-col">
                <span className="text-xs md:text-sm text-slate-400 mb-1 ml-1">Team {i + 1}</span>
                <input
                  type="text"
                  value={names[i]}
                  onChange={(e) => handleNameChange(i, e.target.value)}
                  className="bg-slate-900 border-2 border-slate-700 rounded-lg p-3 md:p-4 text-lg md:text-xl text-white focus:border-indigo-500 focus:outline-none transition-colors"
                  placeholder={`Enter name for Team ${i + 1}`}
                />
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleStart}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xl md:text-2xl font-bold py-4 md:py-6 rounded-xl shadow-lg transform transition hover:scale-[1.02] flex items-center justify-center gap-3"
        >
          <MonitorPlay size={24} className="md:w-8 md:h-8" />
          Initialize Simulation
        </button>
      </div>
    </div>
  );
};

export default GameSetup;