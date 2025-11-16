import { AuthService } from './auth.service';
import { DemoService } from './demo.service';
import { ConversationService } from './conversation.service';
import { MessageService } from './message.service';
import { EvaluationService } from './evaluation.service';

class CoreAPI {
  private static instance: CoreAPI;

  // Service instances
  public readonly auth: AuthService;
  public readonly demo: DemoService;
  public readonly conversations: ConversationService;
  public readonly messages: MessageService;
  public readonly evaluations: EvaluationService;

  private constructor() {
    // Initialize all services
    this.auth = new AuthService();
    this.demo = new DemoService();
    this.conversations = new ConversationService();
    this.messages = new MessageService();
    this.evaluations = new EvaluationService();
  }

  public static getInstance(): CoreAPI {
    if (!CoreAPI.instance) {
      CoreAPI.instance = new CoreAPI();
    }
    return CoreAPI.instance;
  }
}

// Export singleton instance
export const api = CoreAPI.getInstance();