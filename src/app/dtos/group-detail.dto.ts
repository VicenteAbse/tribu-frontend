import { GroupDto } from './group.dto';

export interface GroupMemberDto {
  id: number;
  name: string;
  initials: string;
  role: 'admin' | 'member';
}

export interface GroupDetailDto extends GroupDto {
  longDescription: string;
  location: string;
  nextEvent: string | null;
  createdBy: string;
  members: GroupMemberDto[];
}
