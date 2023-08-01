import { FormEvent, MouseEvent } from "react";

export interface OpportunityFeedProps {
  onError?: (error: string) => void;
}

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
  hasMoreItems: boolean;
  canAddOpportunity: boolean;
  showAddModal: boolean;
  showAddSpinner: boolean;
}

export interface OpportunityFeedController {
  fetchFeed: () => void;
  onAddModalClose: () => void;
  onAddButtonClick: (event: MouseEvent) => void;
  handleAddSubmit: (event: FormEvent) => void;
}
