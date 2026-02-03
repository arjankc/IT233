import React, { useState, useEffect } from 'react';
import { GamePhase, GameState, Team, Scenario } from './types';
import { SCENARIOS, MAX_ROUNDS, TEAM_COLORS, INITIAL_KPIs, MARKET_EVENTS } from './constants';
import GameSetup from './components/GameSetup';
import ScoreBoard from './components/ScoreBoard';
import ScenarioCard from './components/ScenarioCard';
import VictoryScreen from './components/VictoryScreen';
import { AlertCircle, CheckCircle, ArrowRight, TrendingUp, TrendingDown, DollarSign, Lightbulb, ShieldAlert, ArrowUp, ArrowDown, Radio } from 'lucide-react';

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
    currentMarketEvent: null,
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
      currentMarketEvent: null,
    }));

    setTimeout(() => {
        nextTurn(0);
    }, 1500);
  };

  const nextTurn = (nextIndex: number) => {
    setGameState(prev => {
        const { scenarioOrder, scenariosPlayed, currentRound, phase, roundsConfigured, teams } = prev;
        
        // 1. Check Game Over
        const isNewRound = nextIndex === 0 && phase !== GamePhase.INTRO; 
        const nextRound = isNewRound ? currentRound + 1 : currentRound;

        if (scenariosPlayed.length >= scenarioOrder.length || nextRound > roundsConfigured) {
            return { ...prev, phase: GamePhase.GAME_OVER };
        }

        // 2. Random Market Event Trigger (30% chance, but not on INTRO)
        const triggerEvent = phase !== GamePhase.INTRO && Math.random() < 0.3;

        if (triggerEvent) {
             const randomEvent = MARKET_EVENTS[Math.floor(Math.random() * MARKET_EVENTS.length)];
             
             // Apply impact to ALL teams
             const updatedTeams = teams.map(team => {
                 const newKpis = {
                     revenue: team.kpis.revenue + randomEvent.impact.revenue,
                     innovation: team.kpis.innovation + randomEvent.impact.innovation,
                     risk: Math.max(0, team.kpis.risk + randomEvent.impact.risk)
                 };
                 const newScore = calculateMarketValuation(newKpis);
                 const change = newScore - team.score;
                 
                 return {
                     ...team,
                     kpis: newKpis,
                     score: newScore,
                     history: [...team.history, { scenarioTitle: `EVENT: ${randomEvent.title}`, change }]
                 };
             });

             return {
                 ...prev,
                 phase: GamePhase.MARKET_EVENT,
                 currentMarketEvent: randomEvent,
                 teams: updatedTeams,
                 currentTeamIndex: nextIndex,
                 currentRound: nextRound
             };
        }

        // 3. Normal Flow
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
            lastFeedback: null,
            currentMarketEvent: null
        };
    });
  };

  const handleMarketEventContinue = () => {
      // Transition from Event to Playing (Scenario)
      setGameState(prev => {
          const { scenarioOrder, scenariosPlayed } = prev;
          const nextScenarioId = scenarioOrder[scenariosPlayed.length];
          const selectedScenario = SCENARIOS.find(s => s.id === nextScenarioId) || null;
          
          if (!selectedScenario) {
              return { ...prev, phase: GamePhase.GAME_OVER };
          }

          return {
              ...prev,
              phase: GamePhase.PLAYING,
              currentScenario: selectedScenario,
              currentMarketEvent: null
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
        currentMarketEvent: null,
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

      {/* Market Event Overlay */}
      {gameState.phase === GamePhase.MARKET_EVENT && gameState.currentMarketEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-red-950/90 backdrop-blur-md animate-pop overflow-y-auto p-4">
            <div className="max-w-4xl w-full border-y-8 border-red-600 bg-slate-900 text-center shadow-2xl overflow-hidden relative rounded-xl">
                {/* Scrolling News Ticker Effect Background */}
                <div className="absolute inset-0 opacity-10 flex flex-col justify-between pointer-events-none">
                    <div className="text-9xl font-black text-red-500 whitespace-nowrap animate-pulse">BREAKING NEWS</div>
                </div>

                <div className="relative z-10 p-6 md:p-10 flex flex-col items-center">
                    <div className="inline-block bg-red-600 text-white font-black px-4 py-1 mb-4 uppercase tracking-widest text-lg animate-pulse">
                        Global Market Update
                    </div>
                    
                    <div className="flex justify-center mb-4">
                        <Radio size={48} className="text-red-500 animate-ping" />
                    </div>

                    <h2 className="text-3xl md:text-5xl font-black text-white mb-4 uppercase brand-font">
                        {gameState.currentMarketEvent.title}
                    </h2>

                    <p className="text-lg md:text-xl text-slate-300 mb-2 leading-relaxed max-w-2xl mx-auto italic">
                        {gameState.currentMarketEvent.description}
                    </p>
                    
                    {/* Detailed Explanation */}
                    <div className="bg-red-900/20 border-l-4 border-red-500 p-4 mb-8 max-w-3xl text-left">
                        <p className="text-slate-200 text-sm md:text-base leading-relaxed">
                            <span className="font-bold text-red-400 block mb-1 uppercase text-xs tracking-wider">Market Analysis:</span>
                            {gameState.currentMarketEvent.explanation}
                        </p>
                    </div>

                    {/* Team Impact Report */}
                    <div className="w-full max-w-3xl bg-slate-800/80 border border-slate-700 rounded-xl overflow-hidden mb-8">
                        <div className="bg-slate-950/50 p-2 border-b border-slate-700 flex justify-between px-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                            <span>Entity</span>
                            <span>Net Valuation Impact</span>
                        </div>
                        <div className="divide-y divide-slate-700/50">
                            {gameState.teams.map((team) => {
                                const lastHistory = team.history[team.history.length - 1];
                                const change = lastHistory ? lastHistory.change : 0;
                                const isPos = change >= 0;
                                
                                return (
                                    <div key={team.id} className="p-3 flex items-center justify-between hover:bg-slate-700/30 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-3 h-3 rounded-full ${TEAM_COLORS[team.id % TEAM_COLORS.length].bg}`}></div>
                                            <span className="font-bold text-slate-200">{team.name}</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            {/* KPI Mini Badges */}
                                            <div className="hidden md:flex gap-2 opacity-70">
                                                <span className={`text-xs px-1 rounded ${gameState.currentMarketEvent!.impact.revenue >= 0 ? 'bg-green-900 text-green-400' : 'bg-red-900 text-red-400'}`}>
                                                    REV {gameState.currentMarketEvent!.impact.revenue >= 0 ? '+' : ''}{gameState.currentMarketEvent!.impact.revenue}
                                                </span>
                                                <span className={`text-xs px-1 rounded ${gameState.currentMarketEvent!.impact.innovation >= 0 ? 'bg-blue-900 text-blue-400' : 'bg-red-900 text-red-400'}`}>
                                                    INN {gameState.currentMarketEvent!.impact.innovation >= 0 ? '+' : ''}{gameState.currentMarketEvent!.impact.innovation}
                                                </span>
                                            </div>
                                            
                                            <div className="text-right">
                                                <div className={`font-black text-lg ${isPos ? 'text-emerald-400' : 'text-red-400'}`}>
                                                    {isPos ? '+' : ''}{change}
                                                </div>
                                                <div className="text-[10px] text-slate-500 font-mono">
                                                    NEW VAL: {team.score}M
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="mt-2">
                         <button 
                            onClick={handleMarketEventContinue}
                            className="bg-white hover:bg-slate-200 text-slate-900 text-lg font-bold py-3 px-10 rounded-full shadow-lg transition-transform hover:scale-105"
                        >
                            ACKNOWLEDGE & CONTINUE
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* Feedback Overlay */}
      {gameState.phase === GamePhase.FEEDBACK && gameState.lastFeedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md animate-pop overflow-y-auto p-4">
            <div className={`max-w-4xl w-full my-auto rounded-3xl border-l-8 shadow-2xl relative overflow-hidden flex-shrink-0 ${gameState.lastFeedback.totalChange >= 0 ? 'bg-slate-800 border-emerald-500' : 'bg-slate-800 border-red-500'}`}>
                
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                   {gameState.lastFeedback.totalChange >= 0 ? <TrendingUp size={200} /> : <TrendingDown size={200} />}
                </div>

                <div className="relative z-10 p-6 md:p-8">
                    {/* Header with Icon */}
                    <div className="flex items-center gap-4 mb-6 animate-slide-up" style={{ animationDelay: '0ms' }}>
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

                    {/* Feedback Text */}
                    <div className="bg-slate-900/50 p-4 md:p-6 rounded-xl border border-slate-700 mb-6 max-h-[30vh] overflow-y-auto animate-slide-up" style={{ animationDelay: '100ms' }}>
                        <p className="text-lg md:text-2xl text-slate-200 leading-relaxed font-light">
                            {gameState.lastFeedback.feedbackText}
                        </p>
                    </div>

                    {/* KPI Impact Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 animate-slide-up" style={{ animationDelay: '200ms' }}>
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
                    
                    <div className="flex flex-col md:flex-row items-center justify-between border-t border-slate-700 pt-6 gap-4 animate-slide-up" style={{ animationDelay: '300ms' }}>
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