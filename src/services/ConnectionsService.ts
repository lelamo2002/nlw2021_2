import { getCustomRepository, Repository } from 'typeorm';

import { Connection } from '../entities/Connection';
import { ConnectionRepository } from '../repositories/ConnectionRepository';

interface IConnectionCreate {
  socket_id: string;
  user_id: string;
  admin_id?: string;
  id?: string;
}

class ConnectionsService {
  private connectionRepository: Repository<Connection>

  constructor() {
    this.connectionRepository = getCustomRepository(ConnectionRepository);
  }

  async create({
    socket_id, user_id, admin_id, id,
  }: IConnectionCreate): Promise<Connection> {
    const connection = this.connectionRepository.create({
      socket_id,
      user_id,
      admin_id,
      id,
    });

    await this.connectionRepository.save(connection);

    return connection;
  }

  async findByUserId(user_id: string): Promise<Connection> {
    const connection = await this.connectionRepository.findOne({
      user_id,
    });
    return connection;
  }
}

export { ConnectionsService };
