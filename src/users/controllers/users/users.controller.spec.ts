import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../../entities/user.entity';
import { CreateUserDto } from '../../dtos/user.dto';
import { UsersService } from '../../services/users/users.service';
import { UsersController } from './users.controller';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = moduleRef.get<UsersService>(UsersService);
    controller = moduleRef.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should return new user with id', async () => {
      const result: User = {
        id: 123,
        username: 'camilo',
        email: 'test@example.com',
        victories: 0,
        attempt: 0,
        match: 0,
        password: '',
      };
      const user: CreateUserDto = {
        username: 'camilo',
        password: '123',
        email: 'test@example.com',
      };
      jest.spyOn(service, 'createUser').mockImplementation(async () => result);

      expect(await controller.createUser(user)).toBe(result);
    });
  });
});
