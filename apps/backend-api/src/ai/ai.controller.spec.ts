import { Test, TestingModule } from '@nestjs/testing';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { RolesGuard } from '../auth/roles.guard';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

// Mock AiService
const mockAiService = {
  summarize: jest.fn(),
  analyze: jest.fn(),
};

describe('AiController', () => {
  let controller: AiController;
  let service: AiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AiController],
      providers: [
        {
          provide: AiService,
          useValue: mockAiService,
        },
        // Provide RolesGuard and its dependencies if necessary, or mock it
        // For simplicity, we can mock RolesGuard if its internal logic is not critical for these tests
        {
          provide: RolesGuard,
          useValue: { canActivate: jest.fn(() => true) }, // Mock canActivate to always return true
        },
        Reflector, // Reflector is often used by guards
         {
           provide: JwtService,
           useValue: { verify: jest.fn(() => ({ userId: 'test', roles: ['agent'] })) }, // Mock JwtService
         }
      ],
    }).compile();

    controller = module.get<AiController>(AiController);
    service = module.get<AiService>(AiService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('summarize', () => {
    it('should call AiService.summarize with the provided chat', async () => {
      const chat = ['Hello', 'How are you?'];
      const expectedSummary = { summary: 'A greeting and a question.' };
      mockAiService.summarize.mockResolvedValue(expectedSummary);

      const result = await controller.summarize(chat);

      expect(service.summarize).toHaveBeenCalledWith(chat);
      expect(result).toEqual(expectedSummary);
    });
  });

  describe('analyze', () => {
    it('should call AiService.analyze with the provided text', async () => {
      const text = 'This is a great product!';
      const expectedAnalysis = { sentiment: 'positive', keywords: ['great', 'product'] };
      mockAiService.analyze.mockResolvedValue(expectedAnalysis);

      const result = await controller.analyze(text);

      expect(service.analyze).toHaveBeenCalledWith(text);
      expect(result).toEqual(expectedAnalysis);
    });

    it('should return what AiService.analyze returns', async () => {
        const text = 'This is bad.';
        const mockResponse = { sentiment: 'negative', keywords: ['bad'] };
        mockAiService.analyze.mockResolvedValue(mockResponse);

        const result = await controller.analyze(text);
        expect(result).toEqual(mockResponse);
      });
  });
});
