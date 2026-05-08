export interface NotificationDto {
  id: number;
  groupId: number;
  groupName: string;
  groupBackgroundColor: string;
  groupCategory: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
}
