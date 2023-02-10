import { Module } from '@nestjs/common';
import { WordsController } from './controller/words/words.controller';
import { WordsService } from './service/words/words.service';
import { HttpModule } from '@nestjs/axios';
import { Word } from 'src/entities/words.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ChangeWordTask } from './cron/change-word.task';
import { UsersService } from 'src/users/services/users/users.service';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Word, User]),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 10,
    }),
    ScheduleModule.forRoot(),
  ],
  controllers: [WordsController],
  providers: [WordsService, ChangeWordTask, UsersService],
})
export class WordsModule {}
