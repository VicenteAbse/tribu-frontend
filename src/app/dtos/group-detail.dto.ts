import { GroupDto } from './group.dto';
import { GroupEventDto } from './group-event.dto';

export type ViewerRole = 'creator' | 'admin' | 'member' | 'none';

export interface GroupMemberDto {
  id: number;
  name: string;
  initials: string;
  role: 'admin' | 'member';
  isMuted?: boolean;
}

export interface GroupDetailDto extends GroupDto {
  longDescription: string;
  location: string;
  nextEvent: string | null;
  createdBy: string;
  members: GroupMemberDto[];
  viewerRole: ViewerRole;
  joinPolicy: 'open' | 'approval';
  events: GroupEventDto[];
}
