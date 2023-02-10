import {
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Body,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, map, tap } from 'rxjs';
import { JwtAuthGuard } from '../../../auth/jwt-auth.guard';
import { UsersService } from '../../../users/services/users/users.service';
import { WordsService } from '../../service/words/words.service';

@Controller('words')
export class WordsController {
  constructor(
    private readonly httpService: HttpService,
    private readonly wordsService: WordsService,
    private readonly userService: UsersService,
  ) {}

  @Get()
  async loadsWords() {
    const words = await this.wordsService.getAllWords();
    if (words.length > 0) {
      return 'No need to carry words';
    }
    try {
      const file = await firstValueFrom(
        this.httpService.get(
          'https://gitlab.com/d2945/words/-/raw/main/words.txt',
        ),
      );
      const data = file.data.split('\n');

      for (let i = 0; i < data.length; i++) {
        if (data[i].length === 5) {
          await this.wordsService.saveWords(data[i]);
        }
      }
      return 'Words loaded with success';
    } catch (err) {
      return err;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async validateWord(@Request() req) {
    if (req.body.user_word.length != 5) {
      return {
        msg: 'From being a 5-letter word',
        location: '/words',
      };
    }

    const user = await this.userService.getUserById(req.user.userId);
    if (user.attempt === 5) {
      return {
        msg: 'You have already exceeded the maximum number of attempts for this word.',
        location: '/words',
      };
    }

    return await this.validateWordProcces(
      user.id,
      user.attempt,
      req.body.user_word,
      user.victories,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('won')
  async getMostWonWords() {
    return await this.wordsService.getMostWordWon();
  }

  public async validateWordProcces(
    userId: number,
    attempt: number,
    user_word: string,
    victories: number,
  ) {
    await this.userService.AddAttemp(userId, attempt);
    const { id, value, won } = await this.wordsService.findCurrentWord();
    const currentWord = value.split('');
    let response = [];
    let correctLetters = 0;
    for (let i = 0; i < user_word.length; i++) {
      let json = {
        letter: user_word[i],
        value: 0,
      };
      if (currentWord.includes(user_word[i])) {
        if (currentWord[i] === user_word[i]) {
          json.value = 1;
          correctLetters++;
        } else {
          json.value = 2;
        }
      } else {
        json.value = 3;
      }
      response.push(json);
    }
    if (correctLetters === 5) {
      await this.wordsService.addWon(id, won);
      await this.userService.AddVictory(userId, victories);
    }
    return response;
  }
}
