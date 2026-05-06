export interface ChatMessageDto {
  id: number;
  senderId: number;
  senderName: string;
  text: string;
  time: string;
  isOwn: boolean;
  dateSeparator?: string; // si está presente, se muestra un separador de fecha encima
}

export interface ChatGroupInfoDto {
  id: number;
  name: string;
  backgroundColor: string;
  memberCount: number;
}
