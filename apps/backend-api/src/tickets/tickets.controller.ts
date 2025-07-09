import { Controller, Get, Param, Post, Body, UseGuards } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('api/tickets')
@UseGuards(RolesGuard)
export class TicketsController {
  constructor(private service: TicketsService) {}

  @Get()
  @Roles('agent', 'admin')
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @Roles('agent', 'admin')
  findOne(@Param('id') id: number) {
    return this.service.findOne(id);
  }

  @Post()
  @Roles('agent', 'admin')
  create(@Body() body: { message: string; customerId: string }) {
    return this.service.create(body.message, body.customerId);
  }
}
