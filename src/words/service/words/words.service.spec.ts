import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Word } from '../../../entities/words.entity';
import { WordsService } from './words.service';

describe('WordsService', () => {
  let service: WordsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WordsService,
        {
          provide: getRepositoryToken(Word),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<WordsService>(WordsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
