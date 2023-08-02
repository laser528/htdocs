import { DetailedSection } from "../../../services/profile_service";

export interface ProfileDetailedSectionProps {
  sectionTitle: string;
  section?: DetailedSection[];
  isEditable: boolean;
}

export interface ProfileDetailedSectionState {
  section: DetailedSection[];
  title: string;
  startedAt: string;
  endedAt?: string;
  location: string;
  description: string;
}

export interface ProfileDetailedSectionController {
  dateFormat: (date?: number) => string;
  titleFormat: (title: string) => string;
  locationFormat: (location: string) => string;
  descriptionFormat: (description: string) => string;
}
