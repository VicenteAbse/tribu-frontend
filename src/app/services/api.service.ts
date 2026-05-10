import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  AuthResponse,
  ChangePasswordRequest,
  CreateGroupEventRequest,
  CreateGroupRequest,
  CreateReportRequest,
  GroupCategory,
  GroupDetail,
  GroupDiscovery,
  GroupEvent,
  GroupMember,
  GroupSummary,
  JoinRequest,
  LoginRequest,
  Message,
  Notification,
  Page,
  RegisterRequest,
  SendMessageRequest,
  SwipeRequest,
  SwipeResult,
  UpdateGroupRequest,
  UpdateProfileRequest,
  UserProfile,
} from '../dtos/api.dto';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly base = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // --- Auth ---

  login(body: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.base}/auth/login`, body);
  }

  register(body: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.base}/auth/register`, body);
  }

  changePassword(body: ChangePasswordRequest): Observable<void> {
    return this.http.put<void>(`${this.base}/auth/change-password`, body);
  }

  // --- User ---

  getMyProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.base}/users/me`);
  }

  updateMyProfile(body: UpdateProfileRequest): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.base}/users/me`, body);
  }

  getMyGroups(): Observable<GroupSummary[]> {
    return this.http.get<GroupSummary[]>(`${this.base}/users/me/groups`);
  }

  getMyNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.base}/users/me/notifications`);
  }

  // --- Discovery ---

  discoverGroups(filters: {
    latitude?: number;
    longitude?: number;
    radiusKm?: number;
    category?: GroupCategory;
    page?: number;
    size?: number;
  } = {}): Observable<Page<GroupDiscovery>> {
    let params = new HttpParams()
      .set('page', filters.page ?? 0)
      .set('size', filters.size ?? 10);
    if (filters.latitude != null)  params = params.set('latitude',  filters.latitude);
    if (filters.longitude != null) params = params.set('longitude', filters.longitude);
    if (filters.radiusKm != null)  params = params.set('radiusKm',  filters.radiusKm);
    if (filters.category != null)  params = params.set('category',  filters.category);
    return this.http.get<Page<GroupDiscovery>>(`${this.base}/groups/discover`, { params });
  }

  swipeGroup(groupId: number, body: SwipeRequest): Observable<SwipeResult> {
    return this.http.post<SwipeResult>(`${this.base}/groups/${groupId}/swipe`, body);
  }

  // --- Groups ---

  createGroup(body: CreateGroupRequest): Observable<GroupDetail> {
    return this.http.post<GroupDetail>(`${this.base}/groups`, body);
  }

  getGroup(groupId: number): Observable<GroupDetail> {
    return this.http.get<GroupDetail>(`${this.base}/groups/${groupId}`);
  }

  updateGroup(groupId: number, body: UpdateGroupRequest): Observable<GroupDetail> {
    return this.http.put<GroupDetail>(`${this.base}/groups/${groupId}`, body);
  }

  // --- Members ---

  getMembers(groupId: number): Observable<GroupMember[]> {
    return this.http.get<GroupMember[]>(`${this.base}/groups/${groupId}/members`);
  }

  removeMember(groupId: number, memberId: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/groups/${groupId}/members/${memberId}`);
  }

  promoteMember(groupId: number, memberId: number): Observable<GroupMember> {
    return this.http.post<GroupMember>(`${this.base}/groups/${groupId}/members/${memberId}/promote`, {});
  }

  muteMember(groupId: number, memberId: number): Observable<GroupMember> {
    return this.http.post<GroupMember>(`${this.base}/groups/${groupId}/members/${memberId}/mute`, {});
  }

  // --- Join Requests ---

  getJoinRequests(groupId: number): Observable<JoinRequest[]> {
    return this.http.get<JoinRequest[]>(`${this.base}/groups/${groupId}/join-requests`);
  }

  approveJoinRequest(groupId: number, requestId: number): Observable<JoinRequest> {
    return this.http.post<JoinRequest>(`${this.base}/groups/${groupId}/join-requests/${requestId}/approve`, {});
  }

  rejectJoinRequest(groupId: number, requestId: number): Observable<JoinRequest> {
    return this.http.post<JoinRequest>(`${this.base}/groups/${groupId}/join-requests/${requestId}/reject`, {});
  }

  // --- Events ---

  getGroupEvents(groupId: number): Observable<GroupEvent[]> {
    return this.http.get<GroupEvent[]>(`${this.base}/groups/${groupId}/events`);
  }

  createGroupEvent(groupId: number, body: CreateGroupEventRequest): Observable<GroupEvent> {
    return this.http.post<GroupEvent>(`${this.base}/groups/${groupId}/events`, body);
  }

  // --- Messages ---

  getMessages(groupId: number, page = 0, size = 50): Observable<Page<Message>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<Page<Message>>(`${this.base}/groups/${groupId}/messages`, { params });
  }

  sendMessage(groupId: number, body: SendMessageRequest): Observable<Message> {
    return this.http.post<Message>(`${this.base}/groups/${groupId}/messages`, body);
  }

  // --- Notifications ---

  markNotificationRead(notificationId: number): Observable<Notification> {
    return this.http.put<Notification>(`${this.base}/notifications/${notificationId}/read`, {});
  }

  // --- Support ---

  sendReport(body: CreateReportRequest): Observable<void> {
    return this.http.post<void>(`${this.base}/support/reports`, body);
  }
}
