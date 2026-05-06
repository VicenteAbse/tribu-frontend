export interface GroupDto {
  id: number;
  name: string;
  description: string;
  category: string;
  memberCount: number;
  distance: number; // en km
  backgroundColor: string;
  tags: string[];
}
