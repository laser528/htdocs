export interface StatsProps {
  onError?: (error: string) => {};
}

interface Info {
  users: number;
  sessions: number;
  opportunities: number;
  views: number;
}

export interface StatsState {
  info?: Info;
}

export interface StatsController {}
