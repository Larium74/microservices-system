import { Controller, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginDto } from '../user/dto/login.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @MessagePattern('register_user')
  async register(@Payload() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }
  @MessagePattern('login_user')
  @HttpCode(HttpStatus.OK)
  async login(@Payload() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
  @MessagePattern('validate_token')
  @HttpCode(HttpStatus.OK)
  async validateToken(@Payload() data: { token: string }) {
    return this.authService.validateToken(data.token);
  }
}
