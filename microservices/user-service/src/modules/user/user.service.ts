import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindAllUserDto } from './dto/findAll-user.dto';
import * as bcrypt from 'bcryptjs';
@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(private readonly prisma: PrismaService) {}
  async create(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new BadRequestException('El correo ya está registrado');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
    });
    this.logger.log(`Usuario creado: ${user.email}`);
    const { password: _, ...rest } = user;
    return rest;
  }
  async findAll(params: FindAllUserDto) {
    const { page = 1, limit = 10, search } = params;
    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as any } },
            { email: { contains: search, mode: 'insensitive' as any } },
          ],
        }
      : {};
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);
    const usersWithoutPasswords = users.map(({ password, ...rest }) => rest);
    return {
      total,
      page,
      limit,
      users: usersWithoutPasswords,
    };
  }
  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    const { password, ...rest } = user;
    return rest;
  }
  async update(updateUserDto: UpdateUserDto) {
    const { id, password, ...rest } = updateUserDto;
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    let dataToUpdate: any = { ...rest };
    if (password) {
      dataToUpdate.password = await bcrypt.hash(password, 10);
    }
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: dataToUpdate,
    });
    this.logger.log(`Usuario actualizado: ${updatedUser.email}`);
    const { password: _, ...restUser } = updatedUser;
    return restUser;
  }
  async remove(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    await this.prisma.user.delete({ where: { id } });
    this.logger.log(`Usuario eliminado: ${user.email}`);
    return { message: 'Usuario eliminado correctamente' };
  }
  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new NotFoundException(`Usuario con email ${email} no encontrado`);
    }
    const { password, ...rest } = user;
    return rest;
  }
  async activate(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    const updated = await this.prisma.user.update({
      where: { id },
      data: { isActive: true },
    });
    this.logger.log(`Usuario activado: ${updated.email}`);
    const { password, ...rest } = updated;
    return rest;
  }
  async deactivate(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    const updated = await this.prisma.user.update({
      where: { id },
      data: { isActive: false },
    });
    this.logger.log(`Usuario desactivado: ${updated.email}`);
    const { password, ...rest } = updated;
    return rest;
  }
}
