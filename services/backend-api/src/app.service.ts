import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth(): { status: string; timestamp: string, message: string } {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      message: 'Backend API is running.',
    };
  }
}
