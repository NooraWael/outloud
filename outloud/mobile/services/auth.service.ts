import { BaseAPI } from './base';
import {
  AuthResponse,
  LoginRequest,
  SignupRequest,
  User,
} from './types';

export class AuthService extends BaseAPI {
  async signup(data: SignupRequest): Promise<AuthResponse> {
    return this.post<AuthResponse>('/auth/signup', data);
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    return this.post<AuthResponse>('/auth/login', data);
  }

  async createGuest(): Promise<AuthResponse> {
    return this.post<AuthResponse>('/auth/guest');
  }

  async getCurrentUser(): Promise<{ user: User }> {
    return this.get<{ user: User }>('/auth/me');
  }
}