export type MessageType = 'text' | 'event';

export interface ChatMessageDto {
  id: number;
  senderId: number;
  senderName: string;
  text: string;
  time: string;
  isOwn: boolean;
  dateSeparator?: string;
  type?: MessageType;
  eventTitle?: string;
  eventDate?: string;
  eventLocation?: string;
}

export interface ChatGroupInfoDto {
  id: number;
  name: string;
  backgroundColor: string;
  memberCount: number;
}
