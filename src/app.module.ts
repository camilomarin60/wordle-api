import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { WordsModule } from './words/words.module';
import { User } from './entities/user.entity';
import { Word } from './entities/words.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { UsersService } from './users/services/users/users.service';
import { WordsService } from './words/service/words/words.service';
import { AuthService } from './auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [User, Word],
        synchronize: true,
        retryDelay: 3000,
        retryAttempts: 10,
      }),
    }),
    TypeOrmModule.forFeature([Word, User]),
    ScheduleModule.forRoot(),
    UsersModule,
    AuthModule,
    WordsModule,
  ],
  controllers: [AppController],
  providers: [AppService, UsersService, WordsService, AuthService, JwtService],
})
export class AppModule {}
