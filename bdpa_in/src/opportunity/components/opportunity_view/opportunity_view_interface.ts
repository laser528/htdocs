import { ChangeEvent, FormEvent, MouseEvent } from "react";
import { Opportunity } from "../../../contrib/lib";

export interface OpportunityViewProps {
  id: string;
}

export interface OpportunityViewState {
  opportunity?: Opportunity;
  session_id?: string;
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
