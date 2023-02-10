import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Word } from '../../../entities/words.entity';

@Injectable()
export class WordsService {
  constructor(
    @InjectRepository(Word) private readonly wordRepository: Repository<Word>,
  ) {}

  async saveWords(value: string) {
    const word = await this.wordRepository.create({ value });
    return await this.wordRepository.save(word);
  }

  async getAllWords() {
    return await this.wordRepository.find();
  }

  async findCurrentWord() {
    return await this.wordRepository.findOne({ where: { current: true } });
  }

  async changeCurrentWord(idCurrentWord: number) {
    return await this.wordRepository.update(
      { id: idCurrentWord },
      { current: false },
    );
  }

  async updateNextWord(idNextWord: number) {
    return await this.wordRepository.update(
      { id: idNextWord },
      {
        current: true,
        selected: true,
      },
    );
  }

  async findOneWordNotSelected() {
    return await this.wordRepository
      .createQueryBuilder('word')
      .select(['word.id', 'word.value', 'word.selected'])
      .where('word.selected = false')
      .orderBy('RANDOM()')
      .getOne();
  }

  async addWon(id: number, won: number) {
    return await this.wordRepository.update({ id }, { won: won + 1 });
  }

  async getMostWordWon() {
    return await this.wordRepository
      .createQueryBuilder('word')
      .select(['word.id', 'word.value', 'word.won'])
      .orderBy('word.won', 'DESC')
      .take(10)
      .getMany();
  }
}
