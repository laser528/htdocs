import { FormEvent, MouseEvent } from "react";
import { Opportunity } from "../../../contrib/lib";

export interface OpportunityFeedProps {}

export interface OpportunityFeedState {
  opportunities: Opportunity[];
  opportunitiesSliced: Opportunity[];
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
