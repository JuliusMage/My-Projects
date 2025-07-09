import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './ticket.entity';
import Sentiment from 'sentiment';
import { WsGateway } from '../ws/ws.gateway';
import { KafkaService } from '../kafka/kafka.service';

@Injectable()
export class TicketsService {
  private sentiment = new Sentiment();

  constructor(
    @InjectRepository(Ticket) private repo: Repository<Ticket>,
    private ws: WsGateway,
    private kafka: KafkaService,
  ) {}

  async create(message: string, customerId: string) {
    const analysis = this.sentiment.analyze(message);
    const ticket = this.repo.create({
      message,
      customerId,
      sentiment: analysis.score > 0 ? 'positive' : analysis.score < 0 ? 'negative' : 'neutral',
      keywords: analysis.words,
    });
    const saved = await this.repo.save(ticket);
    this.ws.sendTicketUpdate(saved);
    await this.kafka.send('tickets', saved);
    return saved;
  }

  findAll() {
    return this.repo.find();
  }

  findOne(id: number) {
    return this.repo.findOneBy({ id });
  }
}
