export interface Opportunity {
  opportunity_id: string;
  creator_id: string;
  title: string;
  views: number;
  contents: string;
  createdAt: number;
  updatedAt: number;
}

export interface OpportunityCardProps {
  opportunity: Opportunity;
  className?: string;
}

export interface OpportunityCardState {
  activeViews: number;
}

export interface OpportunityCardController {}
