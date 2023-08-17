import { UserProfileSection } from "../../../../contrib/lib";

export interface ProfileDetailedSectionProps {
  sectionTitle: string;
  section?: UserProfileSection[];
  isEditable: boolean;
}

export interface ProfileDetailedSectionState {
  section: UserProfileSection[];
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
