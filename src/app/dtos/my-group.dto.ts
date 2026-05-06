export type GroupRole = 'creator' | 'admin' | 'member';

export interface MyGroupDto {
  id: number;
  name: string;
  category: string;
  backgroundColor: string;
  lastMessageText: string;
  lastMessageSender: string;
  lastMessageTime: string;
  unreadCount: number;
  role: GroupRole;
}
