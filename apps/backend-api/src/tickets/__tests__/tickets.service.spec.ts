import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TicketsService } from '../tickets.service';
import { Ticket } from '../ticket.entity';
import { Repository } from 'typeorm';
import { WsGateway } from '../../ws/ws.gateway';

describe('TicketsService', () => {
  let service: TicketsService;
  let repo: Repository<Ticket>;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TicketsService,
        WsGateway,
        {
          provide: getRepositoryToken(Ticket),
          useClass: Repository,
        },
      ],
    }).compile();
    service = module.get<TicketsService>(TicketsService);
    repo = module.get(getRepositoryToken(Ticket));
  });

  it('creates ticket with sentiment', async () => {
    jest.spyOn(repo, 'save').mockResolvedValue({ id: 1 } as any);
    const res = await service.create('great service', '1');
    expect(repo.save).toHaveBeenCalled();
    expect(res).toEqual({ id: 1 });
  });
});
