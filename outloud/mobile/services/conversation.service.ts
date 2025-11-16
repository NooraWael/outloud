import { BaseAPI } from './base';
import {
  CreateConversationRequest,
  ConversationResponse,
  ConversationDetailResponse,
  ConversationsListResponse,
} from './types';

export class ConversationService extends BaseAPI {
  async create(data: CreateConversationRequest): Promise<ConversationResponse> {
    return this.post<ConversationResponse>('/conversations', data);
  }

  async getById(id: string): Promise<ConversationDetailResponse> {
    return this.get<ConversationDetailResponse>(`/conversations/${id}`);
  }

  async getAll(): Promise<ConversationsListResponse> {
    return this.get<ConversationsListResponse>('/conversations');
  }
}