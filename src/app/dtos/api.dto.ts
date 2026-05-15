// --- Enums ---

export type Gender = 'MALE' | 'FEMALE' | 'OTHER';
export type GenderPreference = 'MIXED' | 'MEN_ONLY' | 'WOMEN_ONLY';
export type GroupCategory = 'DEPORTES' | 'ARTE' | 'CULTURA' | 'TECNOLOGIA' | 'MUSICA' | 'GASTRONOMIA';
export type GroupStatus = 'OPEN' | 'ACTIVE' | 'CLOSED';
export type GroupMemberRole = 'MEMBER' | 'ADMIN' | 'OWNER';
export type JoinPolicy = 'OPEN' | 'APPROVAL_REQUIRED';
export type JoinRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

// --- Auth ---

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  gender: Gender;
  birthDate: string;
}

export interface AuthResponse {
  token: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// --- User ---

export interface UserProfile {
  uuid: string;
  email: string;
  name: string;
  description: string | null;
  gender: Gender;
  birthDate: string;
  searchRadiusKm: number;
  dailyLikesLeft: number;
  avatarBase64?: string | null;
}

export interface UpdateProfileRequest {
  name: string;
  description?: string;
  searchRadiusKm: number;
}

export interface UpdateAvatarRequest {
  imageBase64: string;
}

// --- Groups ---

export interface GroupSummary {
  uuid: string;
  id: number;
  name: string;
  description: string;
  status: GroupStatus;
  role: GroupMemberRole;
  joinedAt: string;
  coverImageBase64?: string | null;
}

export interface GroupDiscovery {
  uuid: string;
  id: number;
  name: string;
  description: string;
  creatorName: string;
  genderPreference: GenderPreference;
  category: GroupCategory | null;
  minMembers: number;
  maxMembers: number;
  likesCount: number;
  status: GroupStatus;
  createdAt: string;
  distanceKm: number | null;
  coverImageBase64?: string | null;
}

export interface GroupMember {
  id: number;
  userId: number;
  name: string;
  email: string;
  role: GroupMemberRole;
  muted: boolean;
  joinedAt: string;
}

export interface GroupDetail extends GroupDiscovery {
  members: GroupMember[];
  joinPolicy: string;
}

export interface CreateGroupRequest {
  name: string;
  description: string;
  genderPreference: GenderPreference;
  category: GroupCategory;
  minMembers: number;
  maxMembers: number;
  joinPolicy?: JoinPolicy;
  latitude?: number;
  longitude?: number;
}

export interface UpdateGroupRequest {
  name: string;
  description: string;
  joinPolicy?: JoinPolicy;
}

export interface UpdateCoverImageRequest {
  imageBase64: string;
}

// --- Swipe ---

export interface SwipeRequest {
  liked: boolean;
}

export interface SwipeResult {
  liked: boolean;
  groupStatus: GroupStatus;
  groupActivated: boolean;
  likesLeftToday: number;
}

// --- Join Requests ---

export interface JoinRequest {
  id: number;
  userId: number;
  name: string;
  email: string;
  status: JoinRequestStatus;
  createdAt: string;
}

// --- Events ---

export interface GroupEvent {
  id: number;
  title: string;
  description: string;
  eventDate: string;
  location: string;
  creatorName: string;
  createdAt: string;
}

export interface CreateGroupEventRequest {
  title: string;
  description?: string;
  eventDate: string;
  location?: string;
}

// --- Messages ---

export interface Message {
  id: number;
  senderId: number;
  senderName: string;
  content: string;
  sentAt: string;
}

export interface SendMessageRequest {
  content: string;
}

// --- Notifications ---

export interface Notification {
  id: number;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
}

// --- Support ---

export interface CreateReportRequest {
  message: string;
}

// --- Pagination ---

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
}
