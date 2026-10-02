export type RequestStatus = 'pending' | 'approved' | 'rejected';

export interface Pet {
  id: string;
  name: string;
  breed: string;
  imageUrl: string;
  description: string;
}

export interface AdoptionRequest {
  id: string;
  applicantName: string;
  email: string;
  petId: string;
  petName: string;
  reason: string;
  status: RequestStatus;
  submittedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole; // 'applicant' | 'reviewer'
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupPayload extends LoginCredentials {
  name: string;
}

// start messaging
export interface ChatMessage {
  id: string;
  conversationId: string; // the applicant's user id
  fromId: string;
  senderName: string;
  text: string;
  sentAt: string;
  readAt: string | null;
}

export type ClientEvent =
  | { type: 'send'; conversationId: string; text: string }
  | { type: 'read'; conversationId: string };

export type ServerEvent =
  | { type: 'message'; message: ChatMessage }
  | { type: 'read'; conversationId: string; readBy: UserRole; readAt: string }
  | { type: 'unread'; counts: Record<string, number> };
 // end messaging

export type UserRole = 'applicant' | 'reviewer';
export type ActiveTab = 'home' | 'apply' | 'review' | 'edit' | 'pets' | 'profile' | 'chat' | 'aboutUs';

export type NewAdoptionRequest = Omit<AdoptionRequest, "id" | "status" | "submittedAt">;