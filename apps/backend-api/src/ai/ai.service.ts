import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AiService {
  private baseUrl = process.env.AI_SERVICE_URL || 'http://ai-service:8000';

  async summarize(chat: string[]) {
    const res = await axios.post(`${this.baseUrl}/summarize`, { chat_history: chat });
    return res.data;
  }
}
