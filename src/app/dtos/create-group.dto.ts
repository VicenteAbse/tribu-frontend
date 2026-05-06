export type JoinPolicy = 'open' | 'approval';

export interface CreateGroupDto {
  name: string;
  description: string;
  category: string;
  joinPolicy: JoinPolicy;
  imagePlaceholderColors: string[]; // temporal hasta implementar subida real de imágenes
}
