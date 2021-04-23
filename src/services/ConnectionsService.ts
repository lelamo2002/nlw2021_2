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

  async findAllWithoutAdmin(): Promise<Connection[]> {
    const connections = await this.connectionRepository.find({
      where: { admin_id: null },
      relations: ['user'],
    });

    return connections;
  }

  async findBySocketID(socket_id: string): Promise<Connection> {
    const connection = await this.connectionRepository.findOne({
      socket_id,
    });

    return connection;
  }

  async updateAdminID(user_id: string, admin_id: string): Promise<void> {
    await this.connectionRepository
      .createQueryBuilder()
      .update(Connection)
      .set({ admin_id })
      .where('user_id = :user:id', {
        user_id,
      })
      .execute();
  }
}

export { ConnectionsService };
