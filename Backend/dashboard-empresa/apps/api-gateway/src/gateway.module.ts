import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1',
          port: 3032,
        },
      },
      {
        name: 'MERCH_SERVICE',
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1',
          port: 3034,
        },
      },
      {
        name: 'CATEGORIA_SERVICE',
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1',
          port: 3033,
        },
      }
    ])
  ],
  controllers: [GatewayController],
})
export class GatewayModule {}
