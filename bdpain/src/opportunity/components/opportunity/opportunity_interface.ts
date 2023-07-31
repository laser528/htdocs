export interface OpportunityProps {}

export interface OpportunityState {
  errorMessage?: string;
}

export interface OpportunityController {
  handleAlertClose: () => void;
  onError: (error: string) => void;
  id: string;
}
