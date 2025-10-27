import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';

import { Task } from './tasks/task.entity';
import { User } from './users/user.entity';
import { Status } from './statuses/status.entity';
import { Availability } from './availabilities/availability.entity';

import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AvailabilityProcessor } from './queue/availability.processor';
import { NotificationsGateway } from './notifications/notifications.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST || '127.0.0.1',
      port: Number(process.env.DATABASE_PORT) || 3306,
      username: process.env.DATABASE_USER || 'app',
      password: process.env.DATABASE_PASSWORD || 'pass',
      database: process.env.DATABASE_NAME || 'tasks_db',
      entities: [Task, User, Status, Availability],
      synchronize: true // dev convenience; use migrations in prod
    }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: Number(process.env.REDIS_PORT) || 6379
      }
    }),
    TasksModule,
    UsersModule,
    AuthModule
  ],
  controllers: [],
  providers: [AvailabilityProcessor, NotificationsGateway]
})
export class AppModule { }
