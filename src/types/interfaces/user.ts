// User and Authentication related interfaces

export interface User {
  _id?: string;
  wallet: string;
  clicks: number;
  profilePicture?: {
    secureUrl: string;
    publicId: string;
    uploadedAt: string;
  } | null;
  createdAt: string;
  updatedAt?: string;
}

export interface UserInfo {
  wallet: string;
  profilePicture?: {
    secureUrl: string;
  } | null;
}

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  user: User | null;
  error: string | null;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  user: User;
}

export interface UserProfile {
  wallet: string;
  clicks: number;
  profilePicture: {
    secureUrl: string;
  } | null;
  createdAt: Date;
  updatedAt: Date;
}
