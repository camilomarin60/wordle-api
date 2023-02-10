import { HttpModule, HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UpdateResult } from 'typeorm';
import { User } from '../../../entities/user.entity';
import { Word } from '../../../entities/words.entity';
import { UsersService } from '../../../users/services/users/users.service';
import { WordsService } from '../../service/words/words.service';
import { WordsController } from './words.controller';
var httpMocks = require('node-mocks-http');

describe('WordsController', () => {
  let controller: WordsController;
  let wordsService: WordsService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WordsController],
      imports: [
        HttpModule.register({
          timeout: 5000,
          maxRedirects: 10,
        }),
      ],
      providers: [
        WordsService,
        UsersService,
        {
          provide: getRepositoryToken(Word),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<WordsController>(WordsController);
    wordsService = module.get<WordsService>(WordsService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should return message negative', async () => {
      const resultWord: Word[] = [
        { id: 1, value: 'foo', selected: false, won: 0, current: false },
      ];
      jest
        .spyOn(wordsService, 'getAllWords')
        .mockImplementation(async () => resultWord);

      expect(await controller.loadsWords()).toBe('No need to carry words');
    });
  });

  describe('create', () => {
    it('should return message possitive', async () => {
      const resultWord: Word[] = [];
      jest
        .spyOn(wordsService, 'getAllWords')
        .mockImplementation(async () => resultWord);

      expect(await controller.loadsWords()).toBe('Words loaded with success');
    });
  });

  describe('Validate word', () => {
    it('should return array with reponses', async () => {
      const request = httpMocks.createRequest({
        method: 'POST',
        url: '/words',
        body: { user_word: 'tests' },
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer 124574846asdcze',
        },
        user: { userId: 123 },
      });
      const resultWord: Word = {
        id: 1,
        value: 'tests',
        selected: true,
        won: 0,
        current: true,
      };
      const result = [
        { letter: 't', value: 1 },
        { letter: 'e', value: 1 },
        { letter: 's', value: 1 },
        { letter: 't', value: 1 },
        { letter: 's', value: 1 },
      ];
      const resultUser: User = {
        id: 12,
        username: '',
        email: '',
        victories: 0,
        password: '',
        attempt: 0,
        match: 0,
      };
      jest
        .spyOn(wordsService, 'findCurrentWord')
        .mockImplementation(async () => resultWord);
      jest
        .spyOn(usersService, 'getUserById')
        .mockImplementation(async () => resultUser);
      expect(await controller.validateWord(request)).toStrictEqual(result);
    });
  });
});
