import { User } from "../../../contrib/user/models/user";
import { ProfileSections } from "../../services/profile_service";

export interface ProfileProps {}

interface UserProfile {
  user: User;
  sections: ProfileSections;
}

export interface ProfileState {
  profile?: UserProfile;
  activeViewers?: number;
}

export interface ProfileController {
  isEditable: boolean;
}
