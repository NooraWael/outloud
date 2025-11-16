import { BaseAPI } from './base';
import { EvaluationResponse } from './types';

export class EvaluationService extends BaseAPI {
  async evaluate(conversationId: string): Promise<EvaluationResponse> {
    return this.post<EvaluationResponse>(
      `/conversations/${conversationId}/evaluate`
    );
  }

  async getEvaluation(conversationId: string): Promise<EvaluationResponse> {
    return this.get<EvaluationResponse>(
      `/conversations/${conversationId}/evaluation`
    );
  }
}