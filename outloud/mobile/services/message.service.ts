import { BaseAPI } from './base';
import { VoiceMessageResponse } from './types';

export class MessageService extends BaseAPI {
  async sendVoiceMessage(
    conversationId: string,
    audioUri: string,
    onProgress?: (progress: number) => void
  ): Promise<VoiceMessageResponse> {
    // Create FormData
    const formData = new FormData();
    formData.append('audio', {
      uri: audioUri,
      type: 'audio/webm',
      name: 'voice-message.webm',
    } as any);

    return this.upload<VoiceMessageResponse>(
      `/conversations/${conversationId}/voice-message`,
      formData,
      onProgress
    );
  }
}