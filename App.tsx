import React, { useState, useEffect } from 'react';
import { GamePhase, GameState, Team, Scenario } from './types';
import { SCENARIOS, MAX_ROUNDS, TEAM_COLORS, INITIAL_KPIs } from './constants';
import GameSetup from './components/GameSetup';
import ScoreBoard from './components/ScoreBoard';
import ScenarioCard from './components/ScenarioCard';
import VictoryScreen from './components/VictoryScreen';
import { AlertCircle, CheckCircle, ArrowRight, TrendingUp, TrendingDown, DollarSign, Lightbulb, ShieldAlert, ArrowUp, ArrowDown } from 'lucide-react';

// Fisher-Yates shuffle algorithm
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const calculateMarketValuation = (kpis: { revenue: number, innovation: number, risk: number }) => {
  // Formula: Revenue + Innovation - (Risk * 1.5)
  // Risk is penalized heavily to simulate business danger
  return Math.floor(kpis.revenue + kpis.innovation - (kpis.risk * 1.5));
};

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    phase: GamePhase.SETUP,
    teams: [],
    currentTeamIndex: 0,
    currentScenario: null,
    scenariosPlayed: [],
    roundsConfigured: MAX_ROUNDS,
    currentRound: 1,
    scenarioOrder: [],
    lastFeedback: null,
  });

  // Sound effects helper
  const playSound = (type: 'CORRECT' | 'WRONG' | 'WIN') => {
    // Placeholder for audio logic
  };

  useEffect(() => {
    if (gameState.phase === GamePhase.GAME_OVER) {
      playSound('WIN');
    }
  }, [gameState.phase]);

  const startGame = (teamNames: string[]) => {
    const newTeams: Team[] = teamNames.map((name, index) => ({
      id: index,
      name,
      kpis: { ...INITIAL_KPIs },
      score: calculateMarketValuation(INITIAL_KPIs),
      color: TEAM_COLORS[index].name,
      history: []
    }));

    const shuffledIds = shuffleArray(SCENARIOS).map(s => s.id);

    // Dynamic Round Calculation for ~20 minute gameplay
    // Target: ~12 turns total.
    // 2 Teams = 6 Rounds
    // 4 Teams = 3 Rounds
    const numTeams = teamNames.length;
    const calculatedRounds = numTeams === 4 ? 3 : 6;

    setGameState(prev => ({
      ...prev,
      phase: GamePhase.INTRO,
      teams: newTeams,
      currentTeamIndex: 0,
      currentRound: 1,
      scenariosPlayed: [],
      scenarioOrder: shuffledIds,
      roundsConfigured: calculatedRounds,
    }));

    setTimeout(() => {
        nextTurn(0);
    }, 1500);
  };

  const nextTurn = (nextIndex: number) => {
    setGameState(prev => {
        const { scenarioOrder, scenariosPlayed, currentRound, phase, roundsConfigured } = prev;
        const isNewRound = nextIndex === 0 && phase !== GamePhase.INTRO; 
        const nextRound = isNewRound ? currentRound + 1 : currentRound;

        if (scenariosPlayed.length >= scenarioOrder.length || nextRound > roundsConfigured) {
            return { ...prev, phase: GamePhase.GAME_OVER };
        }

        const nextScenarioId = scenarioOrder[scenariosPlayed.length];
        const selectedScenario = SCENARIOS.find(s => s.id === nextScenarioId) || null;

        if (!selectedScenario) {
             return { ...prev, phase: GamePhase.GAME_OVER };
        }

        return {
            ...prev,
            phase: GamePhase.PLAYING,
            currentTeamIndex: nextIndex,
            currentScenario: selectedScenario,
            currentRound: nextRound,
            lastFeedback: null
        };
    });
  };

  const handleOptionSelected = (optionId: string) => {
    const { currentScenario, teams, currentTeamIndex, scenariosPlayed } = gameState;
    if (!currentScenario) return;

    const selectedOption = currentScenario.options.find(o => o.id === optionId);
    if (!selectedOption) return;

    // Create a deep copy of the current team to ensure immutability
    const updatedTeams = [...teams];
    const teamToUpdate = updatedTeams[currentTeamIndex];
    
    // Create new object references
    const updatedTeam = {
        ...teamToUpdate,
        kpis: { ...teamToUpdate.kpis },
        history: [...teamToUpdate.history] 
    };

    // Update KPIs
    updatedTeam.kpis.revenue += selectedOption.impact.revenue;
    updatedTeam.kpis.innovation += selectedOption.impact.innovation;
    updatedTeam.kpis.risk = Math.max(0, updatedTeam.kpis.risk + selectedOption.impact.risk); // Risk cannot be negative
    
    // Recalculate Total Score
    const oldScore = updatedTeam.score;
    updatedTeam.score = calculateMarketValuation(updatedTeam.kpis);
    const scoreChange = updatedTeam.score - oldScore;

    updatedTeam.history.push({
        scenarioTitle: currentScenario.title,
        change: scoreChange
    });

    // Replace the team in the array
    updatedTeams[currentTeamIndex] = updatedTeam;

    // Determine if "Good" or "Bad" outcome for sound
    const isPositive = scoreChange >= 0;
    playSound(isPositive ? 'CORRECT' : 'WRONG');

    setGameState(prev => ({
        ...prev,
        phase: GamePhase.FEEDBACK,
        teams: updatedTeams,
        scenariosPlayed: [...scenariosPlayed, currentScenario.id],
        lastFeedback: {
            impact: selectedOption.impact,
            totalChange: scoreChange,
            feedbackText: selectedOption.feedback
        }
    }));
  };

  const handleNextTeam = () => {
      const nextIndex = (gameState.currentTeamIndex + 1) % gameState.teams.length;
      nextTurn(nextIndex);
  };

  const resetGame = () => {
    setGameState({
        phase: GamePhase.SETUP,
        teams: [],
        currentTeamIndex: 0,
        currentScenario: null,
        scenariosPlayed: [],
        roundsConfigured: MAX_ROUNDS, // Default, will be recalculated in startGame
        currentRound: 1,
        scenarioOrder: [],
        lastFeedback: null,
    });
  };

  // --- RENDER ---

  if (gameState.phase === GamePhase.SETUP) {
    return <GameSetup onStartGame={startGame} />;
  }

  if (gameState.phase === GamePhase.GAME_OVER) {
    return <VictoryScreen teams={gameState.teams} onRestart={resetGame} />;
  }

  return (
    <div className="h-screen bg-slate-900 flex flex-col relative overflow-y-auto overflow-x-hidden">
      <ScoreBoard teams={gameState.teams} currentTeamIndex={gameState.currentTeamIndex} />
      
      {/* Round Indicator - Positioned relative to main content for better responsiveness */}
      <div className="hidden md:block absolute top-32 left-4 text-slate-500 font-bold text-sm border border-slate-700 p-2 rounded bg-slate-800 z-0">
        ROUND {gameState.currentRound} / {gameState.roundsConfigured}
      </div>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col items-center justify-start p-2 md:p-8 z-10 w-full">
        {gameState.phase === GamePhase.INTRO && (
             <div className="mt-10 md:mt-20 text-center px-4">
                <div className="text-4xl md:text-6xl text-white font-black animate-pulse mb-4 brand-font">MARKET OPENING</div>
                <div className="text-lg md:text-2xl text-slate-400">Initializing Trading Session...</div>
             </div>
        )}

        {(gameState.phase === GamePhase.PLAYING || gameState.phase === GamePhase.FEEDBACK) && gameState.currentScenario && (
             <ScenarioCard 
                scenario={gameState.currentScenario} 
                currentTeam={gameState.teams[gameState.currentTeamIndex]}
                onOptionSelected={handleOptionSelected} 
             />
        )}
      </main>

      {/* Feedback Overlay */}
      {gameState.phase === GamePhase.FEEDBACK && gameState.lastFeedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md animate-pop overflow-y-auto p-4">
            <div className={`max-w-4xl w-full my-auto rounded-3xl border-l-8 shadow-2xl relative overflow-hidden flex-shrink-0 ${gameState.lastFeedback.totalChange >= 0 ? 'bg-slate-800 border-emerald-500' : 'bg-slate-800 border-red-500'}`}>
                
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                   {gameState.lastFeedback.totalChange >= 0 ? <TrendingUp size={200} /> : <TrendingDown size={200} />}
                </div>

                <div className="relative z-10 p-6 md:p-8">
                    <div className="flex items-center gap-4 mb-6">
                        {gameState.lastFeedback.totalChange >= 0 ? (
                            <div className="bg-emerald-900/50 p-3 rounded-full"><CheckCircle size={32} md:size={48} className="text-emerald-400" /></div>
                        ) : (
                            <div className="bg-red-900/50 p-3 rounded-full"><AlertCircle size={32} md:size={48} className="text-red-400" /></div>
                        )}
                        <div>
                            <h2 className={`text-2xl md:text-3xl font-black uppercase tracking-wider ${gameState.lastFeedback.totalChange >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                {gameState.lastFeedback.totalChange >= 0 ? 'Positive Outlook' : 'Negative Outlook'}
                            </h2>
                            <div className="text-slate-400 text-sm font-mono">EXECUTIVE SUMMARY</div>
                        </div>
                    </div>

                    <div className="bg-slate-900/50 p-4 md:p-6 rounded-xl border border-slate-700 mb-6 max-h-[30vh] overflow-y-auto">
                        <p className="text-lg md:text-2xl text-slate-200 leading-relaxed font-light">
                            {gameState.lastFeedback.feedbackText}
                        </p>
                    </div>

                    {/* KPI Impact Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        {/* Revenue KPI */}
                        <div className={`p-4 rounded-xl border flex flex-col items-center justify-center transition-all ${
                            gameState.lastFeedback.impact.revenue > 0 ? 'bg-green-900/20 border-green-500/50' : 
                            gameState.lastFeedback.impact.revenue < 0 ? 'bg-red-900/20 border-red-500/50' : 'bg-slate-800 border-slate-700'
                        }`}>
                            <div className="flex items-center gap-2 mb-2">
                                <div className={`p-2 rounded-full ${gameState.lastFeedback.impact.revenue > 0 ? 'bg-green-500/20' : 'bg-slate-700'}`}>
                                    <DollarSign size={18} className={gameState.lastFeedback.impact.revenue > 0 ? 'text-green-400' : 'text-slate-400'} />
                                </div>
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Revenue</span>
                            </div>
                            <div className="flex items-center gap-1">
                                {gameState.lastFeedback.impact.revenue > 0 && <ArrowUp size={16} className="text-green-400" />}
                                {gameState.lastFeedback.impact.revenue < 0 && <ArrowDown size={16} className="text-red-400" />}
                                <span className={`text-2xl font-black ${
                                    gameState.lastFeedback.impact.revenue > 0 ? 'text-green-400' : 
                                    gameState.lastFeedback.impact.revenue < 0 ? 'text-red-400' : 'text-slate-500'
                                }`}>
                                    {gameState.lastFeedback.impact.revenue > 0 ? '+' : ''}{gameState.lastFeedback.impact.revenue}
                                </span>
                            </div>
                        </div>

                        {/* Innovation KPI */}
                        <div className={`p-4 rounded-xl border flex flex-col items-center justify-center transition-all ${
                            gameState.lastFeedback.impact.innovation > 0 ? 'bg-blue-900/20 border-blue-500/50' : 
                            gameState.lastFeedback.impact.innovation < 0 ? 'bg-red-900/20 border-red-500/50' : 'bg-slate-800 border-slate-700'
                        }`}>
                            <div className="flex items-center gap-2 mb-2">
                                <div className={`p-2 rounded-full ${gameState.lastFeedback.impact.innovation > 0 ? 'bg-blue-500/20' : 'bg-slate-700'}`}>
                                    <Lightbulb size={18} className={gameState.lastFeedback.impact.innovation > 0 ? 'text-blue-400' : 'text-slate-400'} />
                                </div>
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Innovation</span>
                            </div>
                            <div className="flex items-center gap-1">
                                {gameState.lastFeedback.impact.innovation > 0 && <ArrowUp size={16} className="text-blue-400" />}
                                {gameState.lastFeedback.impact.innovation < 0 && <ArrowDown size={16} className="text-red-400" />}
                                <span className={`text-2xl font-black ${
                                    gameState.lastFeedback.impact.innovation > 0 ? 'text-blue-400' : 
                                    gameState.lastFeedback.impact.innovation < 0 ? 'text-red-400' : 'text-slate-500'
                                }`}>
                                    {gameState.lastFeedback.impact.innovation > 0 ? '+' : ''}{gameState.lastFeedback.impact.innovation}
                                </span>
                            </div>
                        </div>

                        {/* Risk KPI (Inverted logic: High risk addition is bad) */}
                        <div className={`p-4 rounded-xl border flex flex-col items-center justify-center transition-all ${
                            gameState.lastFeedback.impact.risk > 0 ? 'bg-red-900/20 border-red-500/50' : 
                            gameState.lastFeedback.impact.risk < 0 ? 'bg-emerald-900/20 border-emerald-500/50' : 'bg-slate-800 border-slate-700'
                        }`}>
                             <div className="flex items-center gap-2 mb-2">
                                <div className={`p-2 rounded-full ${gameState.lastFeedback.impact.risk > 0 ? 'bg-red-500/20' : 'bg-slate-700'}`}>
                                    <ShieldAlert size={18} className={gameState.lastFeedback.impact.risk > 0 ? 'text-red-400' : 'text-slate-400'} />
                                </div>
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Risk</span>
                            </div>
                            <div className="flex items-center gap-1">
                                 {/* Risk UP is bad (Red Arrow Up), Risk DOWN is good (Green Arrow Down) */}
                                {gameState.lastFeedback.impact.risk > 0 && <ArrowUp size={16} className="text-red-400" />}
                                {gameState.lastFeedback.impact.risk < 0 && <ArrowDown size={16} className="text-emerald-400" />}
                                <span className={`text-2xl font-black ${
                                    gameState.lastFeedback.impact.risk > 0 ? 'text-red-400' : 
                                    gameState.lastFeedback.impact.risk < 0 ? 'text-emerald-400' : 'text-slate-500'
                                }`}>
                                    {gameState.lastFeedback.impact.risk > 0 ? '+' : ''}{gameState.lastFeedback.impact.risk}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row items-center justify-between border-t border-slate-700 pt-6 gap-4">
                         <div className="flex flex-col items-center md:items-start">
                            <span className="text-sm text-slate-500 uppercase font-bold">Total Valuation Change</span>
                            <div className={`text-4xl font-black brand-font ${gameState.lastFeedback.totalChange >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                {gameState.lastFeedback.totalChange > 0 ? '+' : ''}{gameState.lastFeedback.totalChange}
                            </div>
                        </div>

                        <button 
                            onClick={handleNextTeam}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white text-lg md:text-xl font-bold py-3 md:py-4 px-8 md:px-10 rounded-lg shadow-lg transition-all hover:translate-x-1 flex items-center gap-3 w-full md:w-auto justify-center"
                        >
                            Next Scenario <ArrowRight />
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default App;