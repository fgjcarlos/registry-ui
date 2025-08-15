export interface FormData {
  username: string;
  password: string;
  registryUrl: string;
}

export interface FormErrors {
  username?: string;
  password?: string;
  registryUrl?: string;
  general?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
  registryUrl: string;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  error?: string;
  authType?: 'basic' | 'bearer';
}

export interface Image {
  name: string;
  tags: string[];
  lastModified?: string;
  size?: string;
}

export interface RegistryImage {
  name: string;
  tags: string[];
  lastModified?: string;
  size?: string;
}

export interface RegistryInfo {
  images: RegistryImage[];
  totalImages: number;
  registryUrl: string;
}
 
export interface SessionData {
  username: string;
  registryUrl: string;
  authToken: string;
  authType: 'basic' | 'bearer';
  loginTime: number;
}

export interface UserInfo {
  username: string;
  registryUrl: string;  
}