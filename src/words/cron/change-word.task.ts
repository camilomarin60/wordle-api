import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UsersService } from 'src/users/services/users/users.service';
import { WordsService } from '../service/words/words.service';

@Injectable()
export class ChangeWordTask {
  private readonly logger = new Logger(ChangeWordTask.name);

  constructor(
    private readonly wordsService: WordsService,
    private readonly userService: UsersService,
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleCron() {
    try {
      const currentWord = await this.wordsService.findCurrentWord();
      if (currentWord) {
        const nextWord = await this.wordsService.findOneWordNotSelected();
        await this.wordsService.changeCurrentWord(currentWord.id);
        await this.wordsService.updateNextWord(nextWord.id);
      } else {
        const nextWord = await this.wordsService.findOneWordNotSelected();
        await this.wordsService.updateNextWord(nextWord.id);
      }
      await this.userService.resetAttemps();
      this.logger.log('The word was changed');
    } catch (err) {
      this.logger.error('Error trying to change the word ' + err.message);
    }
  }
}
