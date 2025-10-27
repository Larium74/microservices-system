import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
@Injectable()
export class UserService {
  constructor(
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
  ) {}
  async findAll(query: any) {
    try {
      const users = await lastValueFrom(
        this.userClient.send('get_all_users', query)
      );
      return users;
    } catch (error) {
      throw new HttpException(
        'Error al obtener usuarios del microservicio (NATS)',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
  async findOne(id: string) {
    try {
      const user = await lastValueFrom(
        this.userClient.send('get_user_by_id', { id })
      );
      if (!user) throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
      return user;
    } catch (error) {
      throw new HttpException(
        'Error al obtener usuario del microservicio (NATS)',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
  async create(createUserDto: any) {
    try {
      const user = await lastValueFrom(
        this.userClient.send('create_user', createUserDto)
      );
      return user;
    } catch (error) {
      throw new HttpException(
        'Error al crear usuario en el microservicio (NATS)',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
  async update(id: string, updateUserDto: any) {
    try {
      const user = await lastValueFrom(
        this.userClient.send('update_user', { id, ...updateUserDto })
      );
      if (!user) throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
      return user;
    } catch (error) {
      throw new HttpException(
        'Error al actualizar usuario en el microservicio (NATS)',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
  async remove(id: string) {
    try {
      const result = await lastValueFrom(
        this.userClient.send('delete_user', { id })
      );
      if (!result) throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
      return result;
    } catch (error) {
      throw new HttpException(
        'Error al eliminar usuario del microservicio (NATS)',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}
