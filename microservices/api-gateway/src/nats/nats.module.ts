import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envs } from '../config';
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.NATS,
        options: {
          servers: [envs.natsServerUrl || 'nats:
        },
      },
      {
        name: 'AUTH_SERVICE',
        transport: Transport.NATS,
        options: {
          servers: [envs.natsServerUrl || 'nats:
        },
      },
      {
        name: 'PRODUCT_SERVICE',
        transport: Transport.NATS,
        options: {
          servers: [envs.natsServerUrl || 'nats:
        },
      },
      {
        name: 'NOTIFICATION_SERVICE',
        transport: Transport.NATS,
        options: {
          servers: [envs.natsServerUrl || 'nats:
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class NatsModule {}
