export interface UserStatsDto {
  groupsCreated: number;
  groupsJoined: number;
  totalMembers: number;
}

export interface UserProfileDto {
  id: number;
  name: string;
  username: string;
  bio: string;
  location: string;
  avatarColor: string;
  initials: string;
  interests: string[];
  stats: UserStatsDto;
  joinedDate: string;
}
