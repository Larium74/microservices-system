import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginDto } from '../user/dto/login.dto';
import * as bcrypt from 'bcryptjs';
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async register(createUserDto: CreateUserDto) {
    try {
      const user = await this.userService.create(createUserDto);
      const payload = { sub: user.id, email: user.email, roles: user.roles };
      const token = this.jwtService.sign(payload);
      return {
        message: 'Usuario registrado exitosamente',
        user,
        access_token: token,
      };
    } catch (error) {
      this.logger.error('Error al registrar usuario', error);
      throw new ConflictException(
        error?.message || 'Error al registrar usuario',
      );
    }
  }
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    const userRecord = await this.userService['prisma'].user.findUnique({
      where: { email },
    });
    const isPasswordValid = await bcrypt.compare(password, userRecord.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    if (!user.isActive) {
      throw new UnauthorizedException('Usuario desactivado');
    }
    await this.userService['prisma'].user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });
    const payload = { sub: user.id, email: user.email, roles: user.roles };
    const token = this.jwtService.sign(payload);
    return {
      message: 'Inicio de sesión exitoso',
      user,
      access_token: token,
    };
  }
  async validateToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.userService.findOne(payload.sub);
      return {
        valid: true,
        user,
      };
    } catch (error) {
      this.logger.warn('Token inválido o expirado');
      return {
        valid: false,
        message: 'Token inválido o expirado',
      };
    }
  }
}
