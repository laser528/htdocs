export interface OpportunityFeedProps {}

export interface Opportunity {
  opportunity_id: string;
  creator_id: string;
  title: string;
  views: number;
  contents: string;
  createdAt: number;
  updatedAt: number;
}

export interface OpportunityFeedState {
  opportunities: Opportunity[];
}

export interface OpportunityFeedController {
  hasMoreItems: boolean;
  fetchFeed: () => void;
}
