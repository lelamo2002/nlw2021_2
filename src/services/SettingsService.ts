import { getCustomRepository, Repository } from 'typeorm';

import { Setting } from '../entities/setting';
import { AppError } from '../errors/AppError';
import { SettingsRepository } from '../repositories/SettingsRepositotory';

interface ISettingsCreate {
  chat: boolean;
  username: string;
}

class SettingsService {
  private settingsRepository: Repository<Setting>

  constructor() {
    this.settingsRepository = getCustomRepository(SettingsRepository);
  }

  async create({ chat, username }: ISettingsCreate): Promise<Setting> {
    const userAlreadyExists = await this.settingsRepository.findOne({
      username,
    });

    if (userAlreadyExists) {
      throw new AppError('User already exists!');
    }

    const settings = this.settingsRepository.create({
      chat,
      username,
    });

    await this.settingsRepository.save(settings);

    return settings;
  }

  async findByUsername(username: string): Promise<Setting> {
    const settings = await this.settingsRepository.findOne({
      username,
    });
    return settings;
  }

  async update(username: string, chat: boolean): Promise<void> {
    await this.settingsRepository.createQueryBuilder()
      .update(Setting)
      .set({ chat })
      .where('username = :username', {
        username,
      })
      .execute();
  }
}

export { SettingsService };
