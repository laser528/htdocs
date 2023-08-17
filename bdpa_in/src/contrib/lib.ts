export enum UserType {
  GUEST = "guest",
  INNER = "inner",
  STAFF = "staff",
  ADMINISTRATOR = "administrator",
}

export interface User {
  user_id: string;
  username: string;
  email: string;
  salt: string;
  views: string;
  type: UserType;
  cover_photo_location?: string;
  createdAt: string;
  updatedAt: string;
  url: string;
}

export enum SessionView {
  HOME = "home",
  ADMIN = "admin",
  AUTH = "auth",
  PROFILE = "profile",
  OPPORTUNITY = "opportunity",
}

export enum UserProfileSectionType {
  EDUCATION = "education",
  EXPERIENCE = "experience",
  VOLUNTEERING = "volunteering",
}

export interface UserProfileSection {
  title: string;
  location: string;
  description: string;
  startedAt: number;
  endedAt?: number;
}

export interface Opportunity {
  opportunity_id: string;
  creator_id: string;
  title: string;
  contents: string;
  views: number;
  createdAt: number;
  updatedAt: number;
  activeViewers?: number;
}
