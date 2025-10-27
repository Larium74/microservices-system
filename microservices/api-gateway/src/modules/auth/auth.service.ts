import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
@Injectable()
export class AuthService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: { email: string; password: string }) {
    try {
      const response = await firstValueFrom(
        this.authClient.send('auth.login', loginDto)
      );
      const user = response.user;
      const payload = { email: user.email, sub: user.id, roles: user.roles };
      return {
        access_token: this.jwtService.sign(payload),
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          roles: user.roles,
        },
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Error al autenticar usuario',
        error.status || HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  async register(registerDto: any) {
    try {
      const response = await firstValueFrom(
        this.authClient.send('auth.register', registerDto)
      );
      const user = response.user;
      const payload = { email: user.email, sub: user.id, roles: user.roles };
      return {
        access_token: this.jwtService.sign(payload),
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          roles: user.roles,
        },
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Error al registrar usuario',
        error.status || HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  async getProfile(userId: string) {
    try {
      const user = await firstValueFrom(
        this.authClient.send('auth.getProfile', { userId })
      );
      return user;
    } catch (error) {
      throw new HttpException(
        'Error al obtener perfil de usuario',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  async refreshToken(user: any) {
    const payload = { email: user.email, sub: user.id, roles: user.roles };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
