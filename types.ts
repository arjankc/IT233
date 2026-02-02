export enum GamePhase {
  SETUP = 'SETUP',
  INTRO = 'INTRO',
  PLAYING = 'PLAYING',
  FEEDBACK = 'FEEDBACK',
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
}