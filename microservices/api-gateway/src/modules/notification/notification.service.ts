import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
@Injectable()
export class NotificationService {
  constructor(
    @Inject('NOTIFICATION_SERVICE')
    private readonly notificationClient: ClientProxy,
  ) {}
  async findAll(userId: string) {
    try {
      return await firstValueFrom(
        this.notificationClient.send('get_notifications', { userId })
      );
    } catch (error) {
      throw new HttpException(
        'Error al obtener notificaciones del microservicio',
        HttpStatus.SERVICE_UNAVAILABLE
      );
    }
  }
  async send(sendNotificationDto: any) {
    try {
      return await firstValueFrom(
        this.notificationClient.send('send_notification', sendNotificationDto)
      );
    } catch (error) {
      throw new HttpException(
        'Error al enviar notificación en el microservicio',
        HttpStatus.SERVICE_UNAVAILABLE
      );
    }
  }
  async markAsRead(id: string, userId: string) {
    try {
      return await firstValueFrom(
        this.notificationClient.send('mark_notification_read', { id, userId })
      );
    } catch (error) {
      throw new HttpException(
        'Error al marcar notificación como leída',
        HttpStatus.SERVICE_UNAVAILABLE
      );
    }
  }
  async getUnreadCount(userId: string) {
    try {
      return await firstValueFrom(
        this.notificationClient.send('get_unread_count', { userId })
      );
    } catch (error) {
      throw new HttpException(
        'Error al obtener contador de notificaciones no leídas',
        HttpStatus.SERVICE_UNAVAILABLE
      );
    }
  }
}
