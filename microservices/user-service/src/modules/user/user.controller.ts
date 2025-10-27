import {
  Controller,
  Get,
  Patch,
  UseGuards,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { FindAllUserDto } from './dto/findAll-user.dto';
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @MessagePattern('create_user')
  create(@Payload() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
  @MessagePattern('find_all_users')
  findAll(@Payload() params: FindAllUserDto) {
    return this.userService.findAll(params);
  }
  @MessagePattern('find_one_user')
  findOne(@Payload('id', ParseUUIDPipe) id: string) {
    return this.userService.findOne(id);
  }
  @MessagePattern('update_user')
  update(@Payload() updateUserDto: UpdateUserDto) {
    return this.userService.update(updateUserDto);
  }
  @MessagePattern('delete_user')
  remove(@Payload('id', ParseUUIDPipe) id: string) {
    return this.userService.remove(id);
  }
  @MessagePattern('find_user_by_email')
  findByEmail(@Payload('email') email: string) {
    return this.userService.findByEmail(email);
  }
  @MessagePattern('activate_user')
  activate(@Payload('id', ParseUUIDPipe) id: string) {
    return this.userService.activate(id);
  }
  @MessagePattern('deactivate_user')
  deactivate(@Payload('id', ParseUUIDPipe) id: string) {
    return this.userService.deactivate(id);
  }
}
