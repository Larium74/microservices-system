import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsBoolean, IsUUID } from 'class-validator';
import { CreateUserDto } from './create-user.dto';
export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsUUID()
  id: string;
  @IsOptional()
  @IsBoolean({ message: 'isActive debe ser un valor booleano' })
  isActive?: boolean;
}
