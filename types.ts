export enum GamePhase {
  SETUP = 'SETUP',
  INTRO = 'INTRO',
  PLAYING = 'PLAYING',
  FEEDBACK = 'FEEDBACK',
  MARKET_EVENT = 'MARKET_EVENT',
  GAME_OVER = 'GAME_OVER'
}

export type Unit = 'Foundations' | 'Strategy' | 'Data' | 'Mobile/IoT';

export interface KPIChange {
  revenue: number;    // Represents Efficiency/Profit
  innovation: number; // Represents Strategy/Future Readiness
  risk: number;       // Represents Liability/Security flaws (Lower is better)
}

export interface ScenarioOption {
  id: string;
  text: string;
  impact: KPIChange; // The business consequence
  feedback: string;
}

export interface Scenario {
  id: string;
  unit: Unit;
  title: string;
  prompt: string;
  options: ScenarioOption[];
  iconType: 'strategy' | 'database' | 'mobile' | 'system';
}

export interface MarketEvent {
  id: string;
  title: string;
  description: string;
  explanation: string; // Detailed breakdown of the mechanics
  impact: KPIChange;
  type: 'POSITIVE' | 'NEGATIVE' | 'CHAOS';
}

export interface Team {
  id: number;
  name: string;
  kpis: {
    revenue: number;
    innovation: number;
    risk: number;
  };
  score: number; // Calculated Market Valuation
  color: string; 
  history: { scenarioTitle: string; change: number }[];
}

export interface GameState {
  phase: GamePhase;
  teams: Team[];
  currentTeamIndex: number;
  currentScenario: Scenario | null;
  scenariosPlayed: string[]; 
  roundsConfigured: number;
  currentRound: number;
  scenarioOrder: string[]; 
  lastFeedback: {
    impact: KPIChange;
    totalChange: number;
    feedbackText: string;
  } | null;
  currentMarketEvent: MarketEvent | null;
}