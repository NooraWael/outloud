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
    const fileName = audioUri.split('/').pop() || 'voice-message.m4a';
    const extension = fileName.split('.').pop()?.toLowerCase();

    const mimeType =
      extension === 'caf'
        ? 'audio/x-caf'
        : extension === '3gp' || extension === '3gpp'
        ? 'audio/3gpp'
        : extension === 'mp3'
        ? 'audio/mpeg'
        : 'audio/m4a';

    formData.append('audio', {
      uri: audioUri,
      type: mimeType,
      name: fileName,
    } as any);

    console.log('Uploading voice message:', { fileName, mimeType });

    return this.upload<VoiceMessageResponse>(
      `/conversations/${conversationId}/voice-message`,
      formData,
      onProgress
    );
  }
}
