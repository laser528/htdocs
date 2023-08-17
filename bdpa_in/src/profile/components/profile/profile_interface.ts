import { User, UserProfileSection } from "../../../contrib/lib";

export interface ProfileProps {}

interface UserProfile {
  user: User;
  connections_count: number;
  about: string | undefined | null;
  education: UserProfileSection[];
  experience: UserProfileSection[];
  volunteering: UserProfileSection[];
  skills: string[];
}

export interface ProfileState {
  profile_url: string;
  profile?: UserProfile;
  session_id?: string;
}

export interface ProfileController {
  isEditable: boolean;
}
