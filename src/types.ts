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

export type UserRole = 'applicant' | 'reviewer';
export type ActiveTab = 'apply' | 'review' | 'edit' | 'pets';

export type NewAdoptionRequest = Omit<AdoptionRequest, "id" | "status" | "submittedAt">;