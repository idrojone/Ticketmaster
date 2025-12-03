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
          host: process.env.AUTH_TCP_HOST || '127.0.0.1',
          port: parseInt(process.env.AUTH_TCP_PORT || '3032', 10),
        },
      },
      {
        name: 'MERCH_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.MERCH_TCP_HOST || '127.0.0.1',
          port: parseInt(process.env.MERCH_TCP_PORT || '3034', 10),
        },
      },
      {
        name: 'CATEGORIA_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.CATEGORIA_TCP_HOST || '127.0.0.1',
          port: parseInt(process.env.CATEGORIA_TCP_PORT || '3033', 10),
        },
      }
    ])
  ],
  controllers: [GatewayController],
})
export class GatewayModule {}
