import { ChangeEvent, FormEvent, MouseEvent } from "react";
import { Opportunity } from "../../lib";

export interface OpportunityViewProps {
  id: string;
}

export interface OpportunityViewState {
  opportunity?: Opportunity;
  activeViewers?: number;
  sessionId?: string;
  canModifyOpportunity: boolean;
  showEditSpinner: boolean;
  showEditModal: boolean;
  modalTitle?: string;
  modalContents?: string;
}

export interface OpportunityViewController {
  onEditButtonClick: (event: MouseEvent) => void;
  onDeleteButtonClick: (event: MouseEvent) => void;
  onEditModalClose: () => void;
  handleEditSubmit: (event: FormEvent) => void;
  onModalTitleChange: (event: ChangeEvent) => void;
  onModalContentsChange: (event: ChangeEvent) => void;
}
