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
    usedEventIds: [],
    turnsSinceLastEvent: 0,
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
      usedEventIds: [],
      turnsSinceLastEvent: 0, // Reset pacing
    }));

    setTimeout(() => {
        nextTurn(0);
    }, 1500);
  };

  const nextTurn = (nextIndex: number) => {
    setGameState(prev => {
        const { scenarioOrder, scenariosPlayed, currentRound, phase, roundsConfigured, teams, usedEventIds, turnsSinceLastEvent } = prev;
        
        // 1. Check Game Over
        const isNewRound = nextIndex === 0 && phase !== GamePhase.INTRO; 
        const nextRound = isNewRound ? currentRound + 1 : currentRound;

        if (scenariosPlayed.length >= scenarioOrder.length || nextRound > roundsConfigured) {
            return { ...prev, phase: GamePhase.GAME_OVER };
        }

        // 2. Market Event Logic
        // Improvement: Use a "Deck" system to prevent repeats and a "Cooldown" to prevent clustering.
        
        const COOLDOWN_TURNS = 2; // Minimum turns between events
        const EVENT_PROBABILITY = 0.35; // 35% chance if cooldown passed
        
        // Only trigger if we are not in intro, cooldown is satisfied
        const canTriggerEvent = phase !== GamePhase.INTRO && turnsSinceLastEvent >= COOLDOWN_TURNS;
        const shouldTrigger = canTriggerEvent && Math.random() < EVENT_PROBABILITY;

        if (shouldTrigger) {
             // Filter out events we've already used to avoid repetition
             let availableEvents = MARKET_EVENTS.filter(e => !usedEventIds.includes(e.id));
             
             // If we've seen them all, reset the pool (allow repeats now)
             if (availableEvents.length === 0) {
                 availableEvents = MARKET_EVENTS;
             }

             const randomEvent = availableEvents[Math.floor(Math.random() * availableEvents.length)];
             
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
                 currentRound: nextRound,
                 usedEventIds: [...usedEventIds, randomEvent.id], // Mark as used
                 turnsSinceLastEvent: 0 // Reset cooldown counter
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
            currentMarketEvent: null,
            turnsSinceLastEvent: turnsSinceLastEvent + 1 // Increment pacing counter
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
        usedEventIds: [],
        turnsSinceLastEvent: 0,
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
    <div className="h-[100dvh] bg-slate-900 flex flex-col relative overflow-y-auto overflow-x-hidden">
      <ScoreBoard teams={gameState.teams} currentTeamIndex={gameState.currentTeamIndex} />
      
      {/* Round Indicator - Responsive placement */}
      {gameState.phase !== GamePhase.INTRO && (
        <div className="md:absolute md:top-36 md:left-4 z-0 mt-2 md:mt-0 px-4 md:px-0">
          <div className="text-slate-400 font-bold text-xs md:text-sm border border-slate-700 p-1.5 px-3 md:p-2 rounded bg-slate-800/80 inline-block">
            ROUND <span className="text-white">{gameState.currentRound}</span> / {gameState.roundsConfigured}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col items-center justify-start p-2 pb-20 md:p-8 z-10 w-full">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-red-950/90 backdrop-blur-md animate-pop overflow-y-auto p-2 md:p-4">
            <div className="max-w-4xl w-full border-y-8 border-red-600 bg-slate-900 text-center shadow-2xl overflow-hidden relative rounded-xl my-auto">
                {/* Scrolling News Ticker Effect Background */}
                <div className="absolute inset-0 opacity-10 flex flex-col justify-between pointer-events-none overflow-hidden">
                    <div className="text-6xl md:text-9xl font-black text-red-500 whitespace-nowrap animate-pulse">BREAKING NEWS</div>
                </div>

                <div className="relative z-10 p-4 md:p-10 flex flex-col items-center">
                    <div className="inline-block bg-red-600 text-white font-black px-3 py-1 md:px-4 mb-4 uppercase tracking-widest text-xs md:text-lg animate-pulse rounded">
                        Global Market Update
                    </div>
                    
                    <div className="flex justify-center mb-4">
                        <Radio size={32} className="md:w-12 md:h-12 text-red-500 animate-ping" />
                    </div>

                    <h2 className="text-2xl md:text-5xl font-black text-white mb-2 md:mb-4 uppercase brand-font leading-tight">
                        {gameState.currentMarketEvent.title}
                    </h2>

                    <p className="text-base md:text-xl text-slate-300 mb-2 leading-relaxed max-w-2xl mx-auto italic">
                        {gameState.currentMarketEvent.description}
                    </p>
                    
                    {/* Detailed Explanation */}
                    <div className="bg-red-900/20 border-l-4 border-red-500 p-3 md:p-4 mb-6 max-w-3xl text-left rounded-r">
                        <p className="text-slate-200 text-xs md:text-base leading-relaxed">
                            <span className="font-bold text-red-400 block mb-1 uppercase text-[10px] md:text-xs tracking-wider">Market Analysis:</span>
                            {gameState.currentMarketEvent.explanation}
                        </p>
                    </div>

                    {/* Team Impact Report */}
                    <div className="w-full max-w-3xl bg-slate-800/80 border border-slate-700 rounded-xl overflow-hidden mb-6">
                        <div className="bg-slate-950/50 p-2 border-b border-slate-700 flex justify-between px-4 text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">
                            <span>Entity</span>
                            <span>Net Valuation Impact</span>
                        </div>
                        <div className="divide-y divide-slate-700/50">
                            {gameState.teams.map((team) => {
                                const lastHistory = team.history[team.history.length - 1];
                                const change = lastHistory ? lastHistory.change : 0;
                                const isPos = change >= 0;
                                
                                return (
                                    <div key={team.id} className="p-2 md:p-3 flex items-center justify-between hover:bg-slate-700/30 transition-colors">
                                        <div className="flex items-center gap-2 md:gap-3">
                                            <div className={`w-2 h-2 md:w-3 md:h-3 rounded-full ${TEAM_COLORS[team.id % TEAM_COLORS.length].bg}`}></div>
                                            <span className="font-bold text-slate-200 text-sm md:text-base">{team.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2 md:gap-4">
                                            {/* KPI Mini Badges - Hidden on very small screens, visible on md */}
                                            <div className="hidden sm:flex gap-1 md:gap-2 opacity-70">
                                                <span className={`text-[10px] md:text-xs px-1 rounded ${gameState.currentMarketEvent!.impact.revenue >= 0 ? 'bg-green-900 text-green-400' : 'bg-red-900 text-red-400'}`}>
                                                    REV {gameState.currentMarketEvent!.impact.revenue >= 0 ? '+' : ''}{gameState.currentMarketEvent!.impact.revenue}
                                                </span>
                                                <span className={`text-[10px] md:text-xs px-1 rounded ${gameState.currentMarketEvent!.impact.innovation >= 0 ? 'bg-blue-900 text-blue-400' : 'bg-red-900 text-red-400'}`}>
                                                    INN {gameState.currentMarketEvent!.impact.innovation >= 0 ? '+' : ''}{gameState.currentMarketEvent!.impact.innovation}
                                                </span>
                                            </div>
                                            
                                            <div className="text-right">
                                                <div className={`font-black text-base md:text-lg ${isPos ? 'text-emerald-400' : 'text-red-400'}`}>
                                                    {isPos ? '+' : ''}{change}
                                                </div>
                                                <div className="text-[9px] md:text-[10px] text-slate-400 font-mono">
                                                    NEW VAL: {team.score}M
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="mt-2 w-full md:w-auto">
                         <button 
                            onClick={handleMarketEventContinue}
                            className="w-full md:w-auto bg-white hover:bg-slate-200 text-slate-900 text-base md:text-lg font-bold py-3 px-8 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md animate-pop overflow-y-auto p-2 md:p-4">
            <div className={`max-w-4xl w-full my-auto rounded-2xl md:rounded-3xl border-l-8 shadow-2xl relative overflow-hidden flex-shrink-0 ${gameState.lastFeedback.totalChange >= 0 ? 'bg-slate-800 border-emerald-500' : 'bg-slate-800 border-red-500'}`}>
                
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                   {gameState.lastFeedback.totalChange >= 0 ? <TrendingUp size={150} /> : <TrendingDown size={150} />}
                </div>

                <div className="relative z-10 p-4 md:p-8">
                    {/* Header with Icon */}
                    <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6 animate-slide-up" style={{ animationDelay: '0ms' }}>
                        {gameState.lastFeedback.totalChange >= 0 ? (
                            <div className="bg-emerald-900/50 p-2 md:p-3 rounded-full"><CheckCircle size={24} className="md:w-12 md:h-12 text-emerald-400" /></div>
                        ) : (
                            <div className="bg-red-900/50 p-2 md:p-3 rounded-full"><AlertCircle size={24} className="md:w-12 md:h-12 text-red-400" /></div>
                        )}
                        <div>
                            <h2 className={`text-xl md:text-3xl font-black uppercase tracking-wider ${gameState.lastFeedback.totalChange >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                {gameState.lastFeedback.totalChange >= 0 ? 'Positive Outlook' : 'Negative Outlook'}
                            </h2>
                            <div className="text-slate-400 text-xs md:text-sm font-mono">EXECUTIVE SUMMARY</div>
                        </div>
                    </div>

                    {/* Feedback Text */}
                    <div className="bg-slate-900/50 p-4 md:p-6 rounded-xl border border-slate-700 mb-6 max-h-[30vh] overflow-y-auto animate-slide-up" style={{ animationDelay: '100ms' }}>
                        <p className="text-base md:text-2xl text-slate-200 leading-relaxed font-light">
                            {gameState.lastFeedback.feedbackText}
                        </p>
                    </div>

                    {/* KPI Impact Grid */}
                    <div className="grid grid-cols-3 gap-2 md:gap-4 mb-6 md:mb-8 animate-slide-up" style={{ animationDelay: '200ms' }}>
                        {/* Revenue KPI */}
                        <div className={`p-2 md:p-4 rounded-xl border flex flex-col items-center justify-center transition-all ${
                            gameState.lastFeedback.impact.revenue > 0 ? 'bg-green-900/20 border-green-500/50' : 
                            gameState.lastFeedback.impact.revenue < 0 ? 'bg-red-900/20 border-red-500/50' : 'bg-slate-800 border-slate-700'
                        }`}>
                            <div className="flex items-center gap-1 md:gap-2 mb-1 md:mb-2">
                                <div className={`p-1.5 md:p-2 rounded-full ${gameState.lastFeedback.impact.revenue > 0 ? 'bg-green-500/20' : 'bg-slate-700'}`}>
                                    <DollarSign size={14} className={`md:w-[18px] md:h-[18px] ${gameState.lastFeedback.impact.revenue > 0 ? 'text-green-400' : 'text-slate-400'}`} />
                                </div>
                                <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-slate-300 hidden sm:inline">Revenue</span>
                            </div>
                            <div className="flex items-center gap-0.5 md:gap-1">
                                {gameState.lastFeedback.impact.revenue > 0 && <ArrowUp size={12} className="md:w-4 md:h-4 text-green-400" />}
                                {gameState.lastFeedback.impact.revenue < 0 && <ArrowDown size={12} className="md:w-4 md:h-4 text-red-400" />}
                                <span className={`text-lg md:text-2xl font-black ${
                                    gameState.lastFeedback.impact.revenue > 0 ? 'text-green-400' : 
                                    gameState.lastFeedback.impact.revenue < 0 ? 'text-red-400' : 'text-slate-500'
                                }`}>
                                    {gameState.lastFeedback.impact.revenue > 0 ? '+' : ''}{gameState.lastFeedback.impact.revenue}
                                </span>
                            </div>
                        </div>

                        {/* Innovation KPI */}
                        <div className={`p-2 md:p-4 rounded-xl border flex flex-col items-center justify-center transition-all ${
                            gameState.lastFeedback.impact.innovation > 0 ? 'bg-blue-900/20 border-blue-500/50' : 
                            gameState.lastFeedback.impact.innovation < 0 ? 'bg-red-900/20 border-red-500/50' : 'bg-slate-800 border-slate-700'
                        }`}>
                            <div className="flex items-center gap-1 md:gap-2 mb-1 md:mb-2">
                                <div className={`p-1.5 md:p-2 rounded-full ${gameState.lastFeedback.impact.innovation > 0 ? 'bg-blue-500/20' : 'bg-slate-700'}`}>
                                    <Lightbulb size={14} className={`md:w-[18px] md:h-[18px] ${gameState.lastFeedback.impact.innovation > 0 ? 'text-blue-400' : 'text-slate-400'}`} />
                                </div>
                                <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-slate-300 hidden sm:inline">Innovation</span>
                            </div>
                            <div className="flex items-center gap-0.5 md:gap-1">
                                {gameState.lastFeedback.impact.innovation > 0 && <ArrowUp size={12} className="md:w-4 md:h-4 text-blue-400" />}
                                {gameState.lastFeedback.impact.innovation < 0 && <ArrowDown size={12} className="md:w-4 md:h-4 text-red-400" />}
                                <span className={`text-lg md:text-2xl font-black ${
                                    gameState.lastFeedback.impact.innovation > 0 ? 'text-blue-400' : 
                                    gameState.lastFeedback.impact.innovation < 0 ? 'text-red-400' : 'text-slate-500'
                                }`}>
                                    {gameState.lastFeedback.impact.innovation > 0 ? '+' : ''}{gameState.lastFeedback.impact.innovation}
                                </span>
                            </div>
                        </div>

                        {/* Risk KPI */}
                        <div className={`p-2 md:p-4 rounded-xl border flex flex-col items-center justify-center transition-all ${
                            gameState.lastFeedback.impact.risk > 0 ? 'bg-red-900/20 border-red-500/50' : 
                            gameState.lastFeedback.impact.risk < 0 ? 'bg-emerald-900/20 border-emerald-500/50' : 'bg-slate-800 border-slate-700'
                        }`}>
                             <div className="flex items-center gap-1 md:gap-2 mb-1 md:mb-2">
                                <div className={`p-1.5 md:p-2 rounded-full ${gameState.lastFeedback.impact.risk > 0 ? 'bg-red-500/20' : 'bg-slate-700'}`}>
                                    <ShieldAlert size={14} className={`md:w-[18px] md:h-[18px] ${gameState.lastFeedback.impact.risk > 0 ? 'text-red-400' : 'text-slate-400'}`} />
                                </div>
                                <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-slate-300 hidden sm:inline">Risk</span>
                            </div>
                            <div className="flex items-center gap-0.5 md:gap-1">
                                {gameState.lastFeedback.impact.risk > 0 && <ArrowUp size={12} className="md:w-4 md:h-4 text-red-400" />}
                                {gameState.lastFeedback.impact.risk < 0 && <ArrowDown size={12} className="md:w-4 md:h-4 text-emerald-400" />}
                                <span className={`text-lg md:text-2xl font-black ${
                                    gameState.lastFeedback.impact.risk > 0 ? 'text-red-400' : 
                                    gameState.lastFeedback.impact.risk < 0 ? 'text-emerald-400' : 'text-slate-500'
                                }`}>
                                    {gameState.lastFeedback.impact.risk > 0 ? '+' : ''}{gameState.lastFeedback.impact.risk}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row items-center justify-between border-t border-slate-700 pt-4 md:pt-6 gap-4 animate-slide-up" style={{ animationDelay: '300ms' }}>
                         <div className="flex flex-col items-center md:items-start">
                            <span className="text-[10px] md:text-sm text-slate-400 uppercase font-bold">Total Valuation Change</span>
                            <div className={`text-3xl md:text-4xl font-black brand-font ${gameState.lastFeedback.totalChange >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                {gameState.lastFeedback.totalChange > 0 ? '+' : ''}{gameState.lastFeedback.totalChange}
                            </div>
                        </div>

                        <button 
                            onClick={handleNextTeam}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white text-base md:text-xl font-bold py-3 md:py-4 px-8 md:px-10 rounded-lg shadow-lg transition-all hover:translate-x-1 flex items-center gap-3 w-full md:w-auto justify-center active:scale-95"
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