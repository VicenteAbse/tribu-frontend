export interface JoinRequestDto {
  id: number;
  userId: number;
  userUuid: string;
  userName: string;
  userInitials: string;
  userAvatarColor: string;
  bio: string;
  requestedAt: string;
}
