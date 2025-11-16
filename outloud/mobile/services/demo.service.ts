import { BaseAPI } from './base';
import { DemoTopic, DemoTopicsResponse } from './types';

export class DemoService extends BaseAPI {
  async getTopics(): Promise<DemoTopicsResponse> {
    return this.get<DemoTopicsResponse>('/demo/topics');
  }

  async getTopicById(id: string): Promise<{ topic: DemoTopic }> {
    return this.get<{ topic: DemoTopic }>(`/demo/topics/${id}`);
  }
}