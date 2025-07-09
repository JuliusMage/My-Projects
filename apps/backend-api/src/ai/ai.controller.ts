import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('api/ai')
@UseGuards(RolesGuard)
export class AiController {
  constructor(private service: AiService) {}

  @Post('summarize')
  @Roles('agent', 'admin')
  summarize(@Body('chat') chat: string[]) {
    return this.service.summarize(chat);
  }
}
